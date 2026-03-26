const APP_NAME = "CONVOC";

// ─── Push Event ──────────────────────────────────────────────────────────────
// Fires when backend sends a push notification via web-push
// Works when tab is closed, minimized, or another tab is active

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: APP_NAME, body: event.data.text() };
  }

  const options = {
    body: data.body || "You have a new message",
    icon: data.icon || "/logo.png",
    badge: data.badge || "/badge.png",

    // Groups notifications per chat — new message in same chat
    // replaces the old notification instead of stacking
    tag: data.chatId || "convoc-default",
    renotify: true,

    vibrate: [200, 100, 200],
    silent: false,

    // Passed to notificationclick handler
    data: {
      chatId: data.chatId,
      url: data.chatId ? `/?chat=${data.chatId}` : "/",
    },

    // Action buttons on the notification (Android / some desktop)
    actions: [
      { action: "open", title: "Open" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || APP_NAME, options)
  );
});

// ─── Notification Click ───────────────────────────────────────────────────────
// Fires when user clicks the notification or an action button

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const chatId = event.notification.data?.chatId;
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If CONVOC tab is already open anywhere — focus it and
        // send a message so React can open the correct chat
        for (const client of clientList) {
          if (
            client.url.startsWith(self.location.origin) &&
            "focus" in client
          ) {
            client.focus();
            if (chatId) {
              client.postMessage({ type: "OPEN_CHAT", chatId });
            }
            return;
          }
        }

        // No tab open — open a new one
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// ─── Notification Close ───────────────────────────────────────────────────────
// Optional: fires when user dismisses without clicking

self.addEventListener("notificationclose", () => {
  // can log analytics here if needed
});

// ─── Install & Activate ───────────────────────────────────────────────────────
// Minimal lifecycle — CONVOC doesn't use sw for caching,
// only for push notifications

self.addEventListener("install", (event) => {
  // Skip waiting so updated sw activates immediately
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  // Take control of all open tabs immediately
  event.waitUntil(clients.claim());
});