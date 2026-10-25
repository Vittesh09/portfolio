'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BlackHoleLazy } from '@/src/components/v2/singularity/BlackHoleLazy';
import { useSingularityColorClick } from '@/src/components/v2/singularity/hooks/useSingularityColorClick';
import { SINGULARITY_COLOR_SETS } from '@/src/components/v2/singularity/lib/palettes';
import {
  DEFAULT_SINGULARITY_PARAMS,
  type SingularityParams
} from '@/src/components/v2/singularity/lib/params';
import { useKissMode } from '@/src/components/v2/layout/KissModeProvider';
import { ContactPanel } from '@/src/components/v2/ui/ContactPanel';
import { CopyEmail } from '@/src/components/v2/ui/CopyEmail';
import { ResumeDownload } from '@/src/components/v2/ui/ResumeDownload';
import { useMobileLanding } from '@/src/components/v2/ui/useMobileLanding';
import { HeroCloser, HeroIdentityMark, HeroKicker } from '@/src/components/v2/archive/HeroIntroCopy';
import { HeroPortrait } from '@/src/components/v2/archive/HeroPortrait';
import { HeroMeta } from '@/src/components/v2/archive/HeroMeta';
import { ProjectCard } from '@/src/components/v2/archive/ProjectCard';
import { type ProjectCardData } from '@/src/config/v2/caseStudies';
import { heroCloser, v2Path } from '@/src/config/v2/profile';
import { siteConfig } from '@/src/config/v2/site';

const LandingExperienceKiss = dynamic(
  () =>
    import('@/src/components/v2/archive/LandingExperienceKiss').then((mod) => ({
      default: mod.LandingExperienceKiss
    })),
  { ssr: false }
);

function Label({ children }: { children: React.ReactNode }) {
  return <p className="archive-label text-text-muted">{children}</p>;
}

export function LandingExperienceSingularity({ cards }: { cards: ProjectCardData[] }) {
  const heroRef = useRef<HTMLElement>(null);
  const paramsRef = useRef<SingularityParams>({
    ...DEFAULT_SINGULARITY_PARAMS,
    ...SINGULARITY_COLOR_SETS[0]
  });
  const isMobileMedia = useMobileLanding();
  const { kissMode, hydrated } = useKissMode();
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    setClientReady(true);
    if (
      !window.matchMedia('(max-width: 768px)').matches &&
      !window.matchMedia('(pointer: coarse)').matches
    ) {
      void import('@/src/components/v2/singularity/BlackHole');
    }
  }, []);

  // Mobile always uses Kiss; desktop SM toggles Kiss via KissModeProvider.
  const isMobile = clientReady && isMobileMedia;
  const useKiss = isMobile || (hydrated && kissMode);
  const onHeroClick = useSingularityColorClick(heroRef, paramsRef, 0, !useKiss);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero || useKiss) return;
    hero.classList.add('is-copy-in');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hero.classList.add('is-intro-done');
    }
  }, [useKiss]);

  if (useKiss) return <LandingExperienceKiss cards={cards} />;

  return (
    <>
      <section
        ref={heroRef}
        className="bh-hero is-intro border-b border-white/10"
        aria-label="Drag the singularity to move it, drag around it to orbit, or click it to change its color."
        onClick={onHeroClick}
      >
        {clientReady ? <BlackHoleLazy heroRef={heroRef} paramsRef={paramsRef} /> : null}

        <div className="relative z-10 mx-auto flex max-w-[1600px] flex-col px-4 md:min-h-[100svh] md:px-8 md:py-8">
          <div className="archive-hero relative flex min-h-[100svh] flex-1 flex-col justify-center py-10 md:min-h-0 md:py-6">
            <div className="bh-copy-col relative z-10">
              <h1 className="bh-sr-only">
                {siteConfig.name}, {siteConfig.role}
              </h1>
              <p className="bh-sr-only">{heroCloser}</p>
              <div className="bh-copy bh-copy-source" data-bh-warp aria-hidden="true">
                <HeroPortrait className="mb-5" />
                <HeroKicker />
                <p className="v2-kiss-wordmark archive-display">
                  <HeroIdentityMark />
                </p>
                <HeroCloser />
              </div>
              <div
                className="bh-intro-fade bh-cta mt-8 flex max-w-xl flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-10"
                style={{ transitionDelay: '0.24s' }}
              >
                <CopyEmail variant="hero" className="sm:min-w-[min(100%,20rem)] sm:flex-1" />
                <ResumeDownload variant="hero" className="sm:w-auto" />
              </div>
            </div>
          </div>

          <div
            className="bh-intro-fade v2-hero-meta grid gap-5 border-t border-white/15 px-0 py-6 md:grid-cols-12 md:pb-0 md:pt-5"
            style={{ transitionDelay: '0.32s' }}
          >
            <HeroMeta />
          </div>
        </div>
      </section>

      <section
        id="work"
        className="scroll-mt-16 border-b border-border-subtle"
        aria-labelledby="work-heading"
      >
        <div className="mx-auto max-w-[1600px] px-4 pb-16 pt-16 md:min-h-[100svh] md:px-8 md:pb-24">
          <div className="grid gap-x-8 gap-y-20 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="archive-section-kicker archive-label text-text-muted">Case studies</p>
              <h2 id="work-heading" className="archive-display archive-section-title">
                Selected work.
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-text-secondary md:col-span-4 md:text-right">
              VR · Ops · Enterprise
            </p>
            {cards.map((project, index) => (
              <motion.article
                key={project.slug}
                className="col-span-full md:grid md:grid-cols-subgrid md:items-center"
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.06 }}
              >
                <ProjectCard project={project} index={index} />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="hidden scroll-mt-16 border-b border-border-subtle md:block">
        <div className="mx-auto grid max-w-[1600px] grid-cols-12 items-center md:items-stretch">
          <div className="relative col-span-4 h-36 self-center overflow-hidden bg-bg-muted md:col-span-5 md:h-auto md:min-h-[36rem] md:self-stretch">
            <Image
              src="/assets/images/profile-1400.webp"
              alt={`Portrait of ${siteConfig.name}`}
              fill
              loading="lazy"
              decoding="async"
              className="archive-image object-cover"
              sizes="(max-width: 768px) 34vw, 42vw"
            />
          </div>
          <div className="archive-grid col-span-8 flex flex-col justify-between p-4 md:col-span-7 md:min-h-[36rem] md:p-10">
            <Label>A bit about who I am</Label>
            <p className="archive-serif my-12 max-w-[28ch] text-[clamp(1.85rem,4.2vw,3.25rem)] md:my-16">
              “{siteConfig.statement}”
            </p>
            <div className="grid gap-6 border-t border-border-subtle pt-6 md:grid-cols-2">
              <p className="text-sm leading-relaxed text-text-secondary">{siteConfig.aboutShort}</p>
              <div className="flex items-end md:justify-end">
                <Link
                  href={v2Path('/about/')}
                  className="archive-label border border-text-primary px-5 py-3 transition-colors hover:bg-text-primary hover:text-bg-primary"
                >
                  More about me →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactPanel />
    </>
  );
}
