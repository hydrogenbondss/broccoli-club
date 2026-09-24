/**
 * Subtle motion only — no bounce / infinite / parallax.
 * Entrance: ~8px / 180–240ms. Press: compression via MotionPressable (fast).
 * State change (join / leave / full): standard → important.
 */
export const motion = {
  fast: 180,
  standard: 220,
  important: 280,
  entrance: 200,
  entranceOffset: 8,
} as const;
