import Link from 'next/link';
import { siteConfig } from '@/src/config/v2/site';
import { HashNavLink } from '@/src/components/v2/ui/HashNavLink';

export function ArchiveFooter() {
  return (
    <footer className="v2-footer">
      <div className="v2-footer-inner">
        <div className="v2-footer-navs">
          <nav className="v2-footer-nav" aria-labelledby="footer-site-label">
            <p className="archive-label text-text-muted" id="footer-site-label">
              On this site
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <Link href="/v2/" className="underline-offset-4 hover:underline">
                Home
              </Link>
              <HashNavLink href="/v2/#work" className="underline-offset-4 hover:underline">
                Work
              </HashNavLink>
              <Link href="/v2/about/" className="underline-offset-4 hover:underline">
                About
              </Link>
              <Link href="/v2/machine/" className="underline-offset-4 hover:underline">
                Machine
              </Link>
            </div>
          </nav>
          <nav className="v2-footer-nav" aria-label="Elsewhere">
            <p className="archive-label text-text-muted">Elsewhere</p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                LinkedIn <span className="v2-visually-hidden">(opens in a new tab)</span>
                <span aria-hidden> ↗</span>
              </a>
              <a
                href={siteConfig.links.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                Behance <span className="v2-visually-hidden">(opens in a new tab)</span>
                <span aria-hidden> ↗</span>
              </a>
              <a
                href={siteConfig.links.resume}
                download
                className="underline-offset-4 hover:underline"
              >
                Resume <span aria-hidden>↓</span>
              </a>
            </div>
          </nav>
        </div>

        <div className="v2-site-footer-brand" aria-label="Copyright">
          <p className="v2-site-footer-mark" aria-hidden="true">
            ˗ˏˋ ꒰ 🧡 ꒱ ˎˊ˗
          </p>
          <p className="v2-site-footer-copy">
            <span className="v2-visually-hidden">With love. </span>© 2026 {siteConfig.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
