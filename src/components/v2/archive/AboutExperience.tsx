'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { experience, siteConfig, trustSignals } from '@/src/config/v2/site';

export function AboutExperience() {
  return (
    <article>
      <section className="border-b border-border-subtle">
        <div className="mx-auto grid min-h-[calc(100svh-57px)] max-w-[1600px] md:grid-cols-12">
          <div className="archive-grid flex flex-col justify-between p-5 md:col-span-7 md:p-8">
            <p className="archive-label text-accent-pop">A bit about who I am</p>
            <motion.h1
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="archive-display archive-display--hero my-12 text-[clamp(2.75rem,10vw,7rem)] md:my-16"
            >
              Designer by day.
              <br />
              <span className="text-accent-pop">Always noticing.</span>
            </motion.h1>
            <div className="grid gap-6 border-t border-border-subtle pt-6 md:grid-cols-2">
              <p className="text-sm leading-relaxed text-text-secondary">
                {siteConfig.valueProposition}
              </p>
              <p className="archive-label text-accent-pop md:text-right">
                {siteConfig.current}
                <br />
                Based in {siteConfig.location}
              </p>
            </div>
          </div>
          <div className="relative min-h-[60vh] bg-bg-muted md:col-span-5 md:min-h-0">
            <Image
              src="/assets/images/profile.png"
              alt={siteConfig.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 42vw"
            />
            <span className="archive-label absolute right-4 top-4 bg-accent-blue px-3 py-2 text-white">
              Me
            </span>
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto grid max-w-[1600px] md:grid-cols-12">
          <div className="border-b border-border-subtle p-5 md:col-span-3 md:border-b-0 md:border-r md:p-8">
            <p className="archive-label text-text-muted">How I think</p>
          </div>
          <div className="p-5 md:col-span-9 md:p-10">
            <p className="archive-serif max-w-[28ch] text-[clamp(1.85rem,4.2vw,3.25rem)]">
              {siteConfig.statement}
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <p className="text-sm leading-relaxed text-text-secondary">{siteConfig.about}</p>
              <p className="text-sm leading-relaxed text-text-secondary">{siteConfig.personality}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid md:grid-cols-3">
            {trustSignals.map((signal, index) => (
              <div
                key={signal.label}
                className={`border-b border-border-subtle p-5 md:border-b-0 md:p-8 ${
                  index > 0 ? 'md:border-l' : ''
                }`}
              >
                <p className="archive-display archive-display--stat text-5xl text-accent-pop md:text-6xl">
                  {signal.value}
                </p>
                <p className="archive-label mt-5 text-text-muted">{signal.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-8 md:py-24">
          <p className="archive-label text-text-muted">Where I&apos;ve worked · 2018 to now</p>
          <h2 className="archive-display mt-5 text-[clamp(2.75rem,8vw,6rem)]">Experience.</h2>
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
            <Link
              href="/v2/#work"
              className="archive-label bg-text-primary px-5 py-3 text-bg-primary"
            >
              See selected work →
            </Link>
            <a
              href={siteConfig.links.resume}
              download
              className="archive-label border border-border-subtle px-5 py-3"
            >
              Download resume ↓
            </a>
          </div>
        </div>
      </section>

      <section className="archive-blue">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 py-16 md:flex-row md:items-end md:justify-between md:px-8 md:py-20">
          <h2 className="archive-serif max-w-[16ch] text-[clamp(2rem,4.5vw,3.5rem)]">
            Building something hard to use?
          </h2>
          <a
            href={`mailto:${siteConfig.email}`}
            className="archive-label border border-white px-5 py-4 text-center hover:bg-white hover:text-accent-blue"
          >
            {siteConfig.email} ↗
          </a>
        </div>
      </section>
    </article>
  );
}
