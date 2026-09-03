'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ContactPanel } from '@/src/components/v2/ui/ContactPanel';
import { HashNavLink } from '@/src/components/v2/ui/HashNavLink';
import { experience, siteConfig, trustSignals } from '@/src/config/v2/site';

const INTERESTS_COPY =
  'Away from the screen, I read, stargaze, follow astronomy, and explore Hindu philosophy. I also play cricket, spend time in VR, and lately I’ve been going deeper into yoga.';

export function AboutExperience() {
  const [knowMoreOpen, setKnowMoreOpen] = useState(false);
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (knowMoreOpen) {
      if (!dialog.open) dialog.showModal();
      window.requestAnimationFrame(() => closeRef.current?.focus());
      return;
    }

    if (dialog.open) dialog.close();
  }, [knowMoreOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onClose = () => {
      setKnowMoreOpen(false);
      triggerRef.current?.focus();
    };

    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, []);

  return (
    <article>
      <section className="border-b border-border-subtle" aria-labelledby="about-hero-heading">
        <div className="mx-auto grid min-h-[calc(100svh-57px)] max-w-[1600px] md:grid-cols-12">
          <div className="archive-grid relative flex flex-col justify-between overflow-hidden bg-[#0c0c0c] p-5 text-white md:col-span-7 md:p-8">
            <p className="archive-label text-accent-pop">A bit about who I am</p>
            <motion.h1
              id="about-hero-heading"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="archive-display archive-display--hero my-12 text-[clamp(2.75rem,10vw,7rem)] md:my-16"
            >
              <span className="text-accent-pop">Designer by day.</span>
              <br />
              <span className="text-white">Gamer at night.</span>
            </motion.h1>
            <div className="grid gap-6 border-t border-white/20 pt-6 md:grid-cols-2">
              <p className="text-sm leading-relaxed text-white/85">
                {siteConfig.valueProposition}
              </p>
              <p className="archive-label text-accent-pop md:text-right">
                {siteConfig.current}
                <br />
                Based in {siteConfig.location}
              </p>
            </div>
            <div className="mt-8 border-t border-white/20 pt-5">
              <button
                ref={triggerRef}
                type="button"
                className="archive-label flex min-h-11 w-full items-center justify-between gap-4 text-left text-white transition-colors hover:text-accent-pop focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-expanded={knowMoreOpen}
                aria-haspopup="dialog"
                aria-controls={`${titleId}-dialog`}
                onClick={() => setKnowMoreOpen(true)}
              >
                <span>Know more</span>
                <span aria-hidden className="text-accent-pop">
                  +
                </span>
              </button>
            </div>

            <dialog
              ref={dialogRef}
              id={`${titleId}-dialog`}
              className="v2-about-dialog m-auto w-[min(100%,28rem)] max-w-[calc(100vw-2rem)] border border-white/20 bg-[#161616] p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] open:flex open:flex-col"
              aria-labelledby={titleId}
              aria-describedby={descId}
              onCancel={(event) => {
                event.preventDefault();
                setKnowMoreOpen(false);
              }}
            >
              <AnimatePresence>
                {knowMoreOpen ? (
                  <motion.div
                    className="p-5 md:p-6"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h2 id={titleId} className="archive-label text-accent-pop">
                        Know more
                      </h2>
                      <button
                        ref={closeRef}
                        type="button"
                        className="archive-label min-h-11 text-white transition-colors hover:text-accent-pop focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        onClick={() => setKnowMoreOpen(false)}
                      >
                        Close
                      </button>
                    </div>
                    <p id={descId} className="mt-5 max-w-[42ch] text-sm leading-relaxed text-white/90">
                      {INTERESTS_COPY}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </dialog>
          </div>
          <div className="relative min-h-[60vh] bg-bg-muted md:col-span-5 md:min-h-0">
            <Image
              src="/assets/images/profile.png"
              alt={`Portrait of ${siteConfig.name}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 42vw"
            />
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
                <p className="v2-trust-fact-label mt-5 text-text-muted">{signal.label}</p>
              </div>
            ))}
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
              href="/v2/#work"
              className="archive-label bg-text-primary px-5 py-3 text-bg-primary"
            >
              See selected work →
            </HashNavLink>
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

      <ContactPanel headingId="about-contact-heading" formHeadingId="about-contact-form-heading" />
    </article>
  );
}
