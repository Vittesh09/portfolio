import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContinueWithAI } from '@/src/components/v2/blog/ContinueWithAI';
import {
  blogPosts,
  getBlogPost,
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

export function DeskBlogIndex() {
  return (
    <div className="desk-frame desk-home-copy desk-publish desk-publish-index">
      <p className="desk-contacts desk-publish-back">
        <Link href="/desk/">Back</Link>
      </p>
      <h1 className="desk-title">Blogs</h1>
      <p className="desk-lede desk-publish-note">
        These are personal notes and wandering thoughts, written in my own voice. They are
        reflections, questions, and perspectives that may sometimes be speculative or differ from
        established research and facts. Take them as thoughts to explore, not absolute truths.
      </p>
      <div className="desk-tool-list desk-publish-list">
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
    </div>
  );
}

export function DeskBlogPost({ slug }: { slug: string }) {
  const post = getBlogPost(slug);
  if (!post) notFound();

  const { core, sections } = splitCore(post);

  return (
    <article className="desk-frame desk-home-copy desk-publish">
      <p className="desk-contacts desk-publish-back">
        <Link href="/desk/blog/">Back</Link>
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
