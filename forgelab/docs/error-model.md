# Error model

| Boundary | Code/status | Meaning | Suggested response |
|---|---|---|---|
| CLI usage | exit 2 | No file path | Show usage |
| File read | FILE_NOT_FOUND | Path does not exist | Correct path |
| File read | INPUT_READ_ERROR | File cannot be read | Check permissions/storage |
| JSON parse | INVALID_JSON | Invalid JSON syntax | Fix syntax; do not score |
| Domain validation | status: invalid | Type, schema, or range failure | Display issues and request correction |
| Domain validation | PERCENTAGES_NOT_100 | Components do not total 100 | Correct blend values |
| Domain validation | OUT_OF_RANGE | Value outside prototype boundary | Review value and boundary |

## Invariants

1. Invalid domain input always has `score: null`.
2. Valid domain input has a score from 0 through 100.
3. Results expose `trace`, `warnings`, and `issues` arrays.
4. A triggered rule includes a stable ID, penalty, and explanation.
5. CLI errors do not expose stack traces or raw filesystem internals.

Stable codes let interfaces translate and style errors without parsing message text. Production hardening should add schema versioning, structured logging at service boundaries, and explicit policy for unknown keys.
