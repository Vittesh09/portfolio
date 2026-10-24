'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/src/components/v2/ui/Toast';
import { triggerHaptic } from '@/src/components/v2/ui/haptics';
import { COPY_EMAIL_SOUND, playUiSound } from '@/src/components/v2/ui/playUiSound';
import { type ProjectCardData } from '@/src/config/v2/caseStudies';
import { noOrphan, v2Path, yearsExperience } from '@/src/config/v2/profile';
import { siteConfig } from '@/src/config/v2/site';

const menu = [
  { label: 'Home', href: v2Path('/'), external: false },
  { label: 'Work', href: v2Path('/#work'), external: false },
  { label: 'About', href: v2Path('/about/'), external: false },
  { label: 'Resume', href: siteConfig.links.resume, external: true },
  { label: 'Contact', href: v2Path('/#contact'), external: false }
];

function TldrWorkLine({ project }: { project: ProjectCardData }) {
  const { showToast } = useToast();
  const locked = Boolean(project.comingSoon);

  const inner = (
    <>
      <span className="v2-tldr-year">{project.year}</span>
      <span className="v2-tldr-line-title">{noOrphan(project.title)}</span>
    </>
  );

  if (locked) {
    return (
      <li>
        <button
          type="button"
          className="v2-tldr-line"
          aria-label={`${project.title}, coming soon`}
          onClick={() => {
            triggerHaptic('medium');
            showToast('Coming soon');
          }}
        >
          {inner}
        </button>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={v2Path(`/work/${project.slug}/`)}
        className="v2-tldr-line"
        onClick={() => triggerHaptic('medium')}
      >
        {inner}
      </Link>
    </li>
  );
}

export function TldrExperience({ cards }: { cards: ProjectCardData[] }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const copyEmail = useCallback(async () => {
    playUiSound(COPY_EMAIL_SOUND);
    try {
      await navigator.clipboard.writeText(siteConfig.email);
    } catch {
      const input = document.createElement('textarea');
      input.value = siteConfig.email;
      input.setAttribute('readonly', '');
      input.style.position = 'absolute';
      input.style.left = '-9999px';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopied(true);
    triggerHaptic('success');
  }, []);

  return (
    <article className="v2-tldr">
      <header className="v2-tldr-bar">
        <Link href={v2Path('/')} className="v2-tldr-wordmark">
          {siteConfig.name}
        </Link>
        <button
          type="button"
          className="v2-tldr-menu-btn"
          aria-expanded={open}
          aria-controls="tldr-menu"
          onClick={() => {
            triggerHaptic('light');
            setOpen((value) => !value);
          }}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </header>

      {open ? (
        <nav id="tldr-menu" className="v2-tldr-menu" aria-label="Site">
          {menu.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="v2-tldr-menu-link"
                onClick={() => setOpen(false)}
              >
                {item.label}
                <span className="v2-visually-hidden"> (opens in a new tab)</span>
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="v2-tldr-menu-link"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
      ) : null}

      <div className="v2-tldr-sheet">
        <button
          type="button"
          className="v2-tldr-email"
          onClick={() => void copyEmail()}
          aria-label={copied ? 'Email copied to clipboard' : `Copy email ${siteConfig.email}`}
        >
          {copied ? 'Copied' : siteConfig.email}
        </button>

        <figure className="v2-tldr-portrait">
          <Image
            src="/assets/images/profile-1400.webp"
            alt={`Portrait of ${siteConfig.name}`}
            width={420}
            height={420}
            priority
            className="v2-tldr-portrait-img"
            sizes="(max-width: 768px) 38vw, 152px"
          />
        </figure>

        <div className="v2-tldr-foot">
          <h1 id="tldr-heading" className="v2-tldr-name">
            {siteConfig.name}
          </h1>
          <p className="v2-tldr-bio">
            {noOrphan(`${siteConfig.role}. ${yearsExperience} years. ${siteConfig.location}.`)}
          </p>

          <section aria-labelledby="tldr-work-heading">
            <h2 id="tldr-work-heading" className="v2-visually-hidden">
              Selected work
            </h2>
            <ul className="v2-tldr-lines">
              {cards.map((project) => (
                <TldrWorkLine key={project.slug} project={project} />
              ))}
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
}
