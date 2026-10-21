'use client';

import dynamic from 'next/dynamic';
import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import { KissModeProvider } from '@/src/components/v2/layout/KissModeProvider';
import { ThemeProvider } from '@/src/components/v2/layout/ThemeProvider';
import { HorizonTransition } from '@/src/components/v2/motion/HorizonTransition';
import { useScrollToHashOnMount } from '@/src/components/v2/ui/HashNavLink';

const FOOTER_LANDSCAPE_DARK = '/assets/images/footer-landscape.jpg';
const FOOTER_LANDSCAPE_LIGHT = '/assets/images/footer-landscape-light.jpg';

function revealV2Root() {
  document.querySelector('.v2-root')?.classList.remove('v2-media-pending');
}

function preloadFooterLandscape() {
  return new Promise<void>((resolve) => {
    const root = document.querySelector('.v2-root');
    const src = root?.classList.contains('dark') ? FOOTER_LANDSCAPE_DARK : FOOTER_LANDSCAPE_LIGHT;
    const img = new Image();
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    img.onload = () => {
      if (typeof img.decode === 'function') {
        void img.decode().then(finish).catch(finish);
        return;
      }
      finish();
    };
    img.onerror = finish;
    img.src = src;
    if (img.complete && img.naturalWidth > 0) {
      if (typeof img.decode === 'function') {
        void img.decode().then(finish).catch(finish);
      } else {
        finish();
      }
    }
  });
}

const ArchiveHeader = dynamic(
  () => import('@/src/components/v2/archive/ArchiveHeader').then((mod) => mod.ArchiveHeader),
  { ssr: true }
);
const ArchiveFooter = dynamic(
  () => import('@/src/components/v2/archive/ArchiveFooter').then((mod) => mod.ArchiveFooter),
  { ssr: true }
);
const ExperienceMotion = dynamic(
  () => import('@/src/components/v2/motion/ExperienceMotion').then((mod) => mod.ExperienceMotion),
  { ssr: false }
);
const BackgroundMusic = dynamic(
  () => import('@/src/components/v2/ui/BackgroundMusic').then((mod) => mod.BackgroundMusic),
  { ssr: false }
);
const ButtonHoverSound = dynamic(
  () => import('@/src/components/v2/ui/ButtonHoverSound').then((mod) => mod.ButtonHoverSound),
  { ssr: false }
);
const MenuClickSound = dynamic(
  () => import('@/src/components/v2/ui/MenuClickSound').then((mod) => mod.MenuClickSound),
  { ssr: false }
);

function SkipLink() {
  return (
    <a href="#v2-main" className="v2-skip-link">
      Skip to content
    </a>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMachine = pathname?.includes('/machine') ?? false;
  const isSingularityLab = pathname?.includes('/singularity') ?? false;
  useScrollToHashOnMount();

  useLayoutEffect(() => {
    if (isMachine || isSingularityLab) {
      revealV2Root();
      return;
    }
    let cancelled = false;
    const failSafe = window.setTimeout(() => {
      if (!cancelled) revealV2Root();
    }, 4000);
    void preloadFooterLandscape().then(() => {
      if (!cancelled) revealV2Root();
    });
    return () => {
      cancelled = true;
      window.clearTimeout(failSafe);
    };
  }, [isMachine, isSingularityLab]);

  return (
    <ThemeProvider>
      {isMachine ? null : (
        <>
          <MenuClickSound />
          <ButtonHoverSound />
          <BackgroundMusic />
        </>
      )}
      <HorizonTransition>
        {isMachine ? (
          <>
            <SkipLink />
            <main id="v2-main" tabIndex={-1}>
              {children}
            </main>
          </>
        ) : isSingularityLab ? (
          <KissModeProvider>
            <div className="min-h-svh bg-black text-[#f2efe6]">
              <SkipLink />
              <ArchiveHeader />
              <main id="v2-main" tabIndex={-1}>
                {children}
              </main>
            </div>
          </KissModeProvider>
        ) : (
          <KissModeProvider>
            <div className="min-h-svh">
              <SkipLink />
              <ExperienceMotion />
              <ArchiveHeader />
              <main id="v2-main" tabIndex={-1}>
                {children}
              </main>
              <ArchiveFooter />
            </div>
          </KissModeProvider>
        )}
      </HorizonTransition>
    </ThemeProvider>
  );
}
