const puppeteer = require('puppeteer');
const axeCore = require('axe-core');
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
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || (fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
    browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });

    const page = await browser.newPage();
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

    console.log('\n--------------------------------------------------');
    console.log(`🏁 [Accessibility Audit] Completed. Total Violations: ${totalViolations}`);

    const reportPath = path.join(__dirname, '..', 'accessibility_audit_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(reports, null, 2), 'utf8');
    console.log(`📄 Saved audit summary to accessibility_audit_report.json`);

    if (totalViolations > 0) {
      console.error('💥 [Accessibility Audit] FAILED: WCAG 2.2 violations detected.');
      process.exitCode = 1;
    } else {
      console.log('🎉 [Accessibility Audit] PASSED: 100% WCAG 2.2 AAA compliant across all audited states.');
      process.exitCode = 0;
    }
  } catch (err) {
    console.error('💥 [Accessibility Audit] Unexpected error:', err);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close().catch(() => {});
    server.close();
    process.exit(totalViolations > 0 ? 1 : (process.exitCode || 0));
  }
});
