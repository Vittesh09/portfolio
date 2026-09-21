import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { collectFacts } from './sync-v2-agent-docs.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

const errors = [];
const facts = collectFacts();
const llms = read('public/llms.txt');
const full = read('public/llms-full.txt');
const json = JSON.parse(read('public/machine.json'));
const md = read('public/machine.md');
const robots = read('public/robots.txt');
const sitemap = read('public/sitemap.xml');
const home = read('src/components/v2/archive/LandingExperienceSingularity.tsx');
const agentDocs = read('src/config/v2/agentDocuments.ts');

function must(condition, message) {
  if (!condition) errors.push(message);
}

must(llms.includes(facts.name), 'llms.txt missing name');
must(llms.includes(facts.yearsExperience), 'llms.txt years mismatch');
must(full.includes(facts.name), 'llms-full.txt missing name');
must(md.includes(facts.name), 'machine.md missing name');
must(md.includes(facts.title), 'machine.md title mismatch');
must(facts.employers.includes('Cult.fit (formerly Curefit)'), 'Cult.fit name missing from employers');
must(facts.title === 'Senior Product Designer', 'Current title is not Senior Product Designer');
must(json.name === facts.name, 'machine.json name mismatch');
must(json.yearsExperience === facts.yearsExperience, 'machine.json years mismatch');
must(json.employers.join('|') === facts.employers.join('|'), 'machine.json employers mismatch');
facts.caseTitles.forEach((title) => {
  must(llms.includes(title), `llms.txt missing case ${title}`);
  must(json.caseStudies.includes(title), `machine.json missing case ${title}`);
});
must(home.includes(facts.heroHeadline) || home.includes('heroHeadline'), 'Home hero not driven by shared headline');
must(agentDocs.includes('Person') && agentDocs.includes('CreativeWork'), 'JSON-LD types missing');
must(!robots.includes('Disallow: /v2/machine'), 'robots.txt blocks machine page');
must(robots.includes('Sitemap:'), 'robots.txt missing sitemap');
must(sitemap.includes('/v2/machine/'), 'sitemap missing machine page');
must(sitemap.includes('/v2/work/vr-eeg-analytics/'), 'sitemap missing VR case');

if (errors.length) {
  console.error('V2 consistency check failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('V2 consistency check passed.');
