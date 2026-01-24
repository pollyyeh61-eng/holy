/**
 * V-System 戰略總部 sw.js 整合版
 * 策略：Network First (網路優先)
 */
const CACHE_NAME = 'v-system-v2.0.0'; 
const PRE_CACHE_RESOURCES = [
    './',
    './index.html'
];

// 安裝階段：跳過等待
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(PRE_CACHE_RESOURCES))
    );
});

// 激活階段：清理所有舊快取 (這是防止回流舊版的關鍵)
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) {
                    console.log('🧹 移除舊資產:', key);
                    return caches.delete(key);
                }
            })
        )).then(() => self.clients.claim())
    );
});

// 抓取階段：網路優先策略
self.addEventListener('fetch', event => {
    // 只處理 GET 請求
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // 將最新的內容存入快取
                const clonedResponse = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, clonedResponse);
                });
                return networkResponse;
            })
            .catch(() => {
                // 沒網路時才讀取快取
                return caches.match(event.request);
            })
    );
});
