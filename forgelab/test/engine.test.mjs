import test from "node:test";
import assert from "node:assert/strict";
import { reviewProtocol } from "../src/engine.mjs";

const validInput = () => ({
  substrate: { fiber: 55, nutrient: 25, binder: 20 },
  moisturePercent: 60,
  temperatureC: 24,
  durationDays: 14
});

test("valid input returns reviewed score with no warnings", () => {
  const result = reviewProtocol(validInput());
  assert.equal(result.status, "reviewed");
  assert.equal(result.score, 100);
  assert.deepEqual(result.warnings, []);
  assert.deepEqual(result.issues, []);
});

test("invalid top-level input fails closed", () => {
  const result = reviewProtocol(null);
  assert.equal(result.status, "invalid");
  assert.equal(result.score, null);
  assert.ok(result.issues.some(entry => entry.code === "EXPECTED_OBJECT"));
});

test("numeric strings are not silently coerced", () => {
  const input = validInput();
  input.moisturePercent = "60";
  const result = reviewProtocol(input);
  assert.equal(result.status, "invalid");
  assert.ok(result.issues.some(entry => entry.path === "moisturePercent" &&
    entry.code === "EXPECTED_FINITE_NUMBER"));
});

test("substrate components must sum to 100", () => {
  const input = validInput();
  input.substrate.binder = 10;
  const result = reviewProtocol(input);
  assert.equal(result.status, "invalid");
  assert.ok(result.issues.some(entry => entry.code === "PERCENTAGES_NOT_100"));
});

test("out-of-range values are rejected before scoring", () => {
  const input = validInput();
  input.temperatureC = 100;
  const result = reviewProtocol(input);
  assert.equal(result.status, "invalid");
  assert.equal(result.score, null);
  assert.ok(result.issues.some(entry => entry.path === "temperatureC" &&
    entry.code === "OUT_OF_RANGE"));
});

test("rule triggers are explained and deterministic", () => {
  const input = validInput();
  input.moisturePercent = 70;
  input.substrate = { fiber: 30, nutrient: 40, binder: 30 };
  const first = reviewProtocol(input);
  assert.deepEqual(first, reviewProtocol(input));
  assert.ok(first.trace.length >= 2);
  assert.ok(first.trace.every(entry => entry.ruleId && entry.explanation));
});

test("score remains between zero and 100", () => {
  const result = reviewProtocol({
    substrate: { fiber: 20, nutrient: 50, binder: 30 },
    moisturePercent: 70, temperatureC: 30, durationDays: 50
  });
  assert.equal(result.status, "reviewed");
  assert.ok(result.score >= 0 && result.score <= 100);
});

test("percentage tolerance is enforced", () => {
  const input = validInput();
  input.substrate.binder = 20.02;
  const result = reviewProtocol(input);
  assert.equal(result.status, "invalid");
  assert.ok(result.issues.some(entry => entry.code === "PERCENTAGES_NOT_100"));
});
