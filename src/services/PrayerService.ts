export class PrayerService {
  static async getPrayerTimes(latitude: number, longitude: number) {
    try {
      // Using Aladhan API for Islamic prayer times
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${Math.floor(Date.now() / 1000)}?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      
      if (!response.ok) throw new Error('Failed to fetch prayer times');
      
      const data = await response.json();
      const timings = data.data.timings;
      
      return {
        fajr: this.formatTime(timings.Fajr),
        sunrise: this.formatTime(timings.Sunrise),
        dhuhr: this.formatTime(timings.Dhuhr),
        asr: this.formatTime(timings.Asr),
        maghrib: this.formatTime(timings.Maghrib),
        isha: this.formatTime(timings.Isha),
        date: data.data.date.readable
      };
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      
      // Fallback prayer times (approximate)
      const now = new Date();
      return {
        fajr: '05:30',
        sunrise: '06:45',
        dhuhr: '12:30',
        asr: '15:45',
        maghrib: '18:30',
        isha: '19:45',
        date: now.toLocaleDateString()
      };
    }
  }

  private static formatTime(timeString: string): string {
    // Remove timezone info and return just HH:MM
    return timeString.split(' ')[0];
  }

  static getTimeUntilMaghrib(maghribTime: string): { hours: number; minutes: number; totalMinutes: number } {
    const now = new Date();
    const today = now.toDateString();
    const maghrib = new Date(`${today} ${maghribTime}`);
    
    const diff = maghrib.getTime() - now.getTime();
    
    if (diff <= 0) {
      return { hours: 0, minutes: 0, totalMinutes: 0 };
    }
    
    const totalMinutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return { hours, minutes, totalMinutes };
  }
}