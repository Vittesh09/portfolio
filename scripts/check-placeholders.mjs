import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'out');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

if (!fs.existsSync(out)) {
  console.error('check-placeholders: out/ is missing. Run next build first.');
  process.exit(1);
}

const hits = [];
for (const file of walk(out)) {
  if (!/\.(html|txt|json|md)$/.test(file)) continue;
  const text = fs.readFileSync(file, 'utf8');
  if (text.includes('{{NEEDS')) hits.push(path.relative(root, file));
}

if (hits.length) {
  console.error('Built files still contain {{NEEDS placeholders:');
  hits.forEach((hit) => console.error(`- ${hit}`));
  process.exit(1);
}

console.log('check-placeholders: no {{NEEDS in built output');
