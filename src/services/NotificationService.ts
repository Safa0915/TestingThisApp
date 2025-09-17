import { PrayerService } from './PrayerService';
import { WeatherService } from './WeatherService';

export class NotificationService {
  private static intervals: NodeJS.Timeout[] = [];

  static async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('StackBlitz')) {
          console.warn('Service Worker registration failed:', error);
        } else {
          console.error('Service Worker registration failed:', error);
        }
      }
    }
  }

  static async requestPermission(): Promise<string> {
    if (!('Notification' in window)) {
      return 'not-supported';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  static async sendNotification(title: string, body: string, icon?: string): Promise<void> {
    if (Notification.permission === 'granted') {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        // Use service worker for persistent notifications
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          body,
          icon: icon || '/vite.svg',
          badge: '/vite.svg',
          vibrate: [200, 100, 200],
          tag: 'prayer-weather-alert',
          renotify: true
        });
      } else {
        // Fallback to basic notification
        new Notification(title, {
          body,
          icon: icon || '/vite.svg'
        });
      }
    }
  }

  static setupPeriodicChecks(location: any, prayerTimes: any): void {
    // Clear existing intervals
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];

    if (!location || !prayerTimes) return;

    // Check for prayer time alerts every minute
    const prayerCheckInterval = setInterval(() => {
      this.checkPrayerTimeAlerts(prayerTimes);
    }, 60000); // Check every minute

    // Check weather every 5 minutes
    const weatherCheckInterval = setInterval(() => {
      this.checkWeatherAlerts(location.lat, location.lng);
    }, 300000); // Check every 5 minutes

    this.intervals.push(prayerCheckInterval, weatherCheckInterval);
  }

  private static async checkPrayerTimeAlerts(prayerTimes: any): Promise<void> {
    const alertTime = this.getAlertTimeSetting(); // minutes before prayer
    
    const timeToMaghrib = PrayerService.getTimeUntilMaghrib(prayerTimes.maghrib);
    
    if (timeToMaghrib.totalMinutes === alertTime) {
      await this.sendNotification(
        'Maghrib Prayer Alert',
        `Maghrib prayer is in ${alertTime} minutes. Time to prepare and make duʿā.`,
        '/vite.svg'
      );
    }
  }

  private static async checkWeatherAlerts(latitude: number, longitude: number): Promise<void> {
    const rainAlertEnabled = this.getRainAlertSetting();
    
    if (!rainAlertEnabled) return;

    const isRaining = await WeatherService.checkForRainAlerts(latitude, longitude);
    
    if (isRaining && !this.wasRecentlyNotifiedAboutRain()) {
      await this.sendNotification(
        'Rain Alert - Time for Duʿā',
        'It\'s raining in your area. A blessed time to make duʿā and seek Allah\'s mercy.',
        '/vite.svg'
      );
      
      this.markRainNotificationSent();
    }
  }

  private static getAlertTimeSetting(): number {
    const stored = localStorage.getItem('setting_alertTime');
    return stored ? JSON.parse(stored) : 15; // default 15 minutes
  }

  private static getRainAlertSetting(): boolean {
    const stored = localStorage.getItem('setting_rainAlert');
    return stored ? JSON.parse(stored) : true; // default enabled
  }

  private static wasRecentlyNotifiedAboutRain(): boolean {
    const lastNotification = localStorage.getItem('lastRainNotification');
    if (!lastNotification) return false;
    
    const timeSinceLastNotification = Date.now() - parseInt(lastNotification);
    return timeSinceLastNotification < 3600000; // 1 hour cooldown
  }

  private static markRainNotificationSent(): void {
    localStorage.setItem('lastRainNotification', Date.now().toString());
  }

  static cleanup(): void {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
  }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  NotificationService.cleanup();
});