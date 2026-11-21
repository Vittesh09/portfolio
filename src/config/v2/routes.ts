/**
 * Route map:
 * - Live site (desk): `/`, `/about/`, `/work/[slug]/`, `/blog/`
 * - Previous version (archive): `/v2/`, `/v2/about/`, `/v2/work/[slug]/`, `/v2/blog/`
 * - Labs: `/classic`, `/singularity`, `/tldr`, `/machine`
 */
export function normalizePath(path: string) {
  if (!path) return '/';
  return path.endsWith('/') ? path : `${path}/`;
}

/**
 * True on the live desk site (home, about, case studies, blog), and on the old
 * `/desk/*` URLs, which only redirect there (so they never flash archive chrome).
 */
export function isDeskPath(path: string) {
  const p = normalizePath(path);
  return (
    p === '/' ||
    p.startsWith('/about/') ||
    p.startsWith('/work/') ||
    p.startsWith('/blog/') ||
    p.startsWith('/desk/')
  );
}
