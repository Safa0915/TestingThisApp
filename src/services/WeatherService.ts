export class WeatherService {
  // Using OpenWeatherMap free tier
  private static readonly API_KEY = ''; // Users can add their API key here
  
  static async getCurrentWeather(latitude: number, longitude: number) {
    try {
      // Try to use real API if API key is provided
      if (this.API_KEY) {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.API_KEY}&units=metric`
        );
        
        if (response.ok) {
          return await response.json();
        }
      }
      
      // Fallback to free weather API
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=precipitation`
      );
      
      if (!response.ok) throw new Error('Weather API failed');
      
      const data = await response.json();
      
      // Convert Open-Meteo format to OpenWeatherMap-like format
      return this.convertOpenMeteoData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return this.getDefaultWeatherData();
    }
  }

  private static convertOpenMeteoData(data: any) {
    const current = data.current_weather;
    const precipitation = data.hourly?.precipitation?.[0] || 0;
    
    // Determine weather condition based on WMO weather codes
    const weatherCode = current.weathercode;
    let main = 'Clear';
    let description = 'clear sky';
    
    if (weatherCode >= 51 && weatherCode <= 67) {
      main = 'Rain';
      description = 'rain';
    } else if (weatherCode >= 80 && weatherCode <= 82) {
      main = 'Rain';
      description = 'rain showers';
    } else if (weatherCode >= 95 && weatherCode <= 99) {
      main = 'Thunderstorm';
      description = 'thunderstorm';
    } else if (weatherCode >= 1 && weatherCode <= 3) {
      main = 'Clouds';
      description = 'cloudy';
    }
    
    // If there's precipitation, it's raining
    if (precipitation > 0) {
      main = 'Rain';
      description = 'rain';
    }
    
    return {
      main: {
        temp: Math.round(current.temperature),
        humidity: 65 // Open-Meteo doesn't provide humidity in free tier
      },
      weather: [{
        main,
        description
      }],
      coord: { 
        lat: data.latitude, 
        lon: data.longitude 
      },
      precipitation: precipitation
    };
  }

  private static getDefaultWeatherData() {
    return {
      main: {
        temp: 22,
        humidity: 60
      },
      weather: [{
        main: 'Clear',
        description: 'clear sky'
      }],
      precipitation: 0
    };
  }

  static isRaining(weatherData: any): boolean {
    // Check multiple indicators for rain
    const hasRainInMain = weatherData?.weather?.[0]?.main === 'Rain';
    const hasRainInDescription = weatherData?.weather?.[0]?.description?.toLowerCase().includes('rain');
    const hasPrecipitation = (weatherData?.precipitation || 0) > 0;
    
    return hasRainInMain || hasRainInDescription || hasPrecipitation;
  }

  static async checkForRainAlerts(latitude: number, longitude: number): Promise<boolean> {
    const weather = await this.getCurrentWeather(latitude, longitude);
    return this.isRaining(weather);
  }
}