import { chromium } from 'playwright';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs/promises';

const root = process.cwd();
const indexPath = path.join(root, 'index.html');
const indexUrl = pathToFileURL(indexPath).href;

await fs.mkdir(path.join(root, 'test-artifacts'), { recursive: true });

const browser = await chromium.launch({ headless: true });

const checks = [
  {
    name: 'desktop',
    viewport: { width: 1600, height: 2200 },
    screenshot: 'desktop.png',
  },
  {
    name: 'mobile',
    viewport: { width: 390, height: 844 },
    screenshot: 'mobile.png',
  },
];

try {
  for (const check of checks) {
    const page = await browser.newPage({ viewport: check.viewport });
    const pageErrors = [];

    page.on('pageerror', (error) => {
      pageErrors.push(String(error));
    });

    await page.goto(indexUrl, { waitUntil: 'load' });
    await page.waitForTimeout(300);

    const requiredSelectors = ['.hero', '.social', '.science', '.product-details', '.metrics', '.signup', '.footer'];
    for (const selector of requiredSelectors) {
      const visible = await page.locator(selector).first().isVisible();
      if (!visible) {
        throw new Error(`${check.name}: required section not visible: ${selector}`);
      }
    }

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 1;
    });

    if (hasHorizontalOverflow) {
      throw new Error(`${check.name}: horizontal overflow detected`);
    }

    if (pageErrors.length > 0) {
      throw new Error(`${check.name}: runtime errors detected:\n${pageErrors.join('\n')}`);
    }

    await page.screenshot({
      path: path.join(root, 'test-artifacts', check.screenshot),
      fullPage: true,
    });

    await page.close();
  }

  console.log('Visual checks passed for desktop and mobile.');
} finally {
  await browser.close();
}
