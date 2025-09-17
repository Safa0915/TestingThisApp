import React, { useState, useEffect } from 'react';
import { Clock, Sun, Sunset, Moon } from 'lucide-react';

interface PrayerTimesProps {
  prayerTimes: any;
  location: any;
}

const PrayerTimes: React.FC<PrayerTimesProps> = ({ prayerTimes, location }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeToMaghrib, setTimeToMaghrib] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      if (prayerTimes?.maghrib) {
        const maghribTime = new Date(`${new Date().toDateString()} ${prayerTimes.maghrib}`);
        const diff = maghribTime.getTime() - now.getTime();
        
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeToMaghrib(`${hours}h ${minutes}m`);
        } else {
          setTimeToMaghrib('Prayer time has passed');
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [prayerTimes]);

  const formatTime = (time: string) => {
    if (!time) return '--:--';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="text-white">
      <div className="flex items-center gap-3 mb-6 relative">
        <Sunset className="w-7 h-7 text-orange-300 animate-pulse-slow" />
        <h2 className="text-2xl font-bold prayer-name">Maghrib Prayer</h2>
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-orange-400 rounded-full animate-ping"></div>
      </div>

      {/* Main Maghrib Time Display */}
      <div className="text-center mb-8 relative">
        <div className="text-5xl font-bold mb-3 animate-glow bg-black/40 rounded-2xl px-6 py-4 backdrop-blur-sm border border-amber-400/50">
          <span className="text-amber-200 drop-shadow-lg font-black">
          {formatTime(prayerTimes?.maghrib)}
          </span>
        </div>
        <div className="text-base bg-black/60 rounded-full px-6 py-3 backdrop-blur-sm inline-block border border-white/30">
          <span className="text-white font-semibold">⏰ Time remaining:</span> <span className="font-bold text-amber-200 text-lg">{timeToMaghrib}</span>
        </div>
      </div>

      {/* Today's Prayer Times */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 bg-black/50 rounded-xl px-4 py-3 backdrop-blur-sm border border-white/30">
          <Clock className="w-6 h-6 animate-pulse" />
          <span className="text-white drop-shadow-md">Today's Prayer Times</span>
        </h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between bg-black/50 rounded-lg px-4 py-3 backdrop-blur-sm border border-white/20">
            <span className="text-white font-semibold">Fajr</span>
            <span className="font-bold text-blue-200">{formatTime(prayerTimes?.fajr)}</span>
          </div>
          <div className="flex justify-between bg-black/50 rounded-lg px-4 py-3 backdrop-blur-sm border border-white/20">
            <span className="text-white font-semibold">Sunrise</span>
            <span className="font-bold text-yellow-200">{formatTime(prayerTimes?.sunrise)}</span>
          </div>
          <div className="flex justify-between bg-black/50 rounded-lg px-4 py-3 backdrop-blur-sm border border-white/20">
            <span className="text-white font-semibold">Dhuhr</span>
            <span className="font-bold text-green-200">{formatTime(prayerTimes?.dhuhr)}</span>
          </div>
          <div className="flex justify-between bg-black/50 rounded-lg px-4 py-3 backdrop-blur-sm border border-white/20">
            <span className="text-white font-semibold">Asr</span>
            <span className="font-bold text-orange-200">{formatTime(prayerTimes?.asr)}</span>
          </div>
          <div className="flex justify-between bg-gradient-to-r from-orange-600/80 to-amber-600/80 px-4 py-3 rounded-lg border-2 border-amber-400 animate-glow backdrop-blur-sm">
            <span className="font-bold text-white drop-shadow-md">🌅 Maghrib</span>
            <span className="font-bold text-amber-100 text-lg drop-shadow-md">{formatTime(prayerTimes?.maghrib)}</span>
          </div>
          <div className="flex justify-between bg-black/50 rounded-lg px-4 py-3 backdrop-blur-sm border border-white/20">
            <span className="text-white font-semibold">Isha</span>
            <span className="font-bold text-purple-200">{formatTime(prayerTimes?.isha)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-center bg-black/60 rounded-full px-6 py-3 backdrop-blur-sm border border-white/30">
        <span className="text-white font-semibold">📅 {' '}
        {new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</span>
      </div>
    </div>
  );
};

export default PrayerTimes;