'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import { BlackHoleLazy } from '@/src/components/v2/black-hole/BlackHoleLazy';
import { useKissMode } from '@/src/components/v2/layout/KissModeProvider';
import { CopyEmail } from '@/src/components/v2/ui/CopyEmail';
import { ContactPanel } from '@/src/components/v2/ui/ContactPanel';
import { ResumeDownload } from '@/src/components/v2/ui/ResumeDownload';
import { EarlierWorkRow } from '@/src/components/v2/archive/EarlierWorkRow';
import { HeroHeadlineLines, HeroIntroCopy } from '@/src/components/v2/archive/HeroIntroCopy';
import { HeroMeta } from '@/src/components/v2/archive/HeroMeta';
import { ProjectCard } from '@/src/components/v2/archive/ProjectCard';
import { projects } from '@/src/config/v2/caseStudies';
import {
  processSteps,
  siteConfig,
  trustLogos,
  trustSignals,
  whyPoints
} from '@/src/config/v2/site';

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

function AnimatedStat({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });
  const match = value.match(/\d+/);
  const target = match ? Number(match[0]) : null;
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !inView || target === null) return;
    const controls = animate(0, target, {
      duration: 2.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setCurrent(Math.round(latest))
    });
    return () => controls.stop();
  }, [mounted, inView, target]);

  if (value.includes('TODO') || target === null) {
    return (
      <motion.span
        ref={ref}
        initial={false}
        whileInView={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="inline-block"
      >
        {value}
      </motion.span>
    );
  }

  const digits = match?.[0] ?? '';
  const prefix = value.slice(0, value.indexOf(digits));
  const suffix = value.slice(value.indexOf(digits) + digits.length);
  const shown = mounted ? current : target;
  const displayed = digits.startsWith('0')
    ? String(shown).padStart(digits.length, '0')
    : String(shown);

  return (
    <span ref={ref} suppressHydrationWarning>
      {prefix}
      {displayed}
      {suffix}
    </span>
  );
}

export function LandingExperience() {
  const { kissMode, hydrated } = useKissMode();
  // Avoid SSR/client tree swap from sessionStorage until after mount.
  if (hydrated && kissMode) return <LandingExperienceKiss />;
  return <LandingExperienceArchive />;
}

function LandingExperienceArchive() {
  return (
    <>
      <section className="v2-hero-stage v2-black-hole-hero border-b border-white/10">
        <BlackHoleLazy key="archive-orbit-v28" />
        <div className="relative z-10 mx-auto flex max-w-[1600px] flex-col px-4 md:min-h-[calc(100svh-57px)] md:px-8 md:py-8">
          {/* First fold on mobile: copy + CTAs only. Meta sits below and scrolls in. */}
          <div className="archive-hero relative flex min-h-[calc(100svh-57px)] flex-1 flex-col justify-center py-10 md:min-h-0 md:py-6">
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75 }}
              className="relative z-10 max-w-[52rem] md:w-[68%]"
            >
              <Label>Available for work</Label>
              <h1 className="archive-display archive-display--hero mt-4 text-[clamp(2.35rem,4.1vw,4.15rem)]">
                <HeroHeadlineLines />
              </h1>
              <HeroIntroCopy className="mt-2 max-w-xl text-[0.95rem] leading-snug text-text-secondary md:text-base" />
              <div className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-10">
                <CopyEmail variant="hero" className="sm:min-w-[min(100%,20rem)] sm:flex-1" />
                <ResumeDownload variant="hero" className="sm:w-auto" />
              </div>
            </motion.div>
          </div>

          <div className="v2-hero-meta grid gap-5 border-t border-white/15 px-0 py-6 md:grid-cols-12 md:pb-0 md:pt-5">
            <HeroMeta />
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid border-b border-border-subtle md:grid-cols-4">
            <div className="p-5 md:p-8">
              <Label>Quick facts</Label>
            </div>
            {trustSignals.map((signal, index) => (
              <motion.div
                key={signal.label}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                className="border-t border-border-subtle p-5 md:border-l md:border-t-0 md:p-8"
              >
                <p className="archive-display archive-display--stat text-5xl text-accent-pop md:text-6xl">
                  <AnimatedStat value={signal.value} />
                </p>
                <p className="v2-trust-fact-label mt-5 text-text-secondary">{signal.label}</p>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3 px-5 py-5 md:px-8">
            <Label>I&apos;ve worked with</Label>
            {trustLogos.map((company) => (
              <a
                key={company.name}
                href={company.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`v2-company-link text-sm ${
                  company.current ? 'is-current' : 'is-past'
                }`}
              >
                {company.name}
                <span className="v2-visually-hidden"> (opens in a new tab)</span>
                <span
                  className={`ml-2 archive-label font-normal ${
                    company.current ? 'text-text-muted' : 'v2-company-period is-past'
                  }`}
                >
                  {company.period}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto grid max-w-[1600px] md:grid-cols-12">
          <div className="archive-blue flex min-h-[430px] flex-col justify-between p-5 md:col-span-5 md:p-8">
            <Label>Why teams bring me in</Label>
            <h2 className="archive-serif max-w-[14ch] text-[clamp(2.25rem,5vw,3.75rem)]">
              Powerful products shouldn&apos;t feel hard to use.
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-white/70">
              I sit with product and engineering, dig into where people stall, and redesign the
              path so the next step is obvious.
            </p>
          </div>
          <div className="md:col-span-7">
            {whyPoints.map((point, index) => (
              <motion.div
                key={point.index}
                initial={false}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="grid border-b border-border-subtle p-5 last:border-b-0 md:grid-cols-12 md:p-8"
              >
                <span className="archive-label text-accent-pop md:col-span-2">0{index + 1}</span>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight md:col-span-4 md:mt-0">
                  {point.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary md:col-span-6 md:mt-0">
                  {point.body}
                </p>
              </motion.div>
            ))}
            <div className="p-5 md:p-8">
              <Label>How I usually work</Label>
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-3">
                {processSteps.map((step, index) => (
                  <div key={step.index} className="flex items-center gap-4">
                    <span className="text-sm font-semibold">{step.title}</span>
                    {index < processSteps.length - 1 ? (
                      <span className="text-accent-pop">→</span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="work"
        className="scroll-mt-16 border-b border-border-subtle"
        aria-labelledby="classic-work-heading"
      >
        <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-8 md:py-24">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <Label>Selected work · 3 case studies</Label>
              <h2
                id="classic-work-heading"
                className="archive-display mt-5 text-[clamp(2.75rem,9vw,6.5rem)]"
              >
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

      <ContactPanel headingId="classic-contact-heading" formHeadingId="classic-contact-form-heading" />
    </>
  );
}
