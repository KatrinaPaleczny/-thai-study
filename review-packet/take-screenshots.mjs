import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'screenshots');
mkdirSync(OUT, { recursive: true });

const BASE = 'http://localhost:5173';

// Pages: [pageKey, label, filename_prefix]
const PAGES = [
  ['dashboard',    'Dashboard',        'dashboard'],
  ['vocab',        'Vocabulary',       'vocabulary'],
  ['study',        'Flashcards',       'flashcards'],
  ['categories',   'Categories',       'categories'],
  ['grammar',      'Grammar',          'grammar'],
  ['numbers',      'Numbers',          'numbers'],
  ['conversation', 'Conversation',     'conversation'],
  ['builder',      'Sentence Builder', 'sentence-builder'],
];

async function setPage(page, key) {
  // Click the React state via the sidebar buttons using text
  await page.evaluate((k) => {
    // Find all sidebar buttons and click the one matching the page key
    // We trigger a click via React state by clicking sidebar buttons
    const buttons = document.querySelectorAll('.sb-btn');
    for (const btn of buttons) {
      btn.click && btn.blur && btn.blur();
    }
  }, key);

  // Use React devtools approach: dispatch a click on the right nav button
  // The sidebar buttons set page state — match by data or text
  const PAGE_LABELS = {
    dashboard:    'Dashboard',
    vocab:        'Vocabulary',
    study:        'Flashcards',
    categories:   'Categories',
    grammar:      'Grammar',
    numbers:      'Numbers',
    conversation: 'Conversation',
    builder:      'Sentence Builder',
  };
  const label = PAGE_LABELS[key];
  const btn = page.locator('.sb-btn').filter({ hasText: label }).first();
  await btn.click();
  await page.waitForTimeout(400);
}

async function screenshotPage(browser, key, label, prefix, viewport) {
  const { width, height, suffix } = viewport;
  const context = await browser.newContext({ viewport: { width, height } });
  const pw = await context.newPage();
  await pw.goto(BASE, { waitUntil: 'networkidle' });
  await pw.waitForTimeout(500);
  await setPage(pw, key);
  await pw.waitForTimeout(600);

  // Scroll to top
  await pw.evaluate(() => window.scrollTo(0, 0));
  await pw.waitForTimeout(200);

  const filename = `${prefix}-${suffix}.jpg`;
  const path = join(OUT, filename);
  await pw.screenshot({ path, type: 'jpeg', quality: 90, fullPage: true });
  console.log(`✓ ${filename}`);
  await context.close();
  return filename;
}

const VIEWPORTS = [
  { width: 1440, height: 900,  suffix: 'desktop' },
  { width: 390,  height: 844,  suffix: 'mobile'  },
];

// Mobile screenshots only for key pages
const MOBILE_PAGES = ['dashboard', 'vocab', 'study', 'conversation'];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const manifest = [];

  for (const [key, label, prefix] of PAGES) {
    // Desktop for all
    const f = await screenshotPage(browser, key, label, prefix, VIEWPORTS[0]);
    manifest.push({ page: label, file: f, viewport: 'desktop' });

    // Mobile for key pages
    if (MOBILE_PAGES.includes(key)) {
      const fm = await screenshotPage(browser, key, label, prefix, VIEWPORTS[1]);
      manifest.push({ page: label, file: fm, viewport: 'mobile' });
    }
  }

  await browser.close();

  writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('\nDone! Screenshots saved to:', OUT);
  console.log('Manifest:', manifest.map(m => m.file).join(', '));
}

run().catch(err => { console.error(err); process.exit(1); });
