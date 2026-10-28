# Ergin Atölye | ForgeLab — MycelForge Decision Core

> An explainable engineering prototype for validating inputs and reviewing a proposed mycelium-biomaterial protocol. Built to demonstrate system design, deterministic algorithms, explicit failure modes, and testable assumptions.

**Status:** educational prototype · **Runtime:** Node.js 20+ · **Dependencies:** none

## Why this exists

ForgeLab isolates one critical responsibility from a larger product idea: before a proposed protocol is shown to a person, check whether its inputs are structurally valid and produce a traceable, rule-based review. The core is deliberately deterministic: identical inputs produce identical outputs, and every warning includes a code and explanation.

This is not a biological predictor, laboratory procedure, or validated cultivation recommendation. The ranges and risk weights in this prototype are illustrative software rules, not experimentally validated science. Do not use its output as a substitute for lab safety review or empirical validation.

## Run

```bash
node --version
npm test
npm run demo
```

No install step is required. Uses Node's built-in test runner and standard library.

## Data flow

```text
JSON input
   │
   ▼
Parse input ── malformed JSON/file ──► INPUT_READ_ERROR
   │
   ▼
Schema + domain validation ─────────► VALIDATION_ERROR
   │
   ▼
Normalize explicit valid values
   │
   ▼
Deterministic rule evaluation
   │
   ▼
Explainable result (score + rule trace + warnings)
```

The engine does not silently repair invalid values. It returns field-level issues so a caller can request correction.

## Algorithm

1. Validate the object, required numeric fields, and substrate component percentages.
2. Reject invalid input without scoring.
3. Evaluate transparent illustrative rules.
4. Accumulate penalties and clamp the review score to 0–100.
5. Return every triggered rule with an ID and explanation.

The score is a rule-review score, not a probability of success.

## Design decisions

- **Pure core:** no network, filesystem, database, or clock dependency.
- **Fail closed:** invalid input never receives a score.
- **Explainability:** each penalty has a stable rule ID and reason.
- **No hidden coercion:** strings such as "60" are not treated as numbers.
- **Testability:** normal cases, boundaries, malformed shapes, and determinism are covered.

See [architecture](docs/architecture.md), [algorithm](docs/algorithm.md), [error model](docs/error-model.md), and [demo script](docs/demo-script.md).

## AI-assisted development disclosure

AI tools may help draft or review code, but generated code is not evidence of correctness. This repository makes engineering reasoning inspectable: rules are named, assumptions are documented, failure cases are tested, and unsupported claims are avoided. In a presentation, distinguish accurately between your own work, AI assistance, and checks you personally ran.

## License

MIT. See [LICENSE](LICENSE).
