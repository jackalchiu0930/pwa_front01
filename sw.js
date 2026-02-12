const CACHE_NAME = 'aiot-v6';
const ASSETS = [
  './',
  './Starting.html',
  './index.html',
  './alerts.html',
  './01_Starting.jpg',
  './Bg_JackalAIoT.jpg',
  './Icon_Jackal.jpg',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});
