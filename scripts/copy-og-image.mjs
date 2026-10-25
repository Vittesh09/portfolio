import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function isFile(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  console.log(`copy-og-image: ${path.relative(root, from)} -> ${path.relative(root, to)}`);
}

const jobs = [
  {
    sources: ['out/opengraph-image', 'out/opengraph-image/opengraph-image'],
    dests: ['out/opengraph-image.png', 'public/opengraph-image.png']
  },
  {
    sources: ['out/twitter-image', 'out/twitter-image/twitter-image'],
    dests: ['out/twitter-image.png', 'public/twitter-image.png']
  }
];

let copied = 0;
for (const job of jobs) {
  const source = job.sources.map((rel) => path.join(root, rel)).find(isFile);
  if (!source) continue;
  for (const dest of job.dests) {
    copy(source, path.join(root, dest));
    copied += 1;
  }
}

if (!copied) {
  console.warn('copy-og-image: no generated OG image found');
}
