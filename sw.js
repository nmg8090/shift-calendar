const CACHE_NAME = 'shift-cal-v4';
const APP_SHELL = [
  './index.html',
  './manifest.json',
  './offline.html',
  './icons/calendar-symbol.svg'
];
const FALLBACK_URL = './offline.html';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

const cacheResponse = (request, response) => {
  if (response && response.ok) {
    const clone = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
  }
};

const networkFirst = request =>
  fetch(request).then(response => {
    cacheResponse(request, response);
    return response;
  }).catch(() => caches.match(request));

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);

  if (event.request.mode === 'navigate' || requestUrl.pathname === '/' || requestUrl.pathname.endsWith('index.html')) {
    event.respondWith(
      networkFirst(event.request).catch(() => caches.match(FALLBACK_URL))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cacheResponse => {
      if (cacheResponse) return cacheResponse;
      return fetch(event.request).then(response => {
        cacheResponse(event.request, response);
        return response;
      }).catch(() => {
        if (event.request.destination === 'font') {
          return caches.match('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600&display=swap');
        }
      });
    })
  );
});
