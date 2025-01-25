self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install');
});

self.addEventListener('fetch', (event) => {
    console.log('[ServiceWorker] Fetch', event.request.url);
});
