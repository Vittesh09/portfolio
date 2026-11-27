'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { profile } from '@/src/config/v2/profile';

const PHOTO = '/assets/images/profile-192.webp';
/** Max tilt (deg) at the card's edges. */
const MAX_TILT_X = 14;
const MAX_TILT_Y = 18;

/**
 * The name in the hero with a tiny squircle portrait beside it. On hover (or
 * keyboard focus, or a tap on touch) the little photo grows into a small card:
 * a bigger portrait, full name and role, opening from where the tiny photo sits.
 */
export function DeskNamePeek({ name }: { name: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  /** Pointer position over the card → tilt angles and where the foil/glare sit. */
  const tilt = (event: ReactPointerEvent<HTMLSpanElement>) => {
    const card = cardRef.current;
    if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = card.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - r.left) / r.width));
    const y = Math.min(1, Math.max(0, (event.clientY - r.top) / r.height));
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      card.dataset.tilting = 'true';
      card.style.setProperty('--rx', `${((0.5 - y) * MAX_TILT_X).toFixed(2)}deg`);
      card.style.setProperty('--ry', `${((x - 0.5) * MAX_TILT_Y).toFixed(2)}deg`);
      card.style.setProperty('--px', `${(x * 100).toFixed(1)}%`);
      card.style.setProperty('--py', `${(y * 100).toFixed(1)}%`);
    });
  };

  const untilt = () => {
    const card = cardRef.current;
    if (!card) return;
    cancelAnimationFrame(frame.current);
    delete card.dataset.tilting;
    card.style.removeProperty('--rx');
    card.style.removeProperty('--ry');
    card.style.removeProperty('--px');
    card.style.removeProperty('--py');
  };

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close, true);
    return () => document.removeEventListener('pointerdown', close, true);
  }, [open]);

  return (
    <span
      ref={ref}
      className="desk-namecard"
      tabIndex={0}
      aria-label={`${name}. ${profile.name}, ${profile.title}`}
      data-open={open ? 'true' : undefined}
      onPointerUp={(event) => {
        if (event.pointerType === 'touch') setOpen((v) => !v);
      }}
    >
      <span className="desk-namecard-mini" aria-hidden="true">
        <Image src={PHOTO} alt="" width={48} height={48} />
      </span>
      <span aria-hidden="true">{name}</span>
      <span
        className="desk-namecard-pop"
        aria-hidden="true"
        onPointerMove={tilt}
        onPointerLeave={untilt}
        onPointerCancel={untilt}
      >
        <span ref={cardRef} className="desk-namecard-card">
          <span className="desk-namecard-photo">
            <Image src={PHOTO} alt="" width={96} height={96} />
          </span>
          <span className="desk-namecard-text">
            <span className="desk-namecard-name">{profile.name}</span>
            <span className="desk-namecard-role">{profile.title}</span>
          </span>
          {/* Holographic foil and a moving glare, both steered by the pointer. */}
          <span className="desk-namecard-holo" />
          <span className="desk-namecard-glare" />
        </span>
      </span>
    </span>
  );
}
