const puppeteer = require('puppeteer');
const axeCore = require('axe-core');
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

server.listen(0, '127.0.0.1', async () => {
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/hr-tool-v2/`;
  console.log(`♿ [Accessibility Audit] Local server listening on http://127.0.0.1:${port}`);
  console.log('--------------------------------------------------');

  let browser;
  let totalViolations = 0;
  const reports = [];

  try {
    const windowsBrowser = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    ].find(p => fs.existsSync(p));
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || (fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : windowsBrowser);
    const uniqueUserDir = path.join(os.tmpdir(), `puppeteer_a11y_${Date.now()}_${Math.random().toString(36).slice(2)}`);
    browser = await puppeteer.launch({
      headless: true,
      executablePath,
      userDataDir: uniqueUserDir,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);
    page.setDefaultTimeout(60000);
    await page.setViewport({ width: 1280, height: 800 });

    async function auditCurrentState(stateName) {
      console.log(`\n🔍 Auditing view: ${stateName}...`);
      await page.evaluate(axeCore.source);
      const results = await page.evaluate(async () => {
        // @ts-ignore
        return await axe.run({
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
          }
        });
      });

      console.log(`   Violations: ${results.violations.length} | Passes: ${results.passes.length}`);
      if (results.violations.length > 0) {
        totalViolations += results.violations.length;
        results.violations.forEach((v, i) => {
          console.error(`   ❌ [Violation ${i + 1}] ${v.id} (${v.impact}): ${v.description}`);
          v.nodes.forEach(n => console.error(`      Element: ${n.target.join(' ')}`));
        });
      } else {
        console.log(`   ✅ 0 accessibility violations in ${stateName}.`);
      }

      reports.push({
        state: stateName,
        violations: results.violations.length,
        passes: results.passes.length,
        details: results.violations
      });
    }

    // 1. Audit Login Screen (English)
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#root', { timeout: 15000 });
    await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve()));
    await auditCurrentState('1. Login Screen (English)');

    for (const language of ['en', 'ar']) {
      await page.evaluate(lang => localStorage.setItem('i18nextLng', lang), language);
      await page.reload({ waitUntil: 'networkidle0' });
      await page.waitForFunction(lang => document.documentElement.lang === lang, {}, language);
      const resetTrigger = await page.evaluateHandle(() => [...document.querySelectorAll('button')].find(b => /Preview password reset|معاينة إعادة تعيين كلمة المرور/.test(b.textContent)));
      await resetTrigger.asElement().click();
      await page.waitForSelector('[role="dialog"]');
      await auditCurrentState(`Demo password reset (${language})`);
      await page.click('[role="dialog"] button[type="submit"]');
      await auditCurrentState(`Demo password reset validation (${language})`);
      await page.keyboard.press('Escape');
      await page.waitForSelector('[role="dialog"]', { hidden: true });
    }
    await page.evaluate(() => localStorage.setItem('i18nextLng', 'en'));
    await page.reload({ waitUntil: 'networkidle0' });

    // 2. Audit Login Screen (Arabic)
    const langBtn = await page.$('button[aria-label="Switch language to Arabic"], button[aria-label*="العربية"]');
    if (langBtn) {
      await langBtn.click();
      await new Promise(r => setTimeout(r, 600));
      await auditCurrentState('2. Login Screen (Arabic)');
      // Switch back to English
      const enBtn = await page.$('button[aria-label="Switch language to English"], button[aria-label*="English"]');
      if (enBtn) {
        await enBtn.click();
        await new Promise(r => setTimeout(r, 600));
      }
    }

    // 3. Audit Case Study Page (English)
    const caseStudyBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent && (b.textContent.includes('Case Study') || b.textContent.includes('About this Redesign')));
    });
    if (caseStudyBtn && caseStudyBtn.asElement()) {
      await caseStudyBtn.asElement().click();
      await new Promise(r => setTimeout(r, 800));
      await auditCurrentState('3. Case Study View (English)');

      // 4. Case Study View (Arabic)
      const caseStudyArBtn = await page.$('button[aria-label="Switch language to Arabic"], button[aria-label*="العربية"]');
      if (caseStudyArBtn) {
        await caseStudyArBtn.click();
        await new Promise(r => setTimeout(r, 600));
        await auditCurrentState('4. Case Study View (Arabic)');
      }

      // Explore Demo to enter dashboard
      const exploreBtn = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.find(b => b.textContent && (b.textContent.includes('Explore Demo') || b.textContent.includes('استكشاف النسخة التجريبية')));
      });
      if (exploreBtn && exploreBtn.asElement()) {
        await exploreBtn.asElement().click();
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    // If not logged in yet, try Quick Login
    const quickLoginBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent && (b.textContent.includes('Quick Login') || b.textContent.includes('تسجيل سريع')));
    });
    if (quickLoginBtn && quickLoginBtn.asElement()) {
      await quickLoginBtn.asElement().click();
      await new Promise(r => setTimeout(r, 2000));
    }

    // 5. Authenticated Dashboard (Arabic or current)
    await auditCurrentState('5. Authenticated Dashboard');

    // Switch dashboard language to check other locale
    const dashLangBtn = await page.$('button[aria-label="Switch language to English"], button[aria-label*="English"]');
    if (dashLangBtn) {
      await dashLangBtn.click();
      await new Promise(r => setTimeout(r, 800));
      await auditCurrentState('6. Authenticated Dashboard (English)');
    }

    // Exercise the actual modal drawer in both locales and themes.
    // Selecting language through storage avoids depending on hidden desktop controls.
    await page.setViewport({ width: 375, height: 667 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    for (const language of ['en', 'ar']) {
      for (const theme of ['light', 'dark']) {
        await page.evaluate((settings) => {
          localStorage.setItem('i18nextLng', settings.language);
          localStorage.setItem('app-theme', settings.theme);
        }, { language, theme });
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#main-content');
        await page.waitForFunction((settings) => document.documentElement.lang === settings.language && document.documentElement.classList.contains('dark') === (settings.theme === 'dark'), {}, { language, theme });
        await auditCurrentState(`Mobile dashboard (${language}, ${theme})`);
        await page.click('header button[aria-haspopup="dialog"]');
        await page.waitForSelector('[data-slot="sheet-content"][data-state="open"]');
        await page.evaluate(() => document.fonts.ready);
        await auditCurrentState(`Mobile navigation (${language}, ${theme})`);
        await page.keyboard.press('Escape');
        await page.waitForSelector('[data-slot="sheet-content"]', { hidden: true });
        await page.click('header [data-slot="dialog-trigger"]');
        await page.waitForSelector('[data-panel="accessibility"]');
        await auditCurrentState(`Preferences (${language}, ${theme})`);
        const readingOptions = await page.$$('[data-panel="accessibility"] [role="checkbox"]');
        for (const option of readingOptions) await option.click();
        await auditCurrentState(`Preferences with all reading options (${language}, ${theme})`);
        await page.click('[data-panel="accessibility"] button[data-slot="button"]');
        await page.keyboard.press('Escape');
        await page.waitForSelector('[data-panel="accessibility"]', { hidden: true });
        await page.keyboard.down('Control'); await page.keyboard.press('k'); await page.keyboard.up('Control');
        await page.waitForSelector('[data-panel="search"]');
        await auditCurrentState(`Section search (${language}, ${theme})`);
        await page.keyboard.press('Escape');
        await page.waitForSelector('[data-panel="search"]', { hidden: true });
        await page.click('header [data-slot="popover-trigger"]');
        await page.waitForSelector('[data-slot="popover-content"][data-state="open"]');
        await auditCurrentState(`Notifications (${language}, ${theme})`);
        await page.keyboard.press('Escape');
        await page.evaluate(() => {
          window.dispatchEvent(new Event('offline'));
          const prompt = new Event('beforeinstallprompt');
          prompt.prompt = async () => {};
          prompt.userChoice = Promise.resolve({ outcome: 'dismissed' });
          window.dispatchEvent(prompt);
        });
        await auditCurrentState(`Offline and install notices (${language}, ${theme})`);
        await page.evaluate(() => window.dispatchEvent(new Event('online')));

        await page.keyboard.press('Escape');
        await page.waitForSelector('[data-slot="popover-content"]', { hidden: true });
      }
    }

    console.log('\n--------------------------------------------------');
    console.log(`🏁 [Accessibility Audit] Completed. Total Violations: ${totalViolations}`);

    const reportPath = path.join(__dirname, '..', 'accessibility_audit_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(reports, null, 2), 'utf8');
    console.log(`📄 Saved audit summary to accessibility_audit_report.json`);

    if (totalViolations > 0) {
      console.error('💥 [Accessibility Audit] FAILED: WCAG 2.2 violations detected.');
      process.exitCode = 1;
    } else {
      console.log('🎉 [Accessibility Audit] PASSED: No automated WCAG A/AA violations in the audited states.');
      process.exitCode = 0;
    }
  } catch (err) {
    console.error('💥 [Accessibility Audit] Unexpected error:', err);
    process.exitCode = 1;
  } finally {
    if (browser) {
      await Promise.race([browser.close(), new Promise(r => setTimeout(r, 1500))]).catch(() => {});
    }
    if (server.closeAllConnections) server.closeAllConnections();
    server.close();
    process.exit(totalViolations > 0 ? 1 : (process.exitCode || 0));
  }
});
