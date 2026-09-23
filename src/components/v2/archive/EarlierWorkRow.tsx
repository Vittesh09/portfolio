import Link from 'next/link';
import { profile } from '@/src/config/v2/profile';

export function EarlierWorkRow() {
  return (
    <p className="mt-8 max-w-3xl text-sm leading-relaxed text-text-secondary">
      <span className="archive-label mr-3 text-text-muted">Earlier work</span>
      Cult.fit (Oct 2018 – Jan 2022){' '}
      <a
        href={profile.links.behance}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4"
      >
        Behance
        <span className="v2-visually-hidden"> (opens in a new tab)</span>
      </a>
      {' · '}
      <Link href="/v2/about/" className="underline underline-offset-4">
        Resume / about
      </Link>
    </p>
  );
}
