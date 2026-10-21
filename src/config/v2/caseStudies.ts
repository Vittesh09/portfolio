import type { MetricEvidence } from '@/src/config/v2/profile';

const unconfirmedMethod = 'TODO: [FILL: baseline and method for this metric]';

export type CaseStory = {
  eyebrow: string;
  lede: string;
  support: string;
  /** Let the opening paragraphs use the full story column. */
  supportWide?: boolean;
  facts: { label: string; value: string }[];
  problemTitle: string;
  problemPoints: { title: string; body: string }[];
  problemClose: string;
  /** Diagram that states the solution, after the challenge. */
  solutionImage?: { src: string; alt: string };
  ideaTitle: string;
  ideaFlow: string[];
  idea: string;
  questions: { index: string; body: string }[];
  ideaNote: string;
  /** Planning image, shown before the designed screens. */
  plan?: { label: string; title: string; body: string; image: { src: string; alt: string } };
  redesignTitle: string;
  /** Place the roles block before the journey. */
  rolesFirst?: boolean;
  moments: {
    label: string;
    title: string;
    body: string;
    image: { src: string; alt: string };
    /** Extra screens shown with this moment, not as their own step. */
    also?: { src: string; alt: string }[];
    /** Screens shown in one row, above any video. */
    pair?: { src: string; alt: string }[];
    video?: string;
  }[];
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
  /** Diagram for how the capability is understood, before the results. */
  capabilityImage?: { src: string; alt: string };
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
  /** Card outcome, two lines split by a newline. */
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
  /** Wide opening video. The still in `image` stays the card frame. */
  heroVideo?: string;
  /** Card frames. While the pointer is on the card, these crossfade in order. */
  cardImages?: string[];
  /** Fill the wide thumbnail. Later frames are not letterboxed. */
  cardCover?: boolean;
  /** Shown on the homepage as a locked card, with no case study page yet. */
  comingSoon?: boolean;
  /** Unpublished studies stay out of nav, sitemap, and the machine page. */
  published?: boolean;
  /** Outcome-led card title. The page h1 stays `title`. */
  cardTitle?: string;
  domain?: string;
  seoTitle?: string;
  images: { src: string; alt: string }[];
};

const asset = (name: string) => `/assets/case-studies/${name}`;

export const projects: Project[] = [
{
    slug: 'fleet-track',
    index: '02',
    comingSoon: true,
    title: 'Fleet Track management',
    seoTitle: 'Fleet Track management — one workspace for fleet events | Vittesh Sinha',
    cardTitle: 'Fleet Track management',
    domain: 'Logistics',
    summary:
      'I redesigned the FleetTrack dashboard so a fleet manager can find a problem, see why it happened, and close it in one workspace.',
    company: 'LB Technology',
    cardRole: 'Senior Product Designer',
    outcomeLine: 'A management dashboard\nto maintain the whole fleet.',
    outcomeEvidence: [],
    tags: ['Fleet', 'Dashboard', 'Telematics'],
    industry: 'Fleet logistics',
    client: 'Fleet operators',
    customers: 'Fleet managers',
    challenge:
      'A fleet manager starts from the fleet, not from a single truck.',
    role: 'Senior Product Designer',
    platforms: 'Web',
    year: '2025',
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
      lede: 'One workspace where a fleet manager can find a problem, see why it happened, and close it.',
      support:
        'I redesigned the FleetTrack dashboard to connect fleet visibility, vehicle context, events and actions in one experience.',
      facts: [
        { label: 'Role', value: 'Senior Product Designer' },
        { label: 'Scope', value: 'Dashboard redesign: fleet, vehicle, trip, event, and action' },
        { label: 'Timeline', value: '4 months · 2025' }
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
      idea: 'Instead of treating the dashboard as a collection of separate screens, I designed the experience around how a fleet manager moves from an overview to a specific vehicle, then to an event, its context, and the next action. Vehicle and trip both sit inside Locate, so the five levels show up as four moments: see, locate, understand, and act.',
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
      systemTitle: 'A shared language for FleetTrack.',
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
          title: 'One workflow',
          body: 'An event now sits with its trip, route, and vehicle context, instead of a row with no place attached.'
        },
        {
          title: 'One dashboard',
          body: 'Safety, fuel, maintenance, and asset status share a starting screen, instead of a separate report for each question.'
        },
        {
          title: 'A report that stays',
          body: 'A report the manager built can stay on the dashboard as a tile for the next morning.'
        }
      ],
      honesty:
        "There was no analytics baseline for this project, so I'm not claiming performance numbers. The notes above are changes in the product. Proposals I'd track next, not results: time from alert to resolution, the share of events closed in the panel, and how often widgets are configured.",
    },

    outcomes: [
      'Safety, fuel, maintenance, and asset status are on one dashboard, instead of a separate report for each question.',
      'An event is on the route, with speed and the limit, instead of a row with no place attached.',
      'A report the manager built can stay on the dashboard as a tile for the next morning.'
    ],
    measurementNote:
      'These are changes in the product. I do not have a counted before-and-after for time saved, events caught, or fuel reduced, so none is stated here.',
    image: asset('fleet-card.webp'),
    cardImages: [
      asset('fleet-card.webp'),
      asset('fleet-cameras-device.webp'),
      asset('fleet-thumb-video.jpg')
    ],
    imageAlt: 'FleetTrack collage showing the live map, cameras, geozone and event list.',
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
    index: '01',
    title: 'Future City VR + EEG',
    seoTitle: 'Future City VR + EEG — analytics | Vittesh Sinha',
    cardTitle: "Future City VR + EEG: walk the city before it's built",
    domain: 'VR',
    summary:
      'I was the sole designer, shaping the immersive VR experience and the analytics platform end to end. A future city had to be walked before it was built.',
    company: 'TODO: [FILL: employer for Future City VR + EEG]',
    cardRole: 'Senior Product Designer',
    outcomeLine: 'Building a VR city for users to explore\nand gather their emotional data.',
    outcomeEvidence: [],
    tags: ['VR', 'Experience', 'Dashboards'],
    industry: 'Urban development · Spatial computing',
    client: 'Future-city development group',
    customers: 'Participants, urban planners, and the teams running the sessions',
    challenge:
      'A future city had to be walked in VR, while four roles still needed a way to prepare people, keep raw EEG data, and configure simulations.',
    role: 'Senior Product Designer · sole designer',
    platforms: 'VR headset · Web',
    year: '2024',
    metrics: [
      { label: 'Role', value: 'Sole designer' },
      { label: 'Timeline', value: '3 months' },
      { label: 'Platforms', value: 'VR · Web' }
    ],
    problem: [
      'There was no existing workflow for inviting people, preparing them, and guiding them through the city.',
      'The virtual city was too large to wander without a sequence of meaningful places.',
      'Participants, data providers, planners, and admins each needed a different screen on the same operation.'
    ],
    goal: [
      'Map the journey before the screens: invitation, profile, diagnostics, the city, then a response.',
      'Keep questions at selected places so the walk stays intact.',
      'Give each role control without exposing the technical system underneath.'
    ],
    process: [
      {
        title: 'Map the operation',
        body: 'The participant journey came first. Everything else, from admin access to the simulation, hung off that sequence.'
      },
      {
        title: 'Structure the city',
        body: 'Predefined routes moved people between places such as homes and a university, so sessions could be compared.'
      },
      {
        title: 'Split the roles',
        body: 'Admins managed access. Raw Data Providers kept the EEG record available. Planners configured the world, the people, the time, and the environment.'
      }
    ],
    solution: [
      'A staged participant list, from invitation through a completed experience.',
      'A setup check for the EEG device, the network, the microphone, and the headset.',
      'Routes and in-headset prompts, plus separate screens for admins and planners.'
    ],
    story: {
      eyebrow: 'Case study · Experience design · VR',
      lede: 'An immersive walk through a future city, and a platform that captures, analyses, and visualises how people respond.',
      supportWide: true,
      support:
        'A future city had to be walked before it was built. The VR session opened its key places and captured the response.\n\nI was the sole designer on the project, responsible for shaping the experience end to end. I worked closely with the product, engineering, and research teams, owning design decisions across both the immersive VR experience and the supporting analytics platform.',
      facts: [
        { label: 'Role', value: 'Senior Product Designer · sole designer' },
        { label: 'Scope', value: 'VR, participants, simulation, and dashboards' },
        { label: 'Timeline', value: '3 months' }
      ],
      rolesFirst: true,
      problemTitle: 'The goal was twofold.',
      problemPoints: [
        {
          title: 'Explore the future city',
          body: 'Create an immersive VR experience that lets users explore the future city.'
        },
        {
          title: 'Read the response',
          body: 'Build a unified platform to capture, analyse, and visualise emotional responses during that experience.'
        }
      ],
      problemClose:
        'How might we let everyday residents experience a city that doesn’t exist yet? How might we capture how they feel in a form planners can trust and compare?',
      solutionImage: {
        src: asset('cloud-diagram.webp'),
        alt: 'The solution: an immersive VR experience, passive EEG capture while questions are asked, then centralised insights for the team.'
      },
      ideaTitle: '',
      ideaFlow: [],
      idea: '',
      questions: [],
      ideaNote: '',
      plan: {
        label: 'Planning',
        title: 'Predefined user routes',
        body: 'For all three cities, Module 45, Module 47, and Capital of Tiran, we mapped the route so people could walk them and get the best experience.',
        image: {
          src: asset('future-route.png'),
          alt: 'A planned route from Primary Homes to Creative University across the city map.'
        }
      },
      redesignTitle: '',
      moments: [
        {
          label: '01 / Administer',
          title: 'Keep roles explicit',
          body: 'Admins created users, assigned a role, and turned access on or off. Administration stayed a short list, not a second product.',
          image: {
            src: asset('future-admin.png'),
            alt: 'Admin user list with a filter for role and status.'
          }
        },
        {
          label: '02 / Configure',
          title: 'Configure the simulation',
          body: 'Planners chose a world, the areas and points of interest, who the virtual population was, how many, the period, and the situation for that session: time of day, light, cloud, and sound.',
          image: {
            src: asset('future-configure.png'),
            alt: 'Urban planner screen for configuring a simulation: world, areas, virtual population, period, and environment.'
          },
          also: [
            {
              src: asset('future-visualisation.png'),
              alt: 'Urban planner list of simulations, with the execution date, status, and a way to open each one.'
            }
          ]
        },
        {
          label: '03 / Prepare',
          title: 'Track your progress',
          body: 'Participants had a separate dashboard to track their progress and update their profile, so the Urban Planner got accurate data.',
          image: {
            src: asset('future-profile.jpg'),
            alt: 'The participant profile, with current status from mobile number verified through experience completed, and fields for name, age, and gender.'
          }
        },
        {
          label: '04 / Diagnose',
          title: 'System diagnostics before users experience the city',
          body: 'Once the headset is on, this is what they see. Diagnostics is open. The city stays closed until that step is done, and only then does the experience begin.',
          image: {
            src: asset('future-headset.jpg'),
            alt: 'Diagnostics runs first. The city stays closed until it passes.'
          },
          pair: [
            {
              src: asset('future-headset.jpg'),
              alt: 'Diagnostics runs first. The city stays closed until it passes.'
            },
            {
              src: asset('future-question.jpg'),
              alt: 'A question in the headset, with a microphone prompt to answer by voice.'
            }
          ]
        },
        {
          label: '05 / Settle',
          title: 'Settle in: headset fit, guidance and comfort check',
          body: 'Before the city, the participant confirmed the headset felt right, or stopped and called a moderator.',
          image: {
            src: asset('future-diagnostics.png'),
            alt: 'A check that the headset is comfortable before the session starts.'
          },
          video: asset('future-comfort.mp4')
        },
        {
          label: '06 / Experience',
          title: 'The VR experience of the city',
          body: 'Moving. A small group moved through the areas assigned to them, on foot or by teleport, across flat ground, stairs, and slopes. Seeing others. The other people in the group were visible nearby, and a virtual population filled the streets. Answering. Questions appeared in the place and were answered by voice. Knowing where you are. The same walk kept a record of where they were, the light and sound there, and the raw EEG. The controller guide stayed in the city, and a journey card held the current area, the destination, and the time spent.',
          image: {
            src: asset('future-controller.webp'),
            alt: 'Walking through the virtual city with other people, across paths, stairs, and slopes.'
          },
          video: asset('future-city-walk.mp4'),
          pair: [
            {
              src: asset('future-controller.webp'),
              alt: 'Controller guide in the virtual city, marking the triggers for the interface and the microphone.'
            },
            {
              src: asset('future-journey.jpg'),
              alt: 'Journey tracker in the headset, with the current area, destination, and time spent.'
            }
          ]
        }
      ],
      redesignClose: '',
      systemTitle: 'One kit for the web dashboards.',
      kit: 'A reusable kit for forms, tables, filters, and controls, shared by every dashboard.',
      iconsTitle: 'One visual language',
      icons: 'I also set the logo and the visual foundation, so the web tools and the VR moments read as one product.',
      scaleTitle: 'One experience, four roles.',
      scaleShared: ['Manage', 'Prepare', 'Experience', 'Capture', 'Configure'],
      scaleFlexible: ['Admin', 'Participant', 'Raw Data Provider', 'Urban Planner'],
      scale:
        'Four roles, one shared data flow. Admins managed access. Participants prepared and entered the city. Raw Data Providers kept the EEG record available for the people downstream. Urban planners set the world, the people, the time, and the environment.',
      resultsTitle: 'Learnings',
      results: [
        {
          title: 'Passive signals and self-reporting',
          body: 'EEG captured a continuous emotional signal. Asking participants, at intervals, how they were feeling validated that signal and gave it context, without fully breaking immersion.'
        },
        {
          title: 'Timing of prompts',
          body: 'Prompts placed too often disrupted immersion and added noise to both the EEG and what people reported. Check-ins at natural transitions produced more consistent emotional insight, and still captured a conscious response.'
        },
        {
          title: 'Baseline mood',
          body: 'Mood at the start strongly shaped the emotional response in the early part of the VR journey. Pre-experience diagnostics were essential for reading those first peaks accurately.'
        },
        {
          title: 'Synthesis, not volume',
          body: 'The real challenge was not collecting more emotional input. It was aligning the EEG with what people reported, so the patterns were ones stakeholders could trust.'
        }
      ],
      honesty: ''
    },
    outcomes: [
      'EEG captured a continuous emotional signal. Periodic self-reporting validated it without fully breaking immersion.',
      'Prompts placed too often added noise. Check-ins at natural transitions produced more consistent emotional insight.',
      'Baseline mood shaped the early VR journey, so pre-experience diagnostics were essential for reading the first peaks.',
      'The challenge was aligning EEG with what people reported, so stakeholders could trust the patterns.'
    ],
    measurementNote:
      'No formal quantitative outcome was captured during the project, so no numerical performance claims are being made.',
    image: asset('future-city.jpg'),
    imageAlt: 'A participant standing in the virtual city, with session updates beside the path.',
    heroVideo: asset('future-welcome.mp4'),
    cardCover: true,
    cardImages: [
      asset('future-city.jpg'),
      asset('future-headset.jpg'),
      asset('future-controller.webp'),
      asset('future-configure.png')
    ],
    images: [
      {
        src: asset('future-city.jpg'),
        alt: 'A participant standing in the virtual city, with session updates beside the path.'
      },
      {
        src: asset('future-participants.png'),
        alt: 'Participant list with a status path from invitation sent through experience completed.'
      },
      {
        src: asset('future-diagnostics.png'),
        alt: 'System connection checks, with the EEG device marked checked.'
      },
      {
        src: asset('future-controller.webp'),
        alt: 'Controller guide in the virtual city, marking the triggers for the interface and the microphone.'
      },
      {
        src: asset('future-route.png'),
        alt: 'A planned route from Primary Homes to Creative University across the city map.'
      },
      {
        src: asset('future-journey.jpg'),
        alt: 'Journey tracker in the headset, with the current area, destination, and time spent.'
      },
      {
        src: asset('future-admin.png'),
        alt: 'Admin user list with a filter for role and status.'
      },
      {
        src: asset('future-simulation.png'),
        alt: 'Urban planner screen for configuring a simulation: world, people, time, and environment.'
      }
    ]
  },
{
    slug: 'b2b-configurator',
    index: '03',
    comingSoon: true,
    published: false,
    title: 'Redesigning a Global B2B Product Configurator',
    summary: 'Modernising legacy configuration software for an international market.',
    company: 'TODO: [FILL: case 03 company]',
    cardRole: 'Senior Product Designer',
    outcomeLine: 'Modernising legacy configuration software for an international market.',
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
    year: '2026',
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
    image: asset('configurator-preview.jpg'),
    cardCover: true,
    images: [
      { src: asset('cloud-rds.png'), alt: 'RDS cost optimization recommendations' },
      { src: asset('cloud-ec2.png'), alt: 'EC2 service recommendation table' },
      { src: asset('cloud-processing.png'), alt: 'Cloud analysis processing state' }
    ]
  }
];

export type ProjectCardData = Pick<
  Project,
  | 'slug'
  | 'title'
  | 'cardTitle'
  | 'cardRole'
  | 'domain'
  | 'year'
  | 'outcomeLine'
  | 'image'
  | 'imageAlt'
  | 'cardImages'
  | 'cardCover'
  | 'comingSoon'
>;

export function isPublished(project: Project) {
  return project.published !== false && !project.comingSoon;
}

function isHomepageCard(project: Project) {
  return Boolean(project.comingSoon) || project.published !== false;
}

const homepageCardOrder = ['vr-eeg-analytics', 'fleet-track', 'b2b-configurator'];

export const publishedCaseStudyCount = projects.filter(isPublished).length;

/** Card fields only. Server pages pass this into client landings so story copy stays off the homepage bundle. */
export function getProjectCards(): ProjectCardData[] {
  return projects
    .filter(isHomepageCard)
    .sort((a, b) => homepageCardOrder.indexOf(a.slug) - homepageCardOrder.indexOf(b.slug))
    .map((project) => ({
      slug: project.slug,
      title: project.title,
      cardTitle: project.cardTitle,
      cardRole: project.cardRole,
      domain: project.domain,
      year: project.year,
      outcomeLine: project.outcomeLine,
      image: project.image,
      imageAlt: project.imageAlt,
      cardImages: project.cardImages,
      cardCover: project.cardCover,
      comingSoon: project.comingSoon
    }));
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug && isPublished(project));
}

export function getAllSlugs() {
  return projects.filter(isPublished).map((project) => project.slug);
}

export function howMeasured(project: Project) {
  return project.outcomeEvidence
    .map(
      (item) =>
        `${item.metric}. Baseline: ${item.baseline}. Method: ${item.method}. Source: ${item.source}.`
    )
    .join(' ');
}
