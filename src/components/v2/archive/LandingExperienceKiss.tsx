'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CopyEmail } from '@/src/components/v2/ui/CopyEmail';
import { ContactPanel } from '@/src/components/v2/ui/ContactPanel';
import { HashNavLink } from '@/src/components/v2/ui/HashNavLink';
import { ResumeDownload } from '@/src/components/v2/ui/ResumeDownload';
import { RevealOnScroll } from '@/src/components/v2/motion/landingMotion';
import { HeroCloser, HeroIdentityMark, HeroKicker, TypewriterCloser } from '@/src/components/v2/archive/HeroIntroCopy';
import { KissStarfield } from '@/src/components/v2/archive/KissStarfield';
import { HeroPortrait } from '@/src/components/v2/archive/HeroPortrait';
import { HeroMeta } from '@/src/components/v2/archive/HeroMeta';
import { ProjectCard } from '@/src/components/v2/archive/ProjectCard';
import { type ProjectCardData } from '@/src/config/v2/caseStudies';
import { siteConfig } from '@/src/config/v2/site';
import { v2Path } from '@/src/config/v2/profile';

function Label({ children }: { children: React.ReactNode }) {
  return <p className="archive-label text-text-muted">{children}</p>;
}

/** Simple mode — workbench-style grids, light motion on load + scroll. */
export function LandingExperienceKiss({ cards }: { cards: ProjectCardData[] }) {
  return (
    <article>
      <section className="v2-kiss-hero relative border-b border-border-subtle">
        <KissStarfield />
        <div className="relative z-[1] mx-auto flex min-h-[100svh] max-w-[1600px] flex-col px-4 pb-6 pt-[4.75rem] md:block md:min-h-0 md:px-8 md:py-24">
          {/* Mobile */}
          <div className="v2-kiss-copy flex flex-1 flex-col md:hidden">
            <h1 className="v2-kiss-wordmark m-0 archive-display">
              <HeroIdentityMark />
            </h1>
            <div className="min-h-2 flex-1" />
            <div className="grid grid-cols-12 items-center gap-x-4">
              <div className="col-span-7">
                <TypewriterCloser />
              </div>
              <div className="col-span-5">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-bg-muted">
                  <Image
                    src="/assets/images/profile-1400.webp"
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

          <div className="v2-kiss-email md:hidden">
            <CopyEmail variant="surface" className="w-full" />
          </div>
          <div className="mt-3 md:hidden">
            <ResumeDownload variant="surface" className="v2-kiss-resume" />
          </div>
          <div className="flex justify-center pt-14 md:hidden">
            <HashNavLink href={v2Path('/#work')} className="archive-label inline-flex items-center gap-2">
              Selected work
              <span className="v2-kiss-work-arrow" aria-hidden="true">
                ↓
              </span>
            </HashNavLink>
          </div>

          {/* Desktop kiss (SM mode) */}
          <div className="hidden md:block">
            <HeroPortrait className="mb-2" />
            <HeroKicker />
            <h1 className="v2-kiss-wordmark m-0 archive-display">
              <HeroIdentityMark />
            </h1>
            <HeroCloser />
            <div className="mt-8 flex flex-col gap-3 border-t border-border-subtle pt-6 sm:flex-row sm:flex-wrap">
              <CopyEmail variant="surface" className="sm:min-w-[min(100%,16rem)] sm:flex-1" />
              <ResumeDownload variant="surface" />
            </div>
          </div>

          <div className="mt-12 hidden gap-6 border-t border-border-subtle pt-8 md:mt-12 md:grid md:grid-cols-12">
            <HeroMeta workHrefClassName="archive-label inline-flex items-center gap-3 border border-border-subtle px-5 py-3" />
          </div>
        </div>
      </section>

      <section id="work" className="scroll-mt-16 border-b border-border-subtle" aria-labelledby="kiss-work-heading">
        <div className="mx-auto max-w-[1600px] px-4 pb-10 pt-16 md:min-h-[100svh] md:px-8 md:pb-14">
          <RevealOnScroll className="grid items-end gap-4 md:grid-cols-12">
            <div className="md:col-span-8">
              <p className="archive-section-kicker archive-label text-text-muted">Case studies</p>
              <h2 id="kiss-work-heading" className="archive-display archive-section-title">
                Selected work.
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-text-secondary md:col-span-4 md:text-right">
              VR · Ops · Enterprise
            </p>
          </RevealOnScroll>
          <div className="mt-8 grid gap-x-8 gap-y-16 md:mt-10 md:grid-cols-12">
            {cards.map((project, index) => (
              <RevealOnScroll
                key={project.slug}
                className="col-span-full md:grid md:grid-cols-subgrid md:items-center"
                delay={index * 0.05}
                y={20}
              >
                <ProjectCard project={project} index={index} />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="hidden scroll-mt-16 border-b border-border-subtle md:block">
        <div className="mx-auto grid max-w-[1600px] md:grid-cols-12 md:items-stretch">
          <div className="relative hidden overflow-hidden bg-bg-muted md:col-span-5 md:block md:min-h-[36rem]">
            <Image
              src="/assets/images/profile-1400.webp"
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
                src="/assets/images/profile-1400.webp"
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

      <RevealOnScroll>
        <ContactPanel headingId="kiss-contact-heading" formHeadingId="kiss-contact-form-heading" />
      </RevealOnScroll>
    </article>
  );
}
