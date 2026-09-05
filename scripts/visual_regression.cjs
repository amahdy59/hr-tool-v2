const puppeteer = require('puppeteer');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { PNG } = require('pngjs');
const rawPixelmatch = require('pixelmatch');
const pixelmatch = rawPixelmatch.default || rawPixelmatch;

const distDir = path.join(__dirname, '..', 'dist');
const baselinesDir = path.join(__dirname, '..', 'test', 'visual-baselines');
if (!fs.existsSync(baselinesDir)) {
  fs.mkdirSync(baselinesDir, { recursive: true });
}

const shouldUpdate = process.argv.includes('--update-baselines');

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
  let reqPath = req.url.split('?')[0].replace(/^\/hr-tool-v2/, '');
  if (reqPath === '' || reqPath === '/') reqPath = '/index.html';
  let filePath = path.join(distDir, reqPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

const TEST_SCENARIOS = [
  { name: 'login_desktop_en', width: 1280, height: 800, lang: 'en', action: 'login' },
  { name: 'login_mobile_en', width: 375, height: 667, lang: 'en', action: 'login' },
  { name: 'login_mobile_ar', width: 375, height: 667, lang: 'ar', action: 'login' },
  { name: 'case_study_desktop', width: 1280, height: 800, lang: 'en', action: 'case_study' },
  { name: 'dashboard_desktop_en', width: 1280, height: 800, lang: 'en', action: 'dashboard' },
  { name: 'dashboard_mobile_ar', width: 375, height: 667, lang: 'ar', action: 'dashboard' },
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
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    // Emulate reduced motion for deterministic screenshot rendering
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

    for (const sc of TEST_SCENARIOS) {
      await page.setViewport({ width: sc.width, height: sc.height });
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#root', { timeout: 10000 });

      // Freeze all CSS animations and transitions for deterministic capture
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation: none !important;
            transition: none !important;
          }
        `
      });
      await new Promise(r => setTimeout(r, 300));

      // Handle Language switch
      if (sc.lang === 'ar') {
        const langBtn = await page.$('button[aria-label="Switch language to Arabic"], button[aria-label*="العربية"]');
        if (langBtn) {
          await langBtn.click();
          await new Promise(r => setTimeout(r, 600));
        }
      }

      // Handle Action
      if (sc.action === 'case_study') {
        const caseStudyBtn = await page.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          return btns.find(b => {
            const txt = (b.textContent || '').toLowerCase();
            const aria = (b.getAttribute('aria-label') || '').toLowerCase();
            return txt.includes('case study') || aria.includes('case study') || txt.includes('دراسة الحالة');
          });
        });
        if (caseStudyBtn && caseStudyBtn.asElement()) {
          await caseStudyBtn.asElement().click();
          await new Promise(r => setTimeout(r, 800));
        }
      } else if (sc.action === 'dashboard') {
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
          await new Promise(r => setTimeout(r, 1500));
        }
      }

      // Re-freeze after dynamic navigation
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation: none !important;
            transition: none !important;
          }
        `
      });
      await new Promise(r => setTimeout(r, 200));

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

        // Allow up to 0.1% for subpixel text rendering
        if (diffPercentage > 0.1) {
          const diffPath = path.join(baselinesDir, `diff-${sc.name}.png`);
          fs.writeFileSync(diffPath, PNG.sync.write(diff));
          console.error(`   ❌ [Visual Regression] ${sc.name}: ${mismatchedPixels} pixels differ (${diffPercentage.toFixed(2)}%). Saved diff to ${diffPath}`);
          failures++;
        } else {
          console.log(`   ✅ [Visual Match] ${sc.name}: ${mismatchedPixels}px diff (${diffPercentage.toFixed(2)}%) within tolerance.`);
        }
      }
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
    if (browser) await browser.close();
    server.close();
  }
});
