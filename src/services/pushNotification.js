import api from "./api";

const PUBLIC_VAPID_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
// console.log("key:", PUBLIC_VAPID_KEY);
// console.log("key length:", PUBLIC_VAPID_KEY?.length);

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export const registerPushNotifications = async () => {
  // console.log("registerPushNotifications called");
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    // console.log("Push not supported");
    return;
  }

  const permission = await Notification.requestPermission();
  // console.log("Notification permission:", permission);
  if (permission !== "granted") return;

  // ── unregister any stale sw first ──────────────────────────────
  const existing = await navigator.serviceWorker.getRegistration("/sw.js");
  if (existing) await existing.unregister();
  // ──────────────────────────────────────────────────────────────

  const registration = await navigator.serviceWorker.register("/sw.js");

  // ── wait for sw to become active, not just ready ───────────────
  await new Promise((resolve) => {
    if (registration.active) return resolve();
    const sw = registration.installing || registration.waiting;
    sw.addEventListener("statechange", (e) => {
      if (e.target.state === "activated") resolve();
    });
  });
  // ──────────────────────────────────────────────────────────────

  // console.log("SW active, subscribing...");

  const existingSub = await registration.pushManager.getSubscription();
  if (existingSub) await existingSub.unsubscribe();

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
    });

    // console.log("Subscribed:", subscription.endpoint);

    const { endpoint, keys } = subscription.toJSON();
    const res = await api.post("/auth/push-subscription", { endpoint, keys });
    // console.log("Subscription saved to DB:", res.data);

  } catch (err) {
    // console.log("Subscribe error:", err.message);
  }
};
export const unregisterPushNotifications = async () => {
  const registration = await navigator.serviceWorker.getRegistration("/sw.js");
  if (!registration) return;
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) await subscription.unsubscribe();
  await api.delete("/auth/push-subscription");
};