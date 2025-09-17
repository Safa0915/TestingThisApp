import React from 'react';
import { Bell, X } from 'lucide-react';

interface NotificationBannerProps {
  onRequestPermission: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ onRequestPermission }) => {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  return (
    <div className="notification-permission-banner text-white p-5 relative overflow-hidden">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-4">
          <Bell className="w-7 h-7 animate-bounce" />
          <div>
            <p className="font-bold text-lg">🔔 Enable Notifications</p>
            <p className="text-sm opacity-90">Get blessed prayer and weather alerts</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onRequestPermission}
            className="bg-gray-800 hover:bg-gray-900 px-5 py-3 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 text-white border-2 border-gray-600"
          >
            ✅ Allow
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-3 hover:bg-gray-700 rounded-full transition-all duration-300 hover:rotate-90 bg-gray-800 border border-gray-600"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationBanner;