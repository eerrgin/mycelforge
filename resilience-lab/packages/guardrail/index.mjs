const DEFAULT_MAX_BYTES = 64 * 1024;
export function ok(value) { return Object.freeze({ ok: true, value }); }
export function err(code, message, details = []) {
  return Object.freeze({ ok: false, error: Object.freeze({ code: String(code), message: String(message),
    details: Array.isArray(details) ? details.map((item) => ({ path: String(item.path ?? "$"), code: String(item.code ?? "INVALID"), message: String(item.message ?? "Invalid value") })) : [] }) });
}
export function safeParseJson(text, options = {}) {
  const maxBytes = Number.isSafeInteger(options.maxBytes) && options.maxBytes > 0 ? options.maxBytes : DEFAULT_MAX_BYTES;
  if (typeof text !== "string") return err("INPUT_TYPE", "Input must be a JSON string.");
  if (new TextEncoder().encode(text).byteLength > maxBytes) return err("INPUT_TOO_LARGE", `Input exceeds the ${maxBytes}-byte limit.`);
  try { return ok(JSON.parse(text)); } catch { return err("INVALID_JSON", "Input is not valid JSON."); }
}
export function validateProfile(value) {
  const issues = [];
  if (value === null || typeof value !== "object" || Array.isArray(value)) return err("VALIDATION_FAILED", "Input must be an object.", [{ path: "$", code: "OBJECT_REQUIRED", message: "Expected an object." }]);
  if (typeof value.name !== "string" || value.name.trim().length < 2) issues.push({ path: "$.name", code: "NAME_INVALID", message: "Name must contain at least 2 characters." });
  else if (value.name.length > 80) issues.push({ path: "$.name", code: "NAME_TOO_LONG", message: "Name must be 80 characters or fewer." });
  if (!Number.isInteger(value.age) || value.age < 0 || value.age > 130) issues.push({ path: "$.age", code: "AGE_INVALID", message: "Age must be an integer from 0 to 130." });
  if (issues.length) return err("VALIDATION_FAILED", "Please correct the highlighted fields.", issues);
  return ok(Object.freeze({ name: value.name.trim(), age: value.age }));
}
export function toPublicError(error) {
  const messages = { NETWORK_OFFLINE: "You appear to be offline.", TIMEOUT: "The operation took too long. Try again.", NOT_FOUND: "The requested item was not found.", VALIDATION_FAILED: "Please check the supplied values." };
  if (error && typeof error === "object" && typeof error.code === "string" && Object.hasOwn(messages, error.code)) return err(error.code, messages[error.code]);
  return err("INTERNAL_ERROR", "Something went wrong. Please try again.");
}
