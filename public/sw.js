// Choose a cache name
const cacheName = 'sundaraah-pwa-v1';
// List the files to precache
const precacheResources = [
  '/',
  '/shop',
  '/about',
  '/contact',
  '/blog',
  '/offline.html'
];

// When the service worker is installed, open a new cache and add all resources to it
self.addEventListener('install', (event) => {
  console.log('Service worker install event!');
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        return cache.addAll(precacheResources);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activate event!');
});

// When there's a fetch event, try to respond from the cache, otherwise fetch from the network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // If the resource is in the cache, return it
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, fetch the resource from the network
        return fetch(event.request).then(response => {
            // If the request is for a page, and it fails, show the offline page.
            if (event.request.mode === 'navigate' && !response.ok) {
                 return caches.match('/offline.html');
            }
            return response;
        }).catch(() => {
            // If the fetch fails (e.g., the user is offline), show the offline fallback page
            if (event.request.mode === 'navigate') {
                return caches.match('/offline.html');
            }
        });
      })
  );
});
