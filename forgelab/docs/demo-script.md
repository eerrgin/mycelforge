# 5-minute technical demo

## Opening

“ForgeLab is a decision-core prototype for MycelForge. I separated input validation from rule evaluation so invalid data cannot produce a misleading score. The goal is traceability, not pretending that a heuristic is scientific truth.”

## Demo 1: happy path

Run `npm test` and `npm run demo`. Point out status, score, warnings, and trace. A score of 100 means no configured review rules triggered; it does not mean a 100% chance of biological success.

## Demo 2: invalid input

Copy `examples/input.json`, set `temperatureC` to `100`, then run `node src/cli.mjs path/to/copy.json`. Show `status: invalid`, `OUT_OF_RANGE`, and `score: null`. Explain why invalid data is not scored.

## Demo 3: triggered rule

Set moisture to 70 while keeping all fields in their accepted ranges. Show the preferred-band rule in `trace`.

## Architecture

- CLI owns I/O and exit codes.
- Pure engine owns validation and decision logic.
- Tests protect behavior and edge cases.
- No network request or AI inference occurs at runtime.

## Questions

**Why no AI call inside the algorithm?** Determinism makes decisions reproducible. AI could later help explain results, but should not override validation silently.

**Are the thresholds scientifically validated?** No. They are illustrative and must be replaced with domain-reviewed, evidence-backed requirements before real use.

**What happens with malformed input?** Parsing and domain validation are separate boundaries with distinct error codes.

**Next steps?** Version the contract, validate rules against measured data, add integration tests, then decide whether an API or UI is justified.

Describe accurately what you personally designed, changed, tested, and learned. Disclose AI assistance plainly; do not claim production readiness or experimental validation that has not occurred.
