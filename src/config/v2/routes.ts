/**
 * Route map:
 * - Live site (desk): `/`, `/about/`, `/work/[slug]/`
 * - Previous version (archive): `/v2/`, `/v2/about/`, `/v2/work/[slug]/`
 * - Labs: `/classic`, `/singularity`, `/tldr`, `/machine`
 */
export function normalizePath(path: string) {
  if (!path) return '/';
  return path.endsWith('/') ? path : `${path}/`;
}

/** True on the live desk site (home, about, case studies). */
export function isDeskPath(path: string) {
  const p = normalizePath(path);
  return p === '/' || p.startsWith('/about/') || p.startsWith('/work/');
}
