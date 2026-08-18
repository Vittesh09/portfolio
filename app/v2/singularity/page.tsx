import { SingularityLabExperience } from '@/src/components/v2/singularity/SingularityLabExperience';

export const metadata = {
  title: 'Singularity lab · Vittesh Sinha',
  description:
    'Interactive singularity playground — tune bloom, accretion disk shaders, lensing, and color live.',
  robots: { index: false, follow: false }
};

export default function V2SingularityPage() {
  return <SingularityLabExperience />;
}
