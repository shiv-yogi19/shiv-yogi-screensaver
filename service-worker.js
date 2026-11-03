/* Network-first with offline cache fallback. Bump V to force a cache refresh after updates. */
const V = 'sy-v1';
const A = ['./', 'index.html', 'css/style.css', 'js/content.js', 'js/wallpaper-engine.js', 'js/text-engine.js', 'js/main.js', 'wallpapers/scenes.js', 'manifest.json', 'assets/icons/icon-192.png', 'assets/icons/icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(V).then(c => c.addAll(A)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; }).catch(() => caches.match(r).then(m => m || caches.match('index.html'))));
});
