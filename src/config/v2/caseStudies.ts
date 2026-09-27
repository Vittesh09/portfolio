import type { MetricEvidence } from '@/src/config/v2/profile';

const unconfirmedMethod = 'TODO: [FILL: baseline and method for this metric]';

export type CaseStory = {
  facts: { label: string; value: string }[];
  takeaways: string[];
  challenge: string[];
  pains: string[];
  brief: string;
  approach: string;
  decisions: { title: string; body: string }[];
  features: { title: string; body: string; image: { src: string; alt: string } }[];
  results: { value: string; label: string }[];
  closing: string;
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
  images: { src: string; alt: string }[];
};

const asset = (name: string) => `/assets/case-studies/${name}`;

export const projects: Project[] = [
{
    slug: 'fleet-command-center',
    index: '01',
    title: 'FleetTrack',
    summary:
      'I redesigned the FleetTrack dashboard so a fleet manager can see trucks and dumpsters, open a trip, and act on an event in one workspace.',
    company: 'LB Technology',
    cardRole: 'Product Designer',
    outcomeLine:
      'The fleet manager sees the fleet, the trip, and the event in one workspace.',
    outcomeEvidence: [],
    tags: ['Fleet', 'Dashboard', 'Telematics'],
    industry: 'Fleet logistics',
    client: 'Unnamed operator of trucks and dumpsters',
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
      facts: [
        { label: 'My role', value: 'Product Designer, whole dashboard' },
        { label: 'Timeline', value: '4+ months' }
      ],
      takeaways: [
        'FleetTrack tracks the trucks and dumpsters of an operator that needs to know, every day, where its vehicles are, how they are being driven, and what they cost to run.',
        'Over four months, with a project manager, a business analyst, and the developers, I redesigned the whole dashboard around the person who runs the fleet. The fleet, the trip, and the event now sit in one workspace, and a question the manager asks once stays on the dashboard for the next morning.'
      ],
      challenge: [
        'The data was never the problem. GPS positions, harsh-driving events from the vehicles and their cameras, fuel and engine hours, and service intervals were all being collected.',
        'The problem was the fleet manager’s morning. They answer for safety, fuel spend, maintenance, and the people behind the wheel, so their day starts with a check across the whole fleet, then a closer look at the few vehicles that need one. The product did not follow that day. A harsh stop was a row in one report, the truck’s position was on a map somewhere else, and the clip that explained it was in the camera software. The manager did the joining up.'
      ],
      pains: [
        'Totals and the live fleet on separate screens',
        'Events as rows, with no place attached',
        'Speed, limit, and camera in different tools',
        'The same report rebuilt every morning'
      ],
      brief:
        'The brief was practical: one place where a manager can check the fleet, find what went wrong, see why, deal with it, and come back to the same view tomorrow.',
      approach:
        'With the business analyst I walked through how a manager moves through a day, and every point where they had to leave the product became something to fix. The project manager and developers were in those reviews from the start, so each idea was checked early against what the telematics and camera data could support.',
      decisions: [
        {
          title: 'The fleet comes first',
          body: 'The first screen answers for the whole operation: who is driving, who is idle, and where the exceptions are. A single truck is what the manager opens next, not where they start.'
        },
        {
          title: 'The event sits on the route',
          body: 'A harsh stop means more on the map than in a table. Where it happened is often the explanation: a junction, a hill, a stretch of road where it keeps happening.'
        },
        {
          title: 'The manager composes the dashboard',
          body: 'An operator running dumpsters and one running long-haul trucks do not watch the same numbers. Widgets let each manager keep their own morning, and any report can come back as a tile.'
        }
      ],
      features: [
        {
          title: 'A morning dashboard',
          body: 'Safety events, fuel, maintenance due, and asset status as widgets. Any of them can be removed, and new ones are added from a panel grouped the way managers talk about the fleet.',
          image: {
            src: asset('fleet-dashboard.png'),
            alt: 'Dashboard with safety, fuel, maintenance, and asset widgets, and the add-widget panel open'
          }
        },
        {
          title: 'A live map, and the trip behind each truck',
          body: 'Every vehicle has a status in the list and the same mark on the map, so a cluster of idle trucks stands out. Opening one draws its trip, with each event pinned where it happened.',
          image: {
            src: asset('fleet-trip.jpg'),
            alt: 'Trip details with events listed and pinned along the route'
          }
        },
        {
          title: 'A vehicle panel that closes the loop',
          body: 'Speed above the posted limit, location, and alerts in one column. The manager can message the driver, open the camera, or mark the event resolved without leaving the map.',
          image: {
            src: asset('fleet-vehicle.png'),
            alt: 'Vehicle panel with speed against the limit, camera, and mark as resolved'
          }
        },
        {
          title: 'Reports that become tiles',
          body: 'A custom report can be filtered, grouped, and shared, then drawn as a chart and published to the dashboard, so tomorrow’s answer is already there.',
          image: {
            src: asset('fleet-tile.png'),
            alt: 'Create-tile dialog with chart types, variables, and a preview'
          }
        }
      ],
      results: [
        { value: 'One', label: 'workspace for the fleet, the trip, and the event' },
        { value: 'On the route', label: 'every safety event, beside speed and the posted limit' },
        { value: 'Kept', label: 'custom reports stay on the dashboard as tiles' }
      ],
      closing:
        'The manager no longer does the joining up. They start with the fleet, go straight to the exception, see where and why it happened, act on it, and find the same view waiting the next morning.'
    },
    outcomes: [
      'Safety, fuel, maintenance, and asset status are on one dashboard, instead of a separate report for each question.',
      'An event is on the route, with speed and the limit, instead of a row with no place attached.',
      'A report the manager built can stay on the dashboard as a tile for the next morning.'
    ],
    measurementNote:
      'These are changes in the product. I do not have a counted before-and-after for time saved, events caught, or fuel reduced, so none is stated here.',
    image: asset('fleet-header.jpg'),
    imageAlt:
      'FleetTrack header: a laptop showing the live trip map, with geozone, login, and custom report screens around it.',
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
