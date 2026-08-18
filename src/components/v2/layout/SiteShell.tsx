'use client';

import { usePathname } from 'next/navigation';
import { ArchiveHeader } from '@/src/components/v2/archive/ArchiveHeader';
import { ArchiveFooter } from '@/src/components/v2/archive/ArchiveFooter';
import { KissModeProvider } from '@/src/components/v2/layout/KissModeProvider';
import { ThemeProvider } from '@/src/components/v2/layout/ThemeProvider';
import { ExperienceMotion } from '@/src/components/v2/motion/ExperienceMotion';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMachine = pathname?.includes('/machine') ?? false;
  const isSingularityLab = pathname?.includes('/singularity') ?? false;

  return (
    <ThemeProvider>
      {isMachine ? (
        <main>{children}</main>
      ) : isSingularityLab ? (
        <KissModeProvider>
          <div className="min-h-screen bg-black text-[#f2efe6]">
            <ArchiveHeader />
            <main>{children}</main>
          </div>
        </KissModeProvider>
      ) : (
        <KissModeProvider>
          <div className="min-h-screen">
            <ExperienceMotion />
            <ArchiveHeader />
            <main>{children}</main>
            <ArchiveFooter />
          </div>
        </KissModeProvider>
      )}
    </ThemeProvider>
  );
}
