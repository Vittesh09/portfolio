export const siteConfig = {
  name: 'Vittesh Sinha',
  role: 'Product Designer',
  location: 'India',
  current: '@Nagarro',
  industries: 'Automotive, SaaS, Enterprise tools',
  email: 'hello@vittesh.com',
  valueProposition:
    'I design product experiences for automotive, SaaS, and enterprise tools so people can get things done without fighting the interface.',
  tagline:
    'If your product is powerful but hard to use, I help you find the real problem, simplify the journey, and ship something people actually trust.',
  statement:
    'I care about the part of design that’s hard to explain: when something works and feels right.',
  aboutShort:
    'A designer by day, photographer when I can get away with it. Based in India. Over 7+ years I’ve designed products across automotive, SaaS, and enterprise, where how something looks, feels, and works is a single decision.',
  about:
    'I’m a product designer based in India. Over the last 7+ years I’ve built digital products across automotive, VR, fleet ops, cloud tools, and enterprise software, not as separate disciplines, but as one system, where how something looks, feels, and works is a single decision. I’ve done it in scrappy teams and high-stakes environments where clarity isn’t decoration; it’s the difference between finishing a task and getting stuck. I believe design is one of the few real levers we have on how people work, so I try to earn every choice.',
  personality:
    'A designer by day, photographer when I can get away with it. I’m quiet about process theater and picky about details. Clear in thinking, sure in form. Nothing loud for its own sake, nothing simplified past the point of meaning. Find the idea, cut the noise, protect the intent. Great design happens when user needs, business goals, and technology move in the same direction.',
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
  ]
} as const;

export const trustSignals = [
  { label: 'Years shipping', value: '07+' },
  { label: 'Domains I’ve touched', value: '04' },
  { label: 'What I optimize for', value: 'Clarity' }
] as const;

export const trustLogos = [
  {
    name: 'Nagarro',
    period: 'Nov 2023 – Present',
    href: 'https://www.nagarro.com',
    current: true
  },
  {
    name: 'Simple Energy',
    period: 'Feb 2022 – Nov 2023',
    href: 'https://www.simpleenergy.in',
    current: false
  },
  {
    name: 'Curefit',
    period: 'Oct 2018 – Jan 2022',
    href: 'https://www.cult.fit',
    current: false
  }
] as const;

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

export const experience = [
  {
    company: 'Nagarro',
    role: 'Senior Product Designer',
    period: 'Nov 2023 to Present',
    detail:
      'End-to-end UX for enterprise, logistics, and fitness platforms — real-time KPI dashboards, VR emotion insights, research-led prioritization, and AI-assisted prototyping.'
  },
  {
    company: 'Simple Energy',
    role: 'Product Designer',
    period: 'Feb 2022 to Nov 2023',
    detail:
      'Owned the cross-platform design system (apps, internal tools, scooter HMI). Shipped the Simple One app and e-scooter HMI, cutting task-flow complexity by 10–15%.'
  },
  {
    company: 'Cult.fit',
    role: 'User Research & Experience Design',
    period: 'Oct 2018 to Feb 2022',
    detail:
      'Research, journeys, and interfaces for fitness and wellness. Designed half-hour class flows (+15% NPS across 100+ centers) and field research for in-center experiences.'
  }
] as const;
