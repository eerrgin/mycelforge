# Algorithm notes

## Validation

Required numeric fields must be finite JavaScript numbers. Strings are not silently coerced. The three substrate percentages must each be in 0–100 and sum to 100 within a tolerance of 0.01.

Illustrative software boundaries:
- moisture: 40–75%
- temperature: 18–32 °C
- duration: 1–60 days

These are example boundaries only, not experimentally validated recommendations.

## Review rules

Start at 100 and subtract each triggered penalty:

| Rule ID | Trigger | Penalty |
|---|---|---:|
| MOISTURE_OUTSIDE_PREFERRED_BAND | Moisture below 48% or above 68% | 15 |
| TEMPERATURE_OUTSIDE_PREFERRED_BAND | Temperature below 20 °C or above 28 °C | 15 |
| DURATION_OUTSIDE_PREFERRED_BAND | Duration below 7 or above 35 days | 10 |
| LOW_FIBER_FRACTION | Fiber below 40% | 20 |
| HIGH_NUTRIENT_FRACTION | Nutrient above 35% | 15 |

Score = clamp(100 − total penalty, 0, 100). Rules execute in fixed order for reproducible output. The score is not calibrated to laboratory outcomes.

## Complexity and assumptions

The current fixed schema and fixed rules run in O(1) time and memory. The three components are assumed to be the complete blend. There is no randomness, network request, persistence, or model inference. Real thresholds require domain expertise and measured data.
