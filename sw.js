/* Service worker: cache tampilan dasar + terima notifikasi push (Firebase). */
importScripts('config.js');
const C = self.HQ_CONFIG || {};
const CACHE = 'halaqah-v2';
const SHELL = ['./', 'index.html', 'config.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/badge-72.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Halaman sendiri: ambil dari jaringan dulu, kalau offline pakai cache.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    const salin = r.clone(); caches.open(CACHE).then(c => c.put(e.request, salin)); return r;
  }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});

// ---------- Push ----------
function tampilkan(data) {
  data = data || {};
  return self.registration.showNotification(data.title || "Halaqah Qur'an", {
    body: data.body || '', icon: 'icons/icon-192.png', badge: 'icons/badge-72.png',
    tag: 'halaqah-' + Date.now(), data: { link: data.link || './' }, vibrate: [120, 60, 120]
  });
}
if (C.firebaseConfig && C.firebaseConfig.apiKey) {
  importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
  firebase.initializeApp(C.firebaseConfig);
  firebase.messaging().onBackgroundMessage(p => tampilkan(p.data));
}
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) { c.postMessage({ hq: 'notif' }); return c.focus(); } }
    return self.clients.openWindow('./');
  }));
});
