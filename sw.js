const CACHE_NAME = 'aiot-push-v1.1'; // 每次更新 sw.js 都要改版號
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

// --- 監聽 Web Push 訊息 ---
self.addEventListener('push', (event) => {
  const message = event.data ? event.data.text() : '收到新的 AIoT 數據';
  
  const options = {
    body: message,
    icon: './Icon_Jackal.jpg',    // 你的頭像
    badge: './Icon_Jackal.jpg',   // 狀態列小圖示
    vibrate: [200, 100, 200],     // 震動模式
    data: { url: './alerts.html' } // 點擊通知要開的頁面
  };

  event.waitUntil(self.registration.showNotification('Jackal AIoT 提醒', options));
});

// --- 監聽通知點擊事件 ---
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
