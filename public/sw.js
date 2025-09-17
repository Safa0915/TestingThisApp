const CACHE_NAME = 'maghrib-app-v1';
const urlsToCache = [
  '/',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

// Push Notification
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Prayer time or weather alert',
    icon: '/vite.svg',
    badge: '/vite.svg',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/vite.svg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/vite.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Maghrib Prayer Alert', options)
  );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(checkPrayerAndWeather());
  }
});

// Periodic Background Sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'periodic-prayer-check') {
    event.waitUntil(checkPrayerAndWeather());
  }
});

async function checkPrayerAndWeather() {
  // This would be called periodically to check prayer times and weather
  // Implementation would go here for background checks
  console.log('Background check for prayer times and weather');
}