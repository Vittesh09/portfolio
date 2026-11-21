import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContinueWithAI } from '@/src/components/v2/blog/ContinueWithAI';
import { blogPosts, getBlogPost } from '@/src/config/v2/publishing';
import { v2Path } from '@/src/config/v2/profile';
import { v2PageMetadata } from '@/src/config/v2/seo';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Blog' };
  return {
    ...v2PageMetadata({
      title: `${post.title}, Vittesh Sinha`,
      description: post.description,
      path: `/v2/blog/${post.slug}/`
    }),
    robots: { index: false, follow: true }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <article className="border-b border-border-subtle">
      <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-8 md:py-24">
        <Link href={v2Path('/blog/')} className="archive-label text-text-muted hover:text-text-primary">
          Blog
        </Link>
        <h1 className="archive-display mt-8 max-w-[16ch] text-[clamp(2.75rem,8vw,6rem)]">
          {post.title}
        </h1>
        <time dateTime={post.published} className="archive-label mt-6 block text-text-muted">
          {post.publishedLabel}
        </time>
        <div className="mt-12 max-w-[68ch]">
          {post.sections.map((section) => (
            <section key={section.heading ?? section.paragraphs[0]} className="mt-12 first:mt-0">
              {section.heading ? (
                <h2 className="text-xl font-semibold tracking-tight">{section.heading}</h2>
              ) : null}
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="mt-5 text-base leading-relaxed text-text-secondary first:mt-0"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
          {post.substackUrl ? (
            <p className="mt-8">
              <a
                href={post.substackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  aria-hidden="true"
                  focusable="false"
                  className="shrink-0"
                >
                  <path
                    fill="#FF6719"
                    d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"
                  />
                </svg>
                Read on Substack
              </a>
            </p>
          ) : null}
          <ContinueWithAI />
        </div>
      </div>
    </article>
  );
}
