export const BLACK_HOLE_RADIUS = 1.3;
export const DISK_INNER = BLACK_HOLE_RADIUS + 0.2;
export const DISK_OUTER = 8.0;
/** Homepage rest scale so the disk does not swallow the copy lane. */
export const HERO_HOLE_SCALE = 0.7;
/** Thin edge-on rest pose — a sliver of disk, not a face-on ring. */
export const DISK_TILT = (-82 * Math.PI) / 180;
/** Mild bank so the thin disk still reads diagonal. */
export const DISK_BANK = (-16 * Math.PI) / 180;
/** In-plane yaw — park the ring join on the far edge, off the bright face. */
export const DISK_YAW = (108 * Math.PI) / 180;

/** Interstellar ice — cool silver-blue core, muted mid band, warm ember inner. */
export const COLORS = {
  hot: 0xc5d4e8,
  mid: 0x6f98c0,
  accent: 0x4a7aab,
  ember: 0xb8895c,
  outer: 0x080e18,
  horizonGlow: 0xb8c8dc,
  starWarm: 0xe8d4bc,
  starCool: 0xa8c0dc,
  starEmber: 0x6a88b0
} as const;
