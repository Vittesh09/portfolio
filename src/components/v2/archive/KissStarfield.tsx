'use client';

import { useEffect, useRef } from 'react';
import {
  drawShootingStars,
  nextShootingStarDelay,
  spawnShootingStar,
  type ShootingStar
} from '@/src/components/v2/singularity/lib/shootingStars';

/** Thinner than the desktop sky so the mobile hero stays quiet. */
const STAR_COUNT = 3500;
const FIELD_RADIUS = 2000;
/** One revolution in 8 minutes, matching the desktop sky. */
const TURN = (Math.PI * 2) / (8 * 60);

const PALETTE = [
  [1, 0.91, 0.847],
  [1, 0.961, 0.933],
  [1, 1, 1]
];

const VERT = `
  attribute vec3 aPosition;
  attribute vec3 aColor;
  attribute float aSize;
  uniform mat4 uView;
  uniform mat4 uProjection;
  uniform float uPixelRatio;
  uniform float uTime;
  uniform float uYaw;
  varying vec3 vColor;
  varying float vSigma;
  varying float vSprite;
  varying float vGain;

  float hash(vec3 p, float salt) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719)) + salt) * 43758.5453);
  }

  void main() {
    float c = cos(uYaw);
    float s = sin(uYaw);
    vec3 spun = vec3(c * aPosition.x + s * aPosition.z, aPosition.y, -s * aPosition.x + c * aPosition.z);
    vec4 mvPosition = uView * vec4(spun, 1.0);
    vColor = aColor;
    float px = aSize * uPixelRatio * (300.0 / -mvPosition.z);
    float floorSigma = 0.7 * uPixelRatio;
    vSigma = max(px * 0.35, floorSigma);
    vGain = clamp(px / (1.2 * uPixelRatio), 0.5, 1.0);
    float phase = hash(aPosition, 1.0) * 6.2832;
    float speed = 0.4 + hash(aPosition, 2.0) * 0.6;
    float depth = step(0.66, hash(aPosition, 3.0)) * 0.18;
    vGain *= 1.0 - depth * (0.5 + 0.5 * sin(uTime * speed + phase));
    vSprite = ceil(vSigma * 6.0) + 2.0;
    gl_PointSize = vSprite;
    gl_Position = uProjection * mvPosition;
  }
`;

const FRAG = `
  precision mediump float;
  varying vec3 vColor;
  varying float vSigma;
  varying float vSprite;
  varying float vGain;

  void main() {
    float d = length(gl_PointCoord - 0.5) * vSprite;
    float alpha = exp(-0.5 * (d * d) / (vSigma * vSigma)) * vGain;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(vColor * 1.2, alpha);
  }
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function dot(a: number[], b: number[]) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function normalize(v: number[]) {
  const length = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / length, v[1] / length, v[2] / length];
}

function cross(a: number[], b: number[]) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

/** Column-major view matrix, camera at `eye` looking at `target`. */
function lookAt(eye: number[], target: number[], up: number[]) {
  const z = normalize([eye[0] - target[0], eye[1] - target[1], eye[2] - target[2]]);
  const x = normalize(cross(up, z));
  const y = cross(z, x);
  return new Float32Array([
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -dot(x, eye), -dot(y, eye), -dot(z, eye), 1
  ]);
}

function perspective(fovY: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovY / 2);
  const range = near - far;
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) / range, -1,
    0, 0, (2 * far * near) / range, 0
  ]);
}

function buildStars() {
  const positions = new Float32Array(STAR_COUNT * 3);
  const colors = new Float32Array(STAR_COUNT * 3);
  const sizes = new Float32Array(STAR_COUNT);
  for (let i = 0; i < STAR_COUNT; i += 1) {
    const i3 = i * 3;
    const z = Math.random() * 2 - 1;
    const theta = Math.random() * Math.PI * 2;
    const ring = Math.sqrt(1 - z * z);
    const distance = FIELD_RADIUS * (0.55 + Math.random() * 0.45);
    positions[i3] = distance * ring * Math.cos(theta);
    positions[i3 + 1] = distance * ring * Math.sin(theta);
    positions[i3 + 2] = distance * z;
    const weight = Math.pow(Math.random(), 6);
    const tint = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const gain = 0.1 + weight * 0.55;
    colors[i3] = tint[0] * gain;
    colors[i3 + 1] = tint[1] * gain;
    colors[i3 + 2] = tint[2] * gain;
    sizes[i] = 2 + weight * 7;
  }
  return { positions, colors, sizes };
}

/**
 * Mobile night sky, or a streaks-only overlay for the desktop singularity.
 */
export function KissStarfield({ streaksOnly = false }: { streaksOnly?: boolean } = {}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const fillLayer = (layer: HTMLCanvasElement) => {
      layer.style.pointerEvents = 'none';
      layer.style.touchAction = 'none';
      layer.style.position = 'absolute';
      layer.style.inset = '0';
      layer.style.width = '100%';
      layer.style.height = '100%';
      layer.setAttribute('aria-hidden', 'true');
    };

    const streak = document.createElement('canvas');
    fillLayer(streak);
    mount.appendChild(streak);

    let canvas: HTMLCanvasElement | null = null;
    let gl: WebGLRenderingContext | null = null;
    let vs: WebGLShader | null = null;
    let fs: WebGLShader | null = null;
    let program: WebGLProgram | null = null;

    if (!streaksOnly) {
      canvas = document.createElement('canvas');
      fillLayer(canvas);
      mount.appendChild(canvas);
      gl = canvas.getContext('webgl', {
        alpha: false,
        antialias: false,
        powerPreference: 'low-power'
      });
      if (gl) {
        vs = compile(gl, gl.VERTEX_SHADER, VERT);
        fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
        if (vs && fs) {
          program = gl.createProgram();
          if (program) {
            gl.attachShader(program, vs);
            gl.attachShader(program, fs);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
              gl.deleteProgram(program);
              program = null;
            }
          }
        }
      }
    }

    const skyReady = Boolean(gl && program && canvas);
    const stride = 7 * 4;
    const view = lookAt([-2.6, 4.4, 10.6], [0, 0.55, 0], [0, 1, 0]);
    let buffer: WebGLBuffer | null = null;
    let aPosition = -1;
    let aColor = -1;
    let aSize = -1;
    let uView: WebGLUniformLocation | null = null;
    let uProjection: WebGLUniformLocation | null = null;
    let uPixelRatio: WebGLUniformLocation | null = null;
    let uTime: WebGLUniformLocation | null = null;
    let uYaw: WebGLUniformLocation | null = null;

    if (skyReady && gl && program && canvas) {
      const stars = buildStars();
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      const packed = new Float32Array(STAR_COUNT * 7);
      for (let i = 0; i < STAR_COUNT; i += 1) {
        const base = i * 7;
        packed[base] = stars.positions[i * 3];
        packed[base + 1] = stars.positions[i * 3 + 1];
        packed[base + 2] = stars.positions[i * 3 + 2];
        packed[base + 3] = stars.colors[i * 3];
        packed[base + 4] = stars.colors[i * 3 + 1];
        packed[base + 5] = stars.colors[i * 3 + 2];
        packed[base + 6] = stars.sizes[i];
      }
      gl.bufferData(gl.ARRAY_BUFFER, packed, gl.STATIC_DRAW);
      aPosition = gl.getAttribLocation(program, 'aPosition');
      aColor = gl.getAttribLocation(program, 'aColor');
      aSize = gl.getAttribLocation(program, 'aSize');
      uView = gl.getUniformLocation(program, 'uView');
      uProjection = gl.getUniformLocation(program, 'uProjection');
      uPixelRatio = gl.getUniformLocation(program, 'uPixelRatio');
      uTime = gl.getUniformLocation(program, 'uTime');
      uYaw = gl.getUniformLocation(program, 'uYaw');
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let streakFrame = 0;
    let spawnTimer = 0;
    let streakCount = 0;
    let visible = true;
    let streaksLive = false;
    const started = performance.now();
    const streaks: ShootingStar[] = [];
    const ink = streak.getContext('2d', { alpha: true });
    let viewW = 0;
    let viewH = 0;

    const draw = (elapsed: number) => {
      if (!skyReady || !gl || !program || !canvas || !buffer) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 2 / 255, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(aColor);
      gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, stride, 12);
      gl.enableVertexAttribArray(aSize);
      gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, stride, 24);
      gl.uniformMatrix4fv(uView, false, view);
      gl.uniformMatrix4fv(uProjection, false, perspective((48 * Math.PI) / 180, canvas.width / Math.max(1, canvas.height), 0.1, 4000));
      gl.uniform1f(uPixelRatio, Math.min(window.devicePixelRatio || 1, 1.5));
      gl.uniform1f(uTime, reduceMotion ? 0 : elapsed);
      gl.uniform1f(uYaw, reduceMotion ? 0 : elapsed * TURN);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.drawArrays(gl.POINTS, 0, STAR_COUNT);
    };

    const spawnStreak = () => {
      if (viewW < 2 || viewH < 2) resize();
      if (viewW < 2 || viewH < 2) return;
      streaks.push(spawnShootingStar(viewW, viewH, performance.now()));
    };

    const drawStreaks = (now: number) => {
      if (!ink) return;
      drawShootingStars(ink, viewW, viewH, streaks, now);
    };

    const tickStreaks = (now: number) => {
      streakFrame = 0;
      drawStreaks(now);
      if (streaksLive && streaks.length) {
        streakFrame = window.requestAnimationFrame(tickStreaks);
      }
    };

    const wakeStreaks = () => {
      if (!streakFrame) streakFrame = window.requestAnimationFrame(tickStreaks);
    };

    const planStreak = () => {
      window.clearTimeout(spawnTimer);
      if (!streaksLive) return;
      spawnTimer = window.setTimeout(
        () => {
          spawnStreak();
          streakCount += 1;
          wakeStreaks();
          planStreak();
        },
        nextShootingStarDelay(streakCount)
      );
    };

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (width < 2 || height < 2) return;
      viewW = width;
      viewH = height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      if (canvas) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }
      streak.width = Math.round(width * dpr);
      streak.height = Math.round(height * dpr);
      ink?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const tick = () => {
      if (!visible || document.hidden) {
        frame = window.requestAnimationFrame(tick);
        return;
      }
      draw((performance.now() - started) / 1000);
      if (reduceMotion) return;
      frame = window.requestAnimationFrame(tick);
    };

    const syncStreaks = () => {
      const live = !reduceMotion && !document.hidden;
      if (live === streaksLive) return;
      streaksLive = live;
      if (live) planStreak();
      else {
        window.clearTimeout(spawnTimer);
        streakCount = 0;
        streaks.length = 0;
        ink?.clearRect(0, 0, viewW, viewH);
      }
    };

    const start = () => {
      resize();
      if (reduceMotion) {
        draw(0);
        return;
      }
      if (skyReady) frame = window.requestAnimationFrame(tick);
      syncStreaks();
    };

    resize();
    syncStreaks();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(0);
    });
    resizeObserver.observe(mount);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibility.observe(mount);

    const onVisibility = () => {
      syncStreaks();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const idle = window.requestIdleCallback?.(() => start(), { timeout: 1200 });
    const fallback = idle === undefined ? window.setTimeout(start, 300) : 0;

    return () => {
      if (idle !== undefined) window.cancelIdleCallback(idle);
      window.clearTimeout(fallback);
      window.clearTimeout(spawnTimer);
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(streakFrame);
      document.removeEventListener('visibilitychange', onVisibility);
      resizeObserver.disconnect();
      visibility.disconnect();
      if (gl) {
        if (buffer) gl.deleteBuffer(buffer);
        if (program) gl.deleteProgram(program);
        if (vs) gl.deleteShader(vs);
        if (fs) gl.deleteShader(fs);
        const lose = gl.getExtension('WEBGL_lose_context');
        lose?.loseContext();
      }
      canvas?.remove();
      streak.remove();
    };
  }, [streaksOnly]);

  return (
    <div
      ref={mountRef}
      className={
        streaksOnly
          ? 'v2-kiss-stars v2-kiss-streaks pointer-events-none absolute inset-0 overflow-hidden'
          : 'v2-kiss-stars pointer-events-none absolute inset-0 overflow-hidden md:hidden'
      }
      aria-hidden="true"
    />
  );
}
