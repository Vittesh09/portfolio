export const workbenchMeta = {
  title: 'Workbench',
  path: '/v2/classic/workbench/',
  description:
    'Components, side explorations, and writing drafts that didn’t need a full case study, but still shaped how I design.'
} as const;

export const workbenchComponents = [
  {
    index: '01',
    title: 'Recommendation card',
    category: 'FinOps · Decision support',
    description:
      'Shows the evidence, the dollar savings, the risk, and one clear action, so engineers don’t have to reverse-engineer a chart.'
  },
  {
    index: '02',
    title: 'Incident priority queue',
    category: 'Fleet · Operational triage',
    description:
      'Ranks critical, warning, and info events while keeping vehicle and driver context attached to every row.'
  },
  {
    index: '03',
    title: 'Comparison matrix',
    category: 'Commerce · High-intent choice',
    description:
      'Lines up ingredients, benefits, concerns, ratings, and price so shoppers can decide without tab-hopping.'
  }
] as const;

export const workbenchExperiments = [
  {
    title: 'AI product comparison',
    type: 'Product exploration',
    image: '/assets/case-studies/commerce-comparison.png',
    description:
      'Side-by-side ingredient evidence with AI-distilled reviews, built for people who research before they buy.'
  },
  {
    title: 'Experiment analytics',
    type: 'Measurement exploration',
    image: '/assets/case-studies/commerce-analytics.png',
    description:
      'A tight view of test variants, conversion shifts, and which experience actually moved the needle.'
  }
] as const;

export const workbenchWriting = [
  {
    title: 'Designing trust into complex product systems',
    status: 'Draft',
    topic: 'Systems design',
    description:
      'Why disclosure, feedback, recovery, and steady language matter more than another polished mock.'
  },
  {
    title: 'When a dashboard becomes a decision system',
    status: 'Draft',
    topic: 'Enterprise UX',
    description:
      'Moving past passive charts toward ranked evidence, clear intent, and an obvious next action.'
  },
  {
    title: 'Measuring emotion without breaking immersion',
    status: 'Draft',
    topic: 'Spatial UX',
    description:
      'What I learned pairing VR city exploration with participant position and passive EEG signals.'
  }
] as const;
