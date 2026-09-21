'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CopyEmail } from '@/src/components/v2/ui/CopyEmail';
import { ContactPanel } from '@/src/components/v2/ui/ContactPanel';
import { HashNavLink } from '@/src/components/v2/ui/HashNavLink';
import { ResumeDownload } from '@/src/components/v2/ui/ResumeDownload';
import {
  AnimatedStat,
  RevealOnScroll,
  useKissHeroIntro
} from '@/src/components/v2/motion/landingMotion';
import { EarlierWorkRow } from '@/src/components/v2/archive/EarlierWorkRow';
import { HeroIntroCopy } from '@/src/components/v2/archive/HeroIntroCopy';
import { HeroMeta } from '@/src/components/v2/archive/HeroMeta';
import { ProjectCard } from '@/src/components/v2/archive/ProjectCard';
import { projects } from '@/src/config/v2/caseStudies';
import { heroHeadline } from '@/src/config/v2/profile';
import { siteConfig, trustLogos, trustSignals } from '@/src/config/v2/site';

function Label({ children }: { children: React.ReactNode }) {
  return <p className="archive-label text-text-muted">{children}</p>;
}

function HeroPortrait({ className = '' }: { className?: string }) {
  return (
    <div className={`v2-kiss-fade v2-hero-portrait ${className}`.trim()}>
      <div className="v2-hero-portrait-ring">
        <div className="v2-hero-portrait-inner">
          <Image
            src="/assets/images/profile.png"
            alt={`Portrait of ${siteConfig.name}`}
            width={96}
            height={96}
            priority
            className="v2-hero-portrait-img"
            sizes="96px"
          />
        </div>
      </div>
    </div>
  );
}

/** Simple mode — workbench-style grids, light motion on load + scroll. */
export function LandingExperienceKiss() {
  const { heroRef } = useKissHeroIntro();

  return (
    <article>
      <section
        ref={heroRef}
        className="v2-kiss-hero is-kiss-intro archive-grid border-b border-border-subtle"
      >
        <div className="mx-auto flex min-h-[calc(100svh-57px)] max-w-[1600px] flex-col px-4 pb-6 pt-12 md:block md:min-h-0 md:px-8 md:py-24">
          {/* Mobile */}
          <div className="v2-kiss-copy md:hidden">
            <HeroPortrait className="mb-1" />
            <h1
              className="v2-kiss-fade archive-display archive-display--hero text-[clamp(1.85rem,8vw,2.5rem)]"
              style={{ transitionDelay: '0.06s' }}
            >
              <span className="v2-hero-line">{heroHeadline}</span>
            </h1>
            <HeroIntroCopy
              className="v2-kiss-fade mt-6 max-w-xl text-base leading-relaxed text-text-secondary"
            />
          </div>

          <div
            className="v2-kiss-fade mt-8 flex flex-col gap-3 border-t border-border-subtle pt-6 md:hidden"
            style={{ transitionDelay: '0.2s' }}
          >
            <CopyEmail variant="surface" className="w-full" />
            <ResumeDownload variant="surface" />
          </div>

          <div
            className="v2-kiss-fade mt-auto flex pt-6 md:hidden"
            style={{ transitionDelay: '0.26s' }}
          >
            <HashNavLink
              href="/v2/#work"
              className="archive-label inline-flex w-full items-center justify-center gap-3 border border-border-subtle px-5 py-3"
            >
              See selected work <span>↓</span>
            </HashNavLink>
          </div>

          {/* Desktop kiss (SM mode) */}
          <div className="hidden md:block">
            <HeroPortrait className="mb-2" />
            <h1
              className="v2-kiss-fade archive-display archive-display--hero text-[clamp(2.75rem,10vw,6.5rem)]"
              style={{ transitionDelay: '0.06s' }}
            >
              <span className="v2-hero-line">{heroHeadline}</span>
            </h1>
            <div
              className="v2-kiss-fade mt-12 grid gap-6 border-t border-border-subtle pt-6 md:grid-cols-12"
              style={{ transitionDelay: '0.14s' }}
            >
              <HeroIntroCopy className="text-base leading-relaxed text-text-secondary md:col-span-7 md:text-lg" />
              <div className="md:col-span-4 md:col-start-9">
                <p className="text-sm leading-relaxed text-text-secondary">
                  {siteConfig.valueProposition}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <CopyEmail variant="surface" className="sm:min-w-[min(100%,16rem)] sm:flex-1" />
                  <ResumeDownload variant="surface" />
                </div>
              </div>
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
        <div className="v2-trust-band-inner mx-auto w-full max-w-[1600px]">
          <div className="v2-trust-row grid grid-cols-3 gap-x-5 gap-y-4 md:grid-cols-4 md:gap-0">
            <RevealOnScroll className="hidden flex-col justify-center md:flex">
              <Label>Quick facts</Label>
            </RevealOnScroll>
            {trustSignals.map((signal, index) => (
              <RevealOnScroll
                key={signal.label}
                delay={index * 0.06}
                className="flex flex-col justify-center"
              >
                <p className="archive-display archive-display--stat text-xl text-accent-pop md:text-3xl lg:text-4xl">
                  <AnimatedStat value={signal.value} />
                </p>
                <p className="v2-trust-fact-label mt-2 text-text-secondary md:mt-3">
                  {signal.label}
                </p>
              </RevealOnScroll>
            ))}
          </div>
          <div className="v2-trust-row grid grid-cols-3 gap-x-5 gap-y-4 md:grid-cols-4 md:gap-0">
            <RevealOnScroll className="hidden flex-col justify-center md:flex">
              <Label>I&apos;ve worked with</Label>
            </RevealOnScroll>
            {trustLogos.map((company, index) => (
              <RevealOnScroll
                key={company.name}
                delay={index * 0.05}
                className="flex flex-col justify-center"
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
                  className={`archive-label mt-3 hidden md:block ${
                    company.current ? 'text-text-muted' : 'v2-company-period is-past'
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
          <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2">
            {projects.map((project, index) => (
              <RevealOnScroll
                key={project.slug}
                delay={index * 0.05}
                y={20}
                className={index === 0 ? 'md:col-span-2' : ''}
              >
                <ProjectCard project={project} index={index} />
              </RevealOnScroll>
            ))}
          </div>
          <EarlierWorkRow />
        </div>
      </section>

      <section id="about" className="scroll-mt-16 border-b border-border-subtle">
        <div className="mx-auto grid max-w-[1600px] items-stretch md:grid-cols-12">
          <RevealOnScroll className="archive-blue hidden min-h-[36rem] p-5 md:col-span-4 md:block md:p-8">
            <p className="archive-label text-white/60">02 / About</p>
            <h2 className="archive-serif mt-12 max-w-[12ch] text-[clamp(2rem,4.5vw,3.5rem)]">
              {siteConfig.statement}
            </h2>
          </RevealOnScroll>
          <RevealOnScroll
            delay={0.08}
            className="archive-grid flex min-h-[520px] flex-col justify-between p-5 md:col-span-8 md:min-h-[36rem] md:p-10"
          >
            <Label>A bit about who I am</Label>
            <p className="my-10 max-w-2xl text-sm leading-relaxed text-text-secondary md:my-16">
              {siteConfig.aboutShort}
            </p>
            <div className="flex flex-wrap items-end justify-between gap-4 border-t border-border-subtle pt-6">
              <p className="archive-label text-accent-pop">
                {siteConfig.current}
                <br />
                {siteConfig.location}
              </p>
              <Link
                href="/v2/about/"
                className="archive-label border border-text-primary px-5 py-3 transition-colors hover:bg-text-primary hover:text-bg-primary"
              >
                Read full profile →
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <RevealOnScroll>
        <ContactPanel headingId="kiss-contact-heading" formHeadingId="kiss-contact-form-heading" />
      </RevealOnScroll>
    </article>
  );
}
