'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CopyEmail } from '@/src/components/v2/ui/CopyEmail';
import { ContactPanel } from '@/src/components/v2/ui/ContactPanel';
import { HashNavLink } from '@/src/components/v2/ui/HashNavLink';
import { ResumeDownload } from '@/src/components/v2/ui/ResumeDownload';
import { useBorderGlow } from '@/src/components/v2/ui/useBorderGlow';
import {
  AnimatedStat,
  RevealOnScroll,
  useKissHeroIntro
} from '@/src/components/v2/motion/landingMotion';
import { HeroCloser, HeroHeadlineLines, HeroKicker } from '@/src/components/v2/archive/HeroIntroCopy';
import { KissStarfield } from '@/src/components/v2/archive/KissStarfield';
import { HeroPortrait } from '@/src/components/v2/archive/HeroPortrait';
import { HeroMeta } from '@/src/components/v2/archive/HeroMeta';
import { ProjectCard } from '@/src/components/v2/archive/ProjectCard';
import { projects } from '@/src/config/v2/caseStudies';
import { siteConfig, trustLogos, trustSignals } from '@/src/config/v2/site';

function Label({ children }: { children: React.ReactNode }) {
  return <p className="archive-label text-text-muted">{children}</p>;
}

/** Simple mode — workbench-style grids, light motion on load + scroll. */
export function LandingExperienceKiss() {
  const { heroRef } = useKissHeroIntro();
  const borderGlow = useBorderGlow();

  return (
    <article>
      <section
        ref={heroRef}
        className="v2-kiss-hero is-kiss-intro relative border-b border-border-subtle"
      >
        <KissStarfield />
        <div className="relative z-[1] mx-auto flex min-h-[calc(100svh-57px)] max-w-[1600px] flex-col px-4 pb-6 pt-2 md:block md:min-h-0 md:px-8 md:py-24">
          {/* Mobile */}
          <div className="v2-kiss-copy flex flex-1 flex-col md:hidden">
            <p className="v2-kiss-fade m-0 archive-display text-[clamp(3rem,14vw,4.25rem)] leading-[0.86]">
              {siteConfig.name}
            </p>
            <div className="min-h-2 flex-1" />
            <div className="grid grid-cols-12 items-center gap-x-4">
              <div className="col-span-7">
                <h1
                  className="v2-kiss-fade v2-kiss-headline mb-3 text-left text-[1.125rem] font-normal leading-[1.2]"
                  style={{ transitionDelay: '0.06s' }}
                >
                  <HeroHeadlineLines />
                </h1>
                <HeroCloser className="v2-kiss-fade" style={{ transitionDelay: '0.1s' }} />
              </div>
              <div className="col-span-5">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-bg-muted">
                  <Image
                    src="/assets/images/profile.png"
                    alt={`Portrait of ${siteConfig.name}`}
                    fill
                    priority
                    className="object-cover object-[center_18%]"
                    sizes="46vw"
                  />
                </div>
              </div>
            </div>
            <div className="h-10 shrink-0" />
          </div>

          <div
            className="v2-kiss-fade v2-kiss-email md:hidden"
            style={{ transitionDelay: '0.2s' }}
          >
            <CopyEmail variant="surface" className="w-full" />
          </div>
          <div className="v2-kiss-fade mt-3 md:hidden" style={{ transitionDelay: '0.23s' }}>
            <ResumeDownload variant="surface" className="v2-kiss-resume" />
          </div>
          <div className="v2-kiss-fade flex justify-center pt-14 md:hidden" style={{ transitionDelay: '0.26s' }}>
            <HashNavLink href="/v2/#work" className="archive-label inline-flex items-center gap-2">
              Selected work
              <span className="v2-kiss-work-arrow" aria-hidden="true">
                ↓
              </span>
            </HashNavLink>
          </div>

          {/* Desktop kiss (SM mode) */}
          <div className="hidden md:block">
            <HeroPortrait className="v2-kiss-fade mb-2" />
            <HeroKicker className="v2-kiss-fade" style={{ transitionDelay: '0.04s' }} />
            <h1
              className="v2-kiss-fade archive-display archive-display--hero text-[clamp(2.5rem,5.2vw,4.5rem)]"
              style={{ transitionDelay: '0.06s' }}
            >
              <HeroHeadlineLines />
            </h1>
            <HeroCloser className="v2-kiss-fade" style={{ transitionDelay: '0.1s' }} />
            <div
              className="v2-kiss-fade mt-8 flex flex-col gap-3 border-t border-border-subtle pt-6 sm:flex-row sm:flex-wrap"
              style={{ transitionDelay: '0.14s' }}
            >
              <CopyEmail variant="surface" className="sm:min-w-[min(100%,16rem)] sm:flex-1" />
              <ResumeDownload variant="surface" />
            </div>
          </div>

          <div
            className="v2-kiss-fade mt-12 hidden gap-6 border-t border-border-subtle pt-8 md:mt-12 md:grid md:grid-cols-12"
            style={{ transitionDelay: '0.22s' }}
          >
            <HeroMeta workHrefClassName="archive-label inline-flex items-center gap-3 border border-border-subtle px-5 py-3" />
          </div>
        </div>
      </section>

      <section className="v2-trust-band border-b border-border-subtle">
        <div className="v2-trust-band-inner v2-border-glow mx-auto w-full max-w-[1600px]" {...borderGlow}>
          <div className="v2-trust-row grid grid-cols-1 md:grid-cols-4 md:gap-0">
            <RevealOnScroll className="flex flex-col justify-center md:col-span-1">
              <Label>Quick facts</Label>
            </RevealOnScroll>
            {trustSignals.map((signal, index) => (
              <RevealOnScroll
                key={signal.label}
                delay={index * 0.06}
                className="flex flex-row items-baseline justify-between gap-5 md:flex-col md:items-stretch md:justify-center md:gap-0"
              >
                <p className="archive-display archive-display--stat text-xl text-accent-pop md:text-3xl lg:text-4xl">
                  <AnimatedStat value={signal.value} />
                </p>
                <p className="v2-trust-fact-label mt-0 text-text-secondary md:mt-3">
                  {signal.label}
                </p>
              </RevealOnScroll>
            ))}
          </div>
          <div className="v2-trust-row grid grid-cols-1 md:grid-cols-4 md:gap-0">
            <RevealOnScroll className="flex flex-col justify-center md:col-span-1">
              <Label>I&apos;ve worked with</Label>
            </RevealOnScroll>
            {trustLogos.map((company, index) => (
              <RevealOnScroll
                key={company.name}
                delay={index * 0.05}
                className="flex flex-row items-baseline justify-between gap-5 md:flex-col md:items-stretch md:justify-center md:gap-0"
              >
                <a
                  href={company.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`v2-company-link text-sm md:text-base lg:text-lg ${
                    company.current ? 'is-current' : 'is-past'
                  }`}
                >
                  {company.name}{' '}
                  <span className="v2-visually-hidden">(opens in a new tab)</span>
                  <span aria-hidden>↗</span>
                </a>
                <p
                  className={`archive-label v2-company-period mt-0 md:mt-3 ${
                    company.current ? 'text-text-muted' : 'is-past'
                  }`}
                >
                  {company.period}
                </p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="scroll-mt-16 border-b border-border-subtle" aria-labelledby="kiss-work-heading">
        <div className="mx-auto max-w-[1600px] px-4 py-10 md:min-h-[100svh] md:px-8 md:py-14">
          <RevealOnScroll className="grid items-end gap-4 md:grid-cols-12">
            <div className="md:col-span-8">
              <p className="archive-label text-text-muted">01 / Selected work</p>
              <h2 id="kiss-work-heading" className="archive-display mt-3 text-[clamp(2rem,5vw,3.5rem)]">
                Work that shipped.
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-text-secondary md:col-span-4">
              VR · Ops · Enterprise
            </p>
          </RevealOnScroll>
          <div className="mt-8 grid gap-x-8 gap-y-16 md:mt-10 md:grid-cols-12">
            {projects.map((project, index) => (
              <RevealOnScroll
                key={project.slug}
                className="col-span-full md:grid md:grid-cols-subgrid md:items-center"
                delay={index * 0.05}
                y={20}
              >
                <ProjectCard project={project} />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="hidden scroll-mt-16 border-b border-border-subtle md:block">
        <div className="mx-auto grid max-w-[1600px] md:grid-cols-12 md:items-stretch">
          <div className="relative hidden overflow-hidden bg-bg-muted md:col-span-5 md:block md:min-h-[36rem]">
            <Image
              src="/assets/images/profile.png"
              alt={`Portrait of ${siteConfig.name}`}
              fill
              loading="lazy"
              decoding="async"
              className="archive-image object-cover"
              sizes="42vw"
            />
          </div>
          <div className="archive-grid flex flex-col justify-between p-4 md:col-span-7 md:min-h-[36rem] md:p-10">
            <Label>A bit about who I am</Label>
            <div className="relative -mx-4 mt-4 aspect-[5/4] w-[calc(100%+2rem)] overflow-hidden bg-bg-muted md:hidden">
              <Image
                src="/assets/images/profile.png"
                alt={`Portrait of ${siteConfig.name}`}
                fill
                loading="lazy"
                decoding="async"
                className="archive-image object-cover object-center"
                sizes="100vw"
              />
            </div>
            <p className="archive-serif my-8 max-w-none text-[clamp(1.15rem,3.2vw,3.25rem)] md:my-16 md:max-w-[28ch]">
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

      <RevealOnScroll>
        <ContactPanel headingId="kiss-contact-heading" formHeadingId="kiss-contact-form-heading" />
      </RevealOnScroll>
    </article>
  );
}
