/* Service Worker — מעטפת תיק Ofir
   מאפשר לכרום להציע "התקנת אפליקציה" אמיתית (WebAPK)
   ושומר את מסך הפתיחה מהמטמון גם בלי רשת. */
var CACHE = 'ofir-shell-v4'; // ✅ v4: מעבר לפריסה הפעילה + shell=1 — זריקת מטמון הכרחית
var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys
          .filter(function (k) { return k !== CACHE; })
          .map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  // רק קבצי המעטפת עצמה (אותו origin) — תעבורת האפליקציה
  // (script.google.com / googleusercontent.com) עוברת ישר לרשת
  if (url.origin !== self.location.origin) return;
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function (r) {
      return r || fetch(e.request);
    })
  );
});
