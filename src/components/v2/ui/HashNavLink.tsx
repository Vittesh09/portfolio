'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, type ComponentProps, type MouseEvent } from 'react';

type HashNavLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

function parseHash(href: string): string | null {
  const hashIndex = href.indexOf('#');
  if (hashIndex === -1) return null;
  const hash = href.slice(hashIndex + 1).split('?')[0];
  return hash || null;
}

/** Next.js often skips same-page hash scrolls — scroll when the target is on this page. */
export function scrollToHash(hash: string, behavior: ScrollBehavior = 'smooth') {
  const el = document.getElementById(hash);
  if (!el) return false;
  el.scrollIntoView({ behavior, block: 'start' });
  window.history.replaceState(null, '', `#${hash}`);
  return true;
}

/** After client navigations to `/v2/#work`, scroll once the section exists. */
export function useScrollToHashOnMount() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) return;

    let tries = 0;
    const tick = () => {
      if (scrollToHash(hash, 'smooth') || tries++ > 20) return;
      window.setTimeout(tick, 50);
    };
    tick();
  }, [pathname]);
}

export function HashNavLink({ href, onClick, ...props }: HashNavLinkProps) {
  const hash = parseHash(href);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !hash) return;
    if (scrollToHash(hash)) {
      event.preventDefault();
    }
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
