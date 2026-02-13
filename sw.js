const CACHE_NAME = 'jackal-v999'; // 強制刷新
const ASSETS = [
  './', './Starting.html', './index.html', './test.html', './alerts.html',
  './01_Starting.jpg', './Bg_JackalAIoT.jpg', './Icon_Jackal.jpg', './manifest.json'
];

self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))));
});

self.addEventListener('push', (event) => {
  let data = { title: 'Jackal AIoT', body: '設備通知' };
  try {
    data = event.data.json();
  } catch (e) {
    data.body = event.data ? event.data.text() : '收到新數據';
  }
  const options = {
    body: data.body,
    icon: './Icon_Jackal.jpg',
    badge: './Icon_Jackal.jpg',
    vibrate: [200, 100, 200],
    data: { url: './alerts.html' }
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});

