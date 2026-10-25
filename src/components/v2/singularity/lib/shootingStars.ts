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
  a0?: number;
  a1?: number;
};

const ARC_IN = 0.22;
const ARC_OUT = 0.78;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function smooth01(u: number) {
  return u * u * (3 - 2 * u);
}

function hermite(
  p0: { x: number; y: number },
  m0: { x: number; y: number },
  p1: { x: number; y: number },
  m1: { x: number; y: number },
  u: number
) {
  const u2 = u * u;
  const u3 = u2 * u;
  const h00 = 2 * u3 - 3 * u2 + 1;
  const h10 = u3 - 2 * u2 + u;
  const h01 = -2 * u3 + 3 * u2;
  const h11 = u3 - u2;
  return {
    x: h00 * p0.x + h10 * m0.x + h01 * p1.x + h11 * m1.x,
    y: h00 * p0.y + h10 * m0.y + h01 * p1.y + h11 * m1.y
  };
}

function wrapsHorizon(star: ShootingStar): star is ShootingStar & {
  hx: number;
  hy: number;
  hr: number;
  a0: number;
  a1: number;
} {
  return star.hr != null && star.hx != null && star.hy != null && star.a0 != null && star.a1 != null;
}

function onHorizon(star: ShootingStar & { hx: number; hy: number; hr: number }, a: number) {
  return {
    x: star.hx + star.hr * Math.cos(a),
    y: star.hy + star.hr * Math.sin(a)
  };
}

function circleTangent(
  star: ShootingStar & { hr: number; a0: number; a1: number },
  a: number
) {
  const da = star.a1 - star.a0;
  return {
    x: -star.hr * Math.sin(a) * da,
    y: star.hr * Math.cos(a) * da
  };
}

function scaledTangent(vec: { x: number; y: number }, length: number) {
  const mag = Math.hypot(vec.x, vec.y) || 1;
  return { x: (vec.x / mag) * length, y: (vec.y / mag) * length };
}

function alongPath(star: ShootingStar, t: number) {
  if (!wrapsHorizon(star)) {
    const u = 1 - t;
    return {
      x: u * u * star.x + 2 * u * t * star.cx + t * t * star.ex,
      y: u * u * star.y + 2 * u * t * star.cy + t * t * star.ey
    };
  }

  const entry = onHorizon(star, star.a0);
  const exit = onHorizon(star, star.a1);
  const join = star.hr * 1.1;
  if (t <= ARC_IN) {
    const u = smooth01(t / ARC_IN);
    return hermite(
      { x: star.x, y: star.y },
      scaledTangent({ x: entry.x - star.x, y: entry.y - star.y }, join * 1.4),
      entry,
      scaledTangent(circleTangent(star, star.a0), join),
      u
    );
  }
  if (t <= ARC_OUT) {
    const u = (t - ARC_IN) / (ARC_OUT - ARC_IN);
    return onHorizon(star, star.a0 + (star.a1 - star.a0) * u);
  }
  const u = smooth01((t - ARC_OUT) / (1 - ARC_OUT));
  return hermite(
    exit,
    scaledTangent(circleTangent(star, star.a1), join),
    { x: star.ex, y: star.ey },
    scaledTangent({ x: star.ex - exit.x, y: star.ey - exit.y }, join * 1.4),
    u
  );
}

function pathTangent(star: ShootingStar, t: number) {
  const dt = 0.004;
  const a = alongPath(star, Math.max(0, t - dt));
  const b = alongPath(star, Math.min(1, t + dt));
  return { dx: b.x - a.x, dy: b.y - a.y };
}

/**
 * Always left → right across the screen. Pass `around` so the mid-path
 * rides the event horizon instead of falling into the well and stalling.
 */
export function spawnShootingStar(
  viewW: number,
  viewH: number,
  now: number,
  around?: { x: number; y: number; r: number }
): ShootingStar {
  if (around && around.r > 8) {
    const hx = around.x * viewW;
    const hy = around.y * viewH;
    const hrMul = rand(0.78, 0.92);
    const hr = Math.max(36, around.r * hrMul);
    const above = Math.random() < 0.5;
    const a0 = above ? Math.PI + rand(0.08, 0.28) : Math.PI - rand(0.08, 0.28);
    const a1 = above ? Math.PI * 2 - rand(0.08, 0.28) : rand(0.08, 0.28);
    const entry = onHorizon({ hx, hy, hr }, a0);
    const exit = onHorizon({ hx, hy, hr }, a1);
    return {
      start: now,
      duration: rand(3200, 4400),
      x: viewW * rand(-0.08, 0.02),
      y: entry.y + viewH * rand(-0.08, 0.08),
      cx: hx,
      cy: hy,
      ex: viewW * rand(0.94, 1.12),
      ey: exit.y + viewH * rand(-0.08, 0.08),
      hx,
      hy,
      hr,
      hrMul,
      a0,
      a1
    };
  }
  return {
    start: now,
    duration: rand(1900, 2600),
    x: viewW * rand(-0.08, 0.02),
    y: viewH * rand(0.14, 0.78),
    cx: viewW * rand(0.32, 0.62),
    cy: viewH * rand(0.12, 0.55),
    ex: viewW * rand(0.94, 1.12),
    ey: viewH * rand(0.08, 0.82)
  };
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
    const t = Math.min((now - star.start) / star.duration, 1);
    if (t >= 1) {
      streaks.splice(i, 1);
      continue;
    }
    const head = alongPath(star, t);
    const tailSpan = wrapsHorizon(star) ? 0.48 : 0.64;
    const tailT = Math.max(0, t - tailSpan);
    const tail = alongPath(star, tailT);
    const fade = Math.sin(Math.PI * t) ** 0.65;
    const glow = ink.createLinearGradient(tail.x, tail.y, head.x, head.y);
    glow.addColorStop(0, 'rgba(255, 214, 176, 0)');
    glow.addColorStop(0.55, `rgba(255, 232, 210, ${0.4 * fade})`);
    glow.addColorStop(1, `rgba(255, 248, 238, ${0.95 * fade})`);
    ink.beginPath();
    ink.moveTo(tail.x, tail.y);
    const steps = wrapsHorizon(star) ? 72 : 48;
    for (let step = 1; step <= steps; step += 1) {
      const p = alongPath(star, tailT + (t - tailT) * (step / steps));
      ink.lineTo(p.x, p.y);
    }
    ink.strokeStyle = glow;
    ink.lineWidth = wrapsHorizon(star) ? 2.15 : 1.7;
    ink.lineCap = 'round';
    ink.lineJoin = 'round';
    ink.stroke();
    const tangent = pathTangent(star, t);
    ink.beginPath();
    ink.ellipse(head.x, head.y, 3.4, 1.15, Math.atan2(tangent.dy, tangent.dx), 0, Math.PI * 2);
    ink.fillStyle = `rgba(255, 248, 238, ${fade})`;
    ink.shadowBlur = 14;
    ink.shadowColor = '#fff5ee';
    ink.fill();
    ink.shadowBlur = 0;
  }
}

export function nextShootingStarDelay(immediate = false) {
  return immediate ? 1800 : rand(4500, 8000);
}

/** Keep an in-flight wrap locked to the live horizon so it cannot stall in a stale well. */
export function retargetShootingStars(
  streaks: ShootingStar[],
  around: { x: number; y: number; r: number },
  viewW: number,
  viewH: number
) {
  const hx = around.x * viewW;
  const hy = around.y * viewH;
  for (const star of streaks) {
    if (star.hr == null) continue;
    star.hx = hx;
    star.hy = hy;
    star.hr = Math.max(42, around.r * (star.hrMul ?? 1.12));
  }
}
