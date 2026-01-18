/// <reference lib="webworker" />

const CACHE_NAME = 'alsamos-quran-v1';
const STATIC_CACHE = 'alsamos-static-v1';
const API_CACHE = 'alsamos-api-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

const API_HOSTS = [
  'api.alquran.cloud',
  'cdn.islamic.network',
  'quranapi.pages.dev',
];

// Install event - cache static assets
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  (self as unknown as ServiceWorkerGlobalScope).skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE && name !== API_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  (self as unknown as ServiceWorkerGlobalScope).clients.claim();
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url);
  
  // Handle API requests (Quran data)
  if (API_HOSTS.some(host => url.hostname.includes(host))) {
    event.respondWith(
      caches.open(API_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            // Only cache successful responses
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
          
          // Return cached response immediately, update in background
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }
  
  // Handle audio files (aggressive caching)
  if (url.pathname.includes('audio') || url.pathname.endsWith('.mp3')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((response) => {
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }
  
  // Default: network first, cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response for caching
        if (response.ok && event.request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// Background sync for bookmarks when back online
self.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === 'sync-bookmarks') {
    event.waitUntil(syncBookmarks());
  }
});

async function syncBookmarks() {
  // This would sync any pending bookmarks when connection is restored
  console.log('Syncing bookmarks...');
}

export {};
