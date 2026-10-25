export type ShootingStar = {
  start: number;
  duration: number;
  x: number;
  y: number;
  cx: number;
  cy: number;
  ex: number;
  ey: number;
  hx?: number;
  hy?: number;
  hr?: number;
  hrMul?: number;
  spin?: number;
  /** First t where the raw path enters the hole; unset if it misses. */
  absorbT?: number;
  clock: number;
  lastNow: number;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function quadratic(star: ShootingStar, t: number) {
  const u = 1 - t;
  return {
    x: u * u * star.x + 2 * u * t * star.cx + t * t * star.ex,
    y: u * u * star.y + 2 * u * t * star.cy + t * t * star.ey
  };
}

function distToHole(star: ShootingStar, t: number) {
  if (star.hx == null || star.hy == null) return Infinity;
  const p = quadratic(star, t);
  return Math.hypot(p.x - star.hx, p.y - star.hy);
}

function findAbsorbT(star: ShootingStar) {
  if (star.hx == null || star.hy == null || star.hr == null) return undefined;
  const rim = star.hr;
  if (distToHole(star, 0) < rim) return 0;
  const steps = 80;
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    if (distToHole(star, t) >= rim) continue;
    let lo = (i - 1) / steps;
    let hi = t;
    for (let k = 0; k < 8; k += 1) {
      const mid = (lo + hi) * 0.5;
      if (distToHole(star, mid) < rim) hi = mid;
      else lo = mid;
    }
    return hi;
  }
  return undefined;
}

function pathSpeed(star: ShootingStar, t: number) {
  if (star.hx == null || star.hy == null || star.hr == null) return 1;
  const dist = distToHole(star, t);
  const reach = star.hr * 2.6;
  if (dist >= reach) return 1;
  const near = Math.max(0, 1 - dist / reach);
  const k = near * near * (3 - 2 * near);
  return 1 - 0.42 * k;
}

function advanceClock(star: ShootingStar, now: number) {
  const dt = Math.min(48, Math.max(0, now - star.lastNow));
  star.lastNow = now;
  star.clock += (dt / star.duration) * pathSpeed(star, star.clock);
}

function alongPath(star: ShootingStar, t: number) {
  const p = quadratic(star, t);
  if (star.hx == null || star.hy == null || star.hr == null) return p;
  if (star.absorbT != null) return p;

  const rim = star.hr;
  const dx = p.x - star.hx;
  const dy = p.y - star.hy;
  const dist = Math.hypot(dx, dy);
  const reach = rim * 2.2;
  if (dist >= reach || dist <= rim) return p;

  const nx = dx / dist;
  const ny = dy / dist;
  const near = Math.max(0, 1 - dist / reach);
  const k = near * near * (3 - 2 * near);
  const lift = rim * 0.18 * k;
  const spin = star.spin ?? 1;
  p.x += -ny * spin * lift;
  p.y += nx * spin * lift;
  return p;
}

function pathTangent(star: ShootingStar, t: number) {
  const dt = 0.004;
  const a = alongPath(star, Math.max(0, t - dt));
  const b = alongPath(star, Math.min(1, t + dt));
  return { dx: b.x - a.x, dy: b.y - a.y };
}

function strokePath(
  ink: CanvasRenderingContext2D,
  star: ShootingStar,
  t0: number,
  t1: number
) {
  const end = star.absorbT != null ? Math.min(t1, star.absorbT) : t1;
  const startT = Math.min(t0, end);
  if (end - startT < 1e-4) return false;
  const start = alongPath(star, startT);
  ink.moveTo(start.x, start.y);
  const steps = 56;
  for (let i = 1; i <= steps; i += 1) {
    const p = alongPath(star, startT + (end - startT) * (i / steps));
    ink.lineTo(p.x, p.y);
  }
  return true;
}

function bindHole(star: ShootingStar, around: { x: number; y: number; r: number }, viewW: number, viewH: number) {
  star.hx = around.x * viewW;
  star.hy = around.y * viewH;
  star.hr = Math.max(56, around.r * (star.hrMul ?? 1.04));
  star.absorbT = findAbsorbT(star);
}

/**
 * Left → right across the screen on a new random curve each time.
 * If the curve heads into the hole, the remaining path fades at the rim.
 */
export function spawnShootingStar(
  viewW: number,
  viewH: number,
  now: number,
  around?: { x: number; y: number; r: number }
): ShootingStar {
  const x = viewW * rand(-0.12, 0.02);
  const y = viewH * rand(0.1, 0.78);
  const ex = viewW * rand(0.96, 1.14);
  const ey = Math.min(viewH * 0.9, Math.max(viewH * 0.06, y + viewH * rand(-0.07, 0.07)));
  const bow = viewH * rand(-0.04, 0.04);
  const star: ShootingStar = {
    start: now,
    duration: rand(2400, 3800),
    x,
    y,
    cx: (x + ex) * 0.5,
    cy: (y + ey) * 0.5 + bow,
    ex,
    ey,
    clock: 0,
    lastNow: now
  };

  if (around && around.r > 8) {
    const hx = around.x * viewW;
    const hy = around.y * viewH;
    const hrMul = rand(1.0, 1.08);
    const hr = Math.max(56, around.r * hrMul);
    star.hx = hx;
    star.hy = hy;
    star.hr = hr;
    star.hrMul = hrMul;
    star.spin = Math.random() < 0.5 ? 1 : -1;
    if (Math.random() < 0.45) {
      star.cy += (hy - star.cy) * 0.2;
    }
    star.absorbT = findAbsorbT(star);
  }

  return star;
}

export function drawShootingStars(
  ink: CanvasRenderingContext2D,
  viewW: number,
  viewH: number,
  streaks: ShootingStar[],
  now: number
) {
  ink.clearRect(0, 0, viewW, viewH);
  for (let i = streaks.length - 1; i >= 0; i -= 1) {
    const star = streaks[i];
    advanceClock(star, now);
    const t = star.clock;
    const absorbT = star.absorbT;
    if (t >= 1 || (absorbT != null && t >= absorbT)) {
      streaks.splice(i, 1);
      continue;
    }
    const headT = absorbT != null ? Math.min(t, absorbT) : t;
    const tailT = Math.max(0, headT - 0.42);
    const head = alongPath(star, headT);
    const tail = alongPath(star, tailT);
    const eaten =
      absorbT == null
        ? 0
        : Math.max(0, Math.min(1, 1 - (absorbT - t) / 0.16));
    const fade = Math.sin(Math.PI * t) ** 0.65 * (1 - eaten) ** 1.7;
    if (fade < 0.02) {
      if (eaten > 0.92) streaks.splice(i, 1);
      continue;
    }
    const glow = ink.createLinearGradient(tail.x, tail.y, head.x, head.y);
    glow.addColorStop(0, 'rgba(255, 214, 176, 0)');
    glow.addColorStop(0.55, `rgba(255, 232, 210, ${0.4 * fade})`);
    glow.addColorStop(1, `rgba(255, 248, 238, ${0.95 * fade})`);
    ink.beginPath();
    if (!strokePath(ink, star, tailT, headT)) continue;
    ink.strokeStyle = glow;
    ink.lineWidth = 1.8;
    ink.lineCap = 'round';
    ink.lineJoin = 'round';
    ink.stroke();
    const tangent = pathTangent(star, headT);
    ink.beginPath();
    ink.ellipse(head.x, head.y, 3.4, 1.15, Math.atan2(tangent.dy, tangent.dx), 0, Math.PI * 2);
    ink.fillStyle = `rgba(255, 248, 238, ${fade})`;
    ink.shadowBlur = 14 * fade;
    ink.shadowColor = '#fff5ee';
    ink.fill();
    ink.shadowBlur = 0;
  }
}

/** Delay before the next star. `count` is how many have already appeared. */
export function nextShootingStarDelay(count = 0) {
  if (count <= 0) return rand(350, 900);
  if (count === 1) return rand(4000, 5000);
  const ramp = 5000 + (count - 1) * 2200;
  const delay = Math.min(18000, ramp);
  return rand(delay * 0.9, delay * 1.12);
}

/** Keep the warp field locked to the live hole. */
export function retargetShootingStars(
  streaks: ShootingStar[],
  around: { x: number; y: number; r: number },
  viewW: number,
  viewH: number
) {
  for (const star of streaks) {
    if (star.hr == null) continue;
    bindHole(star, around, viewW, viewH);
  }
}
