'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/** `/blog/*` moved to `/writing/*`; keep old shared links working. */
export default function BlogToWritingRedirect() {
  const router = useRouter();
  const pathname = usePathname() || '/blog/';

  useEffect(() => {
    const next = pathname.replace(/^\/blog/, '/writing');
    router.replace(next.endsWith('/') ? next : `${next}/`);
  }, [pathname, router]);

  return null;
}
