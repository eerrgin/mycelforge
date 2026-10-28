const REQUIRED = ["fetch", "URL", "Promise", "AbortController"];
export function probeBrowser(environment = globalThis) {
  const features = {};
  for (const feature of REQUIRED) features[feature] = typeof environment?.[feature] !== "undefined";
  features.localStorage = safeStorageProbe(environment);
  features.serviceWorker = typeof environment?.navigator?.serviceWorker !== "undefined";
  features.onlineSignal = typeof environment?.navigator?.onLine === "boolean";
  const missing = REQUIRED.filter((feature) => !features[feature]);
  return Object.freeze({ supported: missing.length === 0, features: Object.freeze(features), missing: Object.freeze(missing) });
}
function safeStorageProbe(environment) {
  try {
    if (!environment || !environment.localStorage) return false;
    const key = `__ergin_probe_${Math.random().toString(36).slice(2)}`;
    environment.localStorage.setItem(key, "1"); environment.localStorage.removeItem(key); return true;
  } catch { return false; }
}
