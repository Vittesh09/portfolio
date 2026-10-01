'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

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
  uniform vec2 uHole;
  uniform float uStrength;
  uniform float uRadius;
  uniform float uPull;
  uniform float uAspect;
  uniform float uImageAspect;
  uniform float uCanvasAspect;
  uniform float uFit;
  uniform float uMode;
  uniform float uAberration;
  uniform vec3 uInk;

  vec2 fitted(vec2 uv) {
    float ia = max(uImageAspect, 0.001);
    float ca = max(uCanvasAspect, 0.001);
    vec2 scale = vec2(1.0);
    if (uFit > 0.5) {
      if (ca > ia) scale = vec2(1.0, ia / ca);
      else scale = vec2(ca / ia, 1.0);
    } else if (ia > ca) {
      scale = vec2(1.0, ia / ca);
    } else {
      scale = vec2(ca / ia, 1.0);
    }
    return (uv - 0.5) * scale + 0.5;
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  vec2 lensOffset(vec2 screenPos) {
    vec2 toCenter = screenPos - uHole;
    toCenter.x *= uAspect;
    float dist = length(toCenter);
    float amount = uStrength * uPull / (dist * dist + 0.004);
    amount = clamp(amount, 0.0, uMode < 0.5 ? 0.1 : 0.36);
    float falloff = smoothstep(uRadius, uRadius * 0.28, dist);
    vec2 offset = normalize(toCenter + 1e-5) * amount * falloff;
    offset.x /= uAspect;
    return offset;
  }

  void main() {
    vec2 offset = lensOffset(vUv);
    vec2 toCenter = vUv - uHole;
    toCenter.x *= uAspect;
    float dist = length(toCenter);

    if (uMode < 0.5) {
      vec2 base = vUv - offset;
      vec2 uv = fitted(base);
      vec2 uvR = fitted(base - offset * uAberration);
      vec2 uvB = fitted(base + offset * uAberration);
      if (uFit < 0.5 && (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0)) {
        gl_FragColor = vec4(0.0);
        return;
      }
      uv = clamp(uv, 0.0, 1.0);
      uvR = clamp(uvR, 0.0, 1.0);
      uvB = clamp(uvB, 0.0, 1.0);
      float r = texture2D(uImage, uvR).r;
      float g = texture2D(uImage, uv).g;
      float b = texture2D(uImage, uvB).b;
      float a = texture2D(uImage, uv).a;
      gl_FragColor = vec4(r, g, b, a);
      return;
    }

    vec2 warped = vUv - offset;
    float gy = abs(fract(warped.y * 5.0) - 0.5);
    float gx = abs(fract(warped.x * 12.0) - 0.5);
    float lines = smoothstep(0.045, 0.0, gy) * 0.9 + smoothstep(0.03, 0.0, gx) * 0.5;
    vec2 cell = floor(warped * vec2(42.0, 16.0));
    vec2 f = fract(warped * vec2(42.0, 16.0));
    float n = hash(cell);
    vec2 starAt = vec2(hash(cell + 1.7), hash(cell + 4.2));
    float star = smoothstep(0.045, 0.0, length(f - starAt)) * step(0.9, n);
    float ring = smoothstep(0.012, 0.0, abs(dist - 0.07));
    float disk = smoothstep(0.055, 0.02, dist);
    vec3 color = vec3(0.93, 0.9, 0.86) * star + uInk * (lines * 0.55 + ring);
    float alpha = (star * 0.85 + lines * 0.72 + ring + disk * 0.82) * uStrength;
    gl_FragColor = vec4(color, alpha);
  }
`;

type LensMode = 'wash' | 'image';

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
 * Hover gravity lens. Same bend as the homepage singularity: light is pulled toward the pointer.
 * The fluid surface stays in FluidSurface and is not mounted here.
 */
export function GravityLens({
  mode,
  src,
  fit = 'cover'
}: {
  mode: LensMode;
  src?: string;
  fit?: 'cover' | 'contain';
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadRef = useRef<(url?: string) => void>(() => {});
  const srcRef = useRef(src);
  const fitRef = useRef(fit);
  srcRef.current = src;
  fitRef.current = fit;

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

    const imageTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, imageTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
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

    let imageAspect = 1;
    let imageReady = mode === 'wash';
    let strength = 0;
    let target = 0;
    const hole = { x: 0.5, y: 0.5 };
    const holeTarget = { x: 0.5, y: 0.5 };
    let running = false;
    let frame = 0;
    let last = 0;

    const loadImage = (url: string | undefined) => {
      if (mode !== 'image' || !url) return;
      imageReady = false;
      host.classList.remove('is-lens');
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
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        } catch {
          imageReady = false;
          return;
        }
        imageReady = true;
        if (strength > 0.02) host.classList.add('is-lens');
      };
      img.src = url;
    };
    loadRef.current = loadImage;
    loadImage(srcRef.current);

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
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (mode === 'image' && !imageReady) return;
      if (strength < 0.004) return;
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, imageTex);
      gl.uniform1i(gl.getUniformLocation(program, 'uImage'), 0);
      gl.uniform2f(gl.getUniformLocation(program, 'uHole'), hole.x, hole.y);
      gl.uniform1f(gl.getUniformLocation(program, 'uStrength'), strength);
      gl.uniform1f(gl.getUniformLocation(program, 'uRadius'), mode === 'image' ? 0.46 : 0.62);
      gl.uniform1f(gl.getUniformLocation(program, 'uPull'), mode === 'image' ? 0.08 : 0.14);
      gl.uniform1f(gl.getUniformLocation(program, 'uAspect'), width / heightPx);
      gl.uniform1f(gl.getUniformLocation(program, 'uImageAspect'), imageAspect);
      gl.uniform1f(gl.getUniformLocation(program, 'uCanvasAspect'), width / heightPx);
      gl.uniform1f(gl.getUniformLocation(program, 'uFit'), fitRef.current === 'cover' ? 1 : 0);
      gl.uniform1f(gl.getUniformLocation(program, 'uMode'), mode === 'wash' ? 1 : 0);
      gl.uniform1f(gl.getUniformLocation(program, 'uAberration'), mode === 'image' ? 0.18 : 0.12);
      const ink = hexToRgb(
        getComputedStyle(document.querySelector('.v2-root') ?? document.body).getPropertyValue(
          '--v2-accent-pop'
        )
      );
      gl.uniform3f(gl.getUniformLocation(program, 'uInk'), ink[0], ink[1], ink[2]);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const loop = (now: number) => {
      frame = window.requestAnimationFrame(loop);
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      if (document.hidden) return;
      const ease = 1 - Math.exp(-dt * 7);
      strength += (target - strength) * ease;
      hole.x += (holeTarget.x - hole.x) * ease;
      hole.y += (holeTarget.y - hole.y) * ease;
      if (mode === 'image') {
        if (strength > 0.04 && imageReady) host.classList.add('is-lens');
        else host.classList.remove('is-lens');
      }
      draw();
      if (target === 0 && strength < 0.004) {
        strength = 0;
        host.classList.remove('is-lens');
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        window.cancelAnimationFrame(frame);
        running = false;
        last = 0;
      }
    };

    const kick = () => {
      if (running) return;
      running = true;
      last = 0;
      frame = window.requestAnimationFrame(loop);
    };

    const place = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      holeTarget.x = (event.clientX - rect.left) / rect.width;
      holeTarget.y = 1 - (event.clientY - rect.top) / rect.height;
    };

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      place(event);
      target = 1;
      kick();
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || target === 0) return;
      place(event);
      kick();
    };

    const onLeave = () => {
      target = 0;
      kick();
    };

    host.addEventListener('pointerenter', onEnter);
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);

    return () => {
      loadRef.current = () => {};
      window.cancelAnimationFrame(frame);
      host.removeEventListener('pointerenter', onEnter);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      host.classList.remove('is-lens');
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

  return <canvas ref={canvasRef} className="v2-fluid-canvas v2-lens-canvas" aria-hidden="true" />;
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
      <GravityLens mode="image" src={src} fit="cover" />
    </div>
  );
}
