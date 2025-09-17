import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Cloud, Settings, Bell, Droplets } from 'lucide-react';
import PrayerTimes from './components/PrayerTimes';
import WeatherAlert from './components/WeatherAlert';
import SettingsPanel from './components/SettingsPanel';
import NotificationBanner from './components/NotificationBanner';
import { LocationService } from './services/LocationService';
import { PrayerService } from './services/PrayerService';
import { WeatherService } from './services/WeatherService';
import { NotificationService } from './services/NotificationService';

interface AppState {
  location: { lat: number; lng: number; city: string } | null;
  prayerTimes: any | null;
  weather: any | null;
  loading: boolean;
  showSettings: boolean;
  notificationPermission: string;
}

function App() {
  const [state, setState] = useState<AppState>({
    location: null,
    prayerTimes: null,
    weather: null,
    loading: true,
    showSettings: false,
    notificationPermission: 'default'
  });

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Register service worker
      await NotificationService.registerServiceWorker();
      
      // Get location
      const location = await LocationService.getCurrentLocation();
      
      // Get prayer times
      const prayerTimes = await PrayerService.getPrayerTimes(location.lat, location.lng);
      
      // Get weather
      const weather = await WeatherService.getCurrentWeather(location.lat, location.lng);
      
      setState(prev => ({
        ...prev,
        location,
        prayerTimes,
        weather,
        loading: false,
        notificationPermission: Notification.permission
      }));

      // Setup periodic checks
      NotificationService.setupPeriodicChecks(location, prayerTimes);
      
    } catch (error) {
      console.error('Error initializing app:', error);
      setState(prev => ({ ...prev, loading: false }));
      
      // Show error message to user
      alert(`Unable to initialize app: ${error instanceof Error ? error.message : 'Unknown error'}. Please refresh and allow location access.`);
    }
  };

  const requestNotificationPermission = async () => {
    const permission = await NotificationService.requestPermission();
    setState(prev => ({ ...prev, notificationPermission: permission }));
  };

  if (state.loading) {
    return (
      <div className="min-h-screen maghrib-gradient islamic-pattern flex items-center justify-center relative">
        <div className="text-center text-white animate-fadeInUp">
          <div className="relative mb-6">
            <Clock className="w-20 h-20 mx-auto animate-float text-amber-200" />
            <div className="loading-spinner absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <h2 className="text-2xl font-bold mb-2 arabic-font">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</h2>
          <p className="text-xl font-semibold mb-2">Loading prayer times...</p>
          <p className="text-sm opacity-80">Getting your location and prayer schedule</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-amber-300 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-amber-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-amber-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen maghrib-gradient islamic-pattern">
      {state.notificationPermission !== 'granted' && (
        <NotificationBanner onRequestPermission={requestNotificationPermission} />
      )}
      
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="text-center text-white mb-8 animate-fadeInUp relative">
          <div className="mb-4">
            <h2 className="text-lg arabic-font opacity-80 mb-2">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</h2>
            <h1 className="text-4xl font-bold mb-2 prayer-name">Maghrib Alert</h1>
            <p className="text-sm opacity-75 italic">Your spiritual companion for prayer and reflection</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm opacity-90 bg-black/20 rounded-full px-4 py-2 backdrop-blur-sm">
            <MapPin className="w-4 h-4" />
            <span>{state.location?.city || 'Unknown Location'}</span>
          </div>
        </div>

        {/* Prayer Times Card */}
        {state.prayerTimes && (
          <div className="prayer-card rounded-2xl p-6 mb-6 animate-fadeInUp">
            <PrayerTimes 
              prayerTimes={state.prayerTimes}
              location={state.location}
            />
          </div>
        )}

        {/* Weather Alert Card */}
        {state.weather && (
          <div className="weather-card rounded-2xl p-6 mb-6 animate-fadeInUp">
            <WeatherAlert weather={state.weather} />
          </div>
        )}

        {/* Settings Button */}
        <div className="text-center mb-6">
          <button
            onClick={() => setState(prev => ({ ...prev, showSettings: true }))}
            className="settings-button text-white px-8 py-4 rounded-full flex items-center gap-3 mx-auto font-medium"
          >
            <Settings className="w-5 h-5 animate-spin" style={{animationDuration: '8s'}} />
            Settings & Alerts
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-white/60 text-xs mt-8">
          <p className="arabic-font text-sm mb-1">وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ</p>
          <p>"And remember Allah often that you may succeed"</p>
        </div>

        {/* Settings Panel */}
        {state.showSettings && (
          <SettingsPanel
            onClose={() => setState(prev => ({ ...prev, showSettings: false }))}
            location={state.location}
          />
        )}
      </div>
    </div>
  );
}

export default App;