'use client';

import Link from 'next/link';
import { DeskCopyEmail } from '@/src/components/v2/desk/DeskCopyEmail';
import { DeskSingularityStage } from '@/src/components/v2/desk/DeskSingularityStage';
import { DeskWorkRail } from '@/src/components/v2/desk/DeskWorkRail';
import type { ProjectCardData } from '@/src/config/v2/caseStudies';
import { blogPosts, publishedTools } from '@/src/config/v2/publishing';
import { profile } from '@/src/config/v2/profile';

export function DeskHome({ cards }: { cards: ProjectCardData[] }) {
  return (
    <>
      <section className="desk-hero">
        <DeskSingularityStage />
        {/* Lines blur in and lift, staggered: CSS (`.desk-enter-lines`), so they paint at once. */}
        <div className="desk-frame desk-home-copy desk-enter-lines">
          <h1 className="desk-title">
            Hey, I am Vittesh
          </h1>
          <p className="desk-lede">
            Product Designer{' '}
            <a
              className="desk-lede-org"
              href="https://www.nagarro.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              @Nagarro
            </a>{' '}
            • {profile.yearsExperience}+ years
          </p>
          <p className="desk-desc">
            I love exploring where design and technology come together, turning ideas into digital
            experiences that are easy to use, meaningful to people, and create real value for
            businesses.
          </p>
          <p className="desk-contacts">
            <DeskCopyEmail email={profile.email} />
            <span aria-hidden="true"> · </span>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </p>
        </div>
      </section>
      <DeskWorkRail id="work" cards={cards} resumeHref={profile.links.resume} />
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
          <Link className="desk-section-link" href="/blog/">
            Blogs
            <span className="desk-section-link-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </h2>
        <div className="desk-tool-list">
          {blogPosts.map((post) => (
            <Link key={post.slug} className="desk-tool" href={`/blog/${post.slug}/`}>
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
