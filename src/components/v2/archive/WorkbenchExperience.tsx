'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  workbenchComponents,
  workbenchExperiments,
  workbenchMeta,
  workbenchWriting
} from '@/src/config/v2/workbench';

function ComponentPreview({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="rounded-sm border border-white/25 bg-[#101116] p-4 text-white">
        <div className="flex items-center justify-between">
          <span className="archive-label text-white/50">RDS recommendation</span>
          <span className="rounded-full bg-[#79f2bd] px-2 py-1 text-[9px] font-semibold text-black">
            Save $420/mo
          </span>
        </div>
        <p className="mt-8 text-sm font-semibold">Resize dev-db-02</p>
        <p className="mt-2 text-xs text-white/55">db.t3.xlarge → db.t3.medium</p>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[72%] bg-accent-pop" />
        </div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="space-y-2 rounded-sm border border-white/25 bg-[#101116] p-4 text-white">
        {[
          ['Critical', 'Harsh braking + fatigue', '#ff5447'],
          ['Warning', 'Route deviation', '#f5a524'],
          ['Info', 'Service due in 5 days', '#7c9cff']
        ].map(([level, detail, color]) => (
          <div key={level} className="flex items-center gap-3 border border-white/10 p-3">
            <span className="h-2 w-2 rounded-full" style={{ background: color }} />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider">{level}</p>
              <p className="truncate text-xs text-white/55">{detail}</p>
            </div>
            <span className="text-xs">→</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-white/25 bg-white/20 text-white">
      {['Product', 'A', 'B', 'Price', '£4.99', '£3.59', 'Rating', '4.6', '5.0'].map(
        (item, itemIndex) => (
          <div
            key={`${item}-${itemIndex}`}
            className={`bg-[#101116] p-3 text-xs ${itemIndex % 3 === 0 ? 'col-span-2' : ''}`}
          >
            {item}
          </div>
        )
      )}
    </div>
  );
}

export function WorkbenchExperience() {
  return (
    <article>
      <section className="archive-grid border-b border-border-subtle">
        <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-8 md:py-24">
          <p className="archive-label text-accent-pop">Available for work</p>
          <h1 className="archive-display archive-display--hero mt-4 text-[clamp(3rem,12vw,7.5rem)]">
            Work
            <span className="text-accent-pop">bench.</span>
          </h1>
          <div className="mt-12 grid gap-6 border-t border-border-subtle pt-6 md:grid-cols-12">
            <p className="archive-serif max-w-[22ch] text-[clamp(1.75rem,3.8vw,3rem)] md:col-span-7">
              Smaller pieces I still stand behind: patterns, experiments, and notes in progress.
            </p>
            <p className="text-sm leading-relaxed text-text-secondary md:col-span-4 md:col-start-9">
              {workbenchMeta.description}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-8 md:py-24">
          <p className="archive-label text-text-muted">01 / Interface components</p>
          <h2 className="archive-display mt-5 text-[clamp(2.5rem,7vw,5rem)]">Reusable bits.</h2>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {workbenchComponents.map((component, index) => (
              <motion.article
                key={component.title}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                className="archive-project-card border border-border-subtle bg-bg-surface"
              >
                <div className="bg-[#070707] p-5">
                  <ComponentPreview index={index} />
                </div>
                <div className="p-5">
                  <div className="flex justify-between gap-4">
                    <span className="archive-label text-accent-pop">{component.index}</span>
                    <span className="archive-label text-text-muted">{component.category}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight">{component.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {component.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-8 md:py-24">
          <p className="archive-label text-text-muted">02 / Side projects</p>
          <h2 className="archive-display mt-5 text-[clamp(2.5rem,7vw,5rem)]">Explorations.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {workbenchExperiments.map((experiment) => (
              <article
                key={experiment.title}
                className="archive-project-card group border border-border-subtle bg-bg-surface"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#070707]">
                  <Image
                    src={experiment.image}
                    alt=""
                    fill
                    loading="lazy"
                    decoding="async"
                    className="archive-image object-contain p-5 md:p-8"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-5">
                  <p className="archive-label text-accent-pop">{experiment.type}</p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight">{experiment.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {experiment.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto grid max-w-[1600px] md:grid-cols-12">
          <div className="archive-blue p-5 md:col-span-4 md:p-8">
            <p className="archive-label text-white/60">03 / Writing</p>
            <h2 className="archive-serif mt-12 max-w-[12ch] text-[clamp(2rem,4.5vw,3.5rem)]">
              Things I&apos;m writing down.
            </h2>
          </div>
          <div className="md:col-span-8">
            {workbenchWriting.map((article, index) => (
              <div
                key={article.title}
                className="grid gap-4 border-b border-border-subtle p-5 last:border-b-0 md:grid-cols-12 md:p-8"
              >
                <span className="archive-label text-accent-pop md:col-span-1">0{index + 1}</span>
                <div className="md:col-span-7">
                  <p className="archive-label text-text-muted">
                    {article.topic} / {article.status}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight">{article.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-text-secondary md:col-span-4">
                  {article.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
