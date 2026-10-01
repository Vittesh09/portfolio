'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const N = 72;
const VERT = `
  attribute vec2 aPos;
  varying vec2 vUv;
  void main() {
    vUv = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
  }
`;
const FRAG = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uImage;
  uniform sampler2D uField;
  uniform vec2 uTexel;
  uniform float uImageAspect;
  uniform float uCanvasAspect;
  uniform float uMode;
  uniform float uFit;
  uniform float uGray;
  uniform vec3 uInk;

  vec2 fitted(vec2 uv) {
    float ia = max(uImageAspect, 0.001);
    float ca = max(uCanvasAspect, 0.001);
    vec2 scale = vec2(1.0);
    if (uFit > 0.5) {
      if (ca > ia) scale = vec2(1.0, ca / ia);
      else scale = vec2(ia / ca, 1.0);
    } else if (ia > ca) {
      scale = vec2(1.0, ia / ca);
    } else {
      scale = vec2(ca / ia, 1.0);
    }
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    float hL = texture2D(uField, vUv - vec2(uTexel.x, 0.0)).r * 2.0 - 1.0;
    float hR = texture2D(uField, vUv + vec2(uTexel.x, 0.0)).r * 2.0 - 1.0;
    float hD = texture2D(uField, vUv - vec2(0.0, uTexel.y)).r * 2.0 - 1.0;
    float hU = texture2D(uField, vUv + vec2(0.0, uTexel.y)).r * 2.0 - 1.0;
    float h = texture2D(uField, vUv).r * 2.0 - 1.0;
    vec2 grad = vec2(hR - hL, hU - hD);
    vec2 vel = texture2D(uField, vUv).gb * 2.0 - 1.0;

    if (uMode < 0.5) {
      vec2 offset = clamp(grad * 0.08, vec2(-0.012), vec2(0.012));
      vec2 uv = fitted(vUv + offset);
      vec4 color = texture2D(uImage, uv);
      if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) {
        color = texture2D(uImage, clamp(uv, 0.0, 1.0));
      }
      float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      color.rgb = mix(color.rgb, vec3(luma), uGray);
      color.rgb = (color.rgb - 0.5) * mix(1.0, 1.08, uGray) + 0.5;
      gl_FragColor = color;
      return;
    }

    float energy = abs(h) * 1.8 + length(grad) * 3.0 + length(vel);
    float alpha = smoothstep(0.02, 0.2, energy) * 0.5;
    vec3 ink = mix(uInk, vec3(1.0, 0.91, 0.86), clamp(energy, 0.0, 1.0));
    gl_FragColor = vec4(ink, alpha);
  }
`;

type FluidMode = 'wash' | 'image';

function prefersStill() {
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.trim().replace('#', '');
  if (value.length < 6) return [0.95, 0.22, 0.16];
  return [
    parseInt(value.slice(0, 2), 16) / 255,
    parseInt(value.slice(2, 4), 16) / 255,
    parseInt(value.slice(4, 6), 16) / 255
  ];
}

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

/**
 * Pointer-driven liquid. Wash sits behind type. Image mode ripples the picture itself.
 * Fine pointers only, so phones keep the plain layout.
 */
export function FluidSurface({
  mode,
  src,
  fit = 'cover',
  grayscale = false
}: {
  mode: FluidMode;
  src?: string;
  fit?: 'cover' | 'contain';
  grayscale?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadRef = useRef<(url?: string) => void>(() => {});
  const drawRef = useRef<() => void>(() => {});
  const srcRef = useRef(src);
  const fitRef = useRef(fit);
  const grayRef = useRef(grayscale);
  srcRef.current = src;
  fitRef.current = fit;
  grayRef.current = grayscale;

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host || prefersStill()) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: 'low-power'
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');

    const field = gl.createTexture();
    const imageTex = gl.createTexture();
    const pixels = new Uint8Array(N * N * 4);
    const height = new Float32Array(N * N);
    const vel = new Float32Array(N * N);
    const nextH = new Float32Array(N * N);
    const nextV = new Float32Array(N * N);
    let imageAspect = 1;
    let imageReady = mode === 'wash';
    let energy = 0;
    let running = false;
    let frame = 0;
    let visible = true;

    const uploadField = () => {
      for (let i = 0; i < N * N; i += 1) {
        const o = i * 4;
        pixels[o] = Math.max(0, Math.min(255, (height[i] * 0.5 + 0.5) * 255));
        pixels[o + 1] = 128;
        pixels[o + 2] = 128;
        pixels[o + 3] = 255;
      }
      gl.bindTexture(gl.TEXTURE_2D, field);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, N, N, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    };

    const bindTexParams = () => {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

    gl.bindTexture(gl.TEXTURE_2D, field);
    bindTexParams();
    uploadField();
    gl.bindTexture(gl.TEXTURE_2D, imageTex);
    bindTexParams();
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 0])
    );

    const loadImage = (url: string | undefined) => {
      if (mode !== 'image' || !url) return;
      imageReady = false;
      host.classList.remove('is-fluid');
      const img = document.createElement('img');
      img.decoding = 'async';
      img.onload = () => {
        if (srcRef.current !== url) return;
        try {
          const max = 2048;
          const scale = Math.min(1, max / img.naturalWidth, max / img.naturalHeight);
          const raster = document.createElement('canvas');
          raster.width = Math.max(1, Math.round(img.naturalWidth * scale));
          raster.height = Math.max(1, Math.round(img.naturalHeight * scale));
          const ctx = raster.getContext('2d');
          if (!ctx) return;
          ctx.drawImage(img, 0, 0, raster.width, raster.height);
          imageAspect = raster.width / raster.height;
          gl.bindTexture(gl.TEXTURE_2D, imageTex);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, raster);
          bindTexParams();
        } catch {
          imageReady = false;
          return;
        }
        imageReady = true;
        host.classList.add('is-fluid');
        kick();
      };
      img.src = url;
    };
    loadRef.current = loadImage;
    loadImage(srcRef.current);

    const splat = (u: number, v: number, power: number) => {
      const cx = u * (N - 1);
      const cy = v * (N - 1);
      const radius = 8;
      for (let y = -radius; y <= radius; y += 1) {
        for (let x = -radius; x <= radius; x += 1) {
          const ix = Math.round(cx + x);
          const iy = Math.round(cy + y);
          if (ix < 1 || iy < 1 || ix >= N - 1 || iy >= N - 1) continue;
          const falloff = Math.exp(-(x * x + y * y) / 18);
          const i = iy * N + ix;
          height[i] = Math.max(-0.4, Math.min(0.4, height[i] + power * falloff * 0.45));
          vel[i] = Math.max(-0.4, Math.min(0.4, vel[i] + power * falloff * 0.3));
        }
      }
      energy = 1;
      kick();
    };

    const step = () => {
      energy = 0;
      for (let y = 1; y < N - 1; y += 1) {
        for (let x = 1; x < N - 1; x += 1) {
          const i = y * N + x;
          const lap =
            height[i - 1] + height[i + 1] + height[i - N] + height[i + N] - height[i] * 4;
          nextV[i] = Math.max(-0.4, Math.min(0.4, (vel[i] + lap * 0.1) * 0.94));
          nextH[i] = Math.max(-0.4, Math.min(0.4, (height[i] + nextV[i]) * 0.96));
          energy += Math.abs(nextH[i]) + Math.abs(nextV[i]);
        }
      }
      height.set(nextH);
      vel.set(nextV);
      uploadField();
    };

    const draw = () => {
      const width = host.clientWidth;
      const heightPx = host.clientHeight;
      if (width < 2 || heightPx < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(width * dpr);
      const h = Math.round(heightPx * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (mode === 'image' && !imageReady) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        return;
      }
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, imageTex);
      gl.uniform1i(gl.getUniformLocation(program, 'uImage'), 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, field);
      gl.uniform1i(gl.getUniformLocation(program, 'uField'), 1);
      gl.uniform2f(gl.getUniformLocation(program, 'uTexel'), 2 / N, 2 / N);
      gl.uniform1f(gl.getUniformLocation(program, 'uImageAspect'), imageAspect);
      gl.uniform1f(gl.getUniformLocation(program, 'uCanvasAspect'), width / heightPx);
      gl.uniform1f(gl.getUniformLocation(program, 'uMode'), mode === 'wash' ? 1 : 0);
      gl.uniform1f(gl.getUniformLocation(program, 'uFit'), fitRef.current === 'cover' ? 1 : 0);
      gl.uniform1f(gl.getUniformLocation(program, 'uGray'), grayRef.current ? 1 : 0);
      const ink = hexToRgb(
        getComputedStyle(document.querySelector('.v2-root') ?? document.body).getPropertyValue(
          '--v2-accent-pop'
        )
      );
      gl.uniform3f(gl.getUniformLocation(program, 'uInk'), ink[0], ink[1], ink[2]);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      if (mode === 'wash') gl.clearColor(0, 0, 0, 0);
      else gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (mode === 'wash' || imageReady) gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    drawRef.current = draw;

    const loop = () => {
      frame = window.requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      step();
      draw();
      if (energy < 0.02) {
        window.cancelAnimationFrame(frame);
        running = false;
      }
    };

    const kick = () => {
      if (running) return;
      running = true;
      frame = window.requestAnimationFrame(loop);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = host.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const u = (event.clientX - rect.left) / rect.width;
      const v = (event.clientY - rect.top) / rect.height;
      const speed = Math.hypot(event.movementX, event.movementY);
      splat(u, 1 - v, Math.min(0.22, 0.07 + speed * 0.005));
    };

    host.addEventListener('pointermove', onMove);
    if (mode === 'wash') host.classList.add('is-fluid');
    const look = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    look.observe(host);
    const resize = new ResizeObserver(() => {
      if (imageReady || mode === 'wash') draw();
    });
    resize.observe(host);

    return () => {
      loadRef.current = () => {};
      drawRef.current = () => {};
      window.cancelAnimationFrame(frame);
      host.removeEventListener('pointermove', onMove);
      host.classList.remove('is-fluid');
      look.disconnect();
      resize.disconnect();
      gl.deleteTexture(field);
      gl.deleteTexture(imageTex);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, [mode]);

  useEffect(() => {
    loadRef.current(src);
  }, [src]);

  useEffect(() => {
    drawRef.current();
  }, [fit, grayscale]);

  return <canvas ref={canvasRef} className={`v2-fluid-canvas v2-fluid-canvas--${mode}`} aria-hidden="true" />;
}

export function FooterLandscape() {
  const [src, setSrc] = useState('/assets/images/footer-landscape-light.jpg');

  useEffect(() => {
    const root = document.querySelector('.v2-root');
    const sync = () => {
      const dark = root?.classList.contains('dark') ?? false;
      setSrc(dark ? '/assets/images/footer-landscape.jpg' : '/assets/images/footer-landscape-light.jpg');
    };
    sync();
    if (!root) return;
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="v2-footer-landscape" aria-hidden="true">
      <Image
        src="/assets/images/footer-landscape-light.jpg"
        alt=""
        fill
        sizes="100vw"
        className="v2-footer-landscape-img v2-footer-landscape-img--light"
      />
      <Image
        src="/assets/images/footer-landscape.jpg"
        alt=""
        fill
        sizes="100vw"
        className="v2-footer-landscape-img v2-footer-landscape-img--dark"
      />
      <FluidSurface mode="image" src={src} fit="cover" />
    </div>
  );
}
