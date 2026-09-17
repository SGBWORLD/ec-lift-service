const CACHE_NAME = 'ec-lift-shell-v40';
const SHELL_FILES = [
  './EC_Lift_Service_App.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// App shell: cache-first (so it opens instantly / offline).
// Everything else (Firestore, fonts, CDN libraries, QR/PDF libs): network, falling back to cache if offline.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const isShellFile = SHELL_FILES.some((f) => req.url.endsWith(f.replace('./', '')));

  if (isShellFile) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req))
    );
  } else {
    event.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
  }
});
