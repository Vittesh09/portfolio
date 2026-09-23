'use client';

import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { SingularityField } from '../lib/SingularityField';
import { StarField } from '../lib/StarField';

export function useBlackHole(mountRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile =
      window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(pointer: coarse)').matches;
    const particleCount = isMobile ? 9000 : 16000;
    const starCount = isMobile ? 1800 : 3200;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 90);
    camera.position.set(0, 0.15, 12.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 1);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    mount.appendChild(renderer.domElement);

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const stars = new StarField(starCount, pixelRatio);
    scene.add(stars.group);

    const field = new SingularityField(particleCount, pixelRatio, renderer);
    const pivot = new THREE.Group();
    pivot.rotation.order = 'YXZ';
    pivot.add(field.group);
    const motionGroup = new THREE.Group();
    motionGroup.add(pivot);
    scene.add(motionGroup);

    const orbit = {
      yaw: 0,
      pitch: 0,
      velocityYaw: 0,
      velocityPitch: 0,
      dragging: false,
      lastX: 0,
      lastY: 0
    };

    const parallax = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0
    };

    const gyro = {
      enabled: false,
      listening: false,
      requested: false,
      baseBeta: null as number | null,
      baseGamma: null as number | null
    };

    const GYRO_TILT_RANGE = 22;
    const GYRO_STRENGTH = 0.62;

    const applyGyroTargets = (normX: number, normY: number) => {
      parallax.targetX = THREE.MathUtils.clamp(normX * GYRO_STRENGTH, -1, 1);
      parallax.targetY = THREE.MathUtils.clamp(normY * GYRO_STRENGTH, -1, 1);
    };

    const onDeviceOrientation = (event: Event) => {
      if (!gyro.enabled) return;
      const orientation = event as DeviceOrientationEvent;
      const { beta, gamma } = orientation;
      if (beta == null || gamma == null) return;

      if (gyro.baseBeta == null || gyro.baseGamma == null) {
        gyro.baseBeta = beta;
        gyro.baseGamma = gamma;
      }

      const normX = (gamma - gyro.baseGamma) / GYRO_TILT_RANGE;
      const normY = (beta - gyro.baseBeta) / GYRO_TILT_RANGE;
      applyGyroTargets(normX, normY);
    };

    const startGyroListener = () => {
      if (gyro.listening) return;
      gyro.listening = true;
      window.addEventListener('deviceorientation', onDeviceOrientation, {
        passive: true
      });
    };

    const stopGyroListener = () => {
      if (!gyro.listening) return;
      gyro.listening = false;
      gyro.enabled = false;
      gyro.baseBeta = null;
      gyro.baseGamma = null;
      window.removeEventListener('deviceorientation', onDeviceOrientation);
    };

    const enableGyro = async () => {
      if (reduceMotion || !isMobile || gyro.enabled || gyro.requested) return;
      // Some browsers (and SSR) never define this API — never touch the bare global.
      const Orientation = window.DeviceOrientationEvent as
        | (typeof DeviceOrientationEvent & {
            requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
          })
        | undefined;
      if (!Orientation) return;

      gyro.requested = true;

      if (typeof Orientation.requestPermission === 'function') {
        try {
          const state = await Orientation.requestPermission();
          if (state !== 'granted') return;
        } catch {
          return;
        }
      }

      gyro.enabled = true;
      startGyroListener();
    };

    const onFirstGestureForGyro = () => {
      void enableGyro();
      window.removeEventListener('touchstart', onFirstGestureForGyro);
      window.removeEventListener('pointerdown', onFirstGestureForGyro);
    };

    const globalDrift = { x: 0, y: 0 };
    const globalTimeline = gsap.timeline({ paused: reduceMotion });
    globalTimeline.to(globalDrift, {
      x: 0.02,
      y: -0.012,
      duration: 24,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    let frame = 0;
    let running = true;
    let inViewport = true;
    let lastTime = performance.now();
    let elapsed = 0;
    let scrollTarget = 0;
    let scrollProgress = 0;
    let fieldBaseX = 4.25;
    let fieldBaseY = 0.12;
    let fieldBaseScale = 0.7;

    const skipIntro =
      reduceMotion ||
      window.sessionStorage.getItem('v2-auto-intro') === 'true' ||
      new URLSearchParams(window.location.search).has('skipIntro');

    // First visit: hold the field collapsed until the entry gate opens.
    const reveal = { value: skipIntro ? 1 : 0 };
    const revealTween = gsap.to(reveal, {
      value: 1,
      duration: 1.65,
      ease: 'power3.out',
      paused: true
    });

    const onCosmosReveal = () => {
      if (reveal.value >= 0.999) return;
      revealTween.play(0);
    };

    let revealFallback = 0;
    if (skipIntro) {
      reveal.value = 1;
    } else {
      // Safety: never leave the field invisible if the gate event is missed.
      revealFallback = window.setTimeout(onCosmosReveal, 3200);
    }

    const isInteractiveTarget = (target: EventTarget | null) =>
      target instanceof Element &&
      Boolean(target.closest('a, button, input, textarea, select, [role="button"]'));

    const MAX_YAW = 0.42;
    const MAX_PITCH = 0.18;
    const YAW_SENSITIVITY = 0.0028;
    const PITCH_SENSITIVITY = 0.0022;

    const onPointerDown = (event: PointerEvent) => {
      // Mobile: never capture drag — that blocks page scroll. Gyro handles tilt.
      if (isMobile || reduceMotion || event.button !== 0 || isInteractiveTarget(event.target)) {
        return;
      }
      orbit.dragging = true;
      orbit.lastX = event.clientX;
      orbit.lastY = event.clientY;
      orbit.velocityYaw = 0;
      orbit.velocityPitch = 0;
      mount.classList.add('is-dragging');
      mount.setPointerCapture?.(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      const overHero =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      const usePointerParallax = !isMobile || !gyro.enabled;

      if (usePointerParallax && overHero && rect.width > 0 && rect.height > 0) {
        parallax.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        parallax.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      } else if (usePointerParallax && !orbit.dragging) {
        parallax.targetX *= 0.92;
        parallax.targetY *= 0.92;
      }

      if (!orbit.dragging) return;
      const dx = event.clientX - orbit.lastX;
      const dy = event.clientY - orbit.lastY;
      orbit.lastX = event.clientX;
      orbit.lastY = event.clientY;

      const yawDelta = dx * YAW_SENSITIVITY;
      const pitchDelta = dy * PITCH_SENSITIVITY;
      orbit.yaw = THREE.MathUtils.clamp(orbit.yaw + yawDelta, -MAX_YAW, MAX_YAW);
      orbit.pitch = THREE.MathUtils.clamp(orbit.pitch + pitchDelta, -MAX_PITCH, MAX_PITCH);
      orbit.velocityYaw = yawDelta;
      orbit.velocityPitch = pitchDelta;
    };

    const endDrag = (event: PointerEvent) => {
      if (!orbit.dragging) return;
      orbit.dragging = false;
      mount.classList.remove('is-dragging');
      try {
        mount.releasePointerCapture?.(event.pointerId);
      } catch {
        // Capture may already be released.
      }
    };

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      const nextPixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();

      // Mobile portrait: bring the singularity into view as a backdrop (center-right).
      // Desktop: keep the right-heavy archive composition.
      if (camera.aspect < 0.7) {
        fieldBaseScale = 0.82;
        fieldBaseX = 0.85;
        fieldBaseY = 0.55;
      } else if (camera.aspect < 1) {
        fieldBaseScale = 0.68;
        fieldBaseX = 1.85;
        fieldBaseY = 0.35;
      } else {
        fieldBaseScale = 0.7;
        fieldBaseX = 4.25;
        fieldBaseY = 0.12;
      }

      field.group.position.set(0, 0, 0);

      renderer.setPixelRatio(nextPixelRatio);
      renderer.setSize(width, height, false);
      field.setPixelRatio(nextPixelRatio);
      stars.setPixelRatio(nextPixelRatio);
    };

    const updateScroll = () => {
      const viewport = Math.max(1, window.innerHeight);
      scrollTarget = Math.min(1, Math.max(0, window.scrollY / (viewport * 2.5)));
    };

    const render = (now: number) => {
      if (!running || !inViewport) return;

      const delta = Math.min(0.034, (now - lastTime) / 1000);
      lastTime = now;
      elapsed += delta;
      scrollProgress += (scrollTarget - scrollProgress) * Math.min(1, delta * 2.4);

      if (!orbit.dragging) {
        orbit.yaw += orbit.velocityYaw;
        orbit.pitch += orbit.velocityPitch;
        orbit.yaw = THREE.MathUtils.clamp(orbit.yaw, -MAX_YAW, MAX_YAW);
        orbit.pitch = THREE.MathUtils.clamp(orbit.pitch, -MAX_PITCH, MAX_PITCH);
        orbit.velocityYaw *= Math.exp(-delta * 3.6);
        orbit.velocityPitch *= Math.exp(-delta * 3.6);

        orbit.yaw += (0 - orbit.yaw) * Math.min(1, delta * 0.42);
        orbit.pitch += (0 - orbit.pitch) * Math.min(1, delta * 0.42);

        if (Math.abs(orbit.velocityYaw) < 0.00003) orbit.velocityYaw = 0;
        if (Math.abs(orbit.velocityPitch) < 0.00003) orbit.velocityPitch = 0;
      }

      pivot.rotation.y = orbit.yaw;
      pivot.rotation.x = orbit.pitch;

      const parallaxEase = 1 - Math.exp(-delta * (isMobile ? 4.8 : 3.2));
      parallax.x += (parallax.targetX - parallax.x) * parallaxEase;
      parallax.y += (parallax.targetY - parallax.y) * parallaxEase;

      const mobileGyroGain = isMobile && gyro.enabled ? 1.28 : 1;
      const starParallaxX = parallax.x * 0.85 * mobileGyroGain;
      const starParallaxY = parallax.y * 0.55 * mobileGyroGain;
      const fieldParallaxX = parallax.x * 0.22 * mobileGyroGain;
      const fieldParallaxY = parallax.y * 0.14 * mobileGyroGain;

      const r = reveal.value;
      const eased = r * r * (3 - 2 * r);

      // Singularity grows out of the void; stars bloom slightly behind it.
      field.group.scale.setScalar(fieldBaseScale * (0.06 + 0.94 * eased));
      stars.group.scale.setScalar(0.55 + 0.45 * eased);
      stars.group.position.x = starParallaxX;
      stars.group.position.y = -starParallaxY;
      stars.group.rotation.y = parallax.x * 0.04 * mobileGyroGain;
      stars.group.rotation.x = -parallax.y * 0.03 * mobileGyroGain;

      pivot.position.set(fieldBaseX + fieldParallaxX, fieldBaseY - fieldParallaxY, 0);

      const cameraEase = 1 - Math.exp(-delta * 1.6);
      const camX = globalDrift.x + parallax.x * 0.08;
      const camY = 0.15 + globalDrift.y - parallax.y * 0.05;
      // Ease camera slightly toward the hole as it forms.
      camera.position.x += (camX + (1 - eased) * 0.35 - camera.position.x) * cameraEase;
      camera.position.y += (camY - camera.position.y) * cameraEase;
      camera.position.z = 12.2 - eased * 0.35;

      stars.update(elapsed);
      field.setDensity(scrollProgress);
      field.update(delta, elapsed, 0.55 + scrollProgress * 0.06 + eased * 0.45);
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };

    const start = () => {
      if (running && frame) return;
      running = true;
      lastTime = performance.now();
      frame = window.requestAnimationFrame(render);
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        globalTimeline.pause();
        stop();
      } else if (inViewport && !reduceMotion) {
        globalTimeline.resume();
        start();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
        if (inViewport && !document.hidden && !reduceMotion) {
          globalTimeline.resume();
          start();
        } else {
          globalTimeline.pause();
          stop();
        }
      },
      { rootMargin: '80px' }
    );

    resize();
    updateScroll();
    observer.observe(mount);
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', updateScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('v2-cosmos-reveal', onCosmosReveal);
    mount.addEventListener('pointerdown', onPointerDown);
    if (isMobile && !reduceMotion) {
      // iOS requires a user gesture for motion permission; any first tap/scroll start works.
      window.addEventListener('touchstart', onFirstGestureForGyro, { passive: true });
      window.addEventListener('pointerdown', onFirstGestureForGyro, { passive: true });
      // Android / browsers without a permission gate can start immediately.
      const Orientation = window.DeviceOrientationEvent as
        | (typeof DeviceOrientationEvent & {
            requestPermission?: () => Promise<string>;
          })
        | undefined;
      if (Orientation && typeof Orientation.requestPermission !== 'function') {
        void enableGyro();
      }
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    if (reduceMotion) {
      stars.update(0);
      field.update(0, 0, 1);
      renderer.render(scene, camera);
      stop();
    } else {
      frame = window.requestAnimationFrame(render);
    }

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', updateScroll);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('v2-cosmos-reveal', onCosmosReveal);
      mount.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('touchstart', onFirstGestureForGyro);
      window.removeEventListener('pointerdown', onFirstGestureForGyro);
      stopGyroListener();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
      window.clearTimeout(revealFallback);
      revealTween.kill();
      globalTimeline.kill();
      stars.dispose();
      field.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [mountRef]);
}
