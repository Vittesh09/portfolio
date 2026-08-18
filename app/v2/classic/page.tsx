import { LandingExperience } from '@/src/components/v2/archive/LandingExperience';

export const metadata = {
  title: 'Classic landing · V2 Lab',
  description:
    'Archived v2 orbit / particle black-hole landing. Kept for experiments and reference.',
  robots: { index: false, follow: false }
};

/** Previous v2 homepage (orbit BH) — preserved for future use. */
export default function V2ClassicLandingPage() {
  return <LandingExperience />;
}
