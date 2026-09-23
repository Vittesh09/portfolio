'use client';

import { useEffect, type RefObject } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { captureWarpSource, measureWarpBox } from '../lib/captureWarp';
import { OverlayScenePass } from '../lib/OverlayScenePass';
import {
  BLACK_HOLE_RADIUS,
  COLORS,
  DISK_BANK,
  DISK_INNER,
  DISK_OUTER,
  DISK_TILT,
  DISK_YAW
} from '../lib/constants';
import {
  DEFAULT_SINGULARITY_PARAMS,
  type BlackHoleOptions
} from '../lib/params';
import {
  diskFragmentShader,
  diskVertexShader,
  horizonFragmentShader,
  horizonVertexShader,
  lensingFragmentShader,
  starFragmentShader,
  starVertexShader,
  textPlaneFragmentShader,
  textPlaneVertexShader
} from '../lib/shaders';

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isMobileViewport() {
  return (
    window.matchMedia('(max-width: 768px)').matches ||
    window.matchMedia('(pointer: coarse)').matches
  );
}

function isInteractiveTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    Boolean(target.closest('a, button, input, textarea, select, [role="button"]'))
  );
}

/**
 * Bloom on the singularity only → overlay warped copy (no glow) → lensing warps both.
 * Drag moves the hole; it eases back home when released.
 * `lab` mode skips hero copy/intro and reads live params from `paramsRef`.
 */
export function useBlackHole(
  mountRef: RefObject<HTMLDivElement | null>,
  heroRef: RefObject<HTMLElement | null>,
  options: BlackHoleOptions = {}
) {
  const { mode = 'hero', paramsRef } = options;
  const isLab = mode === 'lab';

  useEffect(() => {
    const mount = mountRef.current;
    const hero = heroRef.current;
    if (!mount) return;

    const reduceMotion = prefersReducedMotion();
    const mobile = isMobileViewport();
    const labDefaults = paramsRef?.current ?? DEFAULT_SINGULARITY_PARAMS;

    // HOME = singularity + orbit/spring anchor (world center of the void).
    // Screen placement on the RIGHT is done via setViewOffset — lookAt always
    // centers the target, so world X alone cannot push it right.
    const HOME = new THREE.Vector3(0, isLab ? 0 : mobile ? 0.55 : 0.48, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(
      isLab ? labDefaults.background : 0x020104,
      isLab ? labDefaults.fogDensity : 0.025
    );
    scene.background = new THREE.Color(isLab ? labDefaults.background : 0x000002);

    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 4000);
    const placeCamera = () => {
      if (isLab) {
        camera.position.set(HOME.x - 0.4, HOME.y + 2.8, HOME.z + 12.5);
      } else {
        camera.position.set(HOME.x - 2.6, HOME.y + 3.85, HOME.z + 10.6);
      }
      camera.lookAt(HOME);
    };
    placeCamera();

    const renderer = new THREE.WebGLRenderer({
      antialias: !mobile,
      alpha: false,
      stencil: false,
      powerPreference: 'high-performance'
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isLab ? labDefaults.exposure : 1.2;
    renderer.domElement.className = 'bh-canvas';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    mount.appendChild(renderer.domElement);

    // Orbit pivot = singularity center
    const controls = new OrbitControls(camera, renderer.domElement);
    // Live drag is direct; release coast uses an ease curve (below)
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 0.42;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.target.copy(HOME);
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI * 0.78;
    // Free azimuth — clamped limits made orbit feel "stuck" after a few turns
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;
    controls.autoRotate = false;
    controls.enabled = !mobile && !reduceMotion;
    controls.update();
    const homeCamPos = camera.position.clone();
    controls.saveState();

    /** Shift frustum so the orbit anchor reads on the right. Lab stays centered. */
    const applyRightFrame = (width: number, height: number) => {
      if (isLab) {
        camera.clearViewOffset();
        return;
      }
      // Was 0.46 — parked the void against the right crop. Lower shift leaves
      // outbound travel so drag isn't clipped by the frame.
      const shift = mobile ? 0.22 : 0.3;
      const lift = mobile ? 0.06 : 0.08;
      camera.setViewOffset(
        width,
        height,
        -Math.floor(width * shift),
        Math.floor(height * lift),
        width,
        height
      );
    };

    let holding = false;
    /** True while easing back to HOME after release. */
    let returning = false;
    /** True while orbit release is coasting on an ease curve. */
    let orbitCoasting = false;
    const throwVel = new THREE.Vector3();
    const returnFrom = new THREE.Vector3();
    const returnMom = new THREE.Vector3();
    const returnCamFrom = new THREE.Vector3();
    let returnStartedAt = 0;
    /** Home glide duration after release. */
    const RETURN_MS = 1600;
    const spawnFrom = new THREE.Vector3();
    const ORBIT_COAST_MS = 1100;
    const orbitSpherical = new THREE.Spherical();
    const orbitOffset = new THREE.Vector3();
    const prevOrbitSpherical = new THREE.Spherical();
    const orbitAngVel = { theta: 0, phi: 0 };
    let orbitCoastStartedAt = 0;
    let orbitCoastTheta0 = 0;
    let orbitCoastPhi0 = 0;
    let orbitCoastDTheta = 0;
    let orbitCoastDPhi = 0;
    let orbitCoastRadius = 0;
    let orbitSampleAt = 0;
    // Declared early so OrbitControls handlers can gate on grab state
    const drag = {
      armed: false,
      dragging: false,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      grabRadiusPx: 120,
      pointerId: -1
    };

    const readOrbitSpherical = (out: THREE.Spherical) => {
      orbitOffset.copy(camera.position).sub(controls.target);
      out.setFromVector3(orbitOffset);
      return out;
    };

    const applyOrbitSpherical = (theta: number, phi: number, radius: number) => {
      orbitSpherical.set(
        radius,
        THREE.MathUtils.clamp(phi, controls.minPolarAngle, controls.maxPolarAngle),
        THREE.MathUtils.clamp(theta, controls.minAzimuthAngle, controls.maxAzimuthAngle)
      );
      camera.position.setFromSpherical(orbitSpherical).add(controls.target);
      camera.lookAt(controls.target);
      controls.update();
    };

    /** CSS-style ease curves — declared early for orbit coast + return home. */
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const beginOrbitCoast = () => {
      if (holding || returning || mobile || reduceMotion) return;
      readOrbitSpherical(orbitSpherical);
      // Integrate recent angular velocity into a short coast arc
      const coastSec = ORBIT_COAST_MS / 1000;
      orbitCoastDTheta = THREE.MathUtils.clamp(orbitAngVel.theta * coastSec * 0.45, -0.9, 0.9);
      orbitCoastDPhi = THREE.MathUtils.clamp(orbitAngVel.phi * coastSec * 0.45, -0.5, 0.5);
      if (Math.abs(orbitCoastDTheta) < 0.002 && Math.abs(orbitCoastDPhi) < 0.002) {
        orbitCoasting = false;
        if (!holding && !returning && introDone) {
          if (!mobile && !reduceMotion) controls.enabled = true;
        }
        return;
      }
      orbitCoastTheta0 = orbitSpherical.theta;
      orbitCoastPhi0 = orbitSpherical.phi;
      orbitCoastRadius = orbitSpherical.radius;
      orbitCoastStartedAt = performance.now();
      orbitCoasting = true;
      controls.enabled = false;
    };

    const stepOrbitCoast = () => {
      const t = Math.min(1, (performance.now() - orbitCoastStartedAt) / ORBIT_COAST_MS);
      // Ease-out: keep momentum, then settle softly (ease-in-out blend at the end)
      const e = easeOutCubic(t) * 0.85 + easeInOutCubic(t) * 0.15;
      applyOrbitSpherical(
        orbitCoastTheta0 + orbitCoastDTheta * e,
        orbitCoastPhi0 + orbitCoastDPhi * e,
        orbitCoastRadius
      );
      if (t >= 1) {
        orbitCoasting = false;
        orbitAngVel.theta = 0;
        orbitAngVel.phi = 0;
        if (!holding && !returning && introDone && !mobile && !reduceMotion) {
          controls.enabled = true;
        }
      }
    };

    // Block OrbitControls while the void is grabbed / returning / coasting
    controls.addEventListener('start', () => {
      if (holding || returning || orbitCoasting) {
        controls.enabled = false;
        return;
      }
      orbitCoasting = false;
      readOrbitSpherical(prevOrbitSpherical);
      orbitSampleAt = performance.now();
      orbitAngVel.theta = 0;
      orbitAngVel.phi = 0;
    });
    controls.addEventListener('change', () => {
      if (holding || returning || orbitCoasting) return;
      const now = performance.now();
      const dt = Math.max(0.008, (now - orbitSampleAt) / 1000);
      readOrbitSpherical(orbitSpherical);
      const vTheta = (orbitSpherical.theta - prevOrbitSpherical.theta) / dt;
      const vPhi = (orbitSpherical.phi - prevOrbitSpherical.phi) / dt;
      orbitAngVel.theta = orbitAngVel.theta * 0.65 + vTheta * 0.35;
      orbitAngVel.phi = orbitAngVel.phi * 0.65 + vPhi * 0.35;
      prevOrbitSpherical.copy(orbitSpherical);
      orbitSampleAt = now;
    });
    controls.addEventListener('end', () => {
      if (holding || returning) return;
      beginOrbitCoast();
    });

    // --- Text overlay in SCREEN SPACE (no snap while the camera orbits) ---
    const overlayScene = new THREE.Scene();
    const overlayCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    let textTexture = new THREE.CanvasTexture(document.createElement('canvas'));
    textTexture.colorSpace = THREE.SRGBColorSpace;
    textTexture.minFilter = THREE.LinearFilter;
    textTexture.magFilter = THREE.LinearFilter;
    textTexture.generateMipmaps = false;

    const textMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: textTexture },
        uOpacity: { value: 0 }
      },
      vertexShader: textPlaneVertexShader,
      fragmentShader: textPlaneFragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
      toneMapped: false,
      blending: THREE.NormalBlending
    });
    const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), textMaterial);
    textMesh.frustumCulled = false;
    textMesh.visible = false;
    overlayScene.add(textMesh);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(
      new THREE.Vector2(1, 1),
      isLab ? labDefaults.bloomStrength : 0.8,
      isLab ? labDefaults.bloomRadius : 0.7,
      isLab ? labDefaults.bloomThreshold : 0.8
    ));
    const overlayPass = new OverlayScenePass(overlayScene, overlayCamera);
    composer.addPass(overlayPass);

    const lensingPass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        holePos0: { value: new THREE.Vector2(isLab ? 0.5 : 0.72, 0.5) },
        holePos1: { value: new THREE.Vector2(0.72, 0.48) },
        holeCount: { value: 1 },
        lensingStrength: { value: isLab ? labDefaults.lensingStrength : mobile ? 0.09 : 0.12 },
        lensingRadius: { value: isLab ? labDefaults.lensingRadius : 0.32 },
        aspectRatio: { value: 1 },
        chromaticAberration: { value: isLab ? labDefaults.chromaticAberration : 0.0006 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: lensingFragmentShader
    });
    composer.addPass(lensingPass);

    const bloomPass = composer.passes[1] as InstanceType<typeof UnrealBloomPass>;
    const BLOOM_TARGET = isLab ? labDefaults.bloomStrength : 0.8;
    const DISK_DENSITY_TARGET = isLab ? labDefaults.diskDensity : 1.3;
    if (!isLab) {
      bloomPass.strength = 0;
      lensingPass.uniforms.lensingStrength.value = 0;
    } else {
      bloomPass.strength = BLOOM_TARGET;
    }

    // --- Stars ---
    const starCount = mobile ? 14000 : 42000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starTwinkle = new Float32Array(starCount);
    const palette = [
      new THREE.Color(COLORS.starWarm),
      new THREE.Color(COLORS.starCool),
      new THREE.Color(COLORS.starEmber),
      new THREE.Color(0xffffff)
    ];
    const starFieldRadius = 2000;

    for (let i = 0; i < starCount; i += 1) {
      const i3 = i * 3;
      const phi = Math.acos(-1 + (2 * i) / starCount);
      const theta = Math.sqrt(starCount * Math.PI) * phi;
      const radius = Math.cbrt(Math.random()) * starFieldRadius + 100;
      starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i3 + 2] = radius * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * palette.length)].clone();
      c.multiplyScalar(0.3 + Math.random() * 0.7);
      starColors[i3] = c.r;
      starColors[i3 + 1] = c.g;
      starColors[i3 + 2] = c.b;
      starSizes[i] = THREE.MathUtils.randFloat(0.6, 3.0);
      starTwinkle[i] = Math.random() * Math.PI * 2;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    starGeometry.setAttribute('twinkle', new THREE.BufferAttribute(starTwinkle, 1));

    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: 1 }
      },
      vertexShader: starVertexShader,
      fragmentShader: starFragmentShader,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    scene.add(new THREE.Points(starGeometry, starMaterial));

    // --- Singularity (primary + optional lab twin) ---
    const horizonGeo = new THREE.SphereGeometry(BLACK_HOLE_RADIUS * 1.05, 128, 64);
    const voidGeo = new THREE.SphereGeometry(BLACK_HOLE_RADIUS, 128, 64);
    const diskGeo = new THREE.RingGeometry(DISK_INNER, DISK_OUTER, 256, 128);

    const horizonMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uCameraPosition: { value: camera.position.clone() }
      },
      vertexShader: horizonVertexShader,
      fragmentShader: horizonFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false
    });
    const voidMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

    const diskMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorHot: {
          value: new THREE.Color(isLab ? labDefaults.colorHot : COLORS.hot)
        },
        uColorMid: {
          value: new THREE.Color(isLab ? labDefaults.colorMid : COLORS.mid)
        },
        uColorAccent: {
          value: new THREE.Color(isLab ? labDefaults.colorAccent : COLORS.accent)
        },
        uColorEmber: {
          value: new THREE.Color(isLab ? labDefaults.colorEmber : COLORS.ember)
        },
        uColorOuter: {
          value: new THREE.Color(isLab ? labDefaults.colorOuter : COLORS.outer)
        },
        uNoiseScale: { value: isLab ? labDefaults.noiseScale : 2.5 },
        uFlowSpeed: { value: isLab ? labDefaults.flowSpeed : 0.1 },
        uDensity: { value: isLab || reduceMotion ? DISK_DENSITY_TARGET : 0 }
      },
      vertexShader: diskVertexShader,
      fragmentShader: diskFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const tiltX = isLab ? (labDefaults.diskTiltDeg * Math.PI) / 180 : DISK_TILT;
    const tiltZ = isLab ? (labDefaults.diskBankDeg * Math.PI) / 180 : DISK_BANK;

    type Hole = {
      core: THREE.Group;
      disk: THREE.Mesh;
      diskTilt: THREE.Group;
      home: THREE.Vector3;
    };

    const buildHole = (home: THREE.Vector3): Hole => {
      const core = new THREE.Group();
      core.position.copy(home);
      core.scale.setScalar(isLab || reduceMotion ? 1 : 0.001);

      const horizon = new THREE.Mesh(horizonGeo, horizonMat);
      core.add(horizon);

      const voidMesh = new THREE.Mesh(voidGeo, voidMat);
      voidMesh.renderOrder = 0;
      core.add(voidMesh);

      const diskTilt = new THREE.Group();
      diskTilt.rotation.x = tiltX;
      diskTilt.rotation.z = tiltZ;
      core.add(diskTilt);

      const disk = new THREE.Mesh(diskGeo, diskMaterial);
      disk.rotation.z = DISK_YAW;
      disk.renderOrder = 1;
      diskTilt.add(disk);

      scene.add(core);
      return { core, disk, diskTilt, home: home.clone() };
    };

    const holeA = buildHole(HOME);
    const HOME_B = new THREE.Vector3(isLab ? 5.2 : 0, isLab ? 0.35 : 0, 0);
    const holeB = isLab ? buildHole(HOME_B) : null;
    if (holeB) {
      holeB.core.visible = labDefaults.holeCount > 1;
    }

    let activeHole: Hole = holeA;
    let holeCountLive = isLab && labDefaults.holeCount > 1 ? 2 : 1;

    const screenPos = new THREE.Vector3();
    const rimPos = new THREE.Vector3();
    const camRight = new THREE.Vector3();
    const camUp = new THREE.Vector3();
    const camForward = new THREE.Vector3();
    const dragPlane = new THREE.Plane();
    const dragPlanePoint = new THREE.Vector3();
    const dragGrabOffset = new THREE.Vector3();
    const planeHit = new THREE.Vector3();
    const pointerNdc = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const clock = new THREE.Clock();
    const pullScratch = new THREE.Vector3();
    const holeScreen = { x: 0, y: 0, radius: 120 };
    const holeScreenB = { x: 0, y: 0, radius: 120 };

    let lastDragMoveAt = 0;

    // Transparent hit target — fixed over the projected void (above all hero UI)
    const overlayHost =
      document.querySelector('.v2-root') ?? hero ?? document.body;
    const grabProxy = document.createElement('div');
    grabProxy.className = 'bh-grab';
    grabProxy.setAttribute('aria-label', 'Hold and drag singularity');
    grabProxy.setAttribute('role', 'presentation');
    overlayHost.appendChild(grabProxy);

    let disposed = false;
    let raf = 0;
    let running = true;
    let inViewport = true;
    let warpNode: HTMLElement | null = null;
    let captureQueued = false;
    let lastCapture = 0;
    /** Warp bitmap captured — WebGL is the only visible headline. */
    let textReady = false;
    /** First frame text became ready — drives opacity fade instead of a hard cut. */
    let textRevealStartedAt = 0;
    const TEXT_CAPTURE_AFTER_COPY_MS = 0;
    const TEXT_CAPTURE_FALLBACK_MS = 2800;
    const TEXT_REVEAL_MS = 180;
    const INTRO_TRAVEL_MS = 3800;
    const INTRO_SPIN_Z = 0.95;

    /** Keep a hole near its home without forcing world-Z (that changed depth/size). */
    const clampToPlayArea = (target = activeHole.core, home = activeHole.home) => {
      const maxDist = 24;
      const dist = target.position.distanceTo(home);
      if (dist > maxDist) {
        target.position.sub(home).multiplyScalar(maxDist / dist).add(home);
      }
    };

    const clientToNdc = (clientX: number, clientY: number) => {
      const rect = mount.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return null;
      return {
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: -((clientY - rect.top) / rect.height) * 2 + 1
      };
    };

    const beginDragPlane = (clientX: number, clientY: number) => {
      // Plane through the void, facing the camera → constant apparent size while dragging
      camera.getWorldDirection(camForward);
      dragPlanePoint.copy(activeHole.core.position);
      dragPlane.setFromNormalAndCoplanarPoint(camForward, dragPlanePoint);

      const ndc = clientToNdc(clientX, clientY);
      if (!ndc) {
        dragGrabOffset.set(0, 0, 0);
        return;
      }
      pointerNdc.set(ndc.x, ndc.y);
      raycaster.setFromCamera(pointerNdc, camera);
      if (raycaster.ray.intersectPlane(dragPlane, planeHit)) {
        dragGrabOffset.copy(activeHole.core.position).sub(planeHit);
      } else {
        dragGrabOffset.set(0, 0, 0);
      }
    };

    /** Screen-space translation on the camera-facing plane (no depth pop). */
    const applyScreenDrag = (clientX: number, clientY: number) => {
      const ndc = clientToNdc(clientX, clientY);
      if (!ndc) return;
      pointerNdc.set(ndc.x, ndc.y);
      raycaster.setFromCamera(pointerNdc, camera);
      camera.getWorldDirection(camForward);
      dragPlane.setFromNormalAndCoplanarPoint(camForward, dragPlanePoint);
      if (!raycaster.ray.intersectPlane(dragPlane, planeHit)) return;
      activeHole.core.position.copy(planeHit).add(dragGrabOffset);
      clampToPlayArea();
      drag.lastX = clientX;
      drag.lastY = clientY;
    };

    const projectHoleScreen = (
      hole: Hole,
      out: { x: number; y: number; radius: number }
    ) => {
      const mountRect = mount.getBoundingClientRect();
      if (mountRect.width < 1 || mountRect.height < 1) return;

      camera.updateMatrixWorld();
      screenPos.copy(hole.core.position).project(camera);
      if (!Number.isFinite(screenPos.x) || !Number.isFinite(screenPos.y)) return;

      const cx = (screenPos.x * 0.5 + 0.5) * mountRect.width + mountRect.left;
      const cy = (-screenPos.y * 0.5 + 0.5) * mountRect.height + mountRect.top;
      out.x = cx;
      out.y = cy;

      rimPos.set(BLACK_HOLE_RADIUS, 0, 0).add(hole.core.position).project(camera);
      const rimClientX = (rimPos.x * 0.5 + 0.5) * mountRect.width + mountRect.left;
      const voidRadiusPx = Math.max(36, Math.abs(rimClientX - cx));
      out.radius = voidRadiusPx * 1.2 + (mobile ? 18 : 24);
    };

    const updateHoleScreen = () => {
      projectHoleScreen(holeA, holeScreen);
      if (holeB && holeB.core.visible) {
        projectHoleScreen(holeB, holeScreenB);
      }

      const focus = holding ? activeHole : holeA;
      const focusScreen = focus === holeB ? holeScreenB : holeScreen;
      drag.grabRadiusPx = focusScreen.radius;

      const size = focusScreen.radius * 2;
      grabProxy.style.width = `${size}px`;
      grabProxy.style.height = `${size}px`;
      grabProxy.style.left = `${focusScreen.x - focusScreen.radius}px`;
      grabProxy.style.top = `${focusScreen.y - focusScreen.radius}px`;
    };

    const pickHoleAt = (clientX: number, clientY: number): Hole | null => {
      const hits: { hole: Hole; dist: number; radius: number }[] = [];
      const dA = Math.hypot(clientX - holeScreen.x, clientY - holeScreen.y);
      if (dA <= holeScreen.radius * 1.05) {
        hits.push({ hole: holeA, dist: dA, radius: holeScreen.radius });
      }
      if (holeB && holeB.core.visible) {
        const dB = Math.hypot(clientX - holeScreenB.x, clientY - holeScreenB.y);
        if (dB <= holeScreenB.radius * 1.05) {
          hits.push({ hole: holeB, dist: dB, radius: holeScreenB.radius });
        }
      }
      if (!hits.length) return null;
      hits.sort((a, b) => a.dist / a.radius - b.dist / b.radius);
      return hits[0].hole;
    };

    const placeTextPlane = () => {
      if (!warpNode) return;

      const mountRect = mount.getBoundingClientRect();
      const box = measureWarpBox(warpNode);
      if (mountRect.width < 1 || mountRect.height < 1 || box.width < 1) return;

      const { width, height } = box;
      const cx = box.left + width * 0.5;
      const cy = box.top + height * 0.5;

      const nx = ((cx - mountRect.left) / mountRect.width) * 2 - 1;
      const ny = -(((cy - mountRect.top) / mountRect.height) * 2 - 1);
      const nw = (width / mountRect.width) * 2;
      const nh = (height / mountRect.height) * 2;

      textMesh.position.set(nx, ny, 0);
      textMesh.scale.set(nw, nh, 1);
      textMesh.rotation.set(0, 0, 0);
    };

    /** WebGL headline — fades in with the singularity intro. */
    const syncTextWarpVisibility = () => {
      if (!warpNode || reduceMotion) {
        textMesh.visible = false;
        textMaterial.uniforms.uOpacity.value = 0;
        return;
      }

      if (!textReady) {
        textMesh.visible = false;
        textMaterial.uniforms.uOpacity.value = 0;
        return;
      }

      textMesh.visible = true;
      if (!introDone) {
        textMaterial.uniforms.uOpacity.value = 1;
        textRevealStartedAt = performance.now();
        return;
      }
      if (!textRevealStartedAt) textRevealStartedAt = performance.now();
      const t = Math.min(1, (performance.now() - textRevealStartedAt) / TEXT_REVEAL_MS);
      textMaterial.uniforms.uOpacity.value = Math.max(
        textMaterial.uniforms.uOpacity.value as number,
        easeOutCubic(t)
      );
    };

    const enableCopyFallback = () => {
      hero?.classList.add('bh-copy-fallback');
      textMesh.visible = false;
      textMaterial.uniforms.uOpacity.value = 0;
    };

    const refreshWarpTexture = async (force = false) => {
      if (disposed || !warpNode || captureQueued || reduceMotion) return;
      if (!force && performance.now() - lastCapture < 1200) return;
      captureQueued = true;
      try {
        if (document.fonts?.status === 'loading') {
          await document.fonts.ready;
        }
        // Let layout + copy fade settle one frame
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        if (disposed || !warpNode) return;

        // Capture from a clone (html-to-image) — do NOT flash the live DOM
        const canvas = await captureWarpSource(warpNode);

        if (!canvas || disposed) {
          console.warn('[singularity] text capture returned empty');
          return;
        }

        if (canvas.width < 2 || canvas.height < 2) {
          console.warn('[singularity] text capture too small', canvas.width, canvas.height);
          return;
        }

        textTexture.image = canvas;
        textTexture.colorSpace = THREE.SRGBColorSpace;
        textTexture.generateMipmaps = false;
        textTexture.minFilter = THREE.LinearFilter;
        textTexture.magFilter = THREE.LinearFilter;
        textTexture.needsUpdate = true;
        textMaterial.uniforms.uMap.value = textTexture;
        placeTextPlane();

        const firstReveal = !textReady;
        textReady = true;
        if (firstReveal) textRevealStartedAt = performance.now();
        textMesh.visible = true;
        // Opacity is eased in syncTextWarpVisibility — start from 0 on first reveal
        if (firstReveal) textMaterial.uniforms.uOpacity.value = 0;
        lastCapture = performance.now();
        placeTextPlane();
      } catch (error) {
        console.warn('[singularity] text capture failed', error);
      } finally {
        captureQueued = false;
      }
    };

    const applyHomeForViewport = (width: number, height: number) => {
      const aspect = width / Math.max(1, height);
      if (isLab) {
        HOME.set(0, 0, 0);
        HOME_B.set(5.2, 0.35, 0);
      } else if (aspect < 0.75) {
        HOME.set(0, 0.36, 0);
      } else if (aspect < 1.05) {
        HOME.set(0, 0.22, 0);
      } else {
        HOME.set(0, 0.14, 0);
      }
      holeA.home.copy(HOME);
      if (holeB) holeB.home.copy(HOME_B);
      placeCamera();
      applyRightFrame(width, height);
      controls.target.copy(HOME);
      homeCamPos.copy(camera.position);
      controls.saveState();
      controls.update();
      if (!holding && introDone) {
        holeA.core.position.copy(holeA.home);
        holeA.core.rotation.set(0, 0, 0);
        if (holeB) {
          holeB.core.position.copy(holeB.home);
          holeB.core.rotation.set(0, 0, 0);
        }
        throwVel.set(0, 0, 0);
        returning = false;
      }
    };

    let resizeCaptureTimer = 0;

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
      camera.aspect = width / Math.max(1, height);
      applyHomeForViewport(width, height);
      // applyRightFrame already updated projection; keep aspect in sync
      camera.updateProjectionMatrix();
      applyRightFrame(width, height);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      composer.setPixelRatio(dpr);
      composer.setSize(width, height);
      bloomPass.resolution.set(width * dpr, height * dpr);
      lensingPass.uniforms.aspectRatio.value = width / height;
      starMaterial.uniforms.uPixelRatio.value = dpr;
      updateHoleScreen();
      // Debounce recapture on resize so text doesn't thrash mid-drag
      window.clearTimeout(resizeCaptureTimer);
      resizeCaptureTimer = window.setTimeout(() => {
        if (textReady) void refreshWarpTexture(true);
      }, 280);
    };

    // ---------------------------------------------------------------------------
    // First-load / refresh intro + singularity grab → return home
    // ---------------------------------------------------------------------------
    let introDone = isLab || reduceMotion;
    let introStartedAt = 0;
    let introBootAt = 0;
    let introTravelAt = 0;
    /** Text gets a tiny head start; singularity begins right after. */
    const INTRO_BH_DELAY_MS = 140;
    const prevPos = new THREE.Vector3();
    const sampleVel = new THREE.Vector3();
    const DRAG_THRESHOLD_PX = 3;
    const MAX_THROW = 9;

    const freezeCamera = () => {
      orbitCoasting = false;
      controls.enabled = false;
    };

    /** Snap OrbitControls + camera to the saved home framing (clears damping lock). */
    const settleHomeCamera = () => {
      camera.position.copy(homeCamPos);
      controls.target.copy(HOME);
      camera.lookAt(HOME);
      controls.saveState();
      controls.reset();
      controls.target.copy(HOME);
      camera.position.copy(homeCamPos);
      camera.lookAt(HOME);
      controls.update();
    };

    const enableOrbitIfAllowed = () => {
      if (!introDone || holding || returning || orbitCoasting) return;
      if (!mobile && !reduceMotion) controls.enabled = true;
      controls.target.copy(HOME);
      controls.update();
    };

    const hitOnHomePlane = (clientX: number, clientY: number, out: THREE.Vector3) => {
      const ndc = clientToNdc(clientX, clientY);
      if (!ndc) return false;
      camera.getWorldDirection(camForward);
      dragPlanePoint.copy(HOME);
      dragPlane.setFromNormalAndCoplanarPoint(camForward, dragPlanePoint);
      pointerNdc.set(ndc.x, ndc.y);
      raycaster.setFromCamera(pointerNdc, camera);
      return Boolean(raycaster.ray.intersectPlane(dragPlane, out));
    };

    const prepareIntroSpawn = () => {
      spawnFrom.copy(holeA.home);
      if (isLab || mobile || reduceMotion) return;
      const box = mount.getBoundingClientRect();
      const copyBox = hero?.querySelector<HTMLElement>('.bh-copy')?.getBoundingClientRect();
      const spawnX = (copyBox?.left ?? box.left) + 24;
      const spawnY = copyBox
        ? copyBox.top - Math.min(120, box.height * 0.12)
        : box.top + box.height * 0.12;
      hitOnHomePlane(spawnX, spawnY, spawnFrom);
    };

    const completeIntroVisuals = () => {
      introDone = true;
      holeA.core.scale.set(1, 1, 1);
      holeA.core.rotation.z = 0;
      bloomPass.strength = BLOOM_TARGET;
      diskMaterial.uniforms.uDensity.value = DISK_DENSITY_TARGET;
      grabProxy.style.pointerEvents = '';
      hero?.classList.add('is-intro-done');
      mount.classList.add('is-intro-done');
    };

    const finishIntro = () => {
      completeIntroVisuals();
      holeA.core.position.copy(holeA.home);
      if (!holding && !returning) enableOrbitIfAllowed();
    };

    if (isLab || reduceMotion) {
      hero?.classList.add('is-copy-in');
      if (!isLab) finishIntro();
      else {
        holeA.core.scale.set(1, 1, 1);
        if (holeB) holeB.core.scale.set(1, 1, 1);
        bloomPass.strength = BLOOM_TARGET;
        diskMaterial.uniforms.uDensity.value = DISK_DENSITY_TARGET;
        grabProxy.style.pointerEvents = '';
        mount.classList.add('is-intro-done');
        enableOrbitIfAllowed();
      }
    } else {
      controls.enabled = false;
      grabProxy.style.pointerEvents = 'none';
      // Ensure copy-in even if LandingExperience rAF hasn't fired yet
      if (hero && !hero.classList.contains('is-copy-in')) {
        window.requestAnimationFrame(() => hero.classList.add('is-copy-in'));
      }
    }

    const clearHoldUi = () => {
      const pointerId = drag.pointerId;
      drag.armed = false;
      drag.dragging = false;
      drag.pointerId = -1;
      mount.classList.remove('is-dragging');
      mount.classList.remove('is-grabbing');
      grabProxy.classList.remove('is-dragging');
      grabProxy.classList.remove('is-grabbing');
      hero?.classList.remove('is-bh-dragging');
      if (pointerId >= 0) {
        try {
          if (grabProxy.hasPointerCapture(pointerId)) {
            grabProxy.releasePointerCapture(pointerId);
          }
        } catch {
          /* ignore */
        }
      }
    };

    /**
     * Release grab: ease singularity + camera home together (no camera snap).
     */
    const beginReturnHome = () => {
      if (!holding) return;
      holding = false;
      orbitCoasting = false;
      clearHoldUi();

      returnFrom.copy(activeHole.core.position);
      returnCamFrom.copy(camera.position);
      if (performance.now() - lastDragMoveAt > 100) {
        returnMom.set(0, 0, 0);
      } else {
        returnMom.copy(throwVel).clampLength(0, MAX_THROW).multiplyScalar(0.12);
        sampleVel.copy(activeHole.home).sub(returnFrom);
        if (sampleVel.lengthSq() > 1e-6 && returnMom.dot(sampleVel) < 0) {
          returnMom.set(0, 0, 0);
        }
      }
      throwVel.set(0, 0, 0);
      returnStartedAt = performance.now();
      returning = true;
      freezeCamera();
    };

    const stepReturnHome = () => {
      freezeCamera();
      const t = Math.min(1, (performance.now() - returnStartedAt) / RETURN_MS);
      const e = easeInOutCubic(t);

      // Singularity glides home
      activeHole.core.position.lerpVectors(returnFrom, activeHole.home, e);
      const momFade = (1 - e) * (1 - t);
      activeHole.core.position.addScaledVector(returnMom, momFade);
      clampToPlayArea();

      // Camera eases back to default framing in parallel (no instant snap)
      camera.position.lerpVectors(returnCamFrom, homeCamPos, e);
      controls.target.copy(HOME);
      camera.lookAt(HOME);

      if (t >= 1) {
        activeHole.core.position.copy(activeHole.home);
        returnMom.set(0, 0, 0);
        settleHomeCamera();
        returning = false;
        enableOrbitIfAllowed();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!holding) return;
      if (drag.pointerId >= 0 && event.pointerId !== drag.pointerId) return;

      const dist = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
      if (!drag.dragging) {
        if (dist < DRAG_THRESHOLD_PX) return;
        drag.dragging = true;
        mount.classList.add('is-dragging');
        mount.classList.remove('is-grabbing');
        grabProxy.classList.add('is-dragging');
        grabProxy.classList.remove('is-grabbing');
      }

      prevPos.copy(activeHole.core.position);
      applyScreenDrag(event.clientX, event.clientY);

      const now = performance.now();
      const dt = Math.max(0.008, (now - lastDragMoveAt) / 1000);
      sampleVel.copy(activeHole.core.position).sub(prevPos).divideScalar(dt);
      throwVel.lerp(sampleVel, 0.5);
      throwVel.clampLength(0, MAX_THROW);
      lastDragMoveAt = now;
    };

    const onGrabMove = (event: PointerEvent) => {
      if (reduceMotion) return;
      if (holding) {
        onPointerMove(event);
        event.stopPropagation();
        return;
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (reduceMotion || event.button !== 0) return;
      if (!introDone && !introStartedAt) return;

      const fromProxy = event.currentTarget === grabProxy || event.target === grabProxy;
      if (!fromProxy && isInteractiveTarget(event.target)) return;
      updateHoleScreen();
      const picked = pickHoleAt(event.clientX, event.clientY);
      if (!fromProxy && !picked) return;
      activeHole = picked ?? holeA;

      if (!introDone) completeIntroVisuals();
      if (returning) {
        returning = false;
        returnMom.set(0, 0, 0);
      }
      if (holding) beginReturnHome();

      event.preventDefault();
      event.stopImmediatePropagation();

      holding = true;
      returning = false;
      orbitCoasting = false;
      throwVel.set(0, 0, 0);
      freezeCamera();

      drag.armed = true;
      drag.dragging = false;
      drag.pointerId = event.pointerId;
      drag.startX = event.clientX;
      drag.startY = event.clientY;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      lastDragMoveAt = performance.now();
      prevPos.copy(activeHole.core.position);
      beginDragPlane(event.clientX, event.clientY);
      mount.classList.add('is-grabbing');
      grabProxy.classList.add('is-grabbing');
      grabProxy.classList.remove('is-dragging');
      hero?.classList.add('is-bh-dragging');
      try {
        grabProxy.setPointerCapture(event.pointerId);
      } catch {
        /* ignore */
      }
    };

    /** Any release path — no pointerId filter so we never stick in holding. */
    const onPointerUp = (event?: PointerEvent) => {
      if (!holding) return;
      if (
        event &&
        drag.pointerId >= 0 &&
        event.pointerId !== drag.pointerId &&
        event.pointerType !== 'mouse'
      ) {
        return;
      }
      beginReturnHome();
    };

    const onLostCapture = () => {
      if (holding) beginReturnHome();
    };

    const onWindowBlur = () => {
      if (holding) beginReturnHome();
    };

    const frame = () => {
      if (disposed || !running) return;
      try {
        const elapsed = clock.getElapsedTime();
        const delta = Math.min(0.033, clock.getDelta());
        const live = isLab ? (paramsRef?.current ?? labDefaults) : null;
        const timeScale = live?.timeScale ?? 0.45;

        if (live) {
          bloomPass.strength = live.bloomStrength;
          bloomPass.radius = live.bloomRadius;
          bloomPass.threshold = live.bloomThreshold;
          diskMaterial.uniforms.uDensity.value = live.diskDensity;
          diskMaterial.uniforms.uFlowSpeed.value = live.flowSpeed;
          diskMaterial.uniforms.uNoiseScale.value = live.noiseScale;
          diskMaterial.uniforms.uColorHot.value.set(live.colorHot);
          diskMaterial.uniforms.uColorMid.value.set(live.colorMid);
          diskMaterial.uniforms.uColorAccent.value.set(live.colorAccent);
          diskMaterial.uniforms.uColorEmber.value.set(live.colorEmber);
          diskMaterial.uniforms.uColorOuter.value.set(live.colorOuter);
          const tiltXLive = (live.diskTiltDeg * Math.PI) / 180;
          const tiltZLive = (live.diskBankDeg * Math.PI) / 180;
          holeA.diskTilt.rotation.x = tiltXLive;
          holeA.diskTilt.rotation.z = tiltZLive;
          if (holeB) {
            holeB.diskTilt.rotation.x = tiltXLive;
            holeB.diskTilt.rotation.z = tiltZLive;
          }
          lensingPass.uniforms.lensingStrength.value = live.lensingStrength;
          lensingPass.uniforms.lensingRadius.value = live.lensingRadius;
          lensingPass.uniforms.chromaticAberration.value = live.chromaticAberration;
          renderer.toneMappingExposure = live.exposure;
          scene.background = new THREE.Color(live.background);
          if (scene.fog instanceof THREE.FogExp2) {
            scene.fog.color.set(live.background);
            scene.fog.density = live.fogDensity;
          }

          const nextCount = live.holeCount > 1 ? 2 : 1;
          if (holeB && nextCount !== holeCountLive) {
            holeCountLive = nextCount;
            holeB.core.visible = holeCountLive > 1;
            if (holeCountLive > 1) {
              holeB.core.position.copy(holeB.home);
              holeB.core.scale.setScalar(1);
            } else if (!(holding && activeHole === holeB) && !returning) {
              activeHole = holeA;
            }
          }
        }

        // Horizon / disk motion is shader flow only — no mesh or starfield rotation
        diskMaterial.uniforms.uTime.value = elapsed * timeScale;
        starMaterial.uniforms.uTime.value = elapsed * timeScale;
        horizonMat.uniforms.uTime.value = elapsed * timeScale;
        horizonMat.uniforms.uCameraPosition.value.copy(camera.position);

        const lensIdle = live?.lensingStrength ?? (mobile ? 0.09 : 0.12);
        const lensDrag = Math.min(0.4, lensIdle + 0.04);

        if (!introDone) {
          if (!introBootAt) introBootAt = performance.now();
          const sinceBoot = performance.now() - introBootAt;

          // Hold the void collapsed until copy has started (~140ms)
          if (sinceBoot < INTRO_BH_DELAY_MS) {
            if (!introStartedAt) {
              prepareIntroSpawn();
              holeA.core.position.copy(spawnFrom);
            }
            holeA.core.scale.setScalar(0.001);
            bloomPass.strength = 0;
            diskMaterial.uniforms.uDensity.value = 0;
            lensingPass.uniforms.lensingStrength.value = 0;
            controls.enabled = false;
          } else {
            if (!introStartedAt) {
              introStartedAt = performance.now();
              prepareIntroSpawn();
              holeA.core.position.copy(spawnFrom);
              grabProxy.style.pointerEvents = '';
            }

            const typeIsUp =
              textReady || Boolean(hero?.classList.contains('bh-copy-fallback'));
            controls.enabled = false;

            if (!typeIsUp) {
              holeA.core.position.copy(spawnFrom);
              holeA.core.scale.setScalar(0.001);
              bloomPass.strength = 0;
              diskMaterial.uniforms.uDensity.value = 0;
              lensingPass.uniforms.lensingStrength.value = 0;
              if (!captureQueued) void refreshWarpTexture(true);
            } else {
              if (!introTravelAt) introTravelAt = performance.now();
              const t = Math.min(1, (performance.now() - introTravelAt) / INTRO_TRAVEL_MS);
              const e = easeOutCubic(t);
              holeA.core.scale.setScalar(Math.max(0.001, e));
              bloomPass.strength = BLOOM_TARGET * e;
              diskMaterial.uniforms.uDensity.value = DISK_DENSITY_TARGET * e;
              lensingPass.uniforms.lensingStrength.value = lensIdle * e;
              holeA.core.position.lerpVectors(spawnFrom, holeA.home, e);
              holeA.core.rotation.z = (1 - e) * INTRO_SPIN_Z;
              if (t >= 1) finishIntro();
            }
          }
        } else if (holding) {
          // Keep the orbited (or current) camera frozen while dragging the void
          freezeCamera();
        } else if (returning) {
          stepReturnHome();
        } else if (orbitCoasting) {
          stepOrbitCoast();
        } else if (holeCountLive < 2) {
          if (holeA.core.position.distanceToSquared(holeA.home) > 1e-6) {
            holeA.core.position.copy(holeA.home);
          }
          throwVel.set(0, 0, 0);
          controls.target.copy(HOME);
          if (!mobile && !reduceMotion) {
            controls.enabled = true;
            controls.update();
          }
        } else {
          // Dual mode: leave positions free so mutual gravity can warp them
          throwVel.set(0, 0, 0);
          controls.target.copy(HOME);
          if (!mobile && !reduceMotion) {
            controls.enabled = true;
            controls.update();
          }
        }

        // Soft mutual gravity — singularities tug each other when both are live
        if (
          holeB &&
          holeCountLive > 1 &&
          holeB.core.visible &&
          introDone &&
          !reduceMotion
        ) {
          pullScratch.copy(holeB.core.position).sub(holeA.core.position);
          const dist = Math.max(0.65, pullScratch.length());
          const dir = pullScratch.normalize();
          const attract = Math.min(6.5, (18 / (dist * dist)) * delta);
          const step = dir.multiplyScalar(attract);
          const minSep = 3.4;
          const push =
            dist < minSep
              ? dir.clone().multiplyScalar(((minSep - dist) * 4.5) * delta)
              : null;

          const moveA = !(holding && activeHole === holeA) && !(returning && activeHole === holeA);
          const moveB = !(holding && activeHole === holeB) && !(returning && activeHole === holeB);

          if (moveA) {
            holeA.core.position.add(step);
            if (push) holeA.core.position.sub(push);
            // Mild home spring so they don't drift forever
            holeA.core.position.lerp(holeA.home, 0.012);
            clampToPlayArea(holeA.core, holeA.home);
          }
          if (moveB) {
            holeB.core.position.sub(step);
            if (push) holeB.core.position.add(push);
            holeB.core.position.lerp(holeB.home, 0.012);
            clampToPlayArea(holeB.core, holeB.home);
          }
        }

        placeTextPlane();
        updateHoleScreen();
        if (!isLab) syncTextWarpVisibility();

        // Dual-hole lensing: each singularity warps the field around the other
        screenPos.copy(holeA.core.position).project(camera);
        lensingPass.uniforms.holePos0.value.set(
          (screenPos.x + 1) / 2,
          (screenPos.y + 1) / 2
        );
        if (holeB && holeB.core.visible && holeCountLive > 1) {
          screenPos.copy(holeB.core.position).project(camera);
          lensingPass.uniforms.holePos1.value.set(
            (screenPos.x + 1) / 2,
            (screenPos.y + 1) / 2
          );
          lensingPass.uniforms.holeCount.value = 2;
        } else {
          lensingPass.uniforms.holeCount.value = 1;
        }

        if (introDone && !live) {
          const lensTarget = holding && drag.dragging ? lensDrag : lensIdle;
          const cur = lensingPass.uniforms.lensingStrength.value as number;
          lensingPass.uniforms.lensingStrength.value =
            cur + (lensTarget - cur) * Math.min(1, delta * 8);
        }
        if (!live) {
          lensingPass.uniforms.lensingRadius.value = 0.34;
        }

        composer.render();
        mount.classList.add('is-ready');
      } catch (err) {
        console.warn('[singularity] frame error', err);
      }
      if (!disposed && running) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running && raf) return;
      running = true;
      // Flush a stale delta instead of resetting elapsed time (avoids "frozen then jump")
      if (clock.running) clock.getDelta();
      else clock.start();
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (inViewport) start();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
        grabProxy.style.display = inViewport && !reduceMotion ? 'block' : 'none';
        if (inViewport && !document.hidden) start();
        else stop();
      },
      { rootMargin: '200px', threshold: 0 }
    );

    warpNode = isLab
      ? null
      : hero?.querySelector<HTMLElement>('[data-bh-warp]') ??
        mount.closest('.bh-hero')?.querySelector<HTMLElement>('[data-bh-warp]') ??
        document.querySelector<HTMLElement>('.bh-hero [data-bh-warp]') ??
        null;

    // Debug: window.__bhWarp() in DevTools
    (window as unknown as { __bhWarp?: () => Record<string, unknown> }).__bhWarp = () => ({
      hasWarpNode: Boolean(warpNode),
      textReady,
      uOpacity: textMaterial.uniforms.uOpacity.value,
      meshVisible: textMesh.visible,
      holding,
      returning,
      introDone,
      hole: { ...holeScreen }
    });

    resize();
    observer.observe(mount);
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    // Grab proxy sits above hero copy; canvas remains for orbit on empty space
    grabProxy.addEventListener('pointerdown', onPointerDown);
    grabProxy.addEventListener('pointerup', onPointerUp);
    grabProxy.addEventListener('pointercancel', onPointerUp);
    grabProxy.addEventListener('pointermove', onGrabMove);
    grabProxy.addEventListener('lostpointercapture', onLostCapture);
    mount.addEventListener('pointerdown', onPointerDown, true);
    renderer.domElement.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    // Window-level release so holding can never stick after the pointer leaves the proxy
    window.addEventListener('pointerup', onPointerUp, true);
    window.addEventListener('pointercancel', onPointerUp, true);
    window.addEventListener('blur', onWindowBlur);

    const captureTimers: number[] = [];
    if (!isLab && !reduceMotion) {
      captureTimers.push(
        window.setTimeout(() => void refreshWarpTexture(true), TEXT_CAPTURE_AFTER_COPY_MS),
        window.setTimeout(() => {
          if (!textReady) void refreshWarpTexture(true);
        }, TEXT_CAPTURE_AFTER_COPY_MS + 800),
        window.setTimeout(() => {
          if (!textReady) enableCopyFallback();
        }, TEXT_CAPTURE_FALLBACK_MS)
      );
    }

    if (reduceMotion && !isLab) {
      composer.render();
      stop();
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      disposed = true;
      stop();
      captureTimers.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(resizeCaptureTimer);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown, true);
      mount.removeEventListener('pointerdown', onPointerDown, true);
      grabProxy.removeEventListener('pointerdown', onPointerDown);
      grabProxy.removeEventListener('pointerup', onPointerUp);
      grabProxy.removeEventListener('pointercancel', onPointerUp);
      grabProxy.removeEventListener('pointermove', onGrabMove);
      grabProxy.removeEventListener('lostpointercapture', onLostCapture);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp, true);
      window.removeEventListener('pointercancel', onPointerUp, true);
      window.removeEventListener('blur', onWindowBlur);
      controls.dispose();
      camera.clearViewOffset();
      hero?.classList.remove('is-bh-dragging');
      hero?.classList.remove('is-intro-done');
      hero?.classList.remove('is-copy-in');
      hero?.classList.remove('bh-copy-fallback');
      mount.classList.remove('is-intro-done');
      if (grabProxy.parentNode) grabProxy.parentNode.removeChild(grabProxy);

      starGeometry.dispose();
      starMaterial.dispose();
      diskGeo.dispose();
      diskMaterial.dispose();
      horizonGeo.dispose();
      horizonMat.dispose();
      voidGeo.dispose();
      voidMat.dispose();
      scene.remove(holeA.core);
      if (holeB) scene.remove(holeB.core);
      textMesh.geometry.dispose();
      textMaterial.dispose();
      textTexture.dispose();
      overlayPass.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [mountRef, heroRef, isLab, paramsRef]);
}
