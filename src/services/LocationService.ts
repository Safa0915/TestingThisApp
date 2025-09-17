export class LocationService {
  static async getCurrentLocation(): Promise<{ lat: number; lng: number; city: string }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser. Please enable location services in your browser settings.'));
        return;
      }

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
          let errorMessage = 'Location access denied. ';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Please allow location access in your browser settings. On iPhone: Settings > Safari > Location Services > Allow.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable. Please check your GPS/location services.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage += error.message;
              break;
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // Increased timeout for slower connections
          maximumAge: 300000 // 5 minutes
        }
      );
    });
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