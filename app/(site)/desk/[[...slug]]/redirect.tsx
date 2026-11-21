'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function DeskToRootRedirect() {
  const router = useRouter();
  const pathname = usePathname() || '/desk';

  useEffect(() => {
    const next = pathname.replace(/^\/desk\/?/, '/') || '/';
    const target = next === '/' || next === '/work/' || next === '/work' ? '/' : next.endsWith('/') ? next : `${next}/`;
    router.replace(target);
  }, [pathname, router]);

  return null;
}
