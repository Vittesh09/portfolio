export const BLACK_HOLE_RADIUS = 1.3;
export const DISK_INNER = BLACK_HOLE_RADIUS + 0.2;
export const DISK_OUTER = 8.0;
/** Thin edge-on rest pose — a sliver of disk, not a face-on ring. */
export const DISK_TILT = (-82 * Math.PI) / 180;
/** Mild bank so the thin disk still reads diagonal. */
export const DISK_BANK = (-16 * Math.PI) / 180;
/** In-plane yaw — park the ring join on the far edge, off the bright face. */
export const DISK_YAW = (108 * Math.PI) / 180;

/** Tight archival palette — cream + red only, no rainbow. */
export const COLORS = {
  hot: 0xfff6ee,
  mid: 0xff5a3a,
  accent: 0xf23828,
  ember: 0x7a2218,
  outer: 0x1a0a08,
  horizonGlow: 0xf23828,
  starWarm: 0xffe8d8,
  starCool: 0xfff5ee,
  starEmber: 0xff8866
} as const;
