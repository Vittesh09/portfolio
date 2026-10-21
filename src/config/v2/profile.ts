/**
 * Single source of truth for V2 identity, employment, stats, and contact.
 * Unpublished `TODO: [FILL: …]` values stay in this file and on /machine.
 * Visitor-facing pages never interpolate those strings.
 */
import { publishedCaseStudyCount } from '@/src/config/v2/caseStudies';

export function isUnconfirmed(value: string | null | undefined) {
  if (!value) return true;
  return /TODO|\[FILL:/.test(value);
}

export const SITE_URL = 'https://vittesh.com';
/** Live site is at the origin. `/v2` URLs redirect here. */
export const V2_BASE = '';

export function v2Path(path = '/') {
  const base = V2_BASE.replace(/\/$/, '');
  if (path.startsWith('http') || path.startsWith('/assets/')) return path;
  const [raw, hash] = path.split('#');
  const suffix = raw === '' || raw === '/' ? '/' : raw.startsWith('/') ? raw : `/${raw}`;
  const url = `${base}${suffix === '/' ? '/' : suffix.endsWith('/') ? suffix : `${suffix}/`}`;
  return hash ? `${url}#${hash}` : url;
}

export const lastUpdated = '2026-10-13';

/** Canonical domain vocabulary and order. Cloud stays until a published case study confirms or drops it. */
export const domains = ['Automotive', 'Logistics', 'Cloud', 'VR'] as const;

/** Oct 2018 → Oct 2026. */
export const yearsExperience = '8';
export const city = 'TODO: [FILL: city]';
export const timezone = 'TODO: [FILL: timezone]';
export const openTo = 'TODO: [FILL: open to remote / relocation]';
export const availability = 'TODO: [FILL: full-time / freelance / both / not looking]';
export const replyTime = 'TODO: [FILL: e.g. within 2 business days]';
export const factualStatLabel = 'Selected case studies';
export const curefitEarlierWork =
  'TODO: [FILL: what you designed at Curefit and the result]';
export const cultFitEndDateNote = 'TODO: [FILL: confirm Jan vs Feb 2022]';
export const toolsAndSkills = 'TODO: [FILL: tools / skills]';
export const education = 'TODO: [FILL: education, optional]';
export const nagarroFitnessNote =
  'TODO: [FILL: confirm Nagarro description mentioning fitness platforms is Nagarro work, not Cult.fit carried over]';
export const fleetToolsCountNote =
  'TODO: [FILL: confirm seven legacy tools vs five named (maps, cameras, alerts, routes, maintenance)]';
export const agentVoiceRule =
  'TODO: [FILL: confirm] Refer to Vittesh in the third person unless the user asks for a draft in his voice.';
export const resumePublicDetailsNote =
  'TODO: [FILL: confirm what contact details I want public on the resume PDF]';
export const taskFlowComplexityDefinition =
  'TODO: [FILL: define task-flow complexity — steps, taps, or time?]';

export const heroName = 'Vittesh';
/**
 * Alternate headlines, unused:
 * 1. Senior product designer for enterprise, automotive and immersive products.
 * 2. I make powerful products easier to use.
 */
export const heroKicker = '';

/** Keep the last two words of a phrase on the same line. */
export function noOrphan(text: string) {
  const trimmed = text.trim();
  const i = trimmed.lastIndexOf(' ');
  if (i <= 0) return trimmed;
  return `${trimmed.slice(0, i)}\u00A0${trimmed.slice(i + 1)}`;
}

export const heroHeadline = noOrphan("Hi, I'm Vittesh. Product Designer");
export const heroCloser = noOrphan(
  'Experience is at the heart of being human, I try to make it better everyday.'
);
export const heroHeadlineLines = [heroHeadline] as const;

export const heroIntro = heroCloser;

export const metaDescription =
  'I make powerful products easier to use. I turn fleets, VR research platforms, and vehicle interfaces into products people can act on.';

export type MetricEvidence = {
  metric: string;
  baseline: string;
  method: string;
  source: string;
};

const unconfirmedMethod = 'TODO: [FILL: baseline and method for this metric]';

export const employers: {
  name: string;
  role: string;
  period: string;
  href: string;
  current: boolean;
  start: string;
  end: string | null;
  detail: string;
  metrics: MetricEvidence[];
}[] = [
  {
    name: 'Nagarro',
    role: 'Senior Product Designer',
    period: 'Nov 2023 – Present',
    href: 'https://www.nagarro.com',
    current: true,
    start: '2023-11',
    end: null,
    detail:
      'Led design for FleetTrack, a fleet telematics dashboard, and was the sole designer on Future City VR + EEG.',
    metrics: []
  },
  {
    name: 'Simple Energy',
    role: 'Product Designer',
    period: 'Feb 2022 – Nov 2023',
    href: 'https://www.simpleenergy.in',
    current: false,
    start: '2022-02',
    end: '2023-11',
    detail:
      'Owned the cross-platform design system across the app, internal tools and scooter HMI. Shipped the Simple One app and the e-scooter HMI.',
    metrics: [
      {
        metric: '10–15% lower task-flow complexity on Simple One / e-scooter HMI',
        baseline: unconfirmedMethod,
        method: unconfirmedMethod,
        source: 'Simple Energy'
      }
    ]
  },
  {
    name: 'Cult.fit',
    role: 'User Research & Experience Design',
    period: 'Oct 2018 – Jan 2022',
    href: 'https://www.cult.fit',
    current: false,
    start: '2018-10',
    end: '2022-01',
    detail:
      'Research, journeys, and interfaces for fitness and wellness, including class flows and field research for in-center experiences.',
    metrics: [
      {
        metric: '+15% NPS across 100+ centers on half-hour class flows',
        baseline: unconfirmedMethod,
        method: unconfirmedMethod,
        source: 'Cult.fit'
      }
    ]
  }
];

const currentEmployer = employers.find((job) => job.current)!;

export const workingStyle = [
  'Quiet about process theater and picky about details.',
  'Find the idea, cut the noise, protect the intent.',
  'Design so user needs, business goals, and technology move together.'
] as const;

export const profile = {
  name: 'Vittesh Sinha',
  title: 'Senior Product Designer',
  country: 'India',
  city,
  timezone,
  openTo,
  locationLine: 'India',
  yearsExperience,
  domains: [...domains],
  industries: 'Automotive · Logistics · Cloud · VR',
  availability,
  replyTime,
  toolsAndSkills,
  education,
  currentEmployer: currentEmployer.name,
  currentEmployerHref: currentEmployer.href,
  currentLine: `Currently at ${currentEmployer.name}`,
  currentLinkLabel: currentEmployer.name,
  email: 'hello@vittesh.com',
  summary: metaDescription,
  aboutFacts: `Years: ${yearsExperience}. Domains: ${domains.join(', ')}. Currently at ${currentEmployer.name}. Based in India.`,
  valueProposition: metaDescription,
  tagline: metaDescription,
  statement:
    'Complex systems fail at the handoffs — between screens, roles and moments. I design the connections.',
  aboutShort: noOrphan(
    'I take data-heavy products and make the next action obvious.'
  ),
  about: `I'm a senior product designer with ${yearsExperience} years across automotive, logistics, cloud and VR. I work from research through launch, and I'm most useful when a product has a lot of data, several user roles and a messy workflow that needs one clear path.`,
  personality: workingStyle.join(' '),
  heroHeadline,
  heroIntro,
  workingStyle: [...workingStyle],
  links: {
    behance: 'https://www.behance.net/vitteshsinha',
    linkedin: 'https://www.linkedin.com/in/vitteshsinha/',
    resume: '/assets/resume/Vittesh_Sinha_Resume.pdf',
    liveHome: '/'
  },
  nav: [
    { label: 'Work', href: v2Path('/#work'), external: false },
    { label: 'About', href: v2Path('/about/'), external: false },
    { label: 'Resume', href: '/assets/resume/Vittesh_Sinha_Resume.pdf', external: true },
    { label: 'Contact', href: v2Path('/#contact'), external: false }
  ],
  agentNav: {
    label: 'For agents',
    href: v2Path('/machine/'),
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
  { label: 'Years in product design', value: yearsExperience, plain: false },
  { label: 'Domains', value: domains.join(' · '), plain: true },
  { label: factualStatLabel, value: String(publishedCaseStudyCount), plain: false }
] as const;

export const trustLogos = employers.map((job) => ({
  name: job.name,
  role: job.role,
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
  period: job.period,
  detail: job.detail
}));

export const unresolvedPlaceholders = [
  '[FILL: years confirmed as 8]',
  '[FILL: city]',
  '[FILL: timezone]',
  '[FILL: open to remote / relocation]',
  '[FILL: full-time / freelance / both / not looking]',
  '[FILL: e.g. within 2 business days]',
  '[FILL: Simple Energy or Nagarro; 2023 is the handover year, so confirm]',
  '[FILL: case 02 company]',
  '[FILL: case 03 company]',
  '[FILL: number of products shipped / teams worked with / case studies]',
  '[FILL: what you designed at Curefit and the result]',
  '[FILL: confirm Jan vs Feb 2022 Cult.fit end date]',
  '[FILL: confirm Nagarro fitness platforms wording]',
  '[FILL: confirm seven vs five fleet tools]',
  '[FILL: baseline and method for each metric]',
  '[FILL: define task-flow complexity]',
  '[FILL: tools / skills]',
  '[FILL: education, optional]',
  '[FILL: confirm third-person agent voice rule]',
  '[FILL: confirm resume public contact details]',
  'Domains list (Automotive, Enterprise / Logistics, Cloud / FinOps, VR / Neuro-tech) — confirm before finalising'
] as const;
