import * as THREE from 'three';
import {
  GPUComputationRenderer,
  type Variable
} from 'three/addons/misc/GPUComputationRenderer.js';
import { BLACK_HOLE_RADIUS, OUTER_RADIUS } from './Physics';
import {
  ARM_COUNT,
  particleFragmentShader,
  particleVertexShader,
  positionComputeShader,
  velocityComputeShader
} from './Shaders';

const GRAVITATIONAL_MASS = 0.042;
const MAX_GRAVITY = 0.18;
const MAX_SPEED = 0.38;
/** Soft start of spiral silhouette (offset from horizon). */
const ARM_BLEND_START = 1.85;
/** Fully formed arms by this offset from horizon. */
const ARM_BLEND_END = 6.2;

function hash2(a: number, b: number) {
  const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function armBaseAngle(arm: number) {
  const equal = arm * ((Math.PI * 2) / ARM_COUNT);
  const drift = (hash2(arm + 0.37, 17.3) - 0.5) * 0.22;
  return equal + drift;
}

function armTwistRate(arm: number) {
  return 1.42 + hash2(arm + 0.11, 4.2) * 0.26;
}

function armWidthScale(arm: number) {
  return 0.88 + hash2(arm + 0.55, 9.1) * 0.3;
}

function spiralTargetAngle(radius: number, arm: number, seed: number) {
  const twist = Math.log(Math.max(radius, 0.35)) * armTwistRate(arm);
  const span = Math.min(1, Math.max(0, (radius - 0.8) / 8));
  const wiggle =
    Math.sin(twist * 2.4 + arm * 1.7 + seed * 4) * (0.02 + span * 0.1) +
    Math.sin(twist * 5.1 + seed * 9) * (0.01 + span * 0.04);
  return armBaseAngle(arm) + twist + wiggle;
}

export class SingularityField {
  readonly group = new THREE.Group();
  readonly material: THREE.ShaderMaterial;

  private readonly count: number;
  private readonly geometry: THREE.BufferGeometry;
  private readonly gpuCompute: GPUComputationRenderer;
  private readonly positionVariable: Variable;
  private readonly velocityVariable: Variable;

  constructor(requestedCount: number, pixelRatio: number, renderer: THREE.WebGLRenderer) {
    const textureSize = Math.ceil(Math.sqrt(requestedCount));
    this.count = textureSize * textureSize;
    this.gpuCompute = new GPUComputationRenderer(textureSize, textureSize, renderer);

    const initialPosition = this.gpuCompute.createTexture();
    const initialVelocity = this.gpuCompute.createTexture();
    const positionData = initialPosition.image.data as Float32Array;
    const velocityData = initialVelocity.image.data as Float32Array;

    for (let index = 0; index < this.count; index += 1) {
      this.seed(index, positionData, velocityData);
    }

    this.positionVariable = this.gpuCompute.addVariable(
      'texturePosition',
      positionComputeShader,
      initialPosition
    );
    this.velocityVariable = this.gpuCompute.addVariable(
      'textureVelocity',
      velocityComputeShader,
      initialVelocity
    );
    this.gpuCompute.setVariableDependencies(this.positionVariable, [
      this.positionVariable,
      this.velocityVariable
    ]);
    this.gpuCompute.setVariableDependencies(this.velocityVariable, [
      this.positionVariable,
      this.velocityVariable
    ]);

    const positionUniforms = this.positionVariable.material.uniforms;
    positionUniforms.uDelta = { value: 0 };
    positionUniforms.uTime = { value: 0 };
    positionUniforms.uHorizon = { value: BLACK_HOLE_RADIUS };
    positionUniforms.uOuterRadius = { value: OUTER_RADIUS };

    const velocityUniforms = this.velocityVariable.material.uniforms;
    velocityUniforms.uDelta = { value: 0 };
    velocityUniforms.uTime = { value: 0 };
    velocityUniforms.uHorizon = { value: BLACK_HOLE_RADIUS };
    velocityUniforms.uOuterRadius = { value: OUTER_RADIUS };

    const computeError = this.gpuCompute.init();
    if (computeError) throw new Error(computeError);

    const references = new Float32Array(this.count * 2);
    const sizes = new Float32Array(this.count);
    const seeds = new Float32Array(this.count);

    for (let index = 0; index < this.count; index += 1) {
      const column = index % textureSize;
      const row = Math.floor(index / textureSize);
      references[index * 2] = (column + 0.5) / textureSize;
      references[index * 2 + 1] = (row + 0.5) / textureSize;
      // Larger soft points near the void come from the shader; base stays modest.
      sizes[index] = 1.2 + Math.random() * 2.1;
      seeds[index] = velocityData[index * 4 + 3];
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(this.count * 3), 3)
    );
    this.geometry.setAttribute('aReference', new THREE.BufferAttribute(references, 2));
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    this.geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    this.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);

    this.material = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uPositionTexture: {
          value: this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture
        },
        uVelocityTexture: {
          value: this.gpuCompute.getCurrentRenderTarget(this.velocityVariable).texture
        },
        uTime: { value: 0 },
        uPixelRatio: { value: pixelRatio },
        uHorizon: { value: BLACK_HOLE_RADIUS },
        uOuterRadius: { value: OUTER_RADIUS }
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(this.geometry, this.material);
    points.frustumCulled = false;
    this.group.add(points);

    // Dark void only; accretion glow comes from near-horizon particles.
    const horizon = new THREE.Mesh(
      new THREE.SphereGeometry(BLACK_HOLE_RADIUS * 0.98, 72, 56),
      new THREE.MeshBasicMaterial({
        color: 0x050504,
        depthWrite: true
      })
    );
    horizon.renderOrder = 2;
    this.group.add(horizon);

    // Default disk tip: 67°.
    this.group.rotation.x = -THREE.MathUtils.degToRad(67);
    this.group.rotation.z = 0;
  }

  update(delta: number, elapsed: number, speedBoost = 1) {
    const dt = Math.min(delta, 0.034) * speedBoost;

    const positionUniforms = this.positionVariable.material.uniforms;
    positionUniforms.uDelta.value = dt;
    positionUniforms.uTime.value = elapsed;

    const velocityUniforms = this.velocityVariable.material.uniforms;
    velocityUniforms.uDelta.value = dt;
    velocityUniforms.uTime.value = elapsed;

    this.gpuCompute.compute();
    this.material.uniforms.uPositionTexture.value =
      this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture;
    this.material.uniforms.uVelocityTexture.value =
      this.gpuCompute.getCurrentRenderTarget(this.velocityVariable).texture;
    this.material.uniforms.uTime.value = elapsed;
  }

  setPixelRatio(pixelRatio: number) {
    this.material.uniforms.uPixelRatio.value = pixelRatio;
  }

  setDensity(progress: number) {
    const density = 0.94 + Math.min(1, Math.max(0, progress)) * 0.06;
    this.geometry.setDrawRange(0, Math.floor(this.count * density));
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
    this.gpuCompute.dispose();
    this.group.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.geometry.dispose();
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => material.dispose());
      } else {
        object.material.dispose();
      }
    });
  }

  private seed(index: number, positions: Float32Array, velocities: Float32Array) {
    const particleSeed = Math.random();
    const arm = Math.floor(particleSeed * ARM_COUNT);
    const radius =
      BLACK_HOLE_RADIUS +
      0.12 +
      Math.pow(Math.random(), 4.6) * (OUTER_RADIUS - BLACK_HOLE_RADIUS - 0.12);

    const span = (radius - BLACK_HOLE_RADIUS) / (OUTER_RADIUS - BLACK_HOLE_RADIUS);
    const blendStart = BLACK_HOLE_RADIUS + ARM_BLEND_START;
    const blendEnd = BLACK_HOLE_RADIUS + ARM_BLEND_END;
    const armBlend = Math.min(
      1,
      Math.max(0, (radius - blendStart) / Math.max(0.001, blendEnd - blendStart))
    );
    const armBlendSmooth = armBlend * armBlend * (3 - 2 * armBlend);
    const freeAngle = Math.random() * Math.PI * 2;
    const width = (0.06 + Math.pow(span, 1.25) * 0.32) * armWidthScale(arm);
    const target = spiralTargetAngle(radius, arm, particleSeed);
    const armAngle = target + (Math.random() - 0.5) * width;
    const angle = freeAngle * (1 - armBlendSmooth) + armAngle * armBlendSmooth;

    const gap = Math.max(0.22, radius - BLACK_HOLE_RADIUS);
    const gravity = Math.min(MAX_GRAVITY, GRAVITATIONAL_MASS / (gap * gap));
    const speed = Math.min(MAX_SPEED, Math.sqrt(gravity * radius)) * (0.92 + Math.random() * 0.12);
    const radialDrift = (Math.random() - 0.7) * 0.003;
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    const offset = index * 4;
    const thickness = 0.028 + Math.pow(Math.random(), 2) * Math.min(0.16, 0.018 + radius * 0.014);

    positions[offset] = cosine * radius;
    positions[offset + 1] = sine * radius;
    positions[offset + 2] = (Math.random() - 0.5) * thickness;
    positions[offset + 3] = 1.0;
    velocities[offset] = -sine * speed + cosine * radialDrift;
    velocities[offset + 1] = cosine * speed + sine * radialDrift;
    velocities[offset + 2] = (Math.random() - 0.5) * 0.0012;
    velocities[offset + 3] = particleSeed;
  }
}
