import type { SingularityParams } from './params';

export type SingularityPalette = Pick<
  SingularityParams,
  'colorHot' | 'colorMid' | 'colorAccent' | 'colorEmber' | 'colorOuter'
>;

/** Site chrome accent — never follow the disk palette. */
const SITE_ACCENT_LIGHT = '#f23828';
const SITE_ACCENT_DARK = '#ff5447';

export function singularityUiAccent(_palette: SingularityPalette, dark: boolean) {
  return dark ? SITE_ACCENT_DARK : SITE_ACCENT_LIGHT;
}

/** Keep UI on brand orange; disk clicks must not recolor the site. */
export function applySingularityAccent(
  _index: number,
  dark: boolean,
  root: Element | null = document.querySelector('.v2-root')
) {
  if (!root || !(root instanceof HTMLElement)) return;
  const accent = dark ? SITE_ACCENT_DARK : SITE_ACCENT_LIGHT;
  root.style.setProperty('--v2-accent-pop', accent);
  root.style.setProperty('--v2-accent-blue', accent);
}

/**
 * Three disk schemes — primary hue ladder + muted complement ember (same recipe as ice).
 * Site accent stays brand orange separately.
 */
export const SINGULARITY_COLOR_SETS: SingularityPalette[] = [
  {
    // Ice — silver-blue + copper
    colorHot: '#c5d4e8',
    colorMid: '#6f98c0',
    colorAccent: '#4a7aab',
    colorEmber: '#b8895c',
    colorOuter: '#080e18'
  },
  {
    // Ember — soft peach / terracotta + cool steel (not neon red)
    colorHot: '#ffe4d4',
    colorMid: '#d4785c',
    colorAccent: '#b84a38',
    colorEmber: '#6a8294',
    colorOuter: '#120805'
  },
  {
    // Sol — cream / ochre + muted violet-slate
    colorHot: '#fff1d2',
    colorMid: '#d4a04a',
    colorAccent: '#b07828',
    colorEmber: '#6e7390',
    colorOuter: '#100c06'
  }
];
