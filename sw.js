// --- 版本配置區 ---
const FE_VERSION = '1.0.4'; 
const BE_VERSION = '1.0.4';
const AUTHOR = 'AIoT Center | Jackal.Chiu';
const ORG = 'PSA華科事業群';

const CACHE_NAME = 'jackal-v' + FE_VERSION;

const ASSETS = [
  './', 
  './Starting.html', 
  './index.html', 
  './test.html', 
  './alerts.html',
  './about.html',
  './01_Starting.jpg', 
  './Bg_JackalAIoT.jpg', 
  './Icon_Jackal.jpg', 
  './manifest.json'
];

self.addEventListener('install', (e) => self.skipWaiting());

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => {
        if (k !== CACHE_NAME) return caches.delete(k);
      })
    ))
  );
});

// --- 依照教學優化的推送顯示邏輯 ---
self.addEventListener('push', (event) => {
  let payload = {
    title: 'AIoT Platform',
    body: '收到新訊息',
    icon: './Icon_Jackal.jpg'
  };

  if (event.data) {
    try {
      // 嘗試解析後端傳來的 JSON
      const data = event.data.json();
      payload.title = data.title || payload.title;
      payload.body = data.body || payload.body;
      payload.icon = data.icon || payload.icon;
    } catch (e) {
      // 如果不是 JSON，則當作純文字處理
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: payload.icon,
    badge: './Icon_Jackal.jpg', // 狀態列小圖示
    vibrate: [100, 50, 100],
    data: { url: './alerts.html' } // 點擊後開啟的頁面
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // 如果已經有開啟的視窗則聚焦，否則開啟新視窗
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url.includes('alerts.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./alerts.html');
      }
    })
  );
});
