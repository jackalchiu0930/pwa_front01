const CACHE_NAME = 'aiot-v2026-final';
const ASSETS = [
  './',
  './Starting.html',
  './index.html',
  './test.html',
  './alerts.html',
  './01_Starting.jpg',
  './Bg_JackalAIoT.jpg',
  './Icon_Jackal.jpg',
  './manifest.json'
];

// 安裝與快取
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

// 激活並清理舊快取
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => {
    return Promise.all(keys.map((key) => {
      if (key !== CACHE_NAME) return caches.delete(key);
    }));
  }));
});

// 攔截請求
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});

// --- 核心：處理推播訊息 ---
self.addEventListener('push', (event) => {
  let bodyText = event.data ? event.data.text() : '收到新的 AIoT 數據';
  
  const options = {
    body: bodyText,
    icon: './Icon_Jackal.jpg',    // 通訊錄大圖
    badge: './Icon_Jackal.jpg',   // 頂部小圖
    vibrate: [200, 100, 200, 100, 400], // 強震動提醒
    data: {
      url: './alerts.html'        // 點擊後要跳轉的頁面
    },
    tag: 'aiot-alert',            // 相同 tag 的通知會覆蓋，避免通知欄爆滿
    renotify: true                // 覆蓋時依然發出震動
  };

  event.waitUntil(
    self.registration.showNotification('Jackal AIoT 警報系統', options)
  );
});

// --- 核心：處理通知點擊 ---
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // 點擊後關閉通知窗
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // 如果已經開著網頁就跳轉過去，沒開就打開新視窗
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
