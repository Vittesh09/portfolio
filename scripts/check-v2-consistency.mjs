import { execSync } from 'child_process';
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
must(facts.employers.includes('Cult.fit'), 'Cult.fit name missing from employers');
must(facts.title === 'Senior Product Designer', 'Current title is not Senior Product Designer');
must(json.name === facts.name, 'machine.json name mismatch');
must(json.yearsExperience === facts.yearsExperience, 'machine.json years mismatch');
must(json.employers.join('|') === facts.employers.join('|'), 'machine.json employers mismatch');
facts.caseTitles.forEach((title) => {
  must(llms.includes(title), `llms.txt missing case ${title}`);
  must(json.caseStudies.includes(title), `machine.json missing case ${title}`);
});
const heroCopy = read('src/components/v2/archive/HeroIntroCopy.tsx');
must(
  home.includes('heroHeadline') ||
    home.includes(facts.heroHeadline) ||
    (home.includes('HeroIdentityMark') &&
      heroCopy.includes('siteConfig.name') &&
      heroCopy.includes('siteConfig.role')),
  'Home hero not driven by shared headline'
);
must(agentDocs.includes('Person') && agentDocs.includes('CreativeWork'), 'JSON-LD types missing');
must(!robots.includes('Disallow: /machine'), 'robots.txt blocks machine page');
must(robots.includes('Sitemap:'), 'robots.txt missing sitemap');
must(sitemap.includes('/machine/'), 'sitemap missing machine page');
must(sitemap.includes('/work/vr-eeg-analytics/'), 'sitemap missing VR case');

const assetsRoot = path.join(root, 'public/assets');
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
walk(assetsRoot).forEach((file) => {
  const rel = path.relative(root, file).replaceAll('\\', '/');
  const size = fs.statSync(file).size;
  must(size <= 8 * 1024 * 1024, `${rel} is larger than 8 MB`);
  if (file.endsWith('.svg')) {
    const text = fs.readFileSync(file, 'utf8');
    must(!text.includes('data:image/'), `${rel} embeds a raster image`);
  }
});

const tracked = new Set(
  execSync('git ls-files', { cwd: root, encoding: 'utf8' })
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
);
const importRe = /from\s+['"]([^'"]+)['"]/g;
function resolveImport(fromFile, spec) {
  if (spec.startsWith('@/')) return path.join(root, spec.slice(2));
  if (spec.startsWith('.')) return path.resolve(path.dirname(fromFile), spec);
  return null;
}
function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(ts|tsx|js|jsx|mjs)$/.test(entry.name) ? [full] : [];
  });
}
for (const dir of ['src', 'app', 'scripts']) {
  for (const file of sourceFiles(path.join(root, dir))) {
    const text = fs.readFileSync(file, 'utf8');
    for (const match of text.matchAll(importRe)) {
      const target = resolveImport(file, match[1]);
      if (!target) continue;
      const candidates = ['', '.ts', '.tsx', '.js', '.jsx', '.mjs'].map((ext) =>
        ext && target.endsWith(ext) ? null : `${target}${ext}`
      );
      const existing = [target, ...candidates].find((item) => item && fs.existsSync(item) && fs.statSync(item).isFile());
      if (!existing) continue;
      const rel = path.relative(root, existing).replaceAll('\\', '/');
      must(tracked.has(rel), `${rel} is imported but not tracked in git`);
    }
  }
}

if (errors.length) {
  console.error('V2 consistency check failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('V2 consistency check passed.');
