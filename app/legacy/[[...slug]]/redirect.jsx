'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function LegacyRedirect() {
  const router = useRouter();
  const pathname = usePathname() || '/legacy';

  useEffect(() => {
    const next = pathname.replace(/^\/legacy\/?/, '/') || '/';
    const target = next === '/' ? '/' : next.endsWith('/') ? next : `${next}/`;
    router.replace(target);
  }, [pathname, router]);

  return null;
}
