import type { MetricEvidence } from '@/src/config/v2/profile';

const unconfirmedMethod = 'TODO: [FILL: baseline and method for this metric]';

export type Project = {
  slug: string;
  index: string;
  title: string;
  summary: string;
  company: string;
  cardRole: string;
  outcomeLine: string;
  outcomeEvidence: MetricEvidence[];
  tags: string[];
  industry: string;
  client: string;
  customers: string;
  challenge: string;
  role: string;
  platforms: string;
  year: string;
  metrics: { label: string; value: string }[];
  problem: string[];
  goal: string[];
  process: { title: string; body: string }[];
  solution: string[];
  outcomes: string[];
  image: string;
  images: { src: string; alt: string }[];
};

const asset = (name: string) => `/assets/case-studies/${name}`;

export const projects: Project[] = [
  {
    slug: 'vr-eeg-analytics',
    index: '01',
    title: 'Future City VR + EEG',
    summary:
      'I designed a 1:1 city in VR and a dashboard that turned live EEG into stress, delight, and fatigue planners could act on.',
    company: 'TODO: [FILL: Simple Energy or Nagarro. 2023 is the handover year, so confirm]',
    cardRole: 'Product & Spatial Experience Designer',
    outcomeLine:
      'Planners got 50+ spatial insight points and found three layout bottlenecks before anything was built.',
    outcomeEvidence: [
      {
        metric: '50+ spatial insight points and three layout bottlenecks before build',
        baseline: unconfirmedMethod,
        method: unconfirmedMethod,
        source: 'Future City VR + EEG'
      }
    ],
    tags: ['Spatial UX', 'VR', 'Neuro-tech'],
    industry: 'Urban Development · Spatial Computing',
    client: 'Future-city development group',
    customers: 'Urban planners, stakeholders, and research participants',
    challenge:
      'Let people walk an unbuilt city without getting sick, and turn raw brainwaves into insights planners could use without a data scientist.',
    role: 'Product & Spatial Experience Designer',
    platforms: 'VR headset · Analytics dashboard',
    year: '2023',
    metrics: [
      { label: 'Participants', value: '25+' },
      { label: 'Insight points', value: '50+' },
      { label: 'Bottlenecks found', value: '03' }
    ],
    problem: [
      'Poor spatial cues risked motion discomfort and cognitive overload.',
      'Survey responses interrupted immersion and captured stated rather than felt reactions.',
      'Raw Alpha, Beta, and Theta signals were inaccessible to planning stakeholders.'
    ],
    goal: [
      'Preserve presence while collecting passive emotional evidence.',
      'Connect biometric events to exact locations in the virtual city.',
      'Translate neuro-data into clear stress, delight, fatigue, and engagement patterns.'
    ],
    process: [
      {
        title: 'Design spatial comfort',
        body: 'Established movement, depth, ambient, and wayfinding rules for a legible 1:1-scale environment.'
      },
      {
        title: 'Synchronize signals',
        body: 'Connected participant position, environmental state, and EEG events on a shared session timeline.'
      },
      {
        title: 'Make emotion actionable',
        body: 'Converted brainwave spikes into comparative maps and plain-language spatial findings.'
      }
    ],
    solution: [
      'A future-city simulation with sunrise, density, and spatial-audio controls.',
      'Passive EEG capture synchronized with 3D participant position.',
      'A multi-session dashboard comparing stress, engagement, delight, and fatigue.'
    ],
    outcomes: [
      'Captured more than 50 actionable architectural insight points.',
      'Identified three major layout bottlenecks before construction.',
      'Made biometric evidence usable by planners without a data-science intermediary.'
    ],
    image: asset('vr-welcome.png'),
    images: [
      { src: asset('vr-welcome.png'), alt: 'Virtual Humans future-city entry experience' },
      { src: asset('vr-diagnostics.png'), alt: 'VR diagnostic and experience mode selection' }
    ]
  },
  {
    slug: 'fleet-command-center',
    index: '02',
    title: 'Fleet Command Center',
    summary:
      'I consolidated maps, cameras, alerts, routes, and maintenance into one multi-tenant command center for fleets of 500+ vehicles.',
    company: 'TODO: [FILL: case 02 company]',
    cardRole: 'Senior Product Designer',
    outcomeLine: 'Monitoring effort dropped 28% and critical response improved 45%.',
    outcomeEvidence: [
      {
        metric: '28% less monitoring effort and 45% better critical response',
        baseline: unconfirmedMethod,
        method: unconfirmedMethod,
        source: 'Fleet Command Center'
      }
    ],
    tags: ['Enterprise', 'Logistics', 'B2B SaaS'],
    industry: 'Fleet Logistics · Enterprise SaaS',
    client: 'Enterprise fleet operations',
    customers: 'Dispatchers and operators managing fleets of 500+ vehicles',
    challenge:
      'Stop forcing dispatchers to monitor a fleet across seven separate apps when every second of an incident counts.',
    role: 'Senior Product Designer',
    platforms: 'Responsive web command center',
    year: '2024',
    metrics: [
      { label: 'Monitoring effort', value: '-28%' },
      { label: 'Incident response', value: '+45%' },
      { label: 'Modules unified', value: '07+' }
    ],
    problem: [
      'Dispatchers continuously switched between maps, cameras, compliance, and alert tools.',
      'High-volume notifications obscured critical safety events.',
      'Tenant, vehicle, and driver context was repeatedly lost between modules.'
    ],
    goal: [
      'Create a single operating picture for each fleet.',
      'Prioritize anomalies by risk and required response.',
      'Keep map, video, route, and telematics evidence in context.'
    ],
    process: [
      {
        title: 'Model operations',
        body: 'Mapped the incident lifecycle, operator roles, tenant boundaries, and seven legacy module inventories.'
      },
      {
        title: 'Design for triage',
        body: 'Created risk tiers and contextual workspaces that grouped related alerts, camera evidence, and vehicle state.'
      },
      {
        title: 'Stress-test density',
        body: 'Validated high-density tables, maps, and tiled layouts against peak operational scenarios.'
      }
    ],
    solution: [
      'A flexible tiled command center with role- and tenant-aware views.',
      'Critical, Warning, and Informational queues tied to recommended actions.',
      'Live telematics overlays with clustering, camera picture-in-picture, and route replay.'
    ],
    outcomes: [
      'Reduced manual monitoring effort by 28%.',
      'Improved critical incident response time by 45%.',
      'Consolidated seven legacy modules into one consistent operating model.'
    ],
    image: asset('fleet-geozone.png'),
    images: [
      { src: asset('fleet-geozone.png'), alt: 'Fleet geozone configuration command center' },
      { src: asset('fleet-login.png'), alt: 'FleetTrack enterprise login experience' }
    ]
  },
  {
    slug: 'cloud-cost-optimization',
    index: '03',
    title: 'Cloud Cost Optimization',
    summary:
      'I designed a FinOps workspace that turns messy AWS usage into ranked recommendations teams can act on.',
    company: 'TODO: [FILL: case 03 company]',
    cardRole: 'Senior Product Designer',
    outcomeLine: 'Waste diagnosis got 30% faster across 20+ AWS services.',
    outcomeEvidence: [
      {
        metric: '30% faster waste diagnosis across 20+ AWS services',
        baseline: unconfirmedMethod,
        method: unconfirmedMethod,
        source: 'Cloud Cost Optimization'
      }
    ],
    tags: ['FinOps', 'AI', 'Cloud SaaS'],
    industry: 'Cloud Infrastructure · DevOps',
    client: 'Cloud engineering and finance teams',
    customers: 'Engineering leads, FinOps specialists, and CFOs',
    challenge:
      'Help teams find cloud waste without drowning in billing CSVs and six different AWS consoles.',
    role: 'Senior Product Designer',
    platforms: 'Enterprise web SaaS',
    year: '2025',
    metrics: [
      { label: 'Diagnosis speed', value: '+30%' },
      { label: 'AWS services', value: '20+' },
      { label: 'Primary action', value: '1-click' }
    ],
    problem: [
      'Billing and utilization evidence lived in separate service-specific consoles.',
      'Static reports identified waste but did not explain the next action.',
      'Engineering and finance teams used incompatible language for the same decisions.'
    ],
    goal: [
      'Create a single-pane view of cost, utilization, and anomalies.',
      'Quantify the savings and risk of every recommendation.',
      'Make optimization decisions inspectable before execution.'
    ],
    process: [
      {
        title: 'Unify the cost model',
        body: 'Aligned EC2, RDS, S3, Lambda, volume, and snapshot data around resources and actionable states.'
      },
      {
        title: 'Prioritize recommendations',
        body: 'Designed cards that combined evidence, exact savings, operational risk, and a specific action.'
      },
      {
        title: 'Build for trust',
        body: 'Added search, profile context, recommendation rationale, and reversible decision states.'
      }
    ],
    solution: [
      'A multi-service dashboard for trends, anomalies, and idle resources.',
      'Recommendation cards with exact monthly savings and instance-level actions.',
      'Service-specific workspaces sharing one consistent interaction model.'
    ],
    outcomes: [
      'Made cloud waste 30% faster to identify.',
      'Consolidated more than 20 infrastructure services and funnels.',
      'Turned passive cost reporting into an action-oriented optimization workflow.'
    ],
    image: asset('cloud-rds.png'),
    images: [
      { src: asset('cloud-rds.png'), alt: 'RDS cost optimization recommendations' },
      { src: asset('cloud-ec2.png'), alt: 'EC2 service recommendation table' },
      { src: asset('cloud-processing.png'), alt: 'Cloud analysis processing state' }
    ]
  }
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getAllSlugs() {
  return projects.map((project) => project.slug);
}

export function howMeasured(project: Project) {
  return project.outcomeEvidence
    .map(
      (item) =>
        `${item.metric}. Baseline: ${item.baseline}. Method: ${item.method}. Source: ${item.source}.`
    )
    .join(' ');
}
