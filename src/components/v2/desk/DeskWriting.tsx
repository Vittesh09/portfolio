import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContinueWithAI } from '@/src/components/v2/blog/ContinueWithAI';
import { DeskPublishedList as PublishedList } from '@/src/components/v2/desk/DeskPublishedList';
import { DeskVideo } from '@/src/components/v2/desk/DeskVideo';
import {
  getBlogPost,
  getTalk,
  type BlogPost,
  type PostSection
} from '@/src/config/v2/publishing';

/** First paragraph is always the core line for the whole piece. */
function splitCore(post: BlogPost): { core: string | null; sections: PostSection[] } {
  const [first, ...rest] = post.sections;
  if (!first?.paragraphs.length) return { core: null, sections: post.sections };

  const [core, ...remaining] = first.paragraphs;
  const sections: PostSection[] = [];
  if (remaining.length || first.heading) {
    sections.push({ heading: first.heading, paragraphs: remaining });
  }
  sections.push(...rest);
  return { core, sections };
}

export function DeskWritingIndex() {
  return (
    <div className="desk-frame desk-home-copy desk-publish desk-publish-index">
      <p className="desk-contacts desk-publish-back">
        <Link href="/">Back</Link>
      </p>
      <h1 className="desk-title">Writing &amp; Speaking</h1>
      <p className="desk-lede desk-publish-note">
        Notes, essays and talks. The writing is personal and in my own voice: reflections,
        questions and perspectives that may sometimes be speculative or differ from established
        research. Take them as thoughts to explore, not absolute truths.
      </p>
      <div className="desk-tool-list desk-publish-list">
        <PublishedList />
      </div>
    </div>
  );
}

export function DeskTalk({ slug }: { slug: string }) {
  const talk = getTalk(slug);
  if (!talk) notFound();

  return (
    <article className="desk-frame desk-home-copy desk-publish">
      <p className="desk-contacts desk-publish-back">
        <Link href="/writing/">Back</Link>
      </p>
      <p className="desk-lede desk-tool-tags desk-talk-eyebrow">{talk.tags.join(' · ')}</p>
      <h1 className="desk-title">{talk.title}</h1>
      <p className="desk-lede">
        <time dateTime={talk.published}>{talk.publishedLabel}</time>
        {talk.host ? <> · Hosted by {talk.host}</> : null}
      </p>
      <DeskVideo title={talk.title} videos={talk.videos} covers={talk.covers} />
      <div className="desk-essay desk-talk-body">
        <p className="desk-desc">{talk.description}</p>
      </div>
    </article>
  );
}

export function DeskBlogPost({ slug }: { slug: string }) {
  const post = getBlogPost(slug);
  if (!post) notFound();

  const { core, sections } = splitCore(post);

  return (
    <article className="desk-frame desk-home-copy desk-publish">
      <p className="desk-contacts desk-publish-back">
        <Link href="/writing/">Back</Link>
      </p>
      <h1 className="desk-title">{post.title}</h1>
      <time className="desk-lede" dateTime={post.published}>
        {post.publishedLabel}
      </time>
      <div className="desk-essay">
        {core ? <p className="desk-essay-core">&ldquo;{core}&rdquo;</p> : null}
        {sections.map((section) => (
          <section key={section.heading ?? section.paragraphs[0]}>
            {section.heading ? <h2>{section.heading}</h2> : null}
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="desk-desc">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
        {post.substackUrl ? (
          <p className="desk-substack">
            <a
              className="desk-substack-link"
              href={post.substackUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="desk-substack-logo"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="currentColor"
                  d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"
                />
              </svg>
              Read on Substack
            </a>
          </p>
        ) : null}
      </div>
      <ContinueWithAI />
    </article>
  );
}
