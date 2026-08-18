export const CTA_PAD = 'px-5 py-3';

const styles = {
  hero: {
    primary:
      'bg-white text-black hover:bg-white/90 focus-visible:outline-white',
    secondary:
      'border border-white/30 text-white hover:bg-white/10 focus-visible:outline-white'
  },
  surface: {
    primary:
      'bg-text-primary text-bg-primary hover:opacity-90 focus-visible:outline-text-primary',
    secondary:
      'border border-border-subtle text-text-primary hover:bg-text-primary hover:text-bg-primary focus-visible:outline-text-primary'
  },
  inverse: {
    primary:
      'bg-white text-accent-blue hover:bg-white/90 focus-visible:outline-white',
    secondary:
      'border border-white text-white hover:bg-white hover:text-accent-blue focus-visible:outline-white'
  }
} as const;

export type CtaVariant = keyof typeof styles;

export function ctaClass(variant: CtaVariant, role: 'primary' | 'secondary') {
  return `${CTA_PAD} ${styles[variant][role]}`;
}

export const ctaBase =
  'archive-label inline-flex items-center justify-start transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';
