import { metaDescription, profile, SITE_URL, V2_BASE } from '@/src/config/v2/profile';

export function v2Robots() {
  const explicit = process.env.NEXT_PUBLIC_V2_NOINDEX;
  if (explicit === 'true') return { index: false as const, follow: false as const };
  if (explicit === 'false') return { index: true as const, follow: true as const };
  if (process.env.NODE_ENV === 'production') {
    return { index: true as const, follow: true as const };
  }
  return { index: false as const, follow: false as const };
}

export function v2Canonical(path = '/') {
  const suffix = path.startsWith('/') ? path : `/${path}`;
  const tail = suffix === '/' || suffix === '' ? '/' : suffix.endsWith('/') ? suffix : `${suffix}/`;
  const base = V2_BASE.replace(/\/$/, '');
  return `${SITE_URL}${base}${tail}`;
}

export const v2DefaultTitle = `${profile.name} | ${profile.title}`;

/** Browser-tab title on every main-site page. Link previews keep the page's own title. */
export const DESK_TAB_TITLE = 'Vittesh | Product Designer';

const shareImage = {
  url: `${SITE_URL}/opengraph-image.png`,
  width: 1200,
  height: 630,
  alt: `${profile.name}, ${profile.title}`,
  type: 'image/png'
};

export function v2PageMetadata({
  title,
  tabTitle,
  description = metaDescription,
  path = '/'
}: {
  /** Used for link previews (Open Graph / Twitter), and the tab unless tabTitle is set. */
  title: string;
  /** Overrides only the browser-tab <title>. */
  tabTitle?: string;
  description?: string;
  path?: string;
}) {
  const canonical = v2Canonical(path);
  return {
    // `absolute` so no layout title template is ever added around it.
    title: tabTitle ? { absolute: tabTitle } : title,
    description,
    robots: v2Robots(),
    alternates: {
      canonical,
      types: {
        'text/markdown': `${SITE_URL}/machine.md`
      }
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: profile.name,
      type: 'website' as const,
      locale: 'en_US',
      images: [shareImage]
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [shareImage.url]
    }
  };
}
