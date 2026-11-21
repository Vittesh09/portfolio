import Link from 'next/link';
import { blogPosts } from '@/src/config/v2/publishing';
import { v2Path } from '@/src/config/v2/profile';
import { v2PageMetadata } from '@/src/config/v2/seo';

export const metadata = {
  ...v2PageMetadata({
    title: 'Blog, Vittesh Sinha',
    description: 'Writing by Vittesh Sinha.',
    path: '/v2/blog/'
  }),
  robots: { index: false, follow: true }
};

export default function BlogIndexPage() {
  return (
    <article className="border-b border-border-subtle">
      <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-8 md:py-24">
        <p className="archive-label text-text-muted">Writing</p>
        <h1 className="archive-display mt-5 text-[clamp(2.75rem,8vw,6rem)]">Blog.</h1>
        <ul className="mt-12 border-t border-border-subtle">
          {blogPosts.map((post) => (
            <li key={post.slug} className="border-b border-border-subtle">
              <Link
                href={v2Path(`/blog/${post.slug}/`)}
                className="grid gap-2 py-5 transition-colors hover:text-accent-pop md:grid-cols-12 md:items-baseline"
              >
                <span className="text-xl font-semibold leading-none tracking-tight md:col-span-8">
                  {post.title}
                </span>
                <time
                  dateTime={post.published}
                  className="archive-label text-text-muted md:col-span-4 md:text-right"
                >
                  {post.publishedLabel}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
