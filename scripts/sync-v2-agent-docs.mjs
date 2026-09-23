import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function write(rel, contents) {
  fs.writeFileSync(path.join(root, rel), contents);
}

function grabExport(src, name) {
  const match = src.match(new RegExp(`export const ${name} = '([^']*)'`));
  if (!match) throw new Error(`Could not find export ${name}`);
  return match[1];
}

function grabProfileField(src, name) {
  const match = src.match(new RegExp(`${name}: '([^']*)'`));
  if (!match) throw new Error(`Could not find profile field ${name}`);
  return match[1];
}

function grabTitles(src) {
  return [...src.matchAll(/title: '([^']+)'/g)].map((match) => match[1]);
}

function pending(value) {
  return /TODO|\[FILL:/.test(value);
}

export function collectFacts() {
  const profile = read('src/config/v2/profile.ts');
  const studies = read('src/config/v2/caseStudies.ts');
  const titles = grabTitles(studies).filter((title) =>
    ['Future City VR + EEG', 'Fleet Command Center', 'Cloud Cost Optimization'].includes(title)
  );
  const profileBlock = /export const profile = \{([\s\S]*?)\n\} as const/.exec(profile)?.[1] ?? '';

  return {
    lastUpdated: grabExport(profile, 'lastUpdated'),
    name: /name: '([^']+)'/.exec(profileBlock)?.[1] ?? '',
    title: /title: '([^']+)'/.exec(profileBlock)?.[1] ?? '',
    yearsExperience: grabExport(profile, 'yearsExperience'),
    email: /email: '([^']+)'/.exec(profileBlock)?.[1] ?? '',
    availability: grabExport(profile, 'availability'),
    locationLine: /locationLine: '([^']+)'/.exec(profileBlock)?.[1] ?? 'India',
    heroHeadline: grabExport(profile, 'heroHeadline'),
    linkedin: /linkedin: '([^']+)'/.exec(profile)?.[1] ?? '',
    behance: /behance: '([^']+)'/.exec(profile)?.[1] ?? '',
    employers: [
      ...profile.matchAll(/name: '(Nagarro|Simple Energy|Cult\.fit \(formerly Curefit\))'/g)
    ].map((match) => match[1]),
    caseTitles: titles
  };
}

export function buildAgentDocs(facts) {
  const llms = [
    `# ${facts.name}`,
    '',
    `${facts.title}. ${facts.heroHeadline}`,
    `Location: ${facts.locationLine}`,
    ...(pending(facts.availability) ? [] : [`Availability: ${facts.availability}`]),
    `Email: ${facts.email}`,
    `Years: ${facts.yearsExperience}`,
    '',
    'Case studies:',
    ...facts.caseTitles.map(
      (title) =>
        `- ${title}: https://www.vittesh.com/v2/work/${
          title === 'Future City VR + EEG'
            ? 'vr-eeg-analytics'
            : title === 'Fleet Command Center'
              ? 'fleet-command-center'
              : 'cloud-cost-optimization'
        }/`
    ),
    '',
    'Machine-readable profile: https://www.vittesh.com/v2/machine/',
    'Full markdown: https://www.vittesh.com/machine.md',
    'JSON: https://www.vittesh.com/machine.json',
    `LinkedIn: ${facts.linkedin}`,
    `Behance: ${facts.behance}`,
    `Last updated: ${facts.lastUpdated}`,
    ''
  ].join('\n');

  return { llms, facts };
}

if (process.argv[1] && process.argv[1].endsWith('sync-v2-agent-docs.mjs')) {
  const facts = collectFacts();
  const { llms } = buildAgentDocs(facts);
  const recordNote =
    'This file is a snapshot for crawlers. The live generator is src/config/v2/agentDocuments.ts.';
  write('public/llms.txt', llms);
  const full = [
      `# ${facts.name}`,
      '',
      'This page is a machine-readable version of the portfolio for AI agents.',
      `Last updated: ${facts.lastUpdated}`,
      '',
      `Name: ${facts.name}`,
      `Title: ${facts.title}`,
      `Email: ${facts.email}`,
      `Years: ${facts.yearsExperience}`,
      ...(pending(facts.availability) ? [] : [`Availability: ${facts.availability}`]),
      `Location: ${facts.locationLine}`,
      '',
      'Employers:',
      ...facts.employers.map((name) => `- ${name}`),
      '',
      'Case studies:',
      ...facts.caseTitles.map((title) => `- ${title}`),
      '',
      recordNote,
      ''
    ].join('\n');
  write('public/llms-full.txt', full);
  write('public/machine.md', full);
  write(
    'public/machine.json',
    `${JSON.stringify(
      {
        lastUpdated: facts.lastUpdated,
        name: facts.name,
        title: facts.title,
        email: facts.email,
        yearsExperience: facts.yearsExperience,
        location: facts.locationLine,
        employers: facts.employers,
        caseStudies: facts.caseTitles,
        links: {
          home: 'https://www.vittesh.com/v2/',
          machine: 'https://www.vittesh.com/v2/machine/',
          linkedin: facts.linkedin,
          behance: facts.behance
        }
      },
      null,
      2
    )}\n`
  );
  console.log('Wrote public/llms.txt, public/llms-full.txt, public/machine.json');
}
