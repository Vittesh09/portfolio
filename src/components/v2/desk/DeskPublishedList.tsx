import Link from 'next/link';
import { publishedEntries } from '@/src/config/v2/publishing';

/** Rows shared by the landing page and the index. */
export function DeskPublishedList() {
  return publishedEntries.map((entry) => (
    <Link key={entry.href} className="desk-tool" href={entry.href}>
      <p className="desk-lede desk-tool-tags">{entry.tags.join(' · ')}</p>
      <div className="desk-tool-row">
        <p className="desk-tool-title">
          {entry.kind === 'speaking' ? (
            <span className="desk-tool-play" aria-hidden="true">
              <svg viewBox="0 0 12 12" width="9" height="9" focusable="false">
                <path fill="currentColor" d="M2.5 1.2v9.6L10.6 6z" />
              </svg>
            </span>
          ) : null}
          {entry.title}
        </p>
        {entry.publishedLabel ? (
          <time className="desk-lede desk-tool-date" dateTime={entry.published}>
            {entry.publishedLabel}
          </time>
        ) : null}
      </div>
    </Link>
  ));
}
