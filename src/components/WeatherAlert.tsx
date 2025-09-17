import React from 'react';
import { Cloud, CloudRain, Sun, Droplets } from 'lucide-react';

interface WeatherAlertProps {
  weather: any;
}

const WeatherAlert: React.FC<WeatherAlertProps> = ({ weather }) => {
  const isRaining = weather?.weather?.[0]?.main === 'Rain' || 
                   weather?.weather?.[0]?.description?.toLowerCase().includes('rain') ||
                   (weather?.precipitation || 0) > 0;
  const temperature = Math.round(weather?.main?.temp);
  
  const getWeatherIcon = () => {
    const condition = weather?.weather?.[0]?.main?.toLowerCase();
    
    if (isRaining) return <CloudRain className="w-6 h-6 text-blue-300" />;
    if (condition?.includes('cloud')) return <Cloud className="w-6 h-6 text-gray-300" />;
    return <Sun className="w-6 h-6 text-yellow-300" />;
  };

  return (
    <div className="text-white">
      <div className="flex items-center gap-3 mb-6 relative">
        {getWeatherIcon()}
        <h3 className="text-2xl font-bold prayer-name">Weather Status</h3>
        {isRaining && <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>}
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold mb-1 bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
            {temperature}°C
          </div>
          <div className="text-sm opacity-80 capitalize bg-black/20 rounded-full px-3 py-1 backdrop-blur-sm">
            {weather?.weather?.[0]?.description}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm opacity-80 mb-1">Humidity</div>
          <div className="text-xl font-bold flex items-center gap-1 justify-center">
            <Droplets className="w-4 h-4" />
            {weather?.main?.humidity}%
          </div>
        </div>
      </div>

      {/* Precipitation Info */}
      {weather?.precipitation > 0 && (
        <div className="text-center mb-6 bg-blue-500/20 rounded-lg p-3 backdrop-blur-sm">
          <div className="text-sm opacity-80 mb-1">💧 Precipitation</div>
          <div className="text-2xl font-bold text-blue-200">{weather.precipitation.toFixed(1)}mm</div>
        </div>
      )}

      {/* Rain Alert */}
      {isRaining && (
        <div className="rain-alert rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <CloudRain className="w-6 h-6 text-blue-300 animate-bounce" />
            <span className="font-bold text-blue-200 text-lg">🌧️ Rain Alert!</span>
          </div>
          <p className="text-blue-100 leading-relaxed">
            It's currently raining in your area! Perfect time for duʿā and seeking Allah's blessings.
          </p>
          <p className="text-xs text-blue-200 mt-2 arabic-font">
            "وَهُوَ الَّذِي يُنَزِّلُ الْغَيْثَ مِن بَعْدِ مَا قَنَطُوا" 🤲
          </p>
        </div>
      )}

      {/* No Rain Status */}
      {!isRaining && (
        <div className="clear-weather rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Sun className="w-6 h-6 text-green-300 animate-pulse" />
            <span className="font-bold text-green-200 text-lg">☀️ Clear Weather</span>
          </div>
          <p className="text-green-100 leading-relaxed">
            No rain detected currently. You'll be notified when it starts raining.
          </p>
        </div>
      )}

      <div className="text-xs opacity-75 text-center bg-black/20 rounded-full px-4 py-2 backdrop-blur-sm">
        🔄 Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default WeatherAlert;