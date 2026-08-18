import * as THREE from 'three';
import { starFragmentShader, starVertexShader } from './Shaders';

export class StarField {
  readonly group = new THREE.Group();
  readonly points: THREE.Points;
  readonly material: THREE.ShaderMaterial;

  private readonly geometry: THREE.BufferGeometry;

  constructor(count: number, pixelRatio: number) {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const seeds = new Float32Array(count);
    const tones = new Float32Array(count);
    const depths = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
      // Screen-filling depth layers so stars read across the full landing.
      const depth = Math.random();
      const z = -6 - depth * 36;
      const spread = 10 + depth * 42;
      const x = (Math.random() - 0.5) * spread * 2.4;
      const y = (Math.random() - 0.5) * spread * 1.45;

      positions[index * 3] = x;
      positions[index * 3 + 1] = y;
      positions[index * 3 + 2] = z;
      sizes[index] = 0.7 + Math.random() * 2.1 + (1 - depth) * 0.35;
      seeds[index] = Math.random();
      tones[index] = 0.78 + Math.random() * 0.22;
      depths[index] = depth;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    this.geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    this.geometry.setAttribute('aTone', new THREE.BufferAttribute(tones, 1));
    this.geometry.setAttribute('aDepth', new THREE.BufferAttribute(depths, 1));
    this.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, -20), 55);

    this.material = new THREE.ShaderMaterial({
      vertexShader: starVertexShader,
      fragmentShader: starFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: pixelRatio }
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.points.frustumCulled = false;
    this.points.renderOrder = -1;
    this.group.add(this.points);
  }

  update(elapsed: number) {
    this.material.uniforms.uTime.value = elapsed;
  }

  setPixelRatio(pixelRatio: number) {
    this.material.uniforms.uPixelRatio.value = pixelRatio;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
