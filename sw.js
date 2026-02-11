// 定義快取名稱
const CACHE_NAME = 'aiot-v2'; // 每次修改檔案建議提升版本號，強制瀏覽器更新

// 需要快取的檔案清單
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './Bg_JackalAIoT.jpg',
  './Icon_Jackal.jpg',   // 新加入的圖示檔案
  './manifest.json'      // 加入 manifest 確保離線可用
];

// 安裝事件：快取必要的資源
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 激活事件：清理舊的快取
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

// 攔截請求事件
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // 如果快取中有資源就回傳，否則發送網路請求
      return response || fetch(e.request);
    })
  );
});
