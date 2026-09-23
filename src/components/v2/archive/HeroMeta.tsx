import { HashNavLink } from '@/src/components/v2/ui/HashNavLink';
import { siteConfig } from '@/src/config/v2/site';

function Label({ children }: { children: React.ReactNode }) {
  return <p className="archive-label text-text-muted">{children}</p>;
}

type HeroMetaProps = {
  workHrefClassName?: string;
};

export function HeroMeta({ workHrefClassName }: HeroMetaProps) {
  return (
    <>
      <div className="md:col-span-3">
        <Label>Currently at</Label>
        <p className="mt-2 text-sm">
          <a
            href={siteConfig.currentHref}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:underline"
          >
            {siteConfig.currentLinkLabel}
            <span className="v2-visually-hidden"> (opens in a new tab)</span>
          </a>
        </p>
      </div>
      <div className="md:col-span-3">
        <Label>Industries</Label>
        <p className="mt-2 text-sm">{siteConfig.industries}</p>
      </div>
      <div className="md:col-span-3">
        <Label>Based in</Label>
        <p className="mt-2 text-sm">{siteConfig.location}</p>
      </div>
      <div className="flex items-end md:col-span-3 md:justify-end">
        <HashNavLink
          href="/v2/#work"
          className={
            workHrefClassName ??
            'archive-label inline-flex items-center gap-3 bg-white px-5 py-3 text-black'
          }
        >
          See selected work <span>↓</span>
        </HashNavLink>
      </div>
    </>
  );
}
