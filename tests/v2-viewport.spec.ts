import { expect, test } from '@playwright/test';

const routes = ['/v2/', '/v2/about/', '/v2/machine/', '/v2/work/vr-eeg-analytics/'];
const widths = [320, 375, 390, 768];

for (const width of widths) {
  for (const route of routes) {
    test(`no horizontal overflow ${route} at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(1);
      await page.screenshot({
        path: `test-results/screens/${width}${route.replaceAll('/', '-')}.png`,
        fullPage: true
      });
    });
  }
}
