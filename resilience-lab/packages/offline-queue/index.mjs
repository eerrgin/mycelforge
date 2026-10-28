export class OfflineQueue {
  #items = []; #running = false;
  constructor({ isOnline = () => true, send, maxAttempts = 3, maxQueueSize = 100 } = {}) {
    if (typeof send !== "function") throw new TypeError("send must be a function");
    if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 10) throw new RangeError("maxAttempts must be an integer from 1 to 10");
    if (!Number.isInteger(maxQueueSize) || maxQueueSize < 1) throw new RangeError("maxQueueSize must be a positive integer");
    this.isOnline = isOnline; this.send = send; this.maxAttempts = maxAttempts; this.maxQueueSize = maxQueueSize;
  }
  get size() { return this.#items.length; }
  enqueue(payload) {
    if (this.#items.length >= this.maxQueueSize) return { ok: false, code: "QUEUE_FULL" };
    const item = { id: crypto.randomUUID(), payload, attempts: 0, state: "queued" }; this.#items.push(item); return { ok: true, id: item.id };
  }
  snapshot() { return this.#items.map(({ id, attempts, state }) => ({ id, attempts, state })); }
  async flush() {
    if (this.#running) return { ok: false, code: "ALREADY_RUNNING" };
    if (!this.isOnline()) return { ok: false, code: "OFFLINE", processed: 0 };
    this.#running = true; let processed = 0;
    try {
      for (const item of this.#items) {
        if (item.state !== "queued") continue;
        if (!this.isOnline()) return { ok: false, code: "OFFLINE", processed };
        item.state = "sending";
        while (item.attempts < this.maxAttempts) {
          item.attempts++;
          try { await this.send(item.payload, { id: item.id, attempt: item.attempts }); item.state = "sent"; processed++; break; }
          catch { if (item.attempts >= this.maxAttempts) item.state = "failed"; }
        }
      }
      this.#items = this.#items.filter((item) => item.state !== "sent");
      return { ok: true, processed, failed: this.#items.filter((item) => item.state === "failed").length };
    } finally { this.#running = false; }
  }
}
