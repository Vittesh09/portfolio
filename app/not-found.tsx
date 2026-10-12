import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import { NotFoundExperience } from '@/src/components/v2/archive/NotFoundExperience';
import '@/src/styles/v2.css';
import '@/src/styles/singularity.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jakarta',
  display: 'swap'
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-jetbrains',
  display: 'swap'
});

export const metadata = {
  title: '404 — Page not found'
};

export default function NotFound() {
  return (
    <div className={`${jakarta.variable} ${jetbrains.variable} ${jakarta.className}`}>
      <NotFoundExperience />
    </div>
  );
}
