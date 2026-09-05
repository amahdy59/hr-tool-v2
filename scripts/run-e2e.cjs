const http = require('http');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const distPath = path.resolve(projectRoot, 'dist');
const puppeteer = require(path.resolve(projectRoot, 'node_modules/puppeteer'));

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(distPath, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(distPath, 'index.html');
  }
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading file');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = 4570;

server.listen(PORT, async () => {
  console.log(`[E2E Runner] Static server listening on http://localhost:${PORT}`);
  let browser;
  let exitCode = 0;

  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const report = [];
    const assert = (condition, name, details = '') => {
      if (condition) {
        report.push({ status: 'PASS', name });
        console.log(`  ✓ ${name}`);
      } else {
        report.push({ status: 'FAIL', name, details });
        console.error(`  ✗ ${name} — ${details}`);
        exitCode = 1;
      }
    };

    console.log('\n--- Test 1: Page Initialization ---');
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });
    const pageTitle = await page.title();
    assert(pageTitle.length > 0, 'Page loads with non-empty title', `Title: "${pageTitle}"`);
    const hasRoot = await page.$('#root');
    assert(hasRoot !== null, 'Root container mounted');

    console.log('\n--- Test 2: Authentication & Demo Login ---');
    const demoBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const found = btns.find(b => {
        const txt = (b.textContent || '').toLowerCase();
        const aria = (b.getAttribute('aria-label') || '').toLowerCase();
        return txt.includes('quick login') || aria.includes('demo') || txt.includes('دخول سريع') || txt.includes('demo access');
      });
      if (found) {
        found.click();
        return true;
      }
      return false;
    });
    assert(demoBtn, 'Demo login button clicked');
    await new Promise(r => setTimeout(r, 1500));

    const isAuthenticated = await page.evaluate(() => {
      return document.getElementById('main-content') !== null;
    });
    assert(isAuthenticated, 'Authenticated layout rendered (#main-content exists)');

    console.log('\n--- Test 3: Navigation Across Core Modules ---');
    const tabs = ['dashboard', 'attendance', 'employees', 'leaves', 'missions', 'roles', 'payrolls', 'profile'];
    for (const tab of tabs) {
      await page.evaluate((t) => {
        const links = Array.from(document.querySelectorAll('button, a'));
        const link = links.find(el => (el.textContent || '').toLowerCase().includes(t));
        if (link) link.click();
      }, tab);
      await new Promise(r => setTimeout(r, 400));
      const hasContent = await page.evaluate(() => {
        return document.getElementById('main-content') && document.getElementById('main-content').children.length > 0;
      });
      assert(hasContent, `Tab [${tab}] rendered successfully`);
    }

    console.log('\n--- Test 4: Print & Download Report Actions in Attendance ---');
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('button, a'));
      const att = links.find(el => (el.textContent || '').toLowerCase().includes('attendance'));
      if (att) att.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const attendanceButtons = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const hasDownload = btns.some(b => (b.textContent || '').includes('Download') || (b.textContent || '').includes('تنزيل'));
      const hasPrint = btns.some(b => (b.textContent || '').includes('Print') || (b.textContent || '').includes('طباعة'));
      const hasPrintHeader = document.querySelector('.print-header') !== null;
      const hasPrintFooter = document.querySelector('.print-footer') !== null;
      return { hasDownload, hasPrint, hasPrintHeader, hasPrintFooter };
    });
    assert(attendanceButtons.hasDownload, 'Attendance Download Data button present');
    assert(attendanceButtons.hasPrint, 'Attendance Print Report button present');
    assert(attendanceButtons.hasPrintHeader, 'Attendance Print-only header present');
    assert(attendanceButtons.hasPrintFooter, 'Attendance Print-only approval footer present');

    console.log('\n--- Test 5: Form Accessibility in Request Leave Modal ---');
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('button, a'));
      const dash = links.find(el => (el.textContent || '').toLowerCase().includes('dashboard'));
      if (dash) dash.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Open Request Leave modal
    const openedModal = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const reqBtn = btns.find(b => (b.textContent || '').toLowerCase().includes('request leave') || (b.textContent || '').toLowerCase().includes('طلب إجازة'));
      if (reqBtn) {
        reqBtn.click();
        return true;
      }
      return false;
    });
    assert(openedModal, 'Request Leave button clicked');
    await new Promise(r => setTimeout(r, 600));

    // Click submit without dates to trigger validation
    const validationTriggered = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) return false;
      const submitBtn = document.getElementById('leave-submit-button') || btns.find(b => {
        const txt = (b.textContent || '').toLowerCase();
        return txt.includes('book time off') || txt.includes('submit') || txt.includes('إرسال') || txt.includes('save changes');
      });
      if (submitBtn) {
        submitBtn.click();
        return true;
      }
      return false;
    });
    assert(validationTriggered, 'Submit button clicked on empty form');
    await new Promise(r => setTimeout(r, 400));

    const a11yChecks = await page.evaluate(() => {
      const fromDatePicker = document.getElementById('leave-from-date');
      const isInvalid = fromDatePicker ? fromDatePicker.getAttribute('aria-invalid') === 'true' : false;
      const hasDescribedBy = fromDatePicker ? fromDatePicker.hasAttribute('aria-describedby') : false;
      const errorEl = document.getElementById('leave-date-error');
      const hasErrorMessage = errorEl !== null && errorEl.textContent.length > 0;
      return { isInvalid, hasDescribedBy, hasErrorMessage };
    });
    assert(a11yChecks.isInvalid, 'DatePicker has aria-invalid="true" on validation failure');
    assert(a11yChecks.hasDescribedBy, 'DatePicker has aria-describedby pointing to error element');
    assert(a11yChecks.hasErrorMessage, 'Error message element (#leave-date-error) exists and has text');

    // Close modal
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));

    console.log('\n--- Test 6: RTL & Bilingual Layout ---');
    await page.evaluate(() => {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
      localStorage.setItem('i18nextLng', 'ar');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    const isRtl = await page.evaluate(() => document.documentElement.dir === 'rtl' && document.documentElement.lang === 'ar');
    assert(isRtl, 'HTML root attributes successfully set to dir="rtl" and lang="ar"');

    console.log('\n--- Test 7: Offline Resilience Banner ---');
    await page.evaluate(() => {
      window.dispatchEvent(new Event('offline'));
    });
    await new Promise(r => setTimeout(r, 300));
    const offlineBannerVisible = await page.evaluate(() => {
      const banner = document.querySelector('aside.offline-banner');
      return banner !== null && (banner.getAttribute('role') === 'status' || banner.getAttribute('aria-live') === 'polite');
    });
    assert(offlineBannerVisible, 'Accessible OfflineBanner renders when offline event fires');

    await page.evaluate(() => {
      window.dispatchEvent(new Event('online'));
    });
    await new Promise(r => setTimeout(r, 300));

    console.log('\n--- E2E Test Summary ---');
    const passed = report.filter(r => r.status === 'PASS').length;
    const failed = report.filter(r => r.status === 'FAIL').length;
    console.log(`Total Scenarios: ${report.length} | Passed: ${passed} | Failed: ${failed}`);

    if (failed > 0) {
      console.error('\nE2E TEST SUITE FAILED!');
    } else {
      console.log('\nALL E2E SCENARIOS PASSED WITH 100% SUCCESS!');
    }
  } catch (err) {
    console.error('Fatal E2E error:', err);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
    process.exit(exitCode);
  }
});
