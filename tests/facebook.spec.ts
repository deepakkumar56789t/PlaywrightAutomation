import { test } from '@playwright/test';
import fs from 'fs';

const USER = process.env.FB_USER || 'ggdh';
const PASS = process.env.FB_PASS || 'jsf';

test.only('list facebook friends', async ({ page }) => {
  // Navigate to Facebook
  await page.goto('https://www.facebook.com/', { waitUntil: 'networkidle' });

  // Try dismissing cookie/dialog buttons if present
  const cookieSelectors = [
    'button:has-text("Allow essential and optional cookies")',
    'button:has-text("Allow all cookies")',
    'button:has-text("Accept")',
    'button:has-text("Agree")',
    'button:has-text("OK")'
  ];
  for (const sel of cookieSelectors) {
    const el = page.locator(sel).first();
    if (await el.count()) {
      await el.click().catch(() => {});
      break;
    }
  }

  // Fill credentials and log in
  await page.fill('input[name="email"]', USER);
  await page.fill('input[name="pass"]', PASS);
  await Promise.all([
    page.click('button[name="login"], button:has-text("Log In"), input[type="submit"]').catch(() => {}),
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
  ]);

  // Navigate to friends list
  await page.goto('https://www.facebook.com/me/friends', { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(2000);

  // Scroll to load more friends
  for (let i = 0; i < 8; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(1000);
  }

  // Extract candidate names heuristically
  const names: string[] = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('a,div,span'));
    const out = new Set<string>();
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ'\-. ]{2,}$/;
    for (const n of nodes) {
      const text = (n.textContent || '').trim();
      if (!text) continue;
      if (text.length < 3 || text.length > 60) continue;
      const words = text.split(/\s+/);
      if (words.length > 5) continue;
      if (!nameRegex.test(text)) continue;
      out.add(text);
    }
    return Array.from(out);
  });

  console.log('Found', names.length, 'candidate names');
  names.forEach(n => console.log(n));

  // Ensure output dir exists and write results
  try {
    fs.mkdirSync('test-results', { recursive: true });
    fs.writeFileSync('test-results/facebook-friends.json', JSON.stringify(names, null, 2));
  } catch (e) {
    console.warn('Could not write results file:', e);
  }
});
