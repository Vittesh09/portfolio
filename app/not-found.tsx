import { Geist, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { NotFoundExperience } from '@/src/components/v2/archive/NotFoundExperience';
import '@/src/styles/v2.css';
import '@/src/styles/singularity.css';

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-geist',
  display: 'swap'
});

const space = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space',
  display: 'swap'
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-jetbrains',
  display: 'swap'
});

export const metadata = {
  title: '404: Page not found'
};

export default function NotFound() {
  return (
    <div className={`v2-root ${geist.variable} ${space.variable} ${jetbrains.variable} ${geist.className}`}>
      <NotFoundExperience />
    </div>
  );
}
