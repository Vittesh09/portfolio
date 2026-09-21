'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BlackHoleLazy } from '@/src/components/v2/singularity/BlackHoleLazy';
import { useKissMode } from '@/src/components/v2/layout/KissModeProvider';
import { AnimatedStat } from '@/src/components/v2/motion/landingMotion';
import { ContactPanel } from '@/src/components/v2/ui/ContactPanel';
import { CopyEmail } from '@/src/components/v2/ui/CopyEmail';
import { ResumeDownload } from '@/src/components/v2/ui/ResumeDownload';
import { useMobileLanding } from '@/src/components/v2/ui/useMobileLanding';
import { EarlierWorkRow } from '@/src/components/v2/archive/EarlierWorkRow';
import { HeroIntroCopy } from '@/src/components/v2/archive/HeroIntroCopy';
import { HeroMeta } from '@/src/components/v2/archive/HeroMeta';
import { ProjectCard } from '@/src/components/v2/archive/ProjectCard';
import { projects } from '@/src/config/v2/caseStudies';
import { heroHeadline } from '@/src/config/v2/profile';
import { siteConfig, trustLogos, trustSignals } from '@/src/config/v2/site';

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

export function LandingExperienceSingularity() {
  const heroRef = useRef<HTMLElement>(null);
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

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || useKiss) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hero.classList.add('is-copy-in', 'is-intro-done');
      return;
    }
    const id = window.requestAnimationFrame(() => {
      hero.classList.add('is-copy-in');
    });
    return () => window.cancelAnimationFrame(id);
  }, [useKiss]);

  if (useKiss) return <LandingExperienceKiss />;

  return (
    <>
      <section ref={heroRef} className="bh-hero is-intro border-b border-white/10">
        {clientReady ? <BlackHoleLazy heroRef={heroRef} /> : null}

        <div className="relative z-10 mx-auto flex max-w-[1600px] flex-col px-4 md:min-h-[calc(100svh-57px)] md:px-8 md:py-8">
          <div className="archive-hero relative flex min-h-[calc(100svh-57px)] flex-1 flex-col justify-center py-10 md:min-h-0 md:py-6">
            <div className="relative z-10 max-w-[760px] md:w-[58%]">
              <h1 className="bh-sr-only">{heroHeadline}</h1>
              <div className="bh-copy bh-copy-source" data-bh-warp aria-hidden="true">
                <p className="archive-display archive-display--hero text-[clamp(2.6rem,4.5vw,4.75rem)]">
                  <span className="v2-hero-line">{heroHeadline}</span>
                </p>
                <div className="bh-copy-sub mt-8 max-w-xl text-base leading-relaxed text-text-secondary md:mt-10 md:text-lg">
                  <HeroIntroCopy />
                </div>
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

      <section className="v2-trust-band border-b border-border-subtle">
        <div className="v2-trust-band-inner mx-auto w-full max-w-[1600px]">
          <div className="v2-trust-row grid md:grid-cols-4">
            <div className="flex flex-col justify-center">
              <Label>Quick facts</Label>
            </div>
            {trustSignals.map((signal, index) => (
              <motion.div
                key={signal.label}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                className="flex flex-col justify-center"
              >
                <p className="archive-display archive-display--stat text-5xl text-accent-pop md:text-6xl lg:text-7xl">
                  <AnimatedStat value={signal.value} />
                </p>
                <p className="v2-trust-fact-label mt-5 text-text-secondary md:mt-6">{signal.label}</p>
              </motion.div>
            ))}
          </div>
          <div className="v2-trust-row grid md:grid-cols-4">
            <div className="flex flex-col justify-center">
              <Label>I&apos;ve worked with</Label>
            </div>
            {trustLogos.map((company) => (
              <div key={company.name} className="flex flex-col justify-center">
                <a
                  href={company.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`v2-company-link text-base md:text-lg lg:text-xl ${
                    company.current ? 'is-current' : 'is-past'
                  }`}
                >
                  {company.name}{' '}
                  <span className="v2-visually-hidden">(opens in a new tab)</span>
                  <span aria-hidden>↗</span>
                </a>
                <p
                  className={`archive-label mt-3 ${
                    company.current ? 'text-text-muted' : 'v2-company-period is-past'
                  }`}
                >
                  {company.period}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="work"
        className="scroll-mt-16 border-b border-border-subtle"
        aria-labelledby="work-heading"
      >
        <div className="mx-auto max-w-[1600px] px-4 py-16 md:min-h-[100svh] md:px-8 md:py-24">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <Label>Selected work · 3 case studies</Label>
              <h2 id="work-heading" className="archive-display mt-5 text-[clamp(2.75rem,9vw,6.5rem)]">
                Work that shipped.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-text-secondary md:col-span-4">
              Three projects where I owned the experience end to end, from VR research and fleet
              ops to cloud cost decisions.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {projects.map((project, index) => (
              <motion.article
                key={project.slug}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: (index % 2) * 0.08 }}
                className={index === 0 ? 'md:col-span-2' : ''}
              >
                <ProjectCard project={project} index={index} />
              </motion.article>
            ))}
          </div>
          <EarlierWorkRow />
        </div>
      </section>

      <section id="about" className="scroll-mt-16 border-b border-border-subtle">
        <div className="mx-auto grid max-w-[1600px] items-stretch md:grid-cols-12">
          <div className="relative min-h-[520px] overflow-hidden bg-bg-muted md:col-span-5 md:min-h-[36rem]">
            <Image
              src="/assets/images/profile.png"
              alt={`Portrait of ${siteConfig.name}`}
              fill
              loading="lazy"
              decoding="async"
              className="archive-image object-cover"
              sizes="(max-width: 768px) 100vw, 42vw"
            />
          </div>
          <div className="archive-grid flex min-h-[520px] flex-col justify-between p-5 md:col-span-7 md:min-h-[36rem] md:p-10">
            <Label>A bit about who I am</Label>
            <p className="archive-serif my-12 max-w-[28ch] text-[clamp(1.85rem,4.2vw,3.25rem)] md:my-16">
              “{siteConfig.statement}”
            </p>
            <div className="grid gap-6 border-t border-border-subtle pt-6 md:grid-cols-2">
              <p className="text-sm leading-relaxed text-text-secondary">{siteConfig.aboutShort}</p>
              <div className="flex items-end md:justify-end">
                <Link
                  href="/v2/about/"
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
