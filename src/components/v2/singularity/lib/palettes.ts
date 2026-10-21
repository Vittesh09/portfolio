import type { SingularityParams } from './params';

export type SingularityPalette = Pick<
  SingularityParams,
  'colorHot' | 'colorMid' | 'colorAccent' | 'colorEmber' | 'colorOuter'
>;

export const SINGULARITY_COLOR_SETS: SingularityPalette[] = [
  {
    colorHot: '#fff6ee',
    colorMid: '#ff5a3a',
    colorAccent: '#f23828',
    colorEmber: '#7a2218',
    colorOuter: '#1a0a08'
  },
  {
    colorHot: '#eef6ff',
    colorMid: '#4aa3ff',
    colorAccent: '#1d4ed8',
    colorEmber: '#16356b',
    colorOuter: '#070c18'
  },
  {
    colorHot: '#fff8e6',
    colorMid: '#ffc14a',
    colorAccent: '#f59e0b',
    colorEmber: '#6b3e0a',
    colorOuter: '#1a1206'
  },
  {
    colorHot: '#f7eeff',
    colorMid: '#c084fc',
    colorAccent: '#7c3aed',
    colorEmber: '#3b1764',
    colorOuter: '#100818'
  },
  {
    colorHot: '#eefff6',
    colorMid: '#34d399',
    colorAccent: '#059669',
    colorEmber: '#0d4a32',
    colorOuter: '#07140e'
  }
];
