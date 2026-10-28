/**
 * ForgeLab deterministic protocol review core.
 * Educational prototype only: thresholds and weights are illustrative,
 * not biologically validated.
 */
const LIMITS = Object.freeze({
  moisturePercent: { min: 40, max: 75 },
  temperatureC: { min: 18, max: 32 },
  durationDays: { min: 1, max: 60 }
});
const COMPONENTS = Object.freeze(["fiber", "nutrient", "binder"]);
const PERCENT_TOLERANCE = 0.01;

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function issue(path, code, message, received = undefined) {
  const result = { path, code, message };
  if (received !== undefined) result.received = received;
  return result;
}
function validateProtocol(input) {
  const issues = [];
  if (!isPlainObject(input)) {
    return [issue("$", "EXPECTED_OBJECT", "Input must be a JSON object.")];
  }
  for (const key of ["moisturePercent", "temperatureC", "durationDays"]) {
    if (typeof input[key] !== "number" || !Number.isFinite(input[key])) {
      issues.push(issue(key, "EXPECTED_FINITE_NUMBER", `${key} must be a finite number.`, input[key]));
    }
  }
  if (!isPlainObject(input.substrate)) {
    issues.push(issue("substrate", "EXPECTED_OBJECT", "substrate must be an object."));
  } else {
    for (const component of COMPONENTS) {
      const value = input.substrate[component];
      if (typeof value !== "number" || !Number.isFinite(value)) {
        issues.push(issue(`substrate.${component}`, "EXPECTED_FINITE_NUMBER",
          `${component} percentage must be a finite number.`, value));
      } else if (value < 0 || value > 100) {
        issues.push(issue(`substrate.${component}`, "OUT_OF_RANGE",
          `${component} percentage must be between 0 and 100.`, value));
      }
    }
    const allNumeric = COMPONENTS.every(key =>
      typeof input.substrate[key] === "number" && Number.isFinite(input.substrate[key]));
    if (allNumeric) {
      const total = COMPONENTS.reduce((sum, key) => sum + input.substrate[key], 0);
      if (Math.abs(total - 100) > PERCENT_TOLERANCE) {
        issues.push(issue("substrate", "PERCENTAGES_NOT_100",
          `Substrate percentages must sum to 100; received ${Number(total.toFixed(4))}.`, total));
      }
    }
  }
  for (const key of ["moisturePercent", "temperatureC", "durationDays"]) {
    const value = input[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      const { min, max } = LIMITS[key];
      if (value < min || value > max) {
        issues.push(issue(key, "OUT_OF_RANGE", `${key} must be between ${min} and ${max}.`, value));
      }
    }
  }
  return issues;
}
export function reviewProtocol(input) {
  const issues = validateProtocol(input);
  if (issues.length) return {
    status: "invalid", inputSummary: null, score: null,
    warnings: [], trace: [], issues
  };
  const normalized = {
    substrate: Object.fromEntries(COMPONENTS.map(key => [key, input.substrate[key]])),
    moisturePercent: input.moisturePercent,
    temperatureC: input.temperatureC,
    durationDays: input.durationDays
  };
  let penalty = 0;
  const warnings = [];
  const trace = [];
  const applyRule = (condition, ruleId, points, explanation) => {
    if (!condition) return;
    penalty += points;
    warnings.push(explanation);
    trace.push({ ruleId, penalty: points, explanation });
  };
  applyRule(normalized.moisturePercent < 48 || normalized.moisturePercent > 68,
    "MOISTURE_OUTSIDE_PREFERRED_BAND", 15,
    "Moisture is inside the accepted prototype range but outside its illustrative preferred band (48–68%).");
  applyRule(normalized.temperatureC < 20 || normalized.temperatureC > 28,
    "TEMPERATURE_OUTSIDE_PREFERRED_BAND", 15,
    "Temperature is inside the accepted prototype range but outside its illustrative preferred band (20–28 °C).");
  applyRule(normalized.durationDays < 7 || normalized.durationDays > 35,
    "DURATION_OUTSIDE_PREFERRED_BAND", 10,
    "Duration is inside the accepted prototype range but outside its illustrative preferred band (7–35 days).");
  applyRule(normalized.substrate.fiber < 40,
    "LOW_FIBER_FRACTION", 20,
    "Fiber fraction is below the illustrative 40% review threshold.");
  applyRule(normalized.substrate.nutrient > 35,
    "HIGH_NUTRIENT_FRACTION", 15,
    "Nutrient fraction exceeds the illustrative 35% review threshold.");
  return {
    status: "reviewed",
    inputSummary: normalized,
    score: Math.max(0, Math.min(100, 100 - penalty)),
    scoreMeaning: "Rule-review score only; not a success probability or validated biological prediction.",
    warnings, trace, issues: []
  };
}
export const __testing = Object.freeze({ validateProtocol, LIMITS });
