'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { COLORS } from '@/src/components/v2/singularity/lib/constants';
import { starFragmentShader, starVertexShader } from '@/src/components/v2/singularity/lib/shaders';

/** Thinner than the desktop sky so the mobile hero stays quiet. */
const STAR_COUNT = 10000;
const FIELD_RADIUS = 2000;
/** One revolution in eight minutes, matching the desktop sky. */
const TURN = (Math.PI * 2) / (8 * 60);

/**
 * Desktop singularity star field only: same shaders, palette, and slow turn.
 * The black hole stays on the desktop landing.
 */
export function KissStarfield() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: false,
      powerPreference: 'low-power'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setClearColor(0x000002, 1);
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.touchAction = 'none';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000002);
    scene.fog = new THREE.FogExp2(0x020104, 0.025);

    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 4000);
    camera.position.set(-2.6, 4.4, 10.6);
    camera.lookAt(0, 0.55, 0);

    const positions = new Float32Array(STAR_COUNT * 3);
    const colors = new Float32Array(STAR_COUNT * 3);
    const sizes = new Float32Array(STAR_COUNT);
    const twinkle = new Float32Array(STAR_COUNT);
    const palette = [
      new THREE.Color(COLORS.starWarm),
      new THREE.Color(COLORS.starCool),
      new THREE.Color(COLORS.starEmber),
      new THREE.Color(0xffffff)
    ];
    const nightColors = new Float32Array(STAR_COUNT * 3);
    const nightSizes = new Float32Array(STAR_COUNT);

    for (let index = 0; index < STAR_COUNT; index += 1) {
      const i3 = index * 3;
      const phi = Math.acos(-1 + (2 * index) / STAR_COUNT);
      const theta = Math.sqrt(STAR_COUNT * Math.PI) * phi;
      const radius = Math.cbrt(Math.random()) * FIELD_RADIUS + 100;
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      const color = palette[Math.floor(Math.random() * palette.length)].clone();
      color.multiplyScalar(0.3 + Math.random() * 0.7);
      nightColors[i3] = colors[i3] = color.r;
      nightColors[i3 + 1] = colors[i3 + 1] = color.g;
      nightColors[i3 + 2] = colors[i3 + 2] = color.b;
      nightSizes[index] = sizes[index] = THREE.MathUtils.randFloat(0.6, 3.0);
      twinkle[index] = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('twinkle', new THREE.BufferAttribute(twinkle, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uSizeScale: { value: 1 },
        uAlphaFloor: { value: 0.25 }
      },
      vertexShader: starVertexShader
        .replace('uniform float uPixelRatio;', 'uniform float uPixelRatio;\n  uniform float uSizeScale;')
        .replace(
          'gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);',
          'gl_PointSize = size * uSizeScale * uPixelRatio * (300.0 / -mvPosition.z);'
        ),
      fragmentShader: starFragmentShader
        .replace('varying float vTwinkle;', 'varying float vTwinkle;\n  uniform float uAlphaFloor;')
        .replace(
          'alpha *= (0.25 + vTwinkle * 0.75);',
          'alpha *= (uAlphaFloor + vTwinkle * (1.0 - uAlphaFloor));'
        ),
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const stars = new THREE.Points(geometry, material);
    scene.add(stars);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.8, 0.7, 0.8);
    composer.addPass(bloom);

    const colorAttribute = geometry.getAttribute('color') as THREE.BufferAttribute;
    const sizeAttribute = geometry.getAttribute('size') as THREE.BufferAttribute;
    const paintSky = (isDark: boolean) => {
      const target = colorAttribute.array as Float32Array;
      const pointSizes = sizeAttribute.array as Float32Array;
      if (isDark) {
        target.set(nightColors);
        pointSizes.set(nightSizes);
        renderer.setClearColor(0x000002, 1);
        scene.background = new THREE.Color(0x000002);
        scene.fog = new THREE.FogExp2(0x020104, 0.025);
        material.blending = THREE.AdditiveBlending;
        material.uniforms.uSizeScale.value = 1;
        material.uniforms.uAlphaFloor.value = 0.25;
        bloom.strength = 0.8;
      } else {
        target.fill(0);
        pointSizes.set(nightSizes);
        renderer.setClearColor(0xeef1f5, 1);
        scene.background = new THREE.Color(0xeef1f5);
        scene.fog = null;
        material.blending = THREE.NormalBlending;
        material.uniforms.uSizeScale.value = 3.2;
        material.uniforms.uAlphaFloor.value = 0.85;
        bloom.strength = 0;
      }
      colorAttribute.needsUpdate = true;
      sizeAttribute.needsUpdate = true;
      material.needsUpdate = true;
    };

    const root = document.querySelector('.v2-root');
    paintSky(root?.classList.contains('dark') ?? false);
    const themeObserver = new MutationObserver(() => {
      paintSky(root?.classList.contains('dark') ?? false);
    });
    if (root) themeObserver.observe(root, { attributes: true, attributeFilter: ['class'] });

    const clock = new THREE.Clock();
    let frame = 0;
    let visible = true;

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (width < 2 || height < 2) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      composer.setSize(width, height);
      composer.setPixelRatio(renderer.getPixelRatio());
    };

    const tick = () => {
      frame = window.requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      const elapsed = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsed;
      if (!reduceMotion) stars.rotation.y = elapsed * TURN;
      composer.render();
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibility.observe(mount);
    tick();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      themeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="v2-kiss-stars pointer-events-none absolute inset-0 overflow-hidden md:hidden"
      aria-hidden="true"
    />
  );
}
