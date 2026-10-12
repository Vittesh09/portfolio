import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve('public/assets');

const jobs = [
  { src: 'images/profile.png', dest: 'images/profile-192.webp', width: 192 },
  { src: 'images/profile.png', dest: 'images/profile-1400.webp', width: 1400 },
  { src: 'case-studies/future-controller.png', dest: 'case-studies/future-controller.webp', width: 2000 },
  { src: 'case-studies/Frame 1000005391.svg', dest: 'case-studies/fleet-card.webp', width: 2000 },
  { src: 'case-studies/4.svg', dest: 'case-studies/cloud-diagram.webp', width: 2000 },
  { src: 'case-studies/5.svg', dest: 'case-studies/vr-diagram.webp', width: 2000 }
];

for (const job of jobs) {
  const input = path.join(root, job.src);
  const output = path.join(root, job.dest);
  if (!fs.existsSync(input)) {
    console.warn('skip missing', job.src);
    continue;
  }
  await sharp(input, { unlimited: true })
    .resize({ width: job.width, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(output);
  const before = fs.statSync(input).size;
  const after = fs.statSync(output).size;
  console.log(
    `${job.dest}: ${(after / 1024).toFixed(0)} KB (from ${(before / 1024).toFixed(0)} KB)`
  );
}
