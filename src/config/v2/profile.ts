/**
 * Single source of truth for V2 identity, employment, stats, and contact.
 * Unpublished `TODO: [FILL: …]` values stay in this file and on /v2/machine.
 * Visitor-facing pages never interpolate those strings.
 */

export function isUnconfirmed(value: string | null | undefined) {
  if (!value) return true;
  return /TODO|\[FILL:/.test(value);
}

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

/** Confirm 7+ vs 8+ before locking. Last published visitor copy is 7+. */
export const yearsExperience = '7+';
export const city = 'TODO: [FILL: city]';
export const timezone = 'TODO: [FILL: timezone]';
export const openTo = 'TODO: [FILL: open to remote / relocation]';
export const availability = 'TODO: [FILL: full-time / freelance / both / not looking]';
export const replyTime = 'TODO: [FILL: e.g. within 2 business days]';
export const selectedCaseStudyCount = 3;
export const factualStatLabel = 'Selected case studies';
export const factualStatValue = String(selectedCaseStudyCount);
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

export const heroHeadline = 'I make powerful products easier to use.';
export const heroHeadlineLines = ['I make powerful products', 'easier to use.'] as const;

export const heroIntro = `Hi, I'm Vittesh, a product designer with ${yearsExperience} years. I turn complex systems into interfaces people can act on.`;

export const metaDescription =
  'Vittesh Sinha, product designer for cars, VR, cloud tools, and enterprise software. I make powerful products easier to use.';

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
      'End-to-end UX for enterprise, logistics, and fitness platforms — real-time KPI dashboards, VR emotion insights, research-led prioritization, and AI-assisted prototyping.',
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
      'Owned the cross-platform design system (apps, internal tools, scooter HMI). Shipped the Simple One app and e-scooter HMI, cutting task-flow complexity by 10–15%.',
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
    name: 'Cult.fit (formerly Curefit)',
    role: 'User Research & Experience Design',
    period: 'Oct 2018 – Jan 2022',
    href: 'https://www.cult.fit',
    current: false,
    start: '2018-10',
    end: '2022-01',
    detail:
      'Research, journeys, and interfaces for fitness and wellness. Designed half-hour class flows (+15% NPS across 100+ centers) and field research for in-center experiences.',
    metrics: [
      {
        metric: '+15% NPS across 100+ centers on half-hour class flows',
        baseline: unconfirmedMethod,
        method: unconfirmedMethod,
        source: 'Cult.fit (formerly Curefit)'
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
  industries: 'Automotive, Logistics, Cloud, VR',
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
    'I care about the part of design that’s hard to explain: when something works and feels right.',
  aboutShort: `Across automotive, SaaS, and enterprise, I’ve designed products where how something looks, feels, and works is a single decision.`,
  about: `Across ${domains.join(', ')}, I’ve shipped product design in scrappy teams and high-stakes environments. Years: ${yearsExperience}. Currently at ${currentEmployer.name}.`,
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
  period: job.period,
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
