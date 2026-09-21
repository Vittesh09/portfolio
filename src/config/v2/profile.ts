/**
 * Single source of truth for V2 identity, employment, stats, and contact.
 * Visible `TODO: [FILL: …]` markers are intentional until Vittesh confirms values.
 */

export const SITE_URL = 'https://www.vittesh.com';
export const V2_BASE = '/v2';

export const lastUpdated = '2026-09-21';

/** Suggested domains from the change spec — confirm before treating as final. */
export const domains = [
  'Automotive',
  'Enterprise / Logistics',
  'Cloud / FinOps',
  'VR / Neuro-tech'
] as const;

export const yearsExperience = 'TODO: [FILL: 7+ or 8+]';
export const city = 'TODO: [FILL: city]';
export const timezone = 'TODO: [FILL: timezone]';
export const openTo = 'TODO: [FILL: open to remote / relocation]';
export const availability = 'TODO: [FILL: full-time / freelance / both / not looking]';
export const replyTime = 'TODO: [FILL: e.g. within 2 business days]';
export const factualStatLabel = 'TODO: [FILL: number of products shipped / teams worked with / case studies]';
export const factualStatValue = 'TODO';
export const curefitEarlierWork =
  'TODO: [FILL: what you designed at Curefit and the result]';

export const heroHeadline = 'I make powerful products easier to use.';

export const heroIntro = `Hi, I'm Vittesh, a product designer with ${yearsExperience} years across automotive, VR, cloud tools and enterprise software. I turn dense, complex systems (fleet command centers, cloud cost data, live EEG) into interfaces people can act on.`;

export const metaDescription =
  'Vittesh Sinha, product designer for cars, VR, cloud tools, and enterprise software. I make powerful products easier to use.';

export const employers = [
  {
    name: 'Nagarro',
    role: 'Senior Product Designer',
    period: 'Nov 2023 – Present',
    periodLong: 'Nov 2023 to Present',
    href: 'https://www.nagarro.com',
    current: true,
    start: '2023-11',
    end: null as string | null,
    detail:
      'End-to-end UX for enterprise, logistics, and fitness platforms — real-time KPI dashboards, VR emotion insights, research-led prioritization, and AI-assisted prototyping.'
  },
  {
    name: 'Simple Energy',
    role: 'Product Designer',
    period: 'Feb 2022 – Nov 2023',
    periodLong: 'Feb 2022 to Nov 2023',
    href: 'https://www.simpleenergy.in',
    current: false,
    start: '2022-02',
    end: '2023-11',
    detail:
      'Owned the cross-platform design system (apps, internal tools, scooter HMI). Shipped the Simple One app and e-scooter HMI, cutting task-flow complexity by 10–15%.'
  },
  {
    name: 'Curefit',
    role: 'User Research & Experience Design',
    period: 'Oct 2018 – Jan 2022',
    periodLong: 'Oct 2018 to Feb 2022',
    href: 'https://www.cult.fit',
    current: false,
    start: '2018-10',
    end: '2022-01',
    detail:
      'Research, journeys, and interfaces for fitness and wellness. Designed half-hour class flows (+15% NPS across 100+ centers) and field research for in-center experiences.'
  }
] as const;

const currentEmployer = employers.find((job) => job.current)!;

export const profile = {
  name: 'Vittesh Sinha',
  title: 'Product Designer',
  country: 'India',
  city,
  timezone,
  openTo,
  locationLine: `Based in ${city}, India · ${timezone} · ${openTo}`,
  yearsExperience,
  domains: [...domains],
  industries: domains.join(', '),
  availability,
  replyTime,
  currentEmployer: currentEmployer.name,
  currentEmployerHref: currentEmployer.href,
  currentLine: `Currently at ${currentEmployer.name}`,
  currentLinkLabel: currentEmployer.name,
  email: 'hello@vittesh.com',
  valueProposition:
    'I design product experiences for automotive, SaaS, and enterprise tools so people can get things done without fighting the interface.',
  tagline:
    'If your product is powerful but hard to use, I help you find the real problem, simplify the journey, and ship something people actually trust.',
  statement:
    'I care about the part of design that’s hard to explain: when something works and feels right.',
  aboutShort:
    'A designer by day, photographer when I can get away with it. Based in India. Across automotive, SaaS, and enterprise, I’ve designed products where how something looks, feels, and works is a single decision.',
  about:
    'I’m a product designer based in India. Across automotive, SaaS, and enterprise, I’ve built digital products in VR, fleet ops, cloud tools, and software teams — not as separate disciplines, but as one system, where how something looks, feels, and works is a single decision. I’ve done it in scrappy teams and high-stakes environments where the interface is the difference between finishing a task and getting stuck. I believe design is one of the few real levers we have on how people work, so I try to earn every choice.',
  personality:
    'A designer by day, photographer when I can get away with it. I’m quiet about process theater and picky about details. Clear in thinking, sure in form. Nothing loud for its own sake, nothing simplified past the point of meaning. Find the idea, cut the noise, protect the intent. Great design happens when user needs, business goals, and technology move in the same direction.',
  heroHeadline,
  heroIntro,
  links: {
    behance: 'https://www.behance.net/vitteshsinha',
    linkedin: 'https://www.linkedin.com/in/vitteshsinha/',
    resume: '/assets/resume/Vittesh_Sinha_Resume.pdf',
    liveHome: '/'
  },
  nav: [
    { label: 'Home', href: '/v2/' },
    { label: 'Work', href: '/v2/#work' },
    { label: 'About', href: '/v2/about/' },
    { label: 'Contact', href: '/v2/#contact' }
  ],
  agentNav: {
    label: 'For agents',
    href: '/v2/machine/',
    title: 'Machine-readable version of this portfolio for AI agents'
  }
} as const;

export const siteConfig = {
  name: profile.name,
  role: profile.title,
  location: profile.locationLine,
  current: profile.currentLine,
  currentLinkLabel: profile.currentLinkLabel,
  currentHref: profile.currentEmployerHref,
  industries: profile.industries,
  email: profile.email,
  valueProposition: profile.valueProposition,
  tagline: profile.tagline,
  statement: profile.statement,
  aboutShort: profile.aboutShort,
  about: profile.about,
  personality: profile.personality,
  links: profile.links,
  nav: profile.nav
} as const;

export const trustSignals = [
  { label: 'Years shipping', value: yearsExperience },
  { label: 'Domains I’ve touched', value: String(domains.length) },
  { label: factualStatLabel, value: factualStatValue }
] as const;

export const trustLogos = employers.map((job) => ({
  name: job.name,
  period: job.period,
  href: job.href,
  current: job.current
}));

export const whyPoints = [
  {
    index: '01',
    title: 'I untangle messy journeys',
    body: 'Discovery, booking, ownership, ops: I map where people get stuck and rebuild the path so handoffs don’t drop context.'
  },
  {
    index: '02',
    title: 'I design for real constraints',
    body: 'Legacy tools, dense data, multi-tenant rules, and engineering limits are the brief. I design inside them, not around them.'
  },
  {
    index: '03',
    title: 'I leave teams with a system',
    body: 'Not just screens: patterns, language, and decisions that help the next feature ship without reinventing the wheel.'
  }
] as const;

export const processSteps = [
  { index: '01', title: 'Listen' },
  { index: '02', title: 'Map' },
  { index: '03', title: 'Design' },
  { index: '04', title: 'Ship' }
] as const;

export const services = [
  'Product design',
  'UX strategy',
  'Information architecture',
  'Design systems'
] as const;

export const experience = employers.map((job) => ({
  company: job.name,
  role: job.role,
  period: job.periodLong,
  detail: job.detail
}));

export const unresolvedPlaceholders = [
  '[FILL: 7+ or 8+]',
  '[FILL: city]',
  '[FILL: timezone]',
  '[FILL: open to remote / relocation]',
  '[FILL: full-time / freelance / both / not looking]',
  '[FILL: e.g. within 2 business days]',
  '[FILL: Simple Energy or Nagarro; 2023 is the handover year, so confirm]',
  '[FILL: case 01 role]',
  '[FILL: case 01 outcome]',
  '[FILL: case 02 company]',
  '[FILL: case 02 role]',
  '[FILL: case 02 outcome]',
  '[FILL: case 03 company]',
  '[FILL: case 03 role]',
  '[FILL: case 03 outcome / actual savings figure]',
  '[FILL: number of products shipped / teams worked with / case studies]',
  '[FILL: what you designed at Curefit and the result]',
  'Domains list (Automotive, Enterprise / Logistics, Cloud / FinOps, VR / Neuro-tech) — confirm before finalising'
] as const;
