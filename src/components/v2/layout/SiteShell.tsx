'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { KissModeProvider } from '@/src/components/v2/layout/KissModeProvider';
import { ThemeProvider } from '@/src/components/v2/layout/ThemeProvider';
import { HorizonTransition } from '@/src/components/v2/motion/HorizonTransition';
import { useScrollToHashOnMount } from '@/src/components/v2/ui/HashNavLink';

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
