// Zebra Restaurant Service Worker
const CACHE_NAME = 'zebra-restaurant-pwa-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('PWA Precache notice:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Do not cache API routes, Firestore, or analytics
  if (url.pathname.startsWith('/api') || url.hostname.includes('firestore') || url.hostname.includes('googleapis')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh in background
        fetch(event.request).then((freshResponse) => {
          if (freshResponse && freshResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, freshResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Offline fallback for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// ==========================================
// PWA NOTIFICATIONS & CALL FROM NOTIFICATION
// ==========================================

// Handle messages from the client to show or dismiss incoming call notifications
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SHOW_INCOMING_CALL_NOTIFICATION') {
    const { callId, callerName, tableNumber, callType } = event.data;
    const isVideo = callType === 'video';

    const title = `📞 Simu Inayoingia: ${callerName || 'Mteja'}`;
    const options = {
      body: `${tableNumber ? `Chumba / Meza: ${tableNumber} • ` : ''}${isVideo ? 'Simu ya Video' : 'Simu ya Sauti'}.\nBofya "Pokea Simu" kujibu mara moja!`,
      icon: '/icon-192.png',
      badge: '/favicon.svg',
      tag: `incoming-call-${callId}`,
      renotify: true,
      requireInteraction: true, // Keep notification visible on screen like a real phone call
      vibrate: [300, 150, 300, 150, 300, 150, 400],
      actions: [
        { action: 'answer_call', title: '📞 Pokea Simu' },
        { action: 'decline_call', title: '❌ Kataa Simu' }
      ],
      data: { callId, callerName, tableNumber, callType }
    };

    self.registration.showNotification(title, options);
  } else if (event.data.type === 'DISMISS_CALL_NOTIFICATION') {
    const { callId } = event.data;
    self.registration.getNotifications().then((notifications) => {
      notifications.forEach((n) => {
        if (!callId || (n.tag && n.tag.includes(callId))) {
          n.close();
        }
      });
    });
  }
});

// Handle clicks on Notification Action Buttons ("Pokea Simu" and "Kataa")
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data || {};
  const callId = data.callId;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Find open client tab
      const client = clientList.find((c) => c.url.includes(self.registration.scope));

      if (action === 'answer_call') {
        // User tapped "Pokea Simu" directly from notification
        if (client) {
          client.postMessage({
            type: 'NOTIFICATION_CALL_ACTION',
            action: 'answer',
            callId
          });
          return client.focus();
        } else if (self.clients.openWindow) {
          return self.clients.openWindow(`/?action=answer_call&callId=${callId || ''}`);
        }
      } else if (action === 'decline_call') {
        // User tapped "Kataa" directly from notification
        if (client) {
          client.postMessage({
            type: 'NOTIFICATION_CALL_ACTION',
            action: 'decline',
            callId
          });
        }
        // Also fire background reject API to ensure server closes session
        if (callId) {
          fetch('/api/live/reject-call', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ callId, reason: 'Kataa kutoka kwenye Notification' })
          }).catch(() => {});
        }
      } else {
        // User tapped the notification body directly: focus or open app window
        if (client) {
          client.postMessage({
            type: 'NOTIFICATION_CALL_ACTION',
            action: 'focus',
            callId
          });
          return client.focus();
        } else if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      }
    })
  );
});
