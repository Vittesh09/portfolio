import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const out = path.resolve('out');
const pages = [
  'index.html',
  'v2/index.html',
  'v2/about/index.html',
  'v2/work/fleet-command-center/index.html',
  'v2/classic/index.html',
  'v2/machine/index.html'
];
const gz = (file) => zlib.gzipSync(fs.readFileSync(file)).length;
const kb = (n) => `${(n / 1024).toFixed(0)}KB`;
const uniq = (html, re) => [...new Set([...html.matchAll(re)].map((match) => match[0]))];
const total = (urls) =>
  urls.reduce((sum, url) => {
    const file = path.join(out, url);
    return sum + (fs.existsSync(file) ? gz(file) : 0);
  }, 0);

if (!fs.existsSync(out)) {
  console.error('Missing out/. Run next build first.');
  process.exit(1);
}

for (const page of pages) {
  const file = path.join(out, page);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const js = uniq(html, /\/_next\/static\/[^"' ]+?\.js/g);
  const css = uniq(html, /\/_next\/static\/[^"' ]+?\.css/g);
  const fonts = uniq(html, /\/_next\/static\/media\/[^"' ]+?\.woff2/g);
  console.log(
    page.padEnd(42),
    `html ${kb(gz(file))}`,
    `| js ${js.length} files ${kb(total(js))}`,
    `| css ${kb(total(css))}`,
    `| font preloads ${fonts.length} (${kb(total(fonts))})`
  );
}

const dir = path.join(out, '_next/static/chunks');
const markers = ['WebGLRenderer', 'UnrealBloomPass', 'gsap', 'lenis', 'toCanvas', 'framer'];
console.log('\nLargest chunks (gzip):');
fs.readdirSync(dir)
  .filter((file) => file.endsWith('.js'))
  .map((file) => [file, gz(path.join(dir, file))])
  .sort((a, b) => b[1] - a[1])
  .slice(0, 12)
  .forEach(([file, size]) => {
    const text = fs.readFileSync(path.join(dir, file), 'utf8');
    console.log(kb(size).padStart(6), file, markers.filter((marker) => text.includes(marker)).join(','));
  });
