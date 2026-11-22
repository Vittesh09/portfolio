'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BlackHoleLazy } from '@/src/components/v2/singularity/BlackHoleLazy';
import { useSingularityColorClick } from '@/src/components/v2/singularity/hooks/useSingularityColorClick';
import { SINGULARITY_COLOR_SETS } from '@/src/components/v2/singularity/lib/palettes';
import {
  DEFAULT_SINGULARITY_PARAMS,
  type SingularityParams
} from '@/src/components/v2/singularity/lib/params';

/**
 * Plane window: straight sides, large squircle corners.
 * Inset leaves room for the blur to finish inside the stage, the same way
 * the live veil does.
 */
function squirclePath(width: number, height: number, inset: number) {
  const w = Math.max(32, width - inset * 2);
  const h = Math.max(32, height - inset * 2);
  const r = Math.min(w, h) * 0.34;
  const c = r * 0.82;
  const right = inset + w;
  const bottom = inset + h;
  return [
    `M${inset + r} ${inset}`,
    `H${right - r}`,
    `C${right - r + c} ${inset} ${right} ${inset + r - c} ${right} ${inset + r}`,
    `V${bottom - r}`,
    `C${right} ${bottom - r + c} ${right - r + c} ${bottom} ${right - r} ${bottom}`,
    `H${inset + r}`,
    `C${inset + r - c} ${bottom} ${inset} ${bottom - r + c} ${inset} ${bottom - r}`,
    `V${inset + r}`,
    `C${inset} ${inset + r - c} ${inset + r - c} ${inset} ${inset + r} ${inset}`,
    'Z'
  ].join('');
}

/**
 * Same picture as the window, blurred, so the canvas box fades instead of cutting.
 */
/** The copy is blurred 28px anyway, so a quarter-resolution, ~30 fps copy looks the same. */
const BLUR_COPY_SCALE = 0.25;
const BLUR_COPY_INTERVAL_MS = 33;

function DeskContentBlur() {
  useEffect(() => {
    const canvas = document.querySelector<HTMLCanvasElement>('.desk-stage-content-blur');
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let raf = 0;
    let alive = true;
    let visible = true;
    let lastDraw = 0;
    let pending = false;
    const tick = (now: number) => {
      raf = 0;
      if (!alive || !visible) return;
      raf = requestAnimationFrame(tick);
      if (now - lastDraw < BLUR_COPY_INTERVAL_MS) return;
      lastDraw = now;
      const hero = canvas.parentElement;
      const src = hero?.querySelector<HTMLCanvasElement>('.bh-canvas');
      if (!src || !hero || src.width < 2) return;
      const width = hero.clientWidth;
      const height = hero.clientHeight;
      if (width < 2 || height < 2) return;
      const bw = Math.max(1, Math.round(width * BLUR_COPY_SCALE));
      const bh = Math.max(1, Math.round(height * BLUR_COPY_SCALE));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      // Snapshot asynchronously (scaled on the GPU side): a direct drawImage of a
      // WebGL canvas makes the main thread wait for the GPU, which shows up as the
      // cursor briefly sticking on weaker graphics.
      if (pending) return;
      pending = true;
      createImageBitmap(src, { resizeWidth: bw, resizeHeight: bh, resizeQuality: 'low' })
        .then((bitmap) => {
          if (alive) ctx.drawImage(bitmap, 0, 0);
          bitmap.close();
        })
        .catch(() => {})
        .finally(() => {
          pending = false;
        });
    };
    // Only copy while the stage is on screen (the WebGL loop pauses there too).
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(canvas);
    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas className="desk-stage-content-blur" aria-hidden="true" />;
}

/**
 * Paper veil with a squircle hole. The edge is blurred and grain-dissolved,
 * the same filter as the live desk, so the picture fades like a plane window.
 * No viewBox: filter values stay in CSS px, so the edge never stretches.
 */
/**
 * Feather strength per stage size. The edge spreads about 2.5σ of blur plus half of
 * each displacement, and the hole must stay at least that far from the stage box:
 * anything closer is clipped by the stage's overflow and reads as a hard line.
 */
function featherFor(width: number) {
  return width < 769
    ? { blur: 10, wobble: 10, grain: 14 }
    : { blur: 14, wobble: 14, grain: 18 };
}

function featherReach({ blur, wobble, grain }: ReturnType<typeof featherFor>) {
  return Math.ceil(blur * 2.5 + (wobble + grain) / 2) + 2;
}

function DeskStageFeather() {
  const id = 'desk-feather';
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);
  const wobbleRef = useRef<SVGFEDisplacementMapElement>(null);
  const grainRef = useRef<SVGFEDisplacementMapElement>(null);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;
    const draw = () => {
      const stage = svg.parentElement;
      if (!stage) return;
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (width < 2 || height < 2) return;
      const feather = featherFor(window.innerWidth);
      blurRef.current?.setAttribute('stdDeviation', String(feather.blur));
      wobbleRef.current?.setAttribute('scale', String(feather.wobble));
      grainRef.current?.setAttribute('scale', String(feather.grain));
      const wanted =
        Number.parseFloat(getComputedStyle(stage).getPropertyValue('--desk-window-inset')) || 40;
      const inset = Math.max(wanted, featherReach(feather));
      path.setAttribute('d', squirclePath(width, height, inset));
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(svg.parentElement ?? svg);
    return () => observer.disconnect();
  }, []);

  return (
    <svg ref={svgRef} className="desk-stage-feather" aria-hidden="true" focusable="false">
      <defs>
        <filter
          id={`${id}-f`}
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur ref={blurRef} in="SourceGraphic" stdDeviation="14" result="soft" />
          <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="2" seed="7" result="wobble" />
          <feDisplacementMap ref={wobbleRef} in="soft" in2="wobble" scale="14" xChannelSelector="R" yChannelSelector="G" result="wavy" />
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" result="grain" />
          <feDisplacementMap ref={grainRef} in="wavy" in2="grain" scale="18" xChannelSelector="R" yChannelSelector="B" />
        </filter>
        <path id={`${id}-shape`} ref={pathRef} />
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#fff" />
          <use href={`#${id}-shape`} fill="#000" filter={`url(#${id}-f)`} />
        </mask>
      </defs>
      <rect className="desk-stage-feather-veil" width="100%" height="100%" mask={`url(#${id}-m)`} />
    </svg>
  );
}

/**
 * Occasional shooting star on a 2D overlay. It travels a straight line in
 * "source" space and is drawn through a point-mass lens around the hole, so near
 * the shadow it wraps along the Einstein ring instead of crossing it.
 */
function DeskShootingStar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /** On-screen px/s away from the hole; eases down to SLOWEST× near the ring. */
    const SPEED = 480;
    const SLOWEST = 0.28;
    const smoothstep = (edge0: number, edge1: number, x: number) => {
      const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
      return t * t * (3 - 2 * t);
    };
    const TAIL = 0.14;
    const SEGMENTS = 48;
    let raf = 0;
    let timer = 0;

    /** Hole centre and Einstein radius in canvas px, read from the live grab handle. */
    const readHole = () => {
      const grab = document.querySelector<HTMLElement>('.bh-grab');
      const box = canvas.getBoundingClientRect();
      if (!grab || grab.style.display === 'none') {
        return { x: width / 2, y: height / 2, r: Math.min(width, height) * 0.23 };
      }
      const g = grab.getBoundingClientRect();
      return {
        x: g.left + g.width / 2 - box.left,
        y: g.top + g.height / 2 - box.top,
        r: (g.width / 2) * 0.95
      };
    };

    const run = () => {
      if (document.hidden || width < 1) {
        schedule();
        return;
      }
      const hole = readHole();
      const dirSign = Math.random() < 0.5 ? 1 : -1;
      const angle = ((Math.random() * 2 - 1) * 22 * Math.PI) / 180;
      const dir = { x: Math.cos(angle) * dirSign, y: Math.sin(angle) };
      const normal = { x: -dir.y, y: dir.x };
      const impact = hole.r * (0.3 + Math.random() * 1.1) * (Math.random() < 0.5 ? 1 : -1);
      const reach = width * 0.62;
      const from = {
        x: hole.x - dir.x * reach + normal.x * impact,
        y: hole.y - dir.y * reach + normal.y * impact
      };

      let life = 0;
      let last = performance.now();
      const frame = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const lens = readHole();
        const at = (t: number) => {
          const sx = from.x + dir.x * reach * 2 * t;
          const sy = from.y + dir.y * reach * 2 * t;
          const dx = sx - lens.x;
          const dy = sy - lens.y;
          const beta = Math.max(1e-3, Math.hypot(dx, dy));
          const theta = (beta + Math.sqrt(beta * beta + 4 * lens.r * lens.r)) / 2;
          const u = beta / lens.r;
          const gain = Math.min(1.8, ((u * u + 2) / (u * Math.sqrt(u * u + 4)) + 1) / 2);
          return { x: lens.x + (dx / beta) * theta, y: lens.y + (dy / beta) * theta, gain };
        };

        // Step by on-screen distance, not source distance: the lens stretches the
        // path near the ring, which would otherwise read as a sudden burst of speed.
        const here = at(life);
        const ahead = at(Math.min(1, life + 1e-3));
        const stretch = Math.max(1, Math.hypot(ahead.x - here.x, ahead.y - here.y) / 1e-3);
        const near = Math.hypot(here.x - lens.x, here.y - lens.y) / lens.r;
        const ease = smoothstep(1.1, 3.2, near);
        life = Math.min(1, life + (SPEED * (SLOWEST + (1 - SLOWEST) * ease) * dt) / stretch);
        const fade = Math.sin(Math.PI * life);

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);
        ctx.lineCap = 'round';
        const tailStart = Math.max(0, life - TAIL);
        let prev = at(tailStart);
        for (let i = 1; i <= SEGMENTS; i += 1) {
          const k = i / SEGMENTS;
          const pt = at(tailStart + (life - tailStart) * k);
          ctx.strokeStyle = `rgba(214, 228, 255, ${Math.min(0.9, 0.5 * k * k * fade * pt.gain)})`;
          ctx.lineWidth = (0.4 + 0.9 * k) * Math.sqrt(pt.gain);
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(pt.x, pt.y);
          ctx.stroke();
          prev = pt;
        }
        ctx.fillStyle = `rgba(240, 246, 255, ${Math.min(1, 0.8 * fade * prev.gain)})`;
        ctx.beginPath();
        ctx.arc(prev.x, prev.y, 1.1, 0, Math.PI * 2);
        ctx.fill();

        if (life < 1) {
          raf = requestAnimationFrame(frame);
        } else {
          ctx.clearRect(0, 0, width, height);
          schedule();
        }
      };
      raf = requestAnimationFrame(frame);
    };

    const schedule = (delay = 6000 + Math.random() * 7000) => {
      timer = window.setTimeout(run, delay);
    };
    schedule(3500);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="desk-stage-comet" aria-hidden="true" />;
}

/** Inset singularity stage for the desk lab — feathered print edge, black plate, stars. */
export function DeskSingularityStage() {
  const heroRef = useRef<HTMLElement>(null);
  const paramsRef = useRef<SingularityParams>({
    ...DEFAULT_SINGULARITY_PARAMS,
    ...SINGULARITY_COLOR_SETS[0],
    // Match reference still: thin nearly-edge-on disk, slight L→R droop (~8°).
    diskTiltDeg: -100,
    diskBankDeg: -8,
    diskDensity: 2.2,
    lensingRadius: 0.3,
    bloomStrength: 0.9,
    bloomRadius: 0.8,
    bloomThreshold: 0.7,
    diskSpin: 0,
    timeScale: 0.28,
    flowSpeed: 0.035
  });
  const [clientReady, setClientReady] = useState(false);
  const [useWebGl, setUseWebGl] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // Fade the stage in once the first frame is drawn (the mount gets `is-ready`), so
  // the canvas never pops in mid-zoom. Falls back to showing it after 2.5s.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const show = () => stage.setAttribute('data-shown', 'true');
    if (!useWebGl) {
      if (clientReady) show();
      return;
    }
    const isReady = () => Boolean(stage.querySelector('.bh-mount.is-ready'));
    if (isReady()) {
      show();
      return;
    }
    const observer = new MutationObserver(() => {
      if (!isReady()) return;
      observer.disconnect();
      window.clearTimeout(fallback);
      requestAnimationFrame(show);
    });
    observer.observe(stage, { subtree: true, attributes: true, attributeFilter: ['class'], childList: true });
    const fallback = window.setTimeout(() => {
      observer.disconnect();
      show();
    }, 2500);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [clientReady, useWebGl]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = !reduce;
    if (window.innerWidth <= 640) paramsRef.current.lensingRadius = 0.25;
    // Fetch the WebGL code and build the scene only once the page has loaded and the
    // main thread is idle, so neither competes with the first paint or hydration.
    // The stage is hidden until its first frame, so nothing pops.
    let idle = 0;
    let timer = 0;
    const boot = () => {
      if (fine) void import('@/src/components/v2/singularity/BlackHole');
      setClientReady(true);
      setUseWebGl(fine);
    };
    const whenIdle = () => {
      if ('requestIdleCallback' in window) {
        idle = window.requestIdleCallback(boot, { timeout: 1200 });
      } else {
        timer = globalThis.setTimeout(boot, 200) as unknown as number;
      }
    };
    if (document.readyState === 'complete') whenIdle();
    else window.addEventListener('load', whenIdle, { once: true });
    return () => {
      window.removeEventListener('load', whenIdle);
      if (idle) window.cancelIdleCallback(idle);
      window.clearTimeout(timer);
    };
  }, []);

  const onHeroClick = useSingularityColorClick(heroRef, paramsRef, 0, useWebGl);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    hero.classList.add('is-copy-in');
    if (!useWebGl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hero.classList.add('is-intro-done');
    }
  }, [useWebGl]);

  return (
    <div className="desk-stage-wrap desk-frame">
      <div ref={stageRef} className="desk-stage">
        {!useWebGl ? <div className="desk-stage-fallback" aria-hidden="true" /> : null}
        <section
          ref={heroRef}
          className="bh-hero is-intro is-copy-in"
          aria-label="Interactive singularity. Drag to move, click to change color."
          onClick={onHeroClick}
        >
          {useWebGl ? <DeskContentBlur /> : null}
          {clientReady && useWebGl ? (
            <BlackHoleLazy
              heroRef={heroRef}
              paramsRef={paramsRef}
              mode="lab"
              playIntro
            />
          ) : null}
        </section>
        {useWebGl ? <DeskShootingStar /> : null}
        <DeskStageFeather />
      </div>
    </div>
  );
}
