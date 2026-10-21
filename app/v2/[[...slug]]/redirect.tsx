'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function V2ToLiveRedirect() {
  const router = useRouter();
  const pathname = usePathname() || '/v2';

  useEffect(() => {
    const next = pathname.replace(/^\/v2\/?/, '/') || '/';
    const target = next === '/' ? '/' : next.endsWith('/') ? next : `${next}/`;
    router.replace(target);
  }, [pathname, router]);

  return null;
}
