import * as THREE from 'three';
import { COLORS } from './constants';

export type StarFieldData = {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
};

const PALETTE = [
  new THREE.Color(COLORS.starWarm),
  new THREE.Color(COLORS.starCool),
  new THREE.Color(0xffffff)
];

/**
 * Random points on a shell around the camera. A regular lattice reads as rows
 * and shimmers like moiré once the sky turns, so placement stays random.
 * Sizes follow a steep curve: mostly faint points, a few brighter ones.
 */
export function buildStarField(count: number, radius = 2000): StarFieldData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const color = new THREE.Color();

  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3;
    const z = Math.random() * 2 - 1;
    const theta = Math.random() * Math.PI * 2;
    const ring = Math.sqrt(1 - z * z);
    const distance = radius * (0.55 + Math.random() * 0.45);
    positions[i3] = distance * ring * Math.cos(theta);
    positions[i3 + 1] = distance * ring * Math.sin(theta);
    positions[i3 + 2] = distance * z;

    // Like a real sky: nearly all stars sit at the edge of visibility,
    // only a rare few read as bright.
    const weight = Math.pow(Math.random(), 6);
    color.copy(PALETTE[Math.floor(Math.random() * PALETTE.length)]);
    color.multiplyScalar(0.1 + weight * 0.55);
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
    sizes[i] = 2 + weight * 7;
  }

  return { positions, colors, sizes };
}
