const puppeteer = require('puppeteer');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { PNG } = require('pngjs');
const rawPixelmatch = require('pixelmatch');
const pixelmatch = rawPixelmatch.default || rawPixelmatch;

const distDir = path.join(__dirname, '..', 'dist');
const baselinesDir = path.join(__dirname, '..', 'test', 'visual-baselines');
if (!fs.existsSync(baselinesDir)) {
  fs.mkdirSync(baselinesDir, { recursive: true });
}

const shouldUpdate = process.argv.includes('--update-baselines');
const scenarioName = process.argv.find(arg => arg.startsWith('--scenario='))?.slice('--scenario='.length);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let cleanUrl = req.url.split('?')[0];
  if (cleanUrl.startsWith('/hr-tool-v2/')) {
    cleanUrl = cleanUrl.slice('/hr-tool-v2/'.length - 1);
  } else if (cleanUrl === '/hr-tool-v2') {
    cleanUrl = '/';
  }
  let filePath = path.join(distDir, cleanUrl === '/' ? 'index.html' : cleanUrl);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading file');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

const TEST_SCENARIOS = [
  { name: 'login_desktop_en', width: 1280, height: 800, lang: 'en', action: 'login' },
  { name: 'login_mobile_en', width: 375, height: 667, lang: 'en', action: 'login' },
  { name: 'login_mobile_ar', width: 375, height: 667, lang: 'ar', action: 'login' },
  { name: 'case_study_desktop', width: 1280, height: 800, lang: 'en', action: 'case_study' },
  { name: 'dashboard_desktop_en', width: 1280, height: 800, lang: 'en', action: 'dashboard' },
  { name: 'dashboard_mobile_ar', width: 375, height: 667, lang: 'ar', action: 'dashboard' },
  { name: 'navigation_mobile_en', width: 375, height: 667, lang: 'en', action: 'navigation' },
  { name: 'navigation_mobile_ar', width: 375, height: 667, lang: 'ar', action: 'navigation' },
  { name: 'dashboard_desktop_ar', width: 1280, height: 800, lang: 'ar', action: 'dashboard' },
  { name: 'dashboard_mobile_en', width: 375, height: 667, lang: 'en', action: 'dashboard' },
  { name: 'preferences_desktop_en_light', width: 1280, height: 800, lang: 'en', theme: 'light', action: 'preferences' },
  { name: 'preferences_desktop_en_dark', width: 1280, height: 800, lang: 'en', theme: 'dark', action: 'preferences' },
  { name: 'preferences_mobile_ar_light', width: 375, height: 667, lang: 'ar', theme: 'light', action: 'preferences' },
  { name: 'preferences_mobile_ar_dark', width: 375, height: 667, lang: 'ar', theme: 'dark', action: 'preferences' },
  { name: 'search_desktop_ar_light', width: 1280, height: 800, lang: 'ar', theme: 'light', action: 'search' },
  { name: 'search_mobile_en_dark', width: 375, height: 667, lang: 'en', theme: 'dark', action: 'search' },
  { name: 'preferences_desktop_ar_light', width: 1280, height: 650, lang: 'ar', theme: 'light', action: 'preferences' },
  { name: 'request_leave_mobile_ar', width: 375, height: 667, lang: 'ar', theme: 'light', action: 'request-leave' },
];

server.listen(0, '127.0.0.1', async () => {
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/hr-tool-v2/`;
  console.log(`🖼️ [Visual Regression] Server on http://127.0.0.1:${port}`);
  console.log(`   Mode: ${shouldUpdate ? 'UPDATE BASELINES' : 'VERIFY AGAINST BASELINES'}`);
  console.log('--------------------------------------------------');

  let browser;
  let failures = 0;
  let comparisons = 0;

  try {
    const windowsBrowser = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    ].find(p => fs.existsSync(p));
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || (fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : windowsBrowser);
    const uniqueUserDir = path.join(os.tmpdir(), `puppeteer_vis_${Date.now()}_${Math.random().toString(36).slice(2)}`);
    browser = await puppeteer.launch({
      headless: true,
      ignoreDefaultArgs: ['--hide-scrollbars'],
      executablePath,
      userDataDir: uniqueUserDir,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });

    const scenarios = scenarioName ? TEST_SCENARIOS.filter(scenario => scenario.name === scenarioName) : TEST_SCENARIOS;
    if (scenarios.length === 0) throw new Error(`Unknown visual scenario: ${scenarioName}`);
    for (const sc of scenarios) {
      // Create an isolated incognito browser context for every scenario
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      page.setDefaultNavigationTimeout(60000);
      page.setDefaultTimeout(60000);

      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

      // Inject deterministic MockDate, locale, and freeze styles on new document
      await page.evaluateOnNewDocument((lang, theme) => {
        // Freeze system clock for deterministic calendar & date math (2026-09-01T12:00:00Z)
        const FIXED_TIME = 1788264000000;
        const OriginalDate = window.Date;
        class MockDate extends OriginalDate {
          constructor(...args) {
            if (args.length === 0) {
              super(FIXED_TIME);
            } else {
              super(...args);
            }
          }
          static now() {
            return FIXED_TIME;
          }
        }
        MockDate.UTC = OriginalDate.UTC;
        MockDate.parse = OriginalDate.parse;
        window.Date = MockDate;

        // Ensure language is set in localStorage before React/i18next boot
        try {
          localStorage.setItem('i18nextLng', lang);
          localStorage.setItem('app-theme', theme);
        } catch (e) {}

        const injectStyles = () => {
          const style = document.createElement('style');
          style.id = 'visual-freeze-styles';
          style.textContent = `
            *, *::before, *::after {
              animation: none !important;
              animation-duration: 0s !important;
              animation-delay: 0s !important;
              transition: none !important;
              transition-duration: 0s !important;
              transition-delay: 0s !important;
              caret-color: transparent !important;
            }
            .animate-blob, .animate-float, .animate-spin, .animate-pulse {
              animation: none !important;
              transform: none !important;
            }
          `;
          if (document.head) {
            document.head.appendChild(style);
          } else {
            document.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));
          }
        };
        injectStyles();
      }, sc.lang, sc.theme || 'dark');

      await page.setViewport({ width: sc.width, height: sc.height });
      await page.goto(baseUrl, { waitUntil: 'networkidle0' });
      await page.waitForSelector('#root', { timeout: 10000 });
      await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve()));
      await new Promise(r => setTimeout(r, 200));

      // Handle Language switch fallback if needed
      if (sc.lang === 'ar') {
        const isRtl = await page.evaluate(() => document.documentElement.dir === 'rtl');
        if (!isRtl) {
          const langBtn = await page.$('button[aria-label="Switch language to Arabic"], button[aria-label*="العربية"]');
          if (langBtn) {
            await langBtn.click();
            await page.waitForFunction(() => document.documentElement.dir === 'rtl', { timeout: 5000 }).catch(() => {});
          }
        }
      }

      // Handle Action
      if (sc.action === 'case_study') {
        const caseStudyBtn = await page.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          return btns.find(b => {
            const txt = (b.textContent || '').toLowerCase();
            const aria = (b.getAttribute('aria-label') || '').toLowerCase();
            return txt.includes('case study') || aria.includes('case study') || txt.includes('دراسة الحالة') || txt.includes('redesign');
          });
        });
        if (caseStudyBtn && caseStudyBtn.asElement()) {
          await caseStudyBtn.asElement().click();
          await page.waitForSelector('main, h1', { timeout: 10000 });
          await new Promise(r => setTimeout(r, 600));
        }
      } else if (['dashboard', 'navigation', 'preferences', 'search', 'request-leave'].includes(sc.action)) {
        const quickLoginBtn = await page.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          return btns.find(b => {
            const txt = (b.textContent || '').toLowerCase();
            const aria = (b.getAttribute('aria-label') || '').toLowerCase();
            return txt.includes('quick login') || aria.includes('demo') || txt.includes('دخول سريع') || txt.includes('demo access');
          });
        });
        if (quickLoginBtn && quickLoginBtn.asElement()) {
          await quickLoginBtn.asElement().click();
          await page.waitForSelector('#main-content', { timeout: 10000 });
          await new Promise(r => setTimeout(r, 800));
        }
        if (sc.action === 'navigation') {
          await page.click('header button[aria-haspopup="dialog"]');
          await page.waitForSelector('[data-slot="sheet-content"][data-state="open"]');
        }
        if (sc.action === 'search') {
          await page.keyboard.down('Control'); await page.keyboard.press('k'); await page.keyboard.up('Control');
          await page.waitForSelector('[data-panel="search"]');
          await page.focus('[data-slot="command-input"]');
        }
        if (sc.action === 'request-leave') {
          const request = await page.evaluateHandle(() => [...document.querySelectorAll('#main-content button')].find(b => /Request Leave|طلب إجازة/.test(b.textContent)));
          if (!request.asElement()) throw new Error('Missing request leave action');
          await request.asElement().click();
          await page.waitForSelector('[role="dialog"] #leave-submit-button');
        }
        if (sc.action === 'preferences') {
          await page.click('header [data-slot="dialog-trigger"]');
          await page.waitForSelector('[data-panel="accessibility"]');
        }
      }

      // Settle layout, blur active inputs/buttons, and verify fonts
      await page.evaluate((keepFocus) => {
        if (!keepFocus && document.activeElement && document.activeElement.blur) {
          document.activeElement.blur();
        }
        document.documentElement.style.scrollBehavior = 'auto';
      }, sc.action === 'search');
      await page.mouse.move(0, 0);
      await page.evaluate(async (language) => {
        const family = language === 'ar' ? 'Noto Sans Arabic' : 'Inter';
        await Promise.all([400, 500, 600, 700].map(weight => document.fonts.load(`${weight} 14px "${family}"`)));
        await document.fonts.ready;
        if (!document.fonts.check(`400 14px "${family}"`)) throw new Error(`Screenshot font failed to load: ${family}`);
      }, sc.lang);
      await new Promise(r => setTimeout(r, 400));

      const currentBuffer = await page.screenshot({ fullPage: false });
      const baselinePath = path.join(baselinesDir, `${sc.name}.png`);

      if (shouldUpdate || !fs.existsSync(baselinePath)) {
        fs.writeFileSync(baselinePath, currentBuffer);
        console.log(`   📸 [Captured Baseline] ${sc.name} (${sc.width}x${sc.height})`);
      } else {
        comparisons++;
        const baselinePng = PNG.sync.read(fs.readFileSync(baselinePath));
        const currentPng = PNG.sync.read(currentBuffer);

        if (baselinePng.width !== currentPng.width || baselinePng.height !== currentPng.height) {
          console.error(`   ❌ [Dimension Mismatch] ${sc.name}: Expected ${baselinePng.width}x${baselinePng.height}, got ${currentPng.width}x${currentPng.height}`);
          failures++;
          await context.close();
          continue;
        }

        const { width, height } = baselinePng;
        const diff = new PNG({ width, height });
        const mismatchedPixels = pixelmatch(
          baselinePng.data,
          currentPng.data,
          diff.data,
          width,
          height,
          { threshold: 0.15 }
        );

        const totalPixels = width * height;
        const diffPercentage = (mismatchedPixels / totalPixels) * 100;

        // Allow up to 0.8% on CI for cross-platform Linux/Windows font rasterizer variance
        const maxAllowedDiff = process.env.CI ? 0.8 : 0.2;
        if (diffPercentage > maxAllowedDiff) {
          const diffPath = path.join(baselinesDir, `diff-${sc.name}.png`);
          fs.writeFileSync(diffPath, PNG.sync.write(diff));
          fs.writeFileSync(path.join(baselinesDir, `actual-${sc.name}.png`), currentBuffer);
          console.error(`   ❌ [Visual Regression] ${sc.name}: ${mismatchedPixels} pixels differ (${diffPercentage.toFixed(2)}%). Saved diff to ${diffPath}`);
          failures++;
        } else {
          console.log(`   ✅ [Visual Match] ${sc.name}: ${mismatchedPixels}px diff (${diffPercentage.toFixed(2)}%) within tolerance.`);
        }
      }

      await context.close();
    }

    console.log('\n--------------------------------------------------');
    console.log(`🏁 [Visual Regression] Completed.`);
    if (comparisons > 0) {
      console.log(`   Scenarios verified: ${comparisons}`);
      console.log(`   Failures: ${failures}`);
    }

    if (failures > 0) {
      console.error('💥 [Visual Regression] FAILED: Visual regressions detected.');
      process.exitCode = 1;
    } else {
      console.log('🎉 [Visual Regression] PASSED: All views render pixel-faithful.');
      process.exitCode = 0;
    }
  } catch (err) {
    console.error('💥 [Visual Regression] Unexpected error:', err);
    process.exitCode = 1;
  } finally {
    if (browser) {
      await Promise.race([browser.close(), new Promise(r => setTimeout(r, 1500))]).catch(() => {});
    }
    if (server.closeAllConnections) server.closeAllConnections();
    server.close();
    process.exit(failures > 0 ? 1 : (process.exitCode || 0));
  }
});
