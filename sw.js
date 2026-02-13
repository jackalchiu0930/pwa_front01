const CACHE_NAME = 'aiot-v2026-v2'; // 更新版本號以強制刷新
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

// --- 監聽推播 ---
self.addEventListener('push', (event) => {
  let data = { title: 'Jackal AIoT', body: '收到新數據' };
  
  if (event.data) {
    try {
      data = event.data.json(); // 嘗試解析 JSON
    } catch (e) {
      data.body = event.data.text(); // 解析失敗則當作純文字
    }
  }

  const options = {
    body: data.body,
    icon: './Icon_Jackal.jpg',
    badge: './Icon_Jackal.jpg',
    vibrate: [200, 100, 200],
    data: { url: './alerts.html' },
    tag: 'aiot-notification'
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
