/**
 * V-System 戰略總部核心 Service Worker
 * 版本：2.0.0 (二版更新整合)
 * 策略：Network First (確保經營數據即時同步)
 */

const CACHE_NAME = 'v-system-v2.0.0'; // 每次重大更新請修改此版號
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  // 如果有其他 CSS 或圖示檔案，請列於此
];

// 1. 安裝階段：強制跳過等待
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('🛡️ 正在預載戰略資產...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. 激活階段：徹底清理舊版快取，釋放手機空間
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('🧹 刪除舊版快取資料:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // 立即接管所有頁面
  );
});

// 3. 抓取策略：網路優先 (Network First)
// 邏輯：先嘗試從網路獲取最新經營數據，失敗時（如離線）才回傳快取內容
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 成功獲取網路回應，將其存入快取
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // 網路斷開或失敗，回傳快取內容
        return caches.match(event.request);
      // 在 index.html 註冊 sw 時改為：
navigator.serviceWorker.register('./sw.js?v=' + Date.now());
      })
  );
});

