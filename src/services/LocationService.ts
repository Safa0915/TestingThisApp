export class LocationService {
  static async getCurrentLocation(): Promise<{ lat: number; lng: number; city: string }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Location services not supported. Please use a modern browser with GPS capability.'));
        return;
      }

      // Check if we're on mobile Safari and provide specific instructions
      const isMobileSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent);
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          
          try {
            // Get city name using reverse geocoding
            const city = await this.getCityName(lat, lng);
            resolve({ lat, lng, city });
          } catch (error) {
            // If reverse geocoding fails, still return coordinates
            resolve({ lat, lng, city: 'Unknown City' });
          }
        },
        (error) => {
          let errorMessage = '';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              if (isMobileSafari) {
                errorMessage = 'Location blocked. Please:\n\n1. Go to iPhone Settings > Privacy & Security > Location Services\n2. Turn ON Location Services\n3. Scroll down to Safari\n4. Select "While Using App"\n5. Refresh this page';
              } else {
                errorMessage = 'Location access denied. Please allow location access when prompted, or check your browser settings.';
              }
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'GPS unavailable. Please:\n• Turn on Location Services\n• Move to an area with better GPS signal\n• Try refreshing the page';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try refreshing the page or check your internet connection.';
              break;
            default:
              errorMessage = `Location error: ${error.message}. Please try refreshing the page.`;
              break;
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 20000, // Increased timeout for mobile
          maximumAge: 600000 // 10 minutes cache
        }
      );
    });
  }

  static async requestLocationWithFallback(): Promise<{ lat: number; lng: number; city: string }> {
    try {
      return await this.getCurrentLocation();
    } catch (error) {
      // Provide fallback location (Mecca) if location fails
      console.warn('Location failed, using fallback:', error);
      return {
        lat: 21.4225,
        lng: 39.8262,
        city: 'Mecca (Fallback)'
      };
    }
  }

  private static async getCityName(lat: number, lng: number): Promise<string> {
    try {
      // Using OpenStreetMap Nominatim for reverse geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'MaghribPrayerApp/1.0'
          }
        }
      );
      
      if (!response.ok) throw new Error('Geocoding failed');
      
      const data = await response.json();
      return data.address?.city || data.address?.town || data.address?.village || data.display_name?.split(',')[0] || 'Unknown City';
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return 'Unknown City';
    }
  }
}