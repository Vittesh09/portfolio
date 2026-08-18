import Link from 'next/link';
import { siteConfig } from '@/src/config/v2/site';
import { IndiaTime } from '@/src/components/v2/ui/IndiaTime';

export function ArchiveFooter() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto grid max-w-[1600px] md:grid-cols-12">
        <div className="border-b border-border-subtle p-5 md:col-span-5 md:border-b-0 md:border-r md:p-8">
          <p className="archive-label text-text-muted">In short</p>
          <p className="archive-serif mt-5 max-w-[18ch] text-[clamp(1.5rem,2.8vw,2rem)]">
            I design products people can finish using, without fighting the interface.
          </p>
        </div>
        <div className="grid grid-cols-2 border-b border-border-subtle md:col-span-4 md:border-b-0 md:border-r">
          <div className="border-r border-border-subtle p-5 md:p-8">
            <p className="archive-label text-text-muted">On this site</p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <Link href="/v2/">Home</Link>
              <Link href="/v2/#work">Work</Link>
              <Link href="/v2/about/">About</Link>
              <Link href="/v2/machine/">Machine</Link>
            </div>
          </div>
          <div className="p-5 md:p-8">
            <p className="archive-label text-text-muted">Elsewhere</p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <a href={siteConfig.links.linkedin} target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
              <a href={siteConfig.links.behance} target="_blank" rel="noreferrer">
                Behance ↗
              </a>
              <a href={siteConfig.links.resume} download>
                Resume ↓
              </a>
            </div>
          </div>
        </div>
        <div className="archive-blue flex flex-col justify-between p-5 md:col-span-3 md:p-8">
          <p className="archive-label text-white/70">Email</p>
          <a href={`mailto:${siteConfig.email}`} className="mt-10 break-all text-lg font-semibold">
            {siteConfig.email}
          </a>
          <p className="archive-label mt-8 text-white/60" suppressHydrationWarning>
            © {new Date().getFullYear()} · <IndiaTime className="text-white/60" />
          </p>
        </div>
      </div>
    </footer>
  );
}
