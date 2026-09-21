import {
  Instrument_Serif,
  JetBrains_Mono,
  Plus_Jakarta_Sans
} from 'next/font/google';
import { SiteShell } from '@/src/components/v2/layout/SiteShell';
import { metaDescription } from '@/src/config/v2/profile';
import { v2DefaultTitle, v2PageMetadata, v2Robots } from '@/src/config/v2/seo';
import '@/src/styles/v2.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jakarta',
  display: 'swap'
});

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-instrument',
  display: 'swap'
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-jetbrains',
  display: 'swap'
});

export const metadata = {
  ...v2PageMetadata({
    title: v2DefaultTitle,
    description: metaDescription,
    path: '/'
  }),
  robots: v2Robots()
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
};

const themeInit = `
(function(){try{var t=localStorage.getItem('v2-theme');var r=document.currentScript&&document.currentScript.parentElement;if(!r||!r.classList.contains('v2-root'))r=document.querySelector('.v2-root');if(r){r.classList.remove('light');var dark=t==='dark'||((t!=='light')&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(dark)r.classList.add('dark');else r.classList.remove('dark');}}catch(e){}})();
`;

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`v2-root ${jakarta.variable} ${instrument.variable} ${jetbrains.variable} ${jakarta.className}`}
      lang="en"
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      <SiteShell>{children}</SiteShell>
    </div>
  );
}
