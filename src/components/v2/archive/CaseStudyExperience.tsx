'use client';

import Link from 'next/link';
import { Fragment, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { CaseStory, Project } from '@/src/config/v2/caseStudies';
import { howMeasured, projects } from '@/src/config/v2/caseStudies';
import { HashNavLink, scrollToHash } from '@/src/components/v2/ui/HashNavLink';
import { triggerHaptic } from '@/src/components/v2/ui/haptics';
import { isUnconfirmed } from '@/src/config/v2/profile';

function ChoicePanel({
  label,
  items
}: {
  label: string;
  items: { title: string; body: string }[];
}) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const current = items[active];

  return (
    <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(14rem,18rem)_minmax(0,40rem)] lg:gap-14">
      <div role="tablist" aria-label={label} className="flex gap-2 overflow-x-auto lg:flex-col">
        {items.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.title}
              type="button"
              role="tab"
              id={`${baseId}-tab-${index}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                const next =
                  event.key === 'ArrowDown' || event.key === 'ArrowRight'
                    ? (index + 1) % items.length
                    : event.key === 'ArrowUp' || event.key === 'ArrowLeft'
                      ? (index - 1 + items.length) % items.length
                      : null;
                if (next === null) return;
                event.preventDefault();
                setActive(next);
                document.getElementById(`${baseId}-tab-${next}`)?.focus();
              }}
              className={`shrink-0 border px-4 py-3 text-left transition-colors lg:w-full ${
                selected
                  ? 'border-accent-pop bg-bg-surface text-text-primary'
                  : 'border-border-subtle text-text-secondary hover:border-accent-pop hover:text-text-primary'
              }`}
            >
              <span className="archive-label text-accent-pop">0{index + 1}</span>
              <span className="mt-2 block text-sm font-medium">{item.title}</span>
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${active}`}
        className="min-w-0"
      >
        <h3 className="text-2xl font-semibold tracking-tight">{current.title}</h3>
        <p className="mt-4 text-base leading-7 text-text-secondary">{current.body}</p>
      </div>
    </div>
  );
}

function ScreenStage({ images }: { images: Project['images'] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const baseId = useId();
  const current = images[active];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!current) return null;

  const step = (delta: number) => {
    setActive((index) => (index + delta + images.length) % images.length);
  };

  return (
    <div>
      <figure className="border border-border-subtle bg-[#070707]">
        <button
          type="button"
          className="block w-full cursor-zoom-in"
          onClick={() => {
            triggerHaptic('medium');
            setOpen(true);
          }}
          aria-label={`Enlarge: ${current.alt}`}
        >
          {/* Natural ratio, so the screen is shown whole. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current.src} alt={current.alt} className="block h-auto w-full" />
        </button>
        <figcaption className="flex items-start justify-between gap-4 border-t border-border-subtle bg-bg-primary p-4">
          <span className="text-sm leading-relaxed text-text-secondary">{current.alt}</span>
          <span className="archive-label shrink-0 text-accent-pop">
            0{active + 1} / 0{images.length}
          </span>
        </figcaption>
      </figure>

      <div
        role="tablist"
        aria-label="Screens"
        className="mt-4 flex gap-3 overflow-x-auto pb-2"
      >
        {images.map((image, index) => {
          const selected = index === active;
          return (
            <button
              key={image.src}
              type="button"
              role="tab"
              id={`${baseId}-screen-${index}`}
              aria-selected={selected}
              aria-label={image.alt}
              onClick={() => setActive(index)}
              className={`w-36 shrink-0 border bg-[#070707] p-1 transition-colors ${
                selected ? 'border-accent-pop' : 'border-border-subtle hover:border-accent-pop'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.src} alt="" className="block h-auto w-full" />
            </button>
          );
        })}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={current.alt}
        className="w-[min(1100px,calc(100vw-2rem))] max-w-none border border-border-subtle bg-bg-primary p-0 text-text-primary backdrop:bg-black/80"
        onClose={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') step(1);
          if (event.key === 'ArrowLeft') step(-1);
        }}
      >
        <div className="flex items-center justify-between gap-4 border-b border-border-subtle px-4 py-3">
          <p className="text-sm text-text-secondary">{current.alt}</p>
          <button
            type="button"
            className="archive-label shrink-0 text-accent-pop"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
        <div className="bg-[#070707]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current.src} alt={current.alt} className="block h-auto w-full" />
        </div>
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <button type="button" className="text-sm text-text-secondary hover:text-accent-pop" onClick={() => step(-1)}>
            ← Previous
          </button>
          <span className="archive-label text-text-muted">
            0{active + 1} / 0{images.length}
          </span>
          <button type="button" className="text-sm text-text-secondary hover:text-accent-pop" onClick={() => step(1)}>
            Next →
          </button>
        </div>
      </dialog>
    </div>
  );
}

function ZoomImage({ src, alt, showCaption = true }: { src: string; alt: string; showCaption?: boolean }) {
  return (
    <figure className="v2-story-shot">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" />
      {showCaption ? (
        <figcaption className="border-t border-border-subtle bg-bg-primary px-4 py-3 text-sm leading-relaxed text-text-secondary">
          {alt}
        </figcaption>
      ) : null}
    </figure>
  );
}

const wrap = 'mx-auto max-w-[1600px] px-4 md:px-8';

function Label({ children, light }: { children: string; light?: boolean }) {
  return (
    <p className={`archive-label ${light ? 'text-white/60' : 'text-text-muted'}`}>{children}</p>
  );
}

const storySections = [
  { id: 'overview', label: 'Overview' },
  { id: 'idea', label: 'The idea' },
  { id: 'redesign', label: 'The redesign' },
  { id: 'system', label: 'The system' },
  { id: 'scale', label: 'The scale' },
  { id: 'reflection', label: 'Reflection' }
];

function useActiveStorySection() {
  const [active, setActive] = useState(storySections[0].id);

  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.32;
      let current = storySections[0].id;
      for (const item of storySections) {
        const section = document.getElementById(item.id);
        if (!section) continue;
        if (section.getBoundingClientRect().top - 8 <= line) current = item.id;
      }
      setActive((previous) => (previous === current ? previous : current));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('v2-lenis-scroll', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('v2-lenis-scroll', update);
    };
  }, []);

  return active;
}

function StoryNav({ active }: { active: string }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const slot = slotRef.current;
    const nav = navRef.current;
    const article = slot?.closest('article');
    if (!slot || !nav || !article) return;

    const update = () => {
      const header = document.querySelector('.v2-archive-header');
      const headerHidden = header?.getAttribute('data-hidden') === 'true';
      const headerHeight = headerHidden ? 16 : Math.round(header?.getBoundingClientRect().height ?? 72);
      const desktop = window.matchMedia('(min-width: 1024px)').matches;
      if (!desktop) {
        nav.dataset.dock = 'stick';
        article.style.paddingTop = '';
        return;
      }
      const story = article.querySelector('.v2-story-main');
      const limitBox = (story ?? article).getBoundingClientRect();
      const navHeight = nav.offsetHeight;
      const slotBox = slot.getBoundingClientRect();
      const stickTop = desktop
        ? Math.max(headerHeight + 12, Math.round((window.innerHeight - navHeight) / 2))
        : headerHeight;
      const past = limitBox.bottom < stickTop + navHeight + 24;

      if (past) {
        nav.dataset.dock = 'end';
        nav.style.top = 'auto';
        nav.style.bottom = '24px';
        nav.style.transform = 'none';
        nav.style.left = desktop ? '0px' : '';
        nav.style.width = desktop ? '100%' : '';
        article.style.paddingTop = '';
        return;
      }

      nav.dataset.dock = 'stick';
      nav.style.top = `${stickTop}px`;
      nav.style.bottom = 'auto';
      nav.style.transform = 'none';
      if (desktop) {
        nav.style.left = `${Math.round(slotBox.left)}px`;
        nav.style.width = `${Math.round(slotBox.width)}px`;
        article.style.paddingTop = '';
      } else {
        nav.style.left = '0px';
        nav.style.width = '';
        article.style.paddingTop = `${navHeight}px`;
      }
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('v2-lenis-scroll', update);
    return () => {
      article.style.paddingTop = '';
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('v2-lenis-scroll', update);
    };
  }, []);

  useEffect(() => {
    const list = listRef.current;
    const current = list?.querySelector<HTMLAnchorElement>('[aria-current="true"]');
    if (!list || !current || window.matchMedia('(min-width: 1024px)').matches) return;
    const left = current.offsetLeft - (list.clientWidth - current.offsetWidth) / 2;
    list.scrollTo({ left, behavior: 'smooth' });
  }, [active]);

  return (
    <div ref={slotRef} className="v2-story-nav-slot">
      <nav ref={navRef} className="v2-story-nav" data-dock="stick" aria-label="Case study sections">
        <ul ref={listRef}>
          {storySections.map((item) => {
            const current = item.id === active;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={current ? 'true' : undefined}
                  onClick={(event) => {
                    if (scrollToHash(item.id)) event.preventDefault();
                  }}
                >
                  <span className="v2-story-nav-mark" aria-hidden="true" />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function FlowDiagram({ steps, caption }: { steps: string[]; caption?: string }) {
  return (
    <figure className="mt-12 max-w-[1100px]">
      <ol className="sr-only">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <div aria-hidden="true" className="v2-flow">
        {steps.map((step, index) => (
          <Fragment key={step}>
            <div className="v2-flow-step">
              <span className="archive-label text-accent-pop">{String(index + 1).padStart(2, '0')}</span>
              <p>{step}</p>
            </div>
            {index < steps.length - 1 ? <span className="v2-flow-arrow" /> : null}
          </Fragment>
        ))}
      </div>
      {caption ? <figcaption className="mt-4 text-sm leading-relaxed text-text-secondary">{caption}</figcaption> : null}
    </figure>
  );
}

const storyHeading = 'archive-serif max-w-[68ch] text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight';
const storyCopy = 'max-w-[68ch] text-lg leading-[1.65] text-text-secondary';

function StoryBody({ story }: { story: CaseStory }) {
  return (
    <>
      <section id="overview" className="v2-story-section border-b border-border-subtle">
        <div className="py-16 md:py-24">
          <h2 className={storyHeading}>{story.problemTitle}</h2>
          <ol className="mt-12 max-w-[1100px] space-y-10">
            {story.problemPoints.map((point, index) => (
              <li key={point.title} className="grid gap-3 border-t border-border-subtle pt-8 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-10">
                <p className="archive-label text-accent-pop">{String(index + 1).padStart(2, '0')}</p>
                <div>
                  <h3 className="text-2xl font-medium leading-snug">{point.title}</h3>
                  <p className="mt-3 max-w-[62ch] text-lg leading-[1.65] text-text-secondary">{point.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="v2-story-line archive-serif mt-16 text-[clamp(1.75rem,3vw,2.75rem)] leading-tight">
            {story.problemClose}
          </p>
        </div>
      </section>

      <section id="idea" className="v2-story-section border-b border-border-subtle">
        <div className="py-16 md:py-24">
          <h2 className={storyHeading}>{story.ideaTitle}</h2>
          <FlowDiagram steps={story.ideaFlow} />
          <p className={`mt-10 ${storyCopy}`}>{story.idea}</p>
          <ol className="v2-story-pair mt-10 md:mt-16">
            {story.questions.map((item) => (
              <li key={item.index}>
                <p className="archive-label text-accent-pop">{item.index}</p>
                <p className="v2-story-pair-title archive-serif">{item.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-14 max-w-[68ch] text-sm leading-relaxed text-text-muted">{story.ideaNote}</p>
        </div>
      </section>

      <section id="redesign" className="v2-story-section border-b border-border-subtle">
        <div className="py-16 md:py-24">
          <h2 className={storyHeading}>{story.redesignTitle}</h2>
          <div className="mt-6 max-w-[1100px]">
            {story.moments.map((moment) => (
              <article key={moment.label} className="mt-16">
                <p className="archive-label text-accent-pop">{moment.label}</p>
                <h3 className="archive-serif mt-3 text-[clamp(1.75rem,2.8vw,2.5rem)] leading-tight">{moment.title}</h3>
                <p className={`mt-4 ${storyCopy}`}>{moment.body}</p>
                <div className="mt-8">
                  <ZoomImage src={moment.image.src} alt={moment.image.alt} showCaption={false} />
                </div>
              </article>
            ))}
          </div>
          <p className="v2-story-line archive-serif mt-20 text-[clamp(1.75rem,3vw,2.75rem)] leading-tight">
            {story.redesignClose}
          </p>
        </div>
      </section>

      <section id="system" className="v2-story-section border-b border-border-subtle">
        <div className="py-16 md:py-24">
          <h2 className={storyHeading}>{story.systemTitle}</h2>
          <div className="v2-story-split">
            <div>
              <h3>UI kit</h3>
              <p>{story.kit}</p>
            </div>
            <div>
              <h3>{story.iconsTitle}</h3>
              <p>{story.icons}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="scale" className="v2-story-section border-b border-border-subtle">
        <div className="py-16 md:py-24">
          <h2 className={storyHeading}>{story.scaleTitle}</h2>
          <p className="archive-label mt-12 text-text-muted">Flexible layer</p>
          <FlowDiagram steps={story.scaleFlexible} />
          <p className={`mt-10 ${storyCopy}`}>{story.scale}</p>
        </div>
      </section>

      <section id="reflection" className="v2-story-section border-b border-border-subtle">
        <div className="py-16 md:py-24">
          <h2 className={`${storyHeading} text-accent-pop`}>{story.resultsTitle}</h2>
          <ol className="v2-story-results">
            {story.results.map((item, index) => (
              <li key={item.title}>
                <p className="archive-label text-accent-pop">{String(index + 1).padStart(2, '0')}</p>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 max-w-[68ch] text-sm leading-relaxed text-text-muted">{story.honesty}</p>
        </div>
      </section>
    </>
  );
}

function ClassicBody({ project }: { project: Project }) {
  const details = [
    ['Company', project.company],
    ['Client', project.client],
    ['Industry', project.industry],
    ['Role', project.role],
    ['Platforms', project.platforms],
    ['Audience', project.customers]
  ].filter(([, value]) => !isUnconfirmed(value));
  const measured = howMeasured(project);

  return (
    <>
      <section className="border-b border-border-subtle">
        <dl className={`${wrap} flex flex-wrap gap-x-12 gap-y-6 py-12 md:py-16`}>
          {details.map(([label, value]) => (
            <div key={label} className="min-w-[10rem] max-w-xs">
              <dt className="archive-label text-accent-pop">{label}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-text-secondary">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-b border-border-subtle">
        <div className={`${wrap} py-16 md:py-20`}>
          <Label>01 / The challenge</Label>
          <h2 className="archive-serif mt-5 max-w-[22ch] text-[clamp(1.75rem,4vw,3rem)]">{project.challenge}</h2>
          <p className="mt-8 max-w-2xl text-base leading-7 text-text-secondary">{project.summary}</p>
          {measured && !isUnconfirmed(measured) ? (
            <p className="mt-6 max-w-2xl text-base leading-7 text-text-secondary">How measured: {measured}</p>
          ) : null}
          <ul className="mt-10 flex max-w-3xl flex-wrap gap-x-10 gap-y-6">
            {project.metrics.map((metric) => (
              <li key={metric.label}>
                <p className="text-2xl font-semibold tracking-tight text-accent-pop">{metric.value}</p>
                <p className="archive-label mt-2 text-text-muted">{metric.label}</p>
              </li>
            ))}
          </ul>
          <div className="mt-12 grid max-w-5xl gap-10 md:grid-cols-2">
            <div>
              <p className="archive-label text-text-muted">What was broken</p>
              <ul className="mt-5 space-y-4">
                {project.problem.map((item) => (
                  <li key={item} className="border-l-2 border-accent-pop pl-4 text-base leading-7">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="archive-label text-text-muted">What I aimed for</p>
              <ul className="mt-5 space-y-4">
                {project.goal.map((item) => (
                  <li key={item} className="border-l border-border-subtle pl-4 text-base leading-7 text-text-secondary">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className={`${wrap} py-16 md:py-20`}>
          <Label>02 / Screens</Label>
          <h2 className="archive-display mt-5 text-[clamp(2.25rem,6vw,4.5rem)]">Look closer.</h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
            Choose a screen. Click it to open the full image.
          </p>
          <div className="mt-10">
            <ScreenStage images={project.images} />
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className={`${wrap} py-16 md:py-20`}>
          <Label>03 / How I worked</Label>
          <h2 className="archive-display mt-5 text-[clamp(2.25rem,6vw,4.5rem)]">The approach.</h2>
          <ChoicePanel label="Approach" items={project.process} />
        </div>
      </section>

      <section className="archive-blue">
        <div className={`${wrap} py-16 md:py-20`}>
          <Label light>04 / Results</Label>
          <h2 className="archive-serif mt-5 text-[clamp(2rem,4vw,3.25rem)]">What changed.</h2>
          <ol className="mt-10 max-w-3xl">
            {project.outcomes.map((item, index) => (
              <li key={item} className="border-b border-white/30 py-5">
                <span className="archive-label text-white/60">0{index + 1}</span>
                <p className="mt-2 text-lg leading-relaxed">{item}</p>
              </li>
            ))}
          </ol>
          {project.measurementNote ? (
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-white/70">{project.measurementNote}</p>
          ) : null}
        </div>
      </section>
    </>
  );
}

export function CaseStudyExperience({ project }: { project: Project }) {
  const next =
    projects[(projects.findIndex((item) => item.slug === project.slug) + 1) % projects.length];
  const active = useActiveStorySection();
  const band = project.story ? 'v2-story-wrap' : wrap;

  return (
    <article className={project.story ? 'v2-case-study v2-case-study--story' : 'v2-case-study'}>
      {project.story ? <StoryNav active={active} /> : null}
      <div className={project.story ? 'v2-story-main' : undefined}>
      <section className="border-b border-border-subtle">
        <div className={`${band} py-8 md:py-12`}>
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
            <HashNavLink href="/v2/#work" className="archive-label text-text-muted hover:text-accent-pop">
              ← Back to work
            </HashNavLink>
          </div>
          {project.story ? (
            <p className="archive-label mt-12 text-accent-pop">{project.story.eyebrow}</p>
          ) : null}
          <h1 className={`archive-display max-w-[12ch] ${project.story ? 'mt-5 text-[clamp(2.5rem,6vw,4.5rem)]' : 'mt-12 text-[clamp(3rem,8vw,6rem)]'}`}>{project.title}</h1>
          <p className="mt-6 max-w-[68ch] text-lg leading-[1.65] text-text-secondary">
            {project.story ? project.story.lede : project.outcomeLine}
          </p>
        </div>
        <div className={`${band} pb-8 md:pb-12`}>
          {project.story ? (
            <figure className="v2-story-shot v2-story-shot--wide">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.image} alt={project.imageAlt || `${project.title} overview`} />
            </figure>
          ) : (
            <div className="flex justify-center border border-border-subtle bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={project.imageAlt || `${project.title} overview`}
                className="block h-auto max-h-[70vh] w-auto max-w-full"
              />
            </div>
          )}
        </div>
        {project.story ? (
          <div className={`${band} pb-16 md:pb-20`}>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-border-subtle pt-8 md:grid-cols-3">
              {project.story.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="archive-label text-accent-pop">{fact.label}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-text-secondary">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 max-w-[68ch] text-base leading-7 text-text-secondary">{project.story.support}</p>
          </div>
        ) : null}
      </section>

      {project.story ? <StoryBody story={project.story} /> : <ClassicBody project={project} />}

      </div>
      <section className={project.story ? 'v2-story-next border-b border-border-subtle' : 'border-b border-border-subtle'}>
        <Link
          href={`/v2/work/${next.slug}/`}
          className={`group ${wrap} flex items-end justify-between gap-6 py-14 md:py-20`}
        >
          <div>
            <p className="archive-label text-text-muted">Next case study</p>
            <h2 className="archive-serif mt-4 text-[clamp(2rem,5vw,3.75rem)] transition-colors group-hover:text-accent-pop">
              {next.title}
            </h2>
          </div>
          <span className="text-4xl text-accent-pop">→</span>
        </Link>
      </section>
    </article>
  );
}
