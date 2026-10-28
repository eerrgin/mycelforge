import test from "node:test";
import assert from "node:assert/strict";
import { OfflineQueue } from "./index.mjs";
test("retains work offline and sends after reconnect", async () => {
  let online = false; const sent = []; const q = new OfflineQueue({ isOnline: () => online, send: async (x) => sent.push(x) });
  q.enqueue({ value: 1 }); assert.deepEqual(await q.flush(), { ok: false, code: "OFFLINE", processed: 0 }); assert.equal(sent.length, 0);
  online = true; assert.deepEqual(await q.flush(), { ok: true, processed: 1, failed: 0 }); assert.deepEqual(sent, [{ value: 1 }]); assert.equal(q.size, 0);
});
test("retries transient failures only within the limit", async () => {
  let calls = 0; const q = new OfflineQueue({ maxAttempts: 3, send: async () => { if (++calls < 3) throw Error("transient"); } });
  q.enqueue("job"); assert.deepEqual(await q.flush(), { ok: true, processed: 1, failed: 0 }); assert.equal(calls, 3);
});
test("marks permanent failure and stops retrying", async () => {
  let calls = 0; const q = new OfflineQueue({ maxAttempts: 2, send: async () => { calls++; throw Error("no"); } });
  q.enqueue("job"); assert.deepEqual(await q.flush(), { ok: true, processed: 0, failed: 1 }); await q.flush(); assert.equal(calls, 2);
});
test("bounds queue size and validates options", () => {
  const q = new OfflineQueue({ maxQueueSize: 1, send: async () => {} }); assert.equal(q.enqueue(1).ok, true);
  assert.deepEqual(q.enqueue(2), { ok: false, code: "QUEUE_FULL" }); assert.throws(() => new OfflineQueue({ maxAttempts: 0, send: async () => {} }), RangeError);
});
