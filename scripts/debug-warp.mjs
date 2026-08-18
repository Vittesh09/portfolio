import { chromium } from 'playwright';
import fs from 'fs';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('console', (m) => {
  if (m.type() === 'warning' && m.text().includes('WebGL')) return;
  console.log('CONSOLE', m.type(), m.text());
});

await page.goto('http://localhost:3000/v2/', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);

let info = await page.evaluate(() => window.__bhWarp?.());
console.log('READY', JSON.stringify(info));

const targets = await page.evaluate(() => {
  const hole = window.__bhWarp?.();
  const text = document.querySelector('[data-bh-warp]')?.getBoundingClientRect();
  return {
    hole: hole?.hole,
    text: text
      ? { x: text.left + text.width / 2, y: text.top + text.height / 2, left: text.left, w: text.width }
      : null
  };
});
console.log('TARGETS', JSON.stringify(targets));

if (!targets.hole || !targets.text) {
  console.log('Missing targets');
  await browser.close();
  process.exit(1);
}

// Click center of void, drag to text center
await page.mouse.move(targets.hole.x, targets.hole.y);
await page.mouse.down();
await page.waitForTimeout(100);
info = await page.evaluate(() => window.__bhWarp?.());
console.log('AFTER_DOWN', JSON.stringify(info));

await page.mouse.move(targets.text.x, targets.text.y, { steps: 30 });
await page.waitForTimeout(400);
info = await page.evaluate(() => window.__bhWarp?.());
console.log('AFTER_DRAG', JSON.stringify(info));
const warped = await page.evaluate(() =>
  document.querySelector('.bh-hero')?.classList.contains('is-text-warped')
);
console.log('HAS_WARPED_CLASS', warped);

await page.screenshot({ path: 'scripts/warp-debug.png', fullPage: false });
console.log('Wrote scripts/warp-debug.png');

await page.mouse.up();
await browser.close();
