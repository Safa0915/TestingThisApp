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
      <div className="min-h-screen maghrib-gradient islamic-pattern flex items-center justify-center relative overflow-hidden">
        <div className="text-center text-white animate-fadeInUp z-10 max-w-sm mx-auto px-6">
          <div className="relative mb-6">
            <div className="relative inline-block">
              <Clock className="w-24 h-24 mx-auto animate-float text-amber-300 drop-shadow-2xl" />
              <div className="loading-spinner absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 arabic-font text-amber-100 drop-shadow-lg">
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
            </h2>
            <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-lg">
              Loading Prayer Times
            </h3>
            <p className="text-base text-gray-200 mb-6 leading-relaxed drop-shadow-md">
              Getting your location and prayer schedule
            </p>
            
            <div className="flex justify-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce shadow-lg"></div>
              <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.2s'}}></div>
              <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.4s'}}></div>
            </div>
            
            <p className="text-sm text-gray-300 italic">
              "And it is He who sends down rain from heaven, and We produce thereby the vegetation of every kind"
            </p>
          </div>
        </div>
        
        {/* Enhanced background overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen maghrib-gradient islamic-pattern overflow-hidden w-full">
      {state.notificationPermission !== 'granted' && (
        <NotificationBanner onRequestPermission={requestNotificationPermission} />
      )}
      
      <div className="w-full max-w-md mx-auto px-4 py-6 relative">
        {/* Header */}
        <div className="text-center text-white mb-8 animate-fadeInUp w-full">
          <div className="mb-4">
            <h2 className="text-lg arabic-font opacity-80 mb-2">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</h2>
            <h1 className="text-4xl font-bold mb-2 prayer-name">Maghrib Alert</h1>
            <p className="text-sm opacity-75 italic">Your spiritual companion for prayer and reflection</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm opacity-90 bg-black/20 rounded-full px-4 py-2 backdrop-blur-sm">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{state.location?.city || 'Unknown Location'}</span>
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