const puppeteer = require('puppeteer');
const http = require('http');
const path = require('path');
const fs = require('fs');

const distDir = path.join(__dirname, '..', 'dist');

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

const VIEWPORTS = [
  { name: '320px (Mobile Mini - iPhone SE)', width: 320, height: 568 },
  { name: '375px (Mobile Standard - iPhone 12/13/14)', width: 375, height: 667 },
  { name: '414px (Mobile Large - iPhone Plus/Pro Max)', width: 414, height: 896 },
  { name: '768px (Tablet Portrait - iPad Mini/Air)', width: 768, height: 1024 },
  { name: '1024px (Tablet Landscape / Netbook)', width: 1024, height: 768 },
  { name: '1280px (Laptop Standard)', width: 1280, height: 800 },
  { name: '1440px (Desktop High-Res)', width: 1440, height: 900 }
];

server.listen(0, '127.0.0.1', async () => {
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/hr-tool-v2/`;
  console.log(`📱 [Responsiveness Review] Local server on http://127.0.0.1:${port}`);
  console.log('--------------------------------------------------');

  let browser;
  let failures = [];
  let checksPassed = 0;

  try {
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || (fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
    browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });
    const page = await browser.newPage();

    async function checkPageOverflow(label) {
      const result = await page.evaluate(() => {
        const scrollW = document.documentElement.scrollWidth;
        const innerW = window.innerWidth;
        const hasOverflow = scrollW > innerW;
        return { hasOverflow, scrollW, innerW };
      });

      if (result.hasOverflow) {
        const errMsg = `${label} has horizontal overflow! (scrollWidth: ${result.scrollW}px, innerWidth: ${result.innerW}px)`;
        failures.push(errMsg);
        console.error(`   ❌ ${errMsg}`);
      } else {
        checksPassed++;
      }
    }

    async function checkDialogOverflow(label) {
      const result = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        if (!dialog) return { found: false };
        const rect = dialog.getBoundingClientRect();
        const innerW = window.innerWidth;
        const hasOverflow = rect.width > innerW || rect.right > innerW + 1;
        return {
          found: true,
          hasOverflow,
          width: Math.round(rect.width),
          innerW
        };
      });

      if (!result.found) {
        console.log(`   ℹ️ [${label}] Dialog not currently open; skipping dialog check.`);
        return;
      }

      if (result.hasOverflow) {
        const errMsg = `${label} dialog exceeds viewport! (dialogWidth: ${result.width}px, innerWidth: ${result.innerW}px)`;
        failures.push(errMsg);
        console.error(`   ❌ ${errMsg}`);
      } else {
        checksPassed++;
      }
    }

    console.log(`Auditing ${VIEWPORTS.length} standard viewports across multiple routes and locales...\n`);

    for (const vp of VIEWPORTS) {
      console.log(`📐 Checking Viewport: ${vp.name} (${vp.width}x${vp.height})`);
      await page.setViewport({ width: vp.width, height: vp.height });

      // 1. Login Page (English)
      await page.goto(baseUrl, { waitUntil: 'networkidle0' });
      await checkPageOverflow(`[${vp.name}] Login Page (EN)`);

      // 2. Login Page (Arabic)
      const langBtn = await page.$('button[aria-label="Switch language to Arabic"], button[aria-label*="العربية"]');
      if (langBtn) {
        await langBtn.click();
        await new Promise(r => setTimeout(r, 400));
        await checkPageOverflow(`[${vp.name}] Login Page (AR)`);
        // Switch back to English
        const enBtn = await page.$('button[aria-label="Switch language to English"], button[aria-label*="English"]');
        if (enBtn) {
          await enBtn.click();
          await new Promise(r => setTimeout(r, 400));
        }
      }

      // 3. Case Study Page (English & Arabic)
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
        await new Promise(r => setTimeout(r, 500));
        await checkPageOverflow(`[${vp.name}] Case Study View (EN)`);

        // Switch to Arabic in Case Study
        const csLangBtn = await page.$('button[aria-label="Switch language to Arabic"], button[aria-label*="العربية"]');
        if (csLangBtn) {
          await csLangBtn.click();
          await new Promise(r => setTimeout(r, 400));
          await checkPageOverflow(`[${vp.name}] Case Study View (AR)`);
        }

        // Return to Login
        const backBtn = await page.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          return btns.find(b => {
            const txt = (b.textContent || '').toLowerCase();
            const aria = (b.getAttribute('aria-label') || '').toLowerCase();
            return txt.includes('back to login') || aria.includes('back to login') || txt.includes('العودة');
          });
        });
        if (backBtn && backBtn.asElement()) {
          await backBtn.asElement().click();
          await new Promise(r => setTimeout(r, 400));
        }
      }

      // 4. Authenticate via Quick Login
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
        await checkPageOverflow(`[${vp.name}] Dashboard Overview (EN)`);

        // Check Request Leave Modal
        const reqLeaveBtn = await page.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          return btns.find(b => (b.textContent || '').toLowerCase().includes('request leave') || (b.textContent || '').toLowerCase().includes('طلب إجازة'));
        });
        if (reqLeaveBtn && reqLeaveBtn.asElement()) {
          await reqLeaveBtn.asElement().click();
          await new Promise(r => setTimeout(r, 400));
          await checkDialogOverflow(`[${vp.name}] Request Leave Dialog (EN)`);
          await page.keyboard.press('Escape');
          await new Promise(r => setTimeout(r, 300));
        }

        // Navigate modules
        const coreModules = ['attendance', 'employees', 'leaves', 'missions', 'roles', 'profile'];
        for (const mod of coreModules) {
          await page.evaluate((m) => {
            const links = Array.from(document.querySelectorAll('button, a'));
            const link = links.find(el => (el.textContent || '').toLowerCase().includes(m));
            if (link) link.click();
          }, mod);
          await new Promise(r => setTimeout(r, 350));
          await checkPageOverflow(`[${vp.name}] Module: ${mod} (EN)`);
        }

        // Check Arabic Dashboard
        const dashArBtn = await page.$('button[aria-label="Switch language to Arabic"], button[aria-label*="العربية"]');
        if (dashArBtn) {
          await dashArBtn.click();
          await new Promise(r => setTimeout(r, 500));
          await checkPageOverflow(`[${vp.name}] Dashboard (AR)`);
        }
      }
    }

    console.log('\n--------------------------------------------------');
    console.log(`🏁 [Responsiveness Review] Completed.`);
    console.log(`   Passed checks: ${checksPassed}`);
    console.log(`   Failures: ${failures.length}`);

    if (failures.length > 0) {
      console.error('\n💥 [Responsiveness Review] FAILED: Horizontal overflow detected:');
      failures.forEach(f => console.error(`  - ${f}`));
      process.exitCode = 1;
    } else {
      console.log('🎉 [Responsiveness Review] PASSED: 100% responsive across all 7 viewports.');
      process.exitCode = 0;
    }
  } catch (err) {
    console.error('💥 [Responsiveness Review] Unexpected error:', err);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close().catch(() => {});
    server.close();
    process.exit(failures.length > 0 ? 1 : (process.exitCode || 0));
  }
});
