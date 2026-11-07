'use client';

import { motion, stagger, useReducedMotion, type Variants } from 'motion/react';
import { DeskCopyEmail } from '@/src/components/v2/desk/DeskCopyEmail';
import { DeskSingularityStage } from '@/src/components/v2/desk/DeskSingularityStage';
import { DeskWorkRail } from '@/src/components/v2/desk/DeskWorkRail';
import type { ProjectCardData } from '@/src/config/v2/caseStudies';
import { profile } from '@/src/config/v2/profile';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const intro: Variants = {
  hidden: {},
  show: {
    transition: { delayChildren: stagger(0.08, { startDelay: 0.1 }) }
  }
};

const line: Variants = {
  hidden: { y: 14 },
  show: { y: 0, transition: { duration: 0.6, ease: EASE_OUT } }
};

export function DeskHome({ cards }: { cards: ProjectCardData[] }) {
  const reduce = useReducedMotion();

  return (
    <>
      <section className="desk-hero">
        <DeskSingularityStage />
        <motion.div
          className="desk-frame desk-home-copy"
          variants={reduce ? undefined : intro}
          initial={reduce ? false : 'hidden'}
          animate={reduce ? undefined : 'show'}
        >
          <motion.h1 className="desk-title" variants={reduce ? undefined : line}>
            Hey, I am Vittesh
          </motion.h1>
          <motion.p className="desk-lede" variants={reduce ? undefined : line}>
            Product Designer{' '}
            <a
              className="desk-lede-org"
              href="https://www.nagarro.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              @Nagarro
            </a>{' '}
            • 7+ years
          </motion.p>
          <motion.p className="desk-desc" variants={reduce ? undefined : line}>
            I enjoy exploring the space between design and technology, building digital experiences
            that are as thoughtful in how they work as they are in how they feel.
          </motion.p>
          <motion.p className="desk-contacts" variants={reduce ? undefined : line}>
            <DeskCopyEmail email={profile.email} />
            <span aria-hidden="true"> · </span>
            <a href={profile.links.resume} target="_blank" rel="noopener noreferrer">
              Resume
            </a>
          </motion.p>
        </motion.div>
      </section>
      <DeskWorkRail cards={cards} />
    </>
  );
}
