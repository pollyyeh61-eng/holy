const CACHE_NAME = 'v-system-v2'; // 每次更新版本請改名

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('🛡️ 清理舊版戰略快取:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim()) // 立即接管所有頁面
    );
});
