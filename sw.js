// --- 版本配置區 ---
const FE_VERSION = '1.0.9';
const BE_VERSION = '1.0.9';
const AUTHOR = 'AIoT Center | Jackal.Chiu';
const ORG = 'PSA華科事業群';
const CACHE_NAME = 'jackal-v' + FE_VERSION;

const ASSETS = [
  './', './Starting.html', './index.html', './test.html', './alerts.html',
  './class.html', './about.html', './menu02.html', './classjoin.html', 
  './classsful.html', './barcode.html', './barcodeclass.html',
  './01_Starting.jpg', './Bg_JackalAIoT.jpg', './Icon_Jackal.jpg', 
  './manifest.json', './sw.js'
];

const getBackendBaseUrl = () => '';

self.addEventListener('install', (e) => {
  console.log('[SW] 安裝新版本:', FE_VERSION);
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  console.log('[SW] 激活新版本:', FE_VERSION);
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('push', (event) => {
  let data = { title: 'Jackal AIoT', body: '設備通知' };
  try { data = event.data.json(); } catch (e) {}
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