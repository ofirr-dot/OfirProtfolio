/* Service Worker — מעטפת תיק Ofir — v6 (חבצלת 20/10)
   v6: רשת-קודם ל-index.html ול-manifest כדי שעדכוני המעטפת
   יגיעו לטלפון מיד (מטמון רק כגיבוי לאופליין),
   cache-first לאייקונים הקבועים, וניקוי גרסאות ישן. */
var CACHE = 'ofir-shell-v6';
var ICONS = ['./icon-192.png', './icon-512.png', './icon-512-maskable.png'];
var ASSETS = ['./', './index.html', './manifest.webmanifest'].concat(ICONS);

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
  /* רק קבצי המעטפת (אותו origin) — תעבורת האפליקציה
     (script.google.com / googleusercontent.com) עוברת ישר לרשת */
  if (url.origin !== self.location.origin) return;
  if (e.request.method !== 'GET') return;

  /* אייקונים — קבועים: מהמטמון, מהר */
  if (ICONS.indexOf(url.pathname.replace(/.*\/OfirProtfolio/, '')) >= 0 ||
      ICONS.indexOf('.' + url.pathname.split('/').slice(-2).join('/')) >= 0) {
    e.respondWith(
      caches.match(e.request).then(function (r) {
        return r || fetch(e.request).then(function (resp) {
          var copy = resp.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
          return resp;
        });
      })
    );
    return;
  }

  /* דפים — רשת-קודם: עדכונים מגיעים מיד, מטמון רק בניתוק */
  e.respondWith(
    fetch(e.request).then(function (resp) {
      var copy = resp.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return resp;
    }).catch(function () {
      return caches.match(e.request, { ignoreSearch: true }).then(function (r) {
        return r || caches.match('./index.html');
      });
    })
  );
});
