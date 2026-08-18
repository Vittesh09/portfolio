'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Project } from '@/src/config/v2/caseStudies';
import { projects } from '@/src/config/v2/caseStudies';

export function CaseStudyExperience({ project }: { project: Project }) {
  const next =
    projects[(projects.findIndex((item) => item.slug === project.slug) + 1) % projects.length];

  return (
    <article>
      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-6 md:py-12">
          <Link href="/v2/#work" className="archive-label text-text-muted hover:text-accent-pop">
            ← Back to work
          </Link>
          <div className="mt-12 grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="archive-label text-accent-pop">
                Case {project.index} · {project.year}
              </p>
              <h1 className="archive-display mt-5 text-[clamp(2.5rem,8vw,5.75rem)]">
                {project.title}
              </h1>
            </div>
            <p className="text-sm leading-relaxed text-text-secondary md:col-span-4">
              {project.outcomeLine}
            </p>
          </div>
        </div>
        <div className="relative aspect-[16/9] bg-[#070707] md:aspect-[21/8]">
          <Image
            src={project.image}
            alt={project.images[0]?.alt ?? ''}
            fill
            priority
            className="object-contain p-5 md:p-10"
            sizes="100vw"
          />
          <span className="archive-label absolute right-4 top-4 bg-bg-primary px-3 py-2">
            Overview
          </span>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto grid max-w-[1600px] md:grid-cols-12">
          <aside className="border-b border-border-subtle p-5 md:col-span-4 md:border-b-0 md:border-r md:p-8">
            <p className="archive-label text-text-muted">Project details</p>
            <dl className="mt-8 space-y-5">
              {[
                ['Client', project.client],
                ['Industry', project.industry],
                ['Role', project.role],
                ['Platforms', project.platforms],
                ['Audience', project.customers]
              ].map(([label, value]) => (
                <div key={label} className="border-t border-border-subtle pt-3">
                  <dt className="archive-label text-accent-pop">{label}</dt>
                  <dd className="mt-2 text-sm text-text-secondary">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
          <div className="p-5 md:col-span-8 md:p-10">
            <p className="archive-label text-text-muted">01 / The challenge</p>
            <h2 className="archive-serif mt-5 max-w-[28ch] text-[clamp(1.65rem,3.6vw,2.85rem)]">
              {project.challenge}
            </h2>
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-text-secondary">
              {project.summary}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto grid max-w-[1600px] md:grid-cols-3">
          {project.metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`border-b border-border-subtle p-5 md:border-b-0 md:p-8 ${
                index > 0 ? 'md:border-l' : ''
              }`}
            >
              <p className="archive-display archive-display--stat text-4xl text-accent-pop md:text-5xl">
                {metric.value}
              </p>
              <p className="archive-label mt-5 text-text-muted">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-6 md:py-24">
          <p className="archive-label text-text-muted">02 / Screens &amp; moments</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {project.images.slice(1).map((image, index) => (
              <motion.figure
                key={image.src}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                className={`border border-border-subtle bg-bg-surface ${
                  project.images.length === 2 ? 'md:col-span-2' : ''
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#070707]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-contain p-5 md:p-8"
                    sizes={
                      project.images.length === 2
                        ? '100vw'
                        : '(max-width: 768px) 100vw, 50vw'
                    }
                  />
                </div>
                <figcaption className="flex justify-between gap-4 border-t border-border-subtle p-4">
                  <span className="text-sm text-text-secondary">{image.alt}</span>
                  <span className="archive-label shrink-0 text-accent-pop">
                    0{index + 2}
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-6 md:py-24">
          <p className="archive-label text-text-muted">03 / How I worked</p>
          <h2 className="archive-display mt-5 text-[clamp(2.5rem,8vw,5.5rem)]">The approach.</h2>
          <div className="mt-12 grid border border-border-subtle md:grid-cols-3">
            {project.process.map((step, index) => (
              <motion.div
                key={step.title}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`border-b border-border-subtle p-5 last:border-b-0 md:border-b-0 md:p-8 ${
                  index > 0 ? 'md:border-l' : ''
                }`}
              >
                <span className="archive-label text-accent-pop">0{index + 1}</span>
                <h3 className="mt-8 text-2xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-text-secondary">{step.body}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <div>
              <p className="archive-label text-text-muted">What was broken</p>
              <ul className="mt-5 space-y-3">
                {project.problem.map((item) => (
                  <li key={item} className="border-l-2 border-accent-pop pl-4 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="archive-label text-text-muted">What I aimed for</p>
              <ul className="mt-5 space-y-3">
                {project.goal.map((item) => (
                  <li key={item} className="border-l border-border-subtle pl-4 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="archive-blue">
        <div className="mx-auto grid max-w-[1600px] md:grid-cols-12">
          <div className="border-b border-white/30 p-5 md:col-span-4 md:border-b-0 md:border-r md:p-8">
            <p className="archive-label text-white/60">04 / Results</p>
            <h2 className="archive-serif mt-8 text-[clamp(2rem,4vw,3.25rem)]">What moved.</h2>
          </div>
          <div className="p-5 md:col-span-8 md:p-8">
            {project.outcomes.map((item, index) => (
              <div
                key={item}
                className="grid border-b border-white/30 py-5 last:border-b-0 md:grid-cols-12"
              >
                <span className="archive-label text-white/60 md:col-span-2">0{index + 1}</span>
                <p className="mt-2 text-lg md:col-span-10 md:mt-0">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <Link
          href={`/v2/work/${next.slug}/`}
          className="group mx-auto grid max-w-[1600px] gap-5 px-4 py-14 md:grid-cols-12 md:items-end md:px-6 md:py-20"
        >
          <div className="md:col-span-9">
            <p className="archive-label text-text-muted">Next case study</p>
            <h2 className="archive-serif mt-4 text-[clamp(2rem,5vw,3.75rem)] transition-colors group-hover:text-accent-pop">
              {next.title}
            </h2>
          </div>
          <span className="text-4xl text-accent-pop md:col-span-3 md:text-right">→</span>
        </Link>
      </section>
    </article>
  );
}
