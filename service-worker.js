const CACHE_NAME = "skizag-cache-v1";
const urlsToCache = [
  "index.html",
  "training.html",
  "players.html",
  "icon192.png",
  "icon512.png"
];

// Installazione del service worker
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Attiva il service worker e pulisce le vecchie cache
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Intercetta le richieste e le serve dalla cache
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response || fetch(event.request).catch(() => {
          // Fornisce un fallback per richieste fallite
          if (event.request.destination === "document") {
            return caches.match("index.html");
          }
        })
      );
    })
  );
});
