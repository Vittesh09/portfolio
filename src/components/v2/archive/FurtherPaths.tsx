import Link from 'next/link';
import { v2Path } from '@/src/config/v2/profile';

/** Quiet way on, after the case studies. The lists live elsewhere. */
export function FurtherPaths({ className = '' }: { className?: string }) {
  return (
    <p className={`archive-label text-text-muted ${className}`.trim()}>
      <Link href={v2Path('/about/#tools')} className="transition-colors hover:text-text-primary">
        Tools
      </Link>
      <span aria-hidden="true"> · </span>
      <Link href={v2Path('/blog/')} className="transition-colors hover:text-text-primary">
        Blog
      </Link>
    </p>
  );
}
