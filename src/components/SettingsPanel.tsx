import React, { useState } from 'react';
import { X, Bell, Clock, Volume2 } from 'lucide-react';

interface SettingsPanelProps {
  onClose: () => void;
  location: any;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose, location }) => {
  const [settings, setSettings] = useState({
    maghribAlert: true,
    alertTime: 15,
    rainAlert: true,
    soundEnabled: true,
    vibration: true
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // Save to localStorage
    localStorage.setItem(`setting_${key}`, JSON.stringify(value));
  };

  const alertTimeOptions = [5, 10, 15, 20, 30, 45];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-4 animate-fadeInUp">
      <div className="bg-white/95 backdrop-blur-xl rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fadeInUp shadow-2xl border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300/50 bg-gradient-to-r from-teal-50 to-blue-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">⚙️ Settings</h2>
            <p className="text-sm text-gray-700">Customize your prayer alerts</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-200/80 rounded-full transition-all duration-300 hover:rotate-90 bg-white/50"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Maghrib Prayer Alerts */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <Clock className="w-6 h-6 text-teal-600 animate-pulse" />
              Maghrib Prayer Alerts
            </h3>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 bg-teal-100/80 rounded-xl border border-teal-200">
                <span className="text-gray-800 font-medium">Enable Maghrib alerts</span>
                <input
                  type="checkbox"
                  checked={settings.maghribAlert}
                  onChange={(e) => handleSettingChange('maghribAlert', e.target.checked)}
                  className="checkbox-custom"
                />
              </div>

              {settings.maghribAlert && (
                <div className="bg-gray-100/80 rounded-xl p-4 border border-gray-200">
                  <label className="block text-base font-semibold text-gray-800 mb-3">
                    Alert me before prayer time
                  </label>
                  <select
                    value={settings.alertTime}
                    onChange={(e) => handleSettingChange('alertTime', parseInt(e.target.value))}
                    className="w-full p-4 rounded-xl text-base font-medium bg-white border-2 border-teal-200 focus:border-teal-500 focus:outline-none text-gray-800"
                  >
                    {alertTimeOptions.map(time => (
                      <option key={time} value={time}>
                        {time} minutes before
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Weather Alerts */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <Bell className="w-6 h-6 text-blue-600 animate-bounce" />
              Weather Alerts
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-blue-100/80 rounded-xl border border-blue-200">
              <div>
                <span className="text-gray-800 font-medium">🌧️ Rain notifications</span>
                <p className="text-sm text-gray-700">Get notified when it rains for duʿā</p>
              </div>
              <input
                type="checkbox"
                checked={settings.rainAlert}
                onChange={(e) => handleSettingChange('rainAlert', e.target.checked)}
                className="checkbox-custom"
              />
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <Volume2 className="w-6 h-6 text-purple-600 animate-pulse" />
              Notification Settings
            </h3>
            
            <div className="space-y-4 bg-purple-100/80 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-800 font-medium">🔊 Sound notifications</span>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                  className="checkbox-custom"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-800 font-medium">📳 Vibration alerts</span>
                <input
                  type="checkbox"
                  checked={settings.vibration}
                  onChange={(e) => handleSettingChange('vibration', e.target.checked)}
                  className="checkbox-custom"
                />
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-5 border border-gray-300">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              📍 Current Location
            </h4>
            <p className="text-base text-gray-800 font-medium">
              {location?.city || 'Unknown City'}
            </p>
            <p className="text-sm text-gray-700 mt-2">
              Prayer times are calculated for this location
            </p>
          </div>

          {/* Save Button */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg border-2 border-gray-700"
          >
            ✅ Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;