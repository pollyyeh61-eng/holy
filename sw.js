// 簡化版 sw.js
self.addEventListener('install', (event) => {
  self.skipWaiting(); // 強制跳過等待，直接激活
});

self.addEventListener('fetch', (event) => {
  // 暫時不執行複雜快取，確保請求正常通過
  event.respondWith(fetch(event.request));
});
