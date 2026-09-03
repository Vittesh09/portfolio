'use client';

import { usePathname } from 'next/navigation';
import { ArchiveHeader } from '@/src/components/v2/archive/ArchiveHeader';
import { ArchiveFooter } from '@/src/components/v2/archive/ArchiveFooter';
import { KissModeProvider } from '@/src/components/v2/layout/KissModeProvider';
import { ThemeProvider } from '@/src/components/v2/layout/ThemeProvider';
import { ExperienceMotion } from '@/src/components/v2/motion/ExperienceMotion';
import { useScrollToHashOnMount } from '@/src/components/v2/ui/HashNavLink';

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
      {isMachine ? (
        <>
          <SkipLink />
          <main id="v2-main">{children}</main>
        </>
      ) : isSingularityLab ? (
        <KissModeProvider>
          <div className="min-h-screen bg-black text-[#f2efe6]">
            <SkipLink />
            <ArchiveHeader />
            <main id="v2-main">{children}</main>
          </div>
        </KissModeProvider>
      ) : (
        <KissModeProvider>
          <div className="min-h-screen">
            <SkipLink />
            <ExperienceMotion />
            <ArchiveHeader />
            <main id="v2-main">{children}</main>
            <ArchiveFooter />
          </div>
        </KissModeProvider>
      )}
    </ThemeProvider>
  );
}
