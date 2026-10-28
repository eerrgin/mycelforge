import test from "node:test";
import assert from "node:assert/strict";
import { safeParseJson, validateProfile, toPublicError } from "./index.mjs";
test("parses JSON primitives and objects", () => {
  assert.deepEqual(safeParseJson('{"x":0}'), { ok: true, value: { x: 0 } });
  assert.equal(safeParseJson("false").value, false); assert.equal(safeParseJson("null").value, null); assert.equal(safeParseJson("0").value, 0);
});
test("malformed JSON returns a stable non-leaking error", () => {
  const r = safeParseJson('{"password":'); assert.equal(r.error.code, "INVALID_JSON"); assert.doesNotMatch(r.error.message, /password|position|token/i);
});
test("rejects wrong input type and oversized payload", () => {
  assert.equal(safeParseJson({}).error.code, "INPUT_TYPE"); assert.equal(safeParseJson('"12345"', { maxBytes: 3 }).error.code, "INPUT_TOO_LARGE");
});
test("validates fields and trims valid names", () => {
  assert.deepEqual(validateProfile({ name: " Ada ", age: 37 }), { ok: true, value: { name: "Ada", age: 37 } });
  assert.equal(validateProfile({ name: "A", age: "37" }).error.details.length, 2);
});
test("rejects invalid shapes and boundaries", () => {
  for (const v of [null, [], { name: "Ada", age: 131 }, { name: "Ada", age: 1.5 }]) assert.equal(validateProfile(v).ok, false);
});
test("hides unknown exception details", () => {
  const r = toPublicError(new Error("secret database password")); assert.equal(r.error.code, "INTERNAL_ERROR"); assert.doesNotMatch(r.error.message, /secret|password/i);
  assert.equal(toPublicError({ code: "NETWORK_OFFLINE" }).error.code, "NETWORK_OFFLINE");
});
