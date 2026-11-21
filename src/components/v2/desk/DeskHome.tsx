'use client';

import { motion, stagger, useReducedMotion, type Variants } from 'motion/react';
import Link from 'next/link';
import { DeskCopyEmail } from '@/src/components/v2/desk/DeskCopyEmail';
import { DeskSingularityStage } from '@/src/components/v2/desk/DeskSingularityStage';
import { DeskWorkRail } from '@/src/components/v2/desk/DeskWorkRail';
import type { ProjectCardData } from '@/src/config/v2/caseStudies';
import { blogPosts, publishedTools } from '@/src/config/v2/publishing';
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
            I love exploring where design and technology come together, turning ideas into digital
            experiences that are easy to use, meaningful to people, and create real value for
            businesses.
          </motion.p>
          <motion.p className="desk-contacts" variants={reduce ? undefined : line}>
            <DeskCopyEmail email={profile.email} />
            <span aria-hidden="true"> · </span>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </motion.p>
        </motion.div>
      </section>
      <DeskWorkRail cards={cards} resumeHref={profile.links.resume} />
      <section id="tools" className="desk-frame desk-home-copy desk-tools">
        <h2 className="desk-title">Tools</h2>
        <div className="desk-tool-list">
          {publishedTools.map((tool) => (
            <a key={tool.href} className="desk-tool" href={tool.href} target="_blank" rel="noopener noreferrer">
              <p className="desk-tool-title">{tool.title}</p>
              <p className="desk-lede">{tool.kind}</p>
              {tool.publishedLabel ? (
                <time className="desk-lede" dateTime={tool.published}>
                  {tool.publishedLabel}
                </time>
              ) : null}
            </a>
          ))}
        </div>
        <h2 className="desk-title">
          <Link className="desk-section-link" href="/desk/blog/">
            Blogs
            <span className="desk-section-link-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </h2>
        <div className="desk-tool-list">
          {blogPosts.map((post) => (
            <Link key={post.slug} className="desk-tool" href={`/desk/blog/${post.slug}/`}>
              <p className="desk-lede desk-tool-tags">{post.tags.join(' · ')}</p>
              <div className="desk-tool-row">
                <p className="desk-tool-title">{post.title}</p>
                <time className="desk-lede desk-tool-date" dateTime={post.published}>
                  {post.publishedLabel}
                </time>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
