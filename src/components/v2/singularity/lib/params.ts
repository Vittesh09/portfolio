export type SingularityParams = {
  bloomStrength: number;
  bloomRadius: number;
  bloomThreshold: number;
  diskDensity: number;
  flowSpeed: number;
  noiseScale: number;
  lensingStrength: number;
  lensingRadius: number;
  chromaticAberration: number;
  exposure: number;
  fogDensity: number;
  timeScale: number;
  diskSpin: number;
  diskTiltDeg: number;
  diskBankDeg: number;
  colorHot: string;
  colorMid: string;
  colorAccent: string;
  colorEmber: string;
  colorOuter: string;
  background: string;
  /** Lab only — 1 or 2 singularities that mutually lens. */
  holeCount: 1 | 2;
};

/** Defaults match the homepage hero look. */
export const DEFAULT_SINGULARITY_PARAMS: SingularityParams = {
  bloomStrength: 0.8,
  bloomRadius: 0.7,
  bloomThreshold: 0.8,
  diskDensity: 1.3,
  flowSpeed: 0.1,
  noiseScale: 2.5,
  lensingStrength: 0.12,
  lensingRadius: 0.34,
  chromaticAberration: 0.0015,
  exposure: 1.2,
  fogDensity: 0.025,
  timeScale: 0.45,
  diskSpin: 0.0045,
  diskTiltDeg: -70,
  diskBankDeg: -18,
  colorHot: '#fff6ee',
  colorMid: '#ff5a3a',
  colorAccent: '#f23828',
  colorEmber: '#7a2218',
  colorOuter: '#1a0a08',
  background: '#000002',
  holeCount: 1
};

export type SingularityMode = 'hero' | 'lab';

export type BlackHoleOptions = {
  mode?: SingularityMode;
  /** Live lab controls — read each frame when mode is `lab`. */
  paramsRef?: { current: SingularityParams };
};
