// --- 版本配置區 ---
const FE_VERSION = '1.1.3'; // 每次修改請更新版本號
const BE_VERSION = '1.1.3';
const CACHE_NAME = 'jackal-v' + FE_VERSION;

const ASSETS = [
  './', 
  './Starting.html', 
  './test.html', 
  './alerts.html',
  './about.html',
  './barcode.html',
  './barcodeclass.html',
  './Bg_JackalAIoT.jpg',
  './sw.js'
];

// 安裝 Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 激活並清理舊快取
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)
    )).then(() => self.clients.claim())
  );
});

// 【關鍵修正】攔截請求處理
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. 如果是 API 請求（例如包含 /list, /alerts, /checkin），直接走網絡，不進快取
  if (url.pathname.includes('/list') || 
      url.pathname.includes('/alerts') || 
      url.pathname.includes('/upload') || 
      url.pathname.includes('/checkin')) {
    return; // 讓請求直接發送到伺服器
  }

  // 2. 靜態資源使用「快取優先」策略
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
