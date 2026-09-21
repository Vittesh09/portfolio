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
  if (suffix === '/' || suffix === '') return `${SITE_URL}${V2_BASE}/`;
  return `${SITE_URL}${V2_BASE}${suffix.endsWith('/') ? suffix : `${suffix}/`}`;
}

export const v2DefaultTitle = `${profile.name} | ${profile.title}`;

export function v2PageMetadata({
  title,
  description = metaDescription,
  path = '/'
}: {
  title: string;
  description?: string;
  path?: string;
}) {
  const canonical = v2Canonical(path);
  return {
    title,
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
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description
    }
  };
}
