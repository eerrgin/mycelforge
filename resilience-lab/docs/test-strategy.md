# Test strategy

| Risk | Case | Expected result |
|---|---|---|
| Malformed input | Broken JSON | Stable error code; no parser internals |
| Oversized input | Payload over limit | Rejected before parsing |
| Wrong shape | null or array | Validation failure |
| Boundary values | age 0/130 and 131 | Explicit bounds |
| Offline use | Flush while offline | Nothing sent; work retained |
| Transient failure | First attempts fail | Bounded retry |
| Permanent failure | All attempts fail | Mark failed; no endless retry |
| Browser privacy | Storage access throws | Report unavailable; do not crash |
| Missing APIs | Empty environment | Missing features listed |

## Not covered yet

Real Chromium/Firefox/WebKit end-to-end tests, IndexedDB persistence, refresh/restart recovery, server authorization, CSRF/XSS/SQL-injection checks, dependency audits, and distributed exactly-once delivery are not covered by these unit tests. Add and run them before making claims about them.
