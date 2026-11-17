const CACHE = 'hsk-shell-fourchinese-v1';
const home = new URL('./', self.location.href).href;
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const response = await fetch(home, { cache: 'reload' });
    if (!response.ok) throw new Error('Shell unavailable');
    const html = await response.clone().text();
    const assets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
      .map((match) => new URL(match[1], home))
      .filter((url) => url.origin === self.location.origin && /\.(js|css|svg|webmanifest)$/.test(url.pathname));
    await cache.put(home, response);
    await cache.addAll([...new Set(assets.map((url) => url.href))]);
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) if (name.startsWith('hsk-shell-') && name !== CACHE) await caches.delete(name);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin || new URL(request.url).pathname.startsWith('/api/')) return;
  if (/\/data\/(?:open-hsk|fourchinese)\/.*\.json$/.test(new URL(request.url).pathname) || /\/data\/.*(?:manifest|report|dedupe)\.json$/.test(new URL(request.url).pathname)) {
    event.respondWith(fetch(request).then(async response=>{if(response.ok)await(await caches.open(CACHE)).put(request,response.clone());return response;}).catch(async()=>await caches.match(request)||Response.error()));
  } else if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(async (response) => {
      if (response.ok) await (await caches.open(CACHE)).put(home, response.clone());
      return response;
    }).catch(async () => (await caches.match(home)) || Response.error()));
  } else if (['script', 'style', 'image', 'manifest'].includes(request.destination) || new URL(request.url).pathname.startsWith('/data/')) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok) (await caches.open(CACHE)).put(request, response.clone());
      return response;
    })());
  }
});

