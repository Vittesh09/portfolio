import type { MetricEvidence } from '@/src/config/v2/profile';

const unconfirmedMethod = 'TODO: [FILL: baseline and method for this metric]';

export type CaseStory = {
  eyebrow: string;
  lede: string;
  support: string;
  facts: { label: string; value: string }[];
  problemTitle: string;
  problemPoints: { title: string; body: string }[];
  problemClose: string;
  ideaTitle: string;
  ideaFlow: string[];
  idea: string;
  questions: { index: string; body: string }[];
  ideaNote: string;
  redesignTitle: string;
  moments: { label: string; title: string; body: string; image: { src: string; alt: string } }[];
  redesignClose: string;
  systemTitle: string;
  kit: string;
  iconsTitle: string;
  icons: string;
  scaleTitle: string;
  scaleShared: string[];
  scaleFlexible: string[];
  scale: string;
  resultsTitle: string;
  results: { title: string; body: string }[];
  honesty: string;
};

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
  sections?: { title: string; body: string }[];
  story?: CaseStory;
  outcomes: string[];
  measurementNote?: string;
  image: string;
  imageAlt?: string;
  /** Card frames. While the pointer is on the card, these crossfade in order. */
  cardImages?: string[];
  images: { src: string; alt: string }[];
};

const asset = (name: string) => `/assets/case-studies/${name}`;

export const projects: Project[] = [
{
    slug: 'fleet-command-center',
    index: '01',
    title: 'FleetTrack',
    summary:
      'I redesigned the FleetTrack dashboard so a fleet manager can find a problem, see why it happened, and close it in one workspace.',
    company: 'LB Technology',
    cardRole: 'Product Designer',
    outcomeLine:
      'The fleet manager sees the fleet, the trip, and the event in one workspace.',
    outcomeEvidence: [],
    tags: ['Fleet', 'Dashboard', 'Telematics'],
    industry: 'Fleet logistics',
    client: 'Fleet operators',
    customers: 'Fleet managers',
    challenge:
      'A fleet manager starts from the fleet, not from a single truck.',
    role: 'Product Designer',
    platforms: 'Web',
    year: '2024',
    metrics: [
      { label: 'Who it is for', value: 'Manager' },
      { label: 'Timeline', value: '4+ mo' },
      { label: 'What I redesigned', value: 'Dashboard' }
    ],
    problem: [
      'The morning totals and the live fleet were separate screens.',
      'An event was a row in a report, not a point on the route where it happened.',
      'Checking a vehicle meant gathering speed, the limit, and the camera from different places.',
      'A question the manager asked once could not be kept on the dashboard for the next morning.'
    ],
    goal: [
      'Show the fleet before the vehicle.',
      'Put the event on the route, next to speed and the posted limit.',
      'Let the manager compose the dashboard, and turn a report into a tile they keep.'
    ],
    process: [
      {
        title: 'The fleet comes first',
        body: 'The first view is the whole operation: who is driving, who is idle, and where the exceptions are. A single truck is what the manager opens next, not where they start.'
      },
      {
        title: 'The event sits on the route',
        body: 'A harsh stop is more useful when the manager can see where on the trip it happened, next to the speed and the posted limit, with the camera one step away.'
      },
      {
        title: 'The dashboard is composed',
        body: 'Safety, fuel, maintenance, and asset status are widgets the manager can add or remove. A report they build can be drawn as a chart and published back onto that screen.'
      }
    ],
    solution: [
      'A morning dashboard of safety, fuel, maintenance, and asset widgets.',
      'A live map of who is driving and who is idle.',
      'A trip that pins events on the route, and a vehicle panel that can close the review.',
      'Reports that can be shared and published back as dashboard tiles.'
    ],
    story: {
      eyebrow: 'Case study · Enterprise product design · Fleet telematics',
      lede: 'One workspace to understand what is happening across the fleet and act on it.',
      support:
        'I redesigned the FleetTrack dashboard to connect fleet visibility, vehicle context, events and actions in one experience.',
      facts: [
        { label: 'Role', value: 'Product Designer' },
        { label: 'Scope', value: 'Entire dashboard redesign' },
        { label: 'Timeline', value: '4 months · 2024' }
      ],
      problemTitle: 'The data existed. The experience was fragmented.',
      problemPoints: [
        {
          title: 'Information was scattered',
          body: 'Fleet status, trips, events, reports and supporting information appeared in different parts of the experience.'
        },
        {
          title: 'Context was disconnected',
          body: 'A manager often had to connect information from multiple views to understand what had happened.'
        },
        {
          title: 'The interface had grown complex',
          body: 'The existing product needed a cleaner, more consistent experience as the amount of information and functionality increased.'
        }
      ],
      problemClose: 'The redesign was about connecting context, not adding more data.',
      ideaTitle: 'From screens to a connected workflow',
      ideaFlow: ['Fleet', 'Vehicle', 'Trip', 'Event', 'Action'],
      idea: 'Instead of treating the dashboard as a collection of separate screens, I designed the experience around how a fleet manager moves from an overview to a specific vehicle, then to an event, its context, and the next action.',
      questions: [
        { index: '01', body: 'What needs my attention?' },
        { index: '02', body: 'What happened, and where?' },
        { index: '03', body: 'What should I do next?' }
      ],
      ideaNote:
        'I worked with the business analyst, project manager, developers and product leadership to understand the issues being raised by customers and translate them into product and UX decisions.',
      redesignTitle: 'One workflow, four moments',
      moments: [
        {
          label: '01 / See',
          title: 'Start with the fleet',
          body: 'The dashboard brings key operational information into one starting point and lets managers shape what they need to see.',
          image: {
            src: asset('fleet-dashboard.png'),
            alt: 'Dashboard with safety, fuel, maintenance and asset widgets, and the panel for adding a widget.'
          }
        },
        {
          label: '02 / Locate',
          title: 'Find the vehicle',
          body: 'Fleet status and location are connected so the manager can move from an overview to a specific vehicle without losing context.',
          image: {
            src: asset('fleet-map-overview.jpg'),
            alt: 'FleetTrack map overview for a selected vehicle, with trips listed beside the route.'
          }
        },
        {
          label: '03 / Understand',
          title: 'Put the event in context',
          body: 'Events become meaningful when they are connected to the trip, route and surrounding vehicle information.',
          image: {
            src: asset('fleet-trip.jpg'),
            alt: 'Trip details with events listed and pinned along the route.'
          }
        },
        {
          label: '04 / Act',
          title: 'Take action from the same place',
          body: 'The vehicle panel brings the relevant information and available actions together, reducing the need to jump between tools.',
          image: {
            src: asset('fleet-vehicle.png'),
            alt: 'Vehicle panel with speed, the posted limit, camera and mark as resolved.'
          }
        }
      ],
      redesignClose: 'See it → locate it → understand it → act',
      systemTitle: 'A consistent product needs a consistent language.',
      kit: 'A reusable kit, extended from the existing FleetTrack brand.',
      iconsTitle: 'Vehicle iconography',
      icons:
        'One icon language so vehicle types stay recognisable across lists, maps and vehicle views.',
      scaleTitle: 'One system, different fleet needs',
      scaleShared: ['Fleet', 'Vehicle', 'Trip', 'Event', 'Action'],
      scaleFlexible: ['Widgets', 'Reports', 'Operational views'],
      scale:
        'Different fleet operators may care about different information, but the core interaction model stays consistent. The dashboard can adapt without creating a different product for every fleet.',
      resultsTitle: 'The result',
      results: [
        {
          title: 'Connected',
          body: 'Fleet, vehicle, trip and event context are brought into one workflow.'
        },
        {
          title: 'Consistent',
          body: 'The redesigned UI follows a shared visual and interaction language.'
        },
        {
          title: 'Scalable',
          body: 'The component system and vehicle iconography support a wider range of fleet configurations.'
        }
      ],
      honesty:
        'No formal usability baseline or quantitative outcome measurement was captured during the project, so no numerical performance claims are being made.'
    },

    outcomes: [
      'Safety, fuel, maintenance, and asset status are on one dashboard, instead of a separate report for each question.',
      'An event is on the route, with speed and the limit, instead of a row with no place attached.',
      'A report the manager built can stay on the dashboard as a tile for the next morning.'
    ],
    measurementNote:
      'These are changes in the product. I do not have a counted before-and-after for time saved, events caught, or fuel reduced, so none is stated here.',
    image: asset('Frame 1000005391.svg'),
    cardImages: [
      asset('Frame 1000005391.svg'),
      asset('fleet-cameras-device.webp'),
      asset('fleet-thumb-video.jpg')
    ],
    imageAlt:
      'Fleet Management System collage with the live map, cameras, geozone, and event list.',
    images: [
      {
        src: asset('fleet-map.jpg'),
        alt: 'FleetTrack map showing which vehicles are driving and which are idle'
      },
      {
        src: asset('fleet-dashboard.png'),
        alt: 'Fleet manager dashboard with safety, fuel, maintenance, and asset widgets'
      },
      {
        src: asset('fleet-trip.jpg'),
        alt: 'Trip route with safety events pinned along the drive'
      },
      {
        src: asset('fleet-vehicle.png'),
        alt: 'Vehicle panel with speed, posted limit, camera, and mark resolved'
      },
      {
        src: asset('fleet-report.png'),
        alt: 'Custom report filtered by event type so it can become a dashboard tile'
      }
    ]
  },
{
    slug: 'vr-eeg-analytics',
    index: '02',
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
