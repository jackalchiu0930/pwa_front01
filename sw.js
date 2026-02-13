const CACHE_NAME = 'aiot-push-v2026-final-check'; // 強制刷新
const ASSETS = [
  './', './Starting.html', './index.html', './test.html', './alerts.html',
  './01_Starting.jpg', './Bg_JackalAIoT.jpg', './Icon_Jackal.jpg', './manifest.json'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => {
    return Promise.all(keys.map((key) => {
      if (key !== CACHE_NAME) return caches.delete(key);
    })));
  }));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});

// --- 監聽並顯示推播 ---
self.addEventListener('push', (event) => {
  let pushData = { title: 'Jackal AIoT', body: '收到新訊息' };
  
  if (event.data) {
    try {
      pushData = event.data.json(); // 解析後端發來的 JSON
    } catch (e) {
      pushData.body = event.data.text();
    }
  }

  const options = {
    body: pushData.body,
    icon: './Icon_Jackal.jpg',
    badge: './Icon_Jackal.jpg',
    vibrate: [200, 100, 200],
    data: { url: './alerts.html' },
    tag: 'aiot-status'
  };

  event.waitUntil(self.registration.showNotification(pushData.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
