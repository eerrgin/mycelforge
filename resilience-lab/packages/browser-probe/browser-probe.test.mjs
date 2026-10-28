import test from "node:test";
import assert from "node:assert/strict";
import { probeBrowser } from "./index.mjs";
test("detects APIs without user-agent guessing", () => {
  const r = probeBrowser({ fetch() {}, URL, Promise, AbortController, navigator: { onLine: true } });
  assert.equal(r.supported, true); assert.equal(r.features.fetch, true); assert.equal(r.features.localStorage, false); assert.equal(r.features.onlineSignal, true);
});
test("reports missing capabilities", () => {
  const r = probeBrowser({}); assert.equal(r.supported, false); assert.deepEqual(r.missing, ["fetch", "URL", "Promise", "AbortController"]);
});
test("handles blocked storage without throwing", () => {
  const env = { fetch() {}, URL, Promise, AbortController, get localStorage() { throw Error("blocked"); } };
  assert.doesNotThrow(() => probeBrowser(env)); assert.equal(probeBrowser(env).features.localStorage, false);
});
