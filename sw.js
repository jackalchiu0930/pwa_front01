// 1. 定義快取名稱
const CACHE_NAME = 'aiot-v3'; // 修改圖示或功能後，提升版本號以強制更新

// 2. 需要快取的靜態資源清單
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './alerts.html',        // ← 新增這一行
  './Bg_JackalAIoT.jpg',
  './Icon_Jackal.jpg',
  './manifest.json'      
];

// 3. 安裝事件：將資源存入快取
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 4. 激活事件：清理舊版本的快取資料
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

// 5. 攔截請求：優先從快取讀取資源，實現離線使用
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

// 6. 新增功能：監聽消息推送事件 (Push Notification)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received');
  
  let data = { title: 'AIoT 系統通知', body: '收到新訊息' };
  
  // 嘗試解析後端傳來的 JSON 內容
  try {
    if (event.data) {
      const payload = event.data.text();
      // 如果後端傳來的是純文字，直接使用；若是 JSON 則可進一步解析
      data.body = payload;
    }
  } catch (err) {
    console.error('解析推送內容失敗', err);
  }

  const options = {
    body: data.body,
    icon: './Icon_Jackal.jpg', // 推送訊息的小圖示
    badge: './Icon_Jackal.jpg', // 手機狀態列的小圖示
    vibrate: [200, 100, 200, 100, 200], // 震動模式
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      { action: 'explore', title: '查看詳情' },
      { action: 'close', title: '關閉' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 7. 監聽通知點擊事件
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // 點擊通知後自動開啟 App 頁面
  event.waitUntil(
    clients.openWindow('/') 
  );
});

