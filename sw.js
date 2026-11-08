/* Service Worker — Le Petit Déj de Myra */
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; }
  catch (_) { payload = { title: 'Le Petit Déj de Myra', body: event.data?.text() || 'Une nouveauté vous attend.' }; }

  const title = payload.title || 'Le Petit Déj de Myra';
  const options = {
    body: payload.body || 'Une nouveauté vous attend.',
    icon: '/img/logo.png',
    badge: '/img/logo.png',
    image: payload.image || undefined,
    data: { url: payload.url || '/' },
    vibrate: [120, 60, 120],
    renotify: false,
    tag: payload.notificationId || 'myra-update'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || '/', self.location.origin).href;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) {
      if ('focus' in client) {
        await client.navigate(target);
        return client.focus();
      }
    }
    if (self.clients.openWindow) return self.clients.openWindow(target);
  })());
});
