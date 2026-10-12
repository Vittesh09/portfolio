'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ContactPanel } from '@/src/components/v2/ui/ContactPanel';
import { HashNavLink } from '@/src/components/v2/ui/HashNavLink';
import { yearsExperience } from '@/src/config/v2/profile';
import { experience, siteConfig } from '@/src/config/v2/site';

const ABOUT_INTRO = `${yearsExperience} years designing products across ${siteConfig.industries}. I work from research through launch—clarity, systems, and interfaces that hold up in production.`;

export function AboutExperience() {
  return (
    <article>
      <section className="border-b border-border-subtle" aria-labelledby="about-hero-heading">
        <div className="mx-auto grid min-h-[calc(100svh-57px)] max-w-[1600px] md:grid-cols-12">
          <div className="v2-about-intro archive-grid relative flex flex-col justify-between overflow-hidden bg-bg-surface p-5 text-text-primary md:col-span-7 md:p-8">
            <p className="archive-label text-accent-pop">A bit about who I am</p>
            <motion.h1
              id="about-hero-heading"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="archive-display archive-display--hero my-12 text-[clamp(2.75rem,10vw,7rem)] md:my-16"
            >
              <span className="text-accent-pop">Designer by day.</span>
              <br />
              <span className="text-text-primary">Gamer at night.</span>
            </motion.h1>
            <div className="border-t border-border-subtle pt-6">
              <p className="max-w-[42ch] text-sm leading-relaxed text-text-secondary">{ABOUT_INTRO}</p>
            </div>
            <div className="mt-8 border-t border-border-subtle pt-5">
              <p className="archive-label text-accent-pop">
                {siteConfig.current}
                <br />
                {siteConfig.location}
              </p>
            </div>
          </div>
          <div className="relative min-h-[60vh] bg-bg-muted md:col-span-5 md:min-h-0">
            <Image
              src="/assets/images/profile-1400.webp"
              alt={`Portrait of ${siteConfig.name}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 42vw"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle" aria-labelledby="about-experience-heading">
        <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-8 md:py-24">
          <p className="archive-label text-text-muted">Where I&apos;ve worked · 2018 to now</p>
          <h2
            id="about-experience-heading"
            className="archive-display mt-5 text-[clamp(2.75rem,8vw,6rem)]"
          >
            Experience.
          </h2>
          <div className="mt-12 border-t border-border-subtle">
            {experience.map((job, index) => (
              <motion.div
                key={job.company}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid gap-4 border-b border-border-subtle py-7 md:grid-cols-12"
              >
                <span className="archive-label text-accent-pop md:col-span-1">0{index + 1}</span>
                <div className="md:col-span-3">
                  <h3 className="text-xl font-semibold tracking-tight">{job.company}</h3>
                  <p className="mt-1 text-sm text-text-secondary">{job.role}</p>
                </div>
                <p className="text-sm leading-relaxed text-text-secondary md:col-span-5">
                  {job.detail}
                </p>
                <p className="archive-label text-text-muted md:col-span-3 md:text-right">
                  {job.period}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <HashNavLink
              href="/#work"
              className="archive-label bg-text-primary px-5 py-3 text-bg-primary"
            >
              See selected work →
            </HashNavLink>
            <a
              href={siteConfig.links.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="archive-label border border-border-subtle px-5 py-3"
            >
              Resume ↗
              <span className="v2-visually-hidden"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>

      <ContactPanel headingId="about-contact-heading" formHeadingId="about-contact-form-heading" />
    </article>
  );
}
