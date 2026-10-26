const puppeteer = require('puppeteer');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

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
    const windowsBrowser = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    ].find(p => fs.existsSync(p));
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || (fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : windowsBrowser);
    const uniqueUserDir = path.join(os.tmpdir(), `puppeteer_resp_${Date.now()}_${Math.random().toString(36).slice(2)}`);
    browser = await puppeteer.launch({
      headless: true,
      executablePath,
      userDataDir: uniqueUserDir,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);
    page.setDefaultTimeout(60000);

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

    async function checkHeaderResponsiveness(label) {
      const result = await page.evaluate(() => {
        const header = document.querySelector('header');
        if (!header) return { found: false };

        const windowWidth = window.innerWidth;
        const interactive = Array.from(header.querySelectorAll('button, a, input, [tabindex="0"]'));
        const elementsData = interactive.map(el => {
          const r = el.getBoundingClientRect();
          const computed = window.getComputedStyle(el);
          return {
            tag: el.tagName.toLowerCase(),
            ariaLabel: el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent.trim().slice(0, 20),
            visible: computed.display !== 'none' && computed.visibility !== 'hidden' && r.width > 0 && r.height > 0,
            rect: {
              top: Math.round(r.top),
              bottom: Math.round(r.bottom),
              left: Math.round(r.left),
              right: Math.round(r.right),
              width: Math.round(r.width),
              height: Math.round(r.height)
            },
            touchAdequate: r.width >= 43.5 && r.height >= 43.5
          };
        }).filter(e => e.visible);

        const overflowing = elementsData.filter(e => e.rect.right > windowWidth || e.rect.left < 0);

        const overlaps = [];
        for (let i = 0; i < elementsData.length; i++) {
          for (let j = i + 1; j < elementsData.length; j++) {
            const a = elementsData[i].rect;
            const b = elementsData[j].rect;
            const overlapX = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
            const overlapY = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
            if (overlapX > 2 && overlapY > 2) {
              overlaps.push(`${elementsData[i].ariaLabel} overlaps with ${elementsData[j].ariaLabel} (${overlapX}px x ${overlapY}px)`);
            }
          }
        }

        const smallTargets = elementsData.filter(e => !e.touchAdequate);

        return {
          found: true,
          overflowing,
          overlaps,
          smallTargets,
          elementsCount: elementsData.length
        };
      });

      if (!result.found) return;

      if (result.overflowing.length > 0) {
        const err = `${label} header element overflow: ${result.overflowing.map(e => e.ariaLabel).join(', ')}`;
        failures.push(err);
        console.error(`   ❌ ${err}`);
      } else {
        checksPassed++;
      }

      if (result.overlaps.length > 0) {
        const err = `${label} header element overlap: ${result.overlaps.join('; ')}`;
        failures.push(err);
        console.error(`   ❌ ${err}`);
      } else {
        checksPassed++;
      }

      if (result.smallTargets.length > 0) {
        const err = `${label} header small touch target: ${result.smallTargets.map(t => `${t.ariaLabel} (${t.rect.width}x${t.rect.height})`).join(', ')}`;
        failures.push(err);
        console.error(`   ❌ ${err}`);
      } else {
        checksPassed++;
      }
    }

    console.log(`Auditing ${VIEWPORTS.length} standard viewports across multiple routes and locales...\n`);

    async function checkModules(vp, language) {
      const modules = ['dashboard', 'attendance', 'employees', 'leaves', 'missions', 'roles', 'payrolls', 'profile'];
      for (const [index, name] of modules.entries()) {
        if (vp.width < 1024) {
          await page.click('header button[aria-haspopup="dialog"]');
          await page.waitForSelector('[data-slot="sheet-content"][data-state="open"]');
          await page.evaluate(() => Promise.all(document.querySelector('[data-slot="sheet-content"]').getAnimations().map(animation => animation.finished)));
          await checkDialogOverflow(`[${vp.name}] Navigation drawer (${language})`);
          const buttons = await page.$$(name === 'profile' ? '[data-slot="sheet-content"] button' : '[data-slot="sheet-content"] nav button');
          if (!buttons[name === 'profile' ? 0 : index]) throw new Error(`Missing mobile destination: ${name}`);
          await buttons[name === 'profile' ? 0 : index].click();
          await page.waitForSelector('[data-slot="sheet-content"]', { hidden: true });
        } else {
          const buttons = await page.$$('aside button');
          if (!buttons[index]) throw new Error(`Missing desktop destination: ${name}`);
          await buttons[index].click();
        }
        await new Promise(r => setTimeout(r, 350));
        await page.waitForFunction(() => !document.querySelector('#main-content > .animate-fadeIn > [role="status"]'));
        await checkPageOverflow(`[${vp.name}] Module: ${name} (${language})`);
        const paginationFits = await page.evaluate(() => [...document.querySelectorAll('main nav')].every(nav => nav.scrollWidth <= nav.clientWidth + 1));
        if (!paginationFits) failures.push(`[${vp.name}] Pagination overflows in ${name} (${language})`);
        else checksPassed++;
      }
      console.log(`   Checked all eight sections (${language}).`);
    }

    for (const vp of VIEWPORTS) {
      console.log(`📐 Checking Viewport: ${vp.name} (${vp.width}x${vp.height})`);
      await page.setViewport({ width: vp.width, height: vp.height });

      // 1. Login Page (English)
      await page.goto(baseUrl, { waitUntil: 'networkidle0' });
      await page.evaluate(() => {
        localStorage.removeItem('hr_tool_auth');
        localStorage.removeItem('hr_tool_user');
        localStorage.setItem('i18nextLng', 'en');
      });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForSelector('input[type="email"]');
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
        await checkHeaderResponsiveness(`[${vp.name}] Header (EN)`);

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
        await checkModules(vp, 'EN');

        // Check Arabic Dashboard
        await page.evaluate(() => localStorage.setItem('i18nextLng', 'ar'));
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#main-content');
        await page.waitForFunction(() => document.documentElement.lang === 'ar');
        await checkPageOverflow(`[${vp.name}] Dashboard (AR)`);
        await checkHeaderResponsiveness(`[${vp.name}] Header (AR)`);
        await checkModules(vp, 'AR');
      } else {
        throw new Error(`Demo login was not found at ${vp.width}px; authenticated checks must not be skipped.`);
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
    if (browser) {
      await Promise.race([browser.close(), new Promise(r => setTimeout(r, 1500))]).catch(() => {});
    }
    if (server.closeAllConnections) server.closeAllConnections();
    server.close();
    process.exit(failures.length > 0 ? 1 : (process.exitCode || 0));
  }
});
