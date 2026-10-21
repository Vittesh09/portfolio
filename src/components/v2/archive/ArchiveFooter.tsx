import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/src/config/v2/site';
import { profile, v2Path } from '@/src/config/v2/profile';
import { HashNavLink } from '@/src/components/v2/ui/HashNavLink';

function FooterLandscape() {
  return (
    <div className="v2-footer-landscape" aria-hidden="true">
      <Image
        src="/assets/images/footer-landscape-light.jpg"
        alt=""
        fill
        priority
        sizes="1024px"
        className="v2-footer-landscape-img v2-footer-landscape-img--light"
      />
      <Image
        src="/assets/images/footer-landscape.jpg"
        alt=""
        fill
        priority
        sizes="1024px"
        className="v2-footer-landscape-img v2-footer-landscape-img--dark"
      />
    </div>
  );
}

export function ArchiveFooter() {
  return (
    <footer className="v2-footer">
      <div className="v2-footer-inner">
        <div className="v2-footer-navs">
          <nav className="v2-footer-nav" aria-labelledby="footer-site-label">
            <p className="archive-label text-text-muted" id="footer-site-label">
              Explore
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <HashNavLink href={v2Path('/#work')} className="underline-offset-4 hover:underline">
                Work
              </HashNavLink>
              <Link href={v2Path('/about/')} className="underline-offset-4 hover:underline">
                About
              </Link>
              <a
                href={siteConfig.links.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                Resume <span className="v2-visually-hidden">(opens in a new tab)</span>
                <span aria-hidden> ↗</span>
              </a>
              <HashNavLink href={v2Path('/#contact')} className="underline-offset-4 hover:underline">
                Contact
              </HashNavLink>
            </div>
          </nav>
          <nav className="v2-footer-nav v2-footer-nav--more" aria-label="Elsewhere">
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
            </div>
          </nav>
          <nav className="v2-footer-nav" aria-label="For agents">
            <p className="archive-label text-text-muted">For agents</p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <Link href={profile.agentNav.href} className="underline-offset-4 hover:underline">
                Machine-readable version
              </Link>
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

      <FooterLandscape />
    </footer>
  );
}
