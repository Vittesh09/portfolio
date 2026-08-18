'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CopyEmail } from '@/src/components/v2/ui/CopyEmail';
import { ResumeDownload } from '@/src/components/v2/ui/ResumeDownload';
import {
  AnimatedHeroTitle,
  AnimatedStat,
  HERO_TITLE_LINES_KISS,
  heroTitleDuration,
  MobileHeroSubline,
  RevealOnScroll,
  useKissHeroIntro
} from '@/src/components/v2/motion/landingMotion';
import { projects } from '@/src/config/v2/caseStudies';
import { siteConfig, trustLogos, trustSignals } from '@/src/config/v2/site';

function Label({ children }: { children: React.ReactNode }) {
  return <p className="archive-label text-text-muted">{children}</p>;
}

const introCopy = (
  <>
    Hi, I am <span className="text-accent-pop">Vittesh</span>, Product Designer with 7+ years of
    working experience. I make powerful products easier to use.
  </>
);

/** Simple mode — workbench-style grids, light motion on load + scroll. */
export function LandingExperienceKiss() {
  const { heroRef, introReady } = useKissHeroIntro();
  const [titleDone, setTitleDone] = useState(false);

  return (
    <article>
      <section
        ref={heroRef}
        className="v2-kiss-hero is-kiss-intro archive-grid border-b border-border-subtle"
      >
        <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-6 md:py-24">
          {/* Mobile — headline + rising subline */}
          <div className="v2-kiss-copy md:hidden">
            <AnimatedHeroTitle
              lines={HERO_TITLE_LINES_KISS}
              play={introReady}
              onComplete={() => setTitleDone(true)}
              className="archive-display archive-display--hero text-[clamp(2.75rem,10vw,6.5rem)]"
            />
            <MobileHeroSubline
              play={titleDone}
              className="max-w-xl text-base leading-relaxed text-text-secondary"
            >
              {introCopy}
            </MobileHeroSubline>
          </div>

          <div
            className="v2-kiss-fade mt-10 border-t border-border-subtle pt-6 md:hidden"
            style={{ transitionDelay: `${heroTitleDuration(HERO_TITLE_LINES_KISS)}s` }}
          >
            <p className="text-sm leading-relaxed text-text-secondary">
              {siteConfig.valueProposition}
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <CopyEmail variant="surface" className="w-full" />
              <ResumeDownload variant="surface" />
            </div>
          </div>

          {/* Desktop kiss (SM mode) — static headline, original fade */}
          <div className="hidden md:block">
            <h1
              className="v2-kiss-fade archive-display archive-display--hero text-[clamp(2.75rem,10vw,6.5rem)]"
              style={{ transitionDelay: '0.06s' }}
            >
              Thoughtfully
              <br />
              designed.
              <br />
              <span className="text-accent-pop">Purposefully simple.</span>
            </h1>
            <div
              className="v2-kiss-fade mt-12 grid gap-6 border-t border-border-subtle pt-6 md:grid-cols-12"
              style={{ transitionDelay: '0.14s' }}
            >
              <p className="text-base leading-relaxed text-text-secondary md:col-span-7 md:text-lg">
                {introCopy}
              </p>
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
            className="v2-kiss-fade mt-12 grid gap-6 border-t border-border-subtle pt-8 md:grid-cols-12"
            style={{ transitionDelay: '0.22s' }}
          >
            <div className="md:col-span-3">
              <Label>Currently working</Label>
              <p className="mt-2 text-sm">{siteConfig.current}</p>
            </div>
            <div className="md:col-span-3">
              <Label>Industries I have worked on</Label>
              <p className="mt-2 text-sm">{siteConfig.industries}</p>
            </div>
            <div className="md:col-span-3">
              <Label>Based in</Label>
              <p className="mt-2 text-sm">{siteConfig.location}</p>
            </div>
            <div className="flex items-end md:col-span-3 md:justify-end">
              <Link
                href="/v2/#work"
                className="archive-label inline-flex items-center gap-3 bg-text-primary px-5 py-3 text-bg-primary"
              >
                See selected work <span>↓</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="v2-trust-band border-b border-border-subtle">
        <div className="v2-trust-band-inner mx-auto w-full max-w-[1600px]">
          <div className="v2-trust-row grid md:grid-cols-4">
            <RevealOnScroll className="flex flex-col justify-center">
              <Label>Quick facts</Label>
            </RevealOnScroll>
            {trustSignals.map((signal, index) => (
              <RevealOnScroll
                key={signal.label}
                delay={index * 0.06}
                className="flex flex-col justify-center"
              >
                <p className="archive-display archive-display--stat text-3xl text-accent-pop md:text-4xl lg:text-5xl">
                  <AnimatedStat value={signal.value} />
                </p>
                <p className="archive-label mt-3 text-text-secondary md:mt-4">{signal.label}</p>
              </RevealOnScroll>
            ))}
          </div>
          <div className="v2-trust-row grid md:grid-cols-4">
            <RevealOnScroll className="flex flex-col justify-center">
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
                  rel="noreferrer"
                  className={`v2-company-link text-base ${
                    company.current ? 'is-current' : 'is-past'
                  }`}
                >
                  {company.name} <span aria-hidden>↗</span>
                </a>
                <p
                  className={`archive-label mt-3 ${
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

      <section id="work" className="scroll-mt-16 border-b border-border-subtle">
        <div className="mx-auto max-w-[1600px] px-4 py-10 md:min-h-[100svh] md:px-6 md:py-14">
          <RevealOnScroll className="grid items-end gap-4 md:grid-cols-12">
            <div className="md:col-span-8">
              <p className="archive-label text-text-muted">01 / Selected work</p>
              <h2 className="archive-display mt-3 text-[clamp(2rem,5vw,3.5rem)]">
                Work that shipped.
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-text-secondary md:col-span-4">
              VR · Ops · Enterprise
            </p>
          </RevealOnScroll>
          <ul className="mt-8 divide-y divide-border-subtle border-y border-border-subtle">
            {projects.map((project, index) => (
              <RevealOnScroll key={project.slug} delay={index * 0.05} y={20}>
                <li>
                  <Link
                    href={`/v2/work/${project.slug}/`}
                    className="group grid gap-2 py-4 md:grid-cols-12 md:items-center md:gap-5"
                  >
                    <span className="archive-label text-accent-pop md:col-span-1">
                      {project.index}
                    </span>
                    <span className="text-lg font-semibold tracking-tight md:col-span-4">
                      {project.title}
                    </span>
                    <p className="text-sm leading-relaxed text-text-secondary md:col-span-6">
                      {project.summary}
                    </p>
                    <span className="text-accent-pop md:col-span-1 md:text-right">↗</span>
                  </Link>
                </li>
              </RevealOnScroll>
            ))}
          </ul>
        </div>
      </section>

      <section id="about" className="scroll-mt-16 border-b border-border-subtle">
        <div className="mx-auto grid max-w-[1600px] md:grid-cols-12">
          <RevealOnScroll className="archive-blue p-5 md:col-span-4 md:p-8">
            <p className="archive-label text-white/60">02 / About</p>
            <h2 className="archive-serif mt-12 max-w-[12ch] text-[clamp(2rem,4.5vw,3.5rem)]">
              {siteConfig.statement}
            </h2>
          </RevealOnScroll>
          <RevealOnScroll
            delay={0.08}
            className="archive-grid flex flex-col justify-between p-5 md:col-span-8 md:p-10"
          >
            <Label>A bit about who I am</Label>
            <p className="my-10 max-w-2xl text-sm leading-relaxed text-text-secondary md:my-16">
              {siteConfig.aboutShort}
            </p>
            <div className="flex flex-wrap items-end justify-between gap-4 border-t border-border-subtle pt-6">
              <p className="archive-label text-accent-pop">
                {siteConfig.current}
                <br />
                Based in {siteConfig.location}
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

      <section id="contact" className="archive-blue scroll-mt-16">
        <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-6 md:py-24">
          <RevealOnScroll>
            <p className="archive-label text-white/60">03 / Contact</p>
            <div className="mt-10 grid gap-10 md:grid-cols-12 md:items-end">
              <h2 className="archive-display text-[clamp(2.5rem,8vw,5.75rem)] md:col-span-8">
                Let&apos;s make it clear.
              </h2>
              <div className="flex flex-col gap-3 md:col-span-4">
                <CopyEmail variant="inverse" />
                <ResumeDownload variant="inverse" label="Download resume ↓" />
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </article>
  );
}
