import Link from 'next/link';
import { publishedEntries } from '@/src/config/v2/publishing';

/** Rows shared by the landing page and the index. */
export function DeskPublishedList() {
  return publishedEntries.map((entry) => (
    <Link key={entry.href} className="desk-tool" href={entry.href}>
      <p className="desk-lede desk-tool-tags">{entry.tags.join(' · ')}</p>
      <div className="desk-tool-row">
        <p className="desk-tool-title">{entry.title}</p>
        {entry.publishedLabel ? (
          <time className="desk-lede desk-tool-date" dateTime={entry.published}>
            {entry.publishedLabel}
          </time>
        ) : null}
      </div>
    </Link>
  ));
}
