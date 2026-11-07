'use client';

import { motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import type { ProjectCardData } from '@/src/config/v2/caseStudies';

const HOVER = {
  rest: { y: 0 },
  hover: { y: -2 }
};

const MEDIA = {
  rest: { scale: 1 },
  hover: { scale: 1.035 }
};

const SPRING = { type: 'spring', bounce: 0, visualDuration: 0.4 } as const;

export function DeskWalkmanCard({ card }: { card: ProjectCardData }) {
  const title = card.cardTitle || card.title;
  const cover = card.cardImages?.[0] || card.image;
  const meta = [card.cardRole, card.year].filter(Boolean).join(' · ');
  const reduce = useReducedMotion();

  const media = cover ? (
    <motion.div className="desk-product-media" variants={reduce ? undefined : MEDIA} transition={SPRING}>
      <Image
        src={cover}
        alt={card.imageAlt || title}
        fill
        sizes="(max-width: 640px) 86vw, 448px"
        className="desk-product-media-img"
      />
    </motion.div>
  ) : (
    <div className="desk-product-media desk-product-media-empty" aria-hidden="true" />
  );

  const copy = (
    <div className="desk-product-copy">
      <p className="desk-product-caption">
        {title}
        {card.comingSoon ? <span className="desk-product-soon"> · soon</span> : null}
      </p>
      {meta ? <p className="desk-product-sub">{meta}</p> : null}
    </div>
  );

  if (card.comingSoon) {
    return (
      <div className="desk-product is-soon" aria-disabled="true">
        <div className="desk-product-shell">{media}</div>
        {copy}
      </div>
    );
  }

  return (
    <motion.div
      className="desk-product-hover"
      initial="rest"
      animate="rest"
      whileHover={reduce ? undefined : 'hover'}
      variants={reduce ? undefined : HOVER}
      transition={SPRING}
    >
      <Link href={`/desk/work/${card.slug}/`} className="desk-product">
        <div className="desk-product-shell">{media}</div>
        {copy}
      </Link>
    </motion.div>
  );
}
