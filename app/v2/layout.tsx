import {
  Bricolage_Grotesque,
  Instrument_Serif,
  JetBrains_Mono,
  Plus_Jakarta_Sans
} from 'next/font/google';
import { SiteShell } from '@/src/components/v2/layout/SiteShell';
import { getHomeJsonLd } from '@/src/config/v2/agentDocuments';
import { metaDescription } from '@/src/config/v2/profile';
import { v2DefaultTitle, v2PageMetadata, v2Robots } from '@/src/config/v2/seo';
import '@/src/styles/v2.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-jakarta',
  display: 'swap'
});

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap'
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-jetbrains',
  display: 'swap'
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-bricolage',
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
(function(){try{var t=localStorage.getItem('v2-appearance');var r=document.currentScript&&document.currentScript.parentElement;if(!r||!r.classList.contains('v2-root'))r=document.querySelector('.v2-root');if(!r)return;r.classList.remove('light');var dark=t==='dark'?true:t==='light'?false:window.matchMedia('(prefers-color-scheme: dark)').matches;if(dark)r.classList.add('dark');else r.classList.remove('dark');}catch(e){}})();
`;

const audioBoot = `
(function(){
  try {
    var a = document.getElementById('v2-site-audio');
    if (!a) {
      a = document.createElement('audio');
      a.id = 'v2-site-audio';
      a.className = 'v2-site-audio';
      a.src = '/assets/event-horizon.mp3';
      a.loop = true;
      a.preload = 'auto';
      a.autoplay = true;
      document.body.appendChild(a);
    }
    var study = /\\/v2\\/work\\/[^/?#]+/.test(location.pathname);
    try { a.volume = study ? 0 : 0.1; } catch (e) {}
    var start = function() {
      if (!a.paused) return;
      var pending = a.play();
      if (pending && pending.catch) pending.catch(function(){});
    };
    if (!a.dataset.booted) {
      a.dataset.booted = '1';
      a.addEventListener('canplay', start);
    }
    start();
  } catch (e) {}
})();
`;

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`v2-root ${jakarta.variable} ${instrument.variable} ${jetbrains.variable} ${bricolage.variable} ${jakarta.className}`}
      lang="en"
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      <script dangerouslySetInnerHTML={{ __html: audioBoot }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getHomeJsonLd()).replace(/</g, '\\u003c')
        }}
      />
      <SiteShell>{children}</SiteShell>
    </div>
  );
}
