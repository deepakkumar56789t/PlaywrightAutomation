#!/usr/bin/env node
const { chromium } = require('playwright');

const USER = process.env.FB_USER || process.argv[2];
const PASS = process.env.FB_PASS || process.argv[3];

if (!USER || !PASS) {
  console.error('Usage: FB_USER=you FB_PASS=pass node scripts/list_friends.js');
  console.error('Or: node scripts/list_friends.js <username> <password>');
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto('https://www.facebook.com/', { waitUntil: 'networkidle' });

    // Try to dismiss common cookie dialogs
    try {
      const cookieButtons = [
        'button:has-text("Allow essential and optional cookies")',
        'button:has-text("Allow all cookies")',
        'button:has-text("Accept")',
        'button:has-text("Agree")'
      ];
      for (const sel of cookieButtons) {
        const el = await page.$(sel);
        if (el) { await el.click().catch(() => {}); break; }
      }
    } catch (e) {}

    await page.fill('input[name="email"]', USER);
    await page.fill('input[name="pass"]', PASS);

    await Promise.all([
      page.click('button[name="login"], button:has-text("Log In"), input[type="submit"]').catch(() => {}),
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
    ]);

    // Go directly to friends list for the logged-in user
    await page.goto('https://www.facebook.com/me/friends', { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(2000);

    // Scroll to load more friends
    for (let i = 0; i < 6; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForTimeout(1000);
    }

    // Collect visible candidate names from anchors/texts on the page
    const names = await page.$$eval('a, div, span', nodes => {
      const out = new Set();
      const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ'\-. ]{2,}$/;
      for (const n of nodes) {
        const text = (n.innerText || '').trim();
        if (!text) continue;
        if (text.length < 3 || text.length > 60) continue;
        // heuristic: likely a person name (1-4 words)
        const words = text.split(/\s+/);
        if (words.length > 5) continue;
        if (!nameRegex.test(text)) continue;
        out.add(text);
      }
      return Array.from(out);
    });

    console.log('--- Found candidate names (may include non-friend items) ---');
    names.forEach(n => console.log(n));
    console.log('--- End ---');

  } catch (err) {
    console.error('Error during run:', err);
  } finally {
    await browser.close();
  }
})();
