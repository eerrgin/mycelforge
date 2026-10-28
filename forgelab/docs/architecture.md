# Architecture and data flow

## Responsibility boundaries

- **CLI adapter (`src/cli.mjs):** file reading, JSON parsing, console output, and process exit codes. It contains no scoring rules.
- **Pure domain core (`src/engine.mjs):** input validation, normalized summary creation, deterministic rule evaluation, and result construction. It has no I/O or third-party dependencies.
- **Tests (`test/engine.test.mjs):** observable behavior, failure paths, and contract stability.

## Data lifecycle

1. The CLI receives a file path.
2. File read errors are converted to stable machine-readable codes.
3. JSON parse errors are handled separately from file errors.
4. Parsed data is treated as untrusted input.
5. The engine validates structure, types, domain bounds, and percentage totals.
6. Invalid input yields `status: invalid`, `score: null`, and field-level issues.
7. Only valid inputs are normalized and evaluated.
8. Each triggered rule records its ID, penalty, and explanation.
9. The caller receives a JSON-serializable result.

## Why invalid inputs are not scored

Scoring an invalid blend creates false precision. The engine fails closed so a caller must correct the input before a score exists.

## Trust boundaries

File contents are untrusted. JSON parsing proves syntax, not correctness. Validation proves only the software rules encoded here, not biological suitability. The score is a heuristic, not a probability. A production system needs domain review, empirical validation, and operational safety checks.
