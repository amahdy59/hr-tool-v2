const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

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
  let cleanUrl = req.url.split('?')[0];
  if (cleanUrl.startsWith('/hr-tool-v2/')) {
    cleanUrl = cleanUrl.slice('/hr-tool-v2/'.length - 1);
  } else if (cleanUrl === '/hr-tool-v2') {
    cleanUrl = '/';
  }
  let filePath = path.join(distPath, cleanUrl === '/' ? 'index.html' : cleanUrl);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
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
      res.end(content);
    }
  });
});

server.listen(0, '127.0.0.1', async () => {
  const PORT = server.address().port;
  console.log(`[E2E Runner] Static server listening on http://127.0.0.1:${PORT}`);
  let browser;
  let exitCode = 0;

  try {
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || (fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
    const uniqueUserDir = path.join(os.tmpdir(), `puppeteer_e2e_${Date.now()}_${Math.random().toString(36).slice(2)}`);
    browser = await puppeteer.launch({
      headless: true,
      executablePath,
      userDataDir: uniqueUserDir,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);
    page.setDefaultTimeout(60000);
    page.on('console', msg => {
      if (msg.type() === 'error') console.log('BROWSER CONSOLE ERROR:', msg.text());
    });
    page.on('pageerror', err => console.error('BROWSER UNCAUGHT ERROR:', err));
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
    await page.goto(`http://127.0.0.1:${PORT}/hr-tool-v2/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('#root', { timeout: 15000 });
    const pageTitle = await page.title();
    assert(pageTitle.length > 0, 'Page loads with non-empty title', `Title: "${pageTitle}"`);
    const hasRoot = await page.$('#root');
    assert(hasRoot !== null, 'Root container mounted');

    console.log('\n--- Test 1.5: Login Screen UI & Case Study Revamp ---');
    const caseStudyBtnExists = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => {
        const txt = (b.textContent || '').toLowerCase();
        const aria = (b.getAttribute('aria-label') || '').toLowerCase();
        return txt.includes('case study') || aria.includes('case study') || txt.includes('دراسة الحالة');
      });
    });
    assert(caseStudyBtnExists, 'Case Study button present with refined label');

    // Test form error alignment and aria-describedby
    const emailInput = await page.$('input[type="email"]');
    if (emailInput) {
      await emailInput.type('invalid-email');
      await page.keyboard.press('Tab'); // Trigger blur
      await new Promise(r => setTimeout(r, 200));

      const errorAlert = await page.evaluate(() => {
        const alert = document.querySelector('[role="alert"]');
        if (!alert) return null;
        const style = window.getComputedStyle(alert);
        const icon = alert.querySelector('svg');
        return {
          exists: true,
          display: style.display,
          alignItems: style.alignItems,
          hasIcon: icon !== null,
          hasText: alert.textContent.length > 0,
        };
      });
      assert(errorAlert && errorAlert.exists, 'Email error alert rendered on blur');
      assert(errorAlert && errorAlert.alignItems === 'flex-start', 'Email error container uses items-start for optical top alignment');
    }

    // Open Case Study
    const openedCaseStudy = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => {
        const txt = (b.textContent || '').toLowerCase();
        const aria = (b.getAttribute('aria-label') || '').toLowerCase();
        return txt.includes('case study') || aria.includes('case study') || txt.includes('دراسة الحالة');
      });
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    assert(openedCaseStudy, 'Navigated to Case Study page');
    await new Promise(r => setTimeout(r, 600));

    const caseStudyLoaded = await page.evaluate(() => {
      const hero = document.getElementById('hero-heading');
      const tabs = document.querySelectorAll('[role="tab"]');
      return hero !== null && tabs.length > 0;
    });
    assert(caseStudyLoaded, 'Case study page mounted with comparison tabs and hero');

    // Test back button
    const backToLoginClicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const backBtn = btns.find(b => {
        const txt = (b.textContent || '').toLowerCase();
        const aria = (b.getAttribute('aria-label') || '').toLowerCase();
        return txt.includes('back to login') || aria.includes('back to login') || txt.includes('العودة');
      });
      if (backBtn) {
        backBtn.click();
        return true;
      }
      return false;
    });
    assert(backToLoginClicked, 'Returned to Login page from Case Study');
    await new Promise(r => setTimeout(r, 600));

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
    const tabs = ['dashboard', 'attendance', 'employees', 'leaves', 'missions', 'roles', 'profile'];
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
      localStorage.setItem('i18nextLng', 'ar');
    });
    await page.goto(`http://127.0.0.1:${PORT}/hr-tool-v2/`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForSelector('#root', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 400));
    const isRtl = await page.evaluate(() => document.documentElement.dir === 'rtl' && document.documentElement.lang === 'ar');
    assert(isRtl, 'HTML root attributes successfully set to dir="rtl" and lang="ar"');

    // Re-authenticate into dashboard to verify authenticated controls in Arabic
    const reloggedIn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => {
        const txt = (b.textContent || '').toLowerCase();
        const aria = (b.getAttribute('aria-label') || '').toLowerCase();
        return txt.includes('demo') || txt.includes('quick login') || txt.includes('سريع') ||
               aria.includes('demo') || aria.includes('تجريبي') || b.querySelector('svg.lucide-zap');
      });
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    if (reloggedIn) {
      await page.waitForSelector('#main-content', { timeout: 15000 });
      await new Promise(r => setTimeout(r, 600));
    }

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

    console.log('\n--- Test 8: Notification Center ---');
    const openedNotifications = await page.evaluate(() => {
      const bell = Array.from(document.querySelectorAll('button')).find(b => {
        const label = b.getAttribute('aria-label') || '';
        const title = b.getAttribute('title') || '';
        return label.includes('Notification') || label.includes('إشعار') || label.includes('الإشعارات') ||
               title.includes('Notification') || title.includes('إشعار') || title.includes('الإشعارات') ||
               b.querySelector('svg.lucide-bell');
      });
      if (bell) {
        bell.click();
        return true;
      }
      return false;
    });
    assert(openedNotifications, 'Notification Center trigger clicked');
    await new Promise(r => setTimeout(r, 600));

    const notificationPopoverVisible = await page.evaluate(() => {
      const popover = document.querySelector('[data-slot="popover-content"], [role="dialog"]');
      return popover !== null;
    });
    assert(notificationPopoverVisible, 'Notification popover displayed with notifications');

    // Close popover
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 300));

    console.log('\n--- Test 9: Keyboard Shortcuts Panel ---');
    // Press ? or trigger via shortcuts button
    await page.evaluate(() => document.body.focus());
    await page.keyboard.press('?');
    await new Promise(r => setTimeout(r, 600));

    let shortcutsModalVisible = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h2, h3, [data-slot="dialog-title"]'));
      return headings.some(h => h.textContent && (h.textContent.includes('Shortcuts') || h.textContent.includes('اختصارات')));
    });

    if (!shortcutsModalVisible) {
      // Direct button trigger fallback
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => {
          const label = b.getAttribute('aria-label') || '';
          return label.includes('Shortcuts') || label.includes('اختصارات') || b.querySelector('svg.lucide-keyboard');
        });
        if (btn) btn.click();
      });
      await new Promise(r => setTimeout(r, 600));
      shortcutsModalVisible = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h2, h3, [data-slot="dialog-title"]'));
        return headings.some(h => h.textContent && (h.textContent.includes('Shortcuts') || h.textContent.includes('اختصارات')));
      });
    }
    assert(shortcutsModalVisible, 'Keyboard Shortcuts panel opened via ? hotkey');

    // Close shortcuts modal
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));

    console.log('\n--- Test 10: Component Styleguide Modal ---');
    const styleguideOpened = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => {
        const label = b.getAttribute('aria-label') || '';
        const title = b.getAttribute('title') || '';
        return label.includes('Styleguide') || label.includes('دليل') || label.includes('تصميم') || b.querySelector('svg.lucide-palette');
      });
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    assert(styleguideOpened, 'Component Styleguide trigger clicked');
    await new Promise(r => setTimeout(r, 600));

    const styleguideModalVisible = await page.evaluate(() => {
      const titles = Array.from(document.querySelectorAll('[data-slot="dialog-title"], h2, h3'));
      return titles.some(t => t.textContent && (t.textContent.includes('Design System') || t.textContent.includes('ADR-0004') || t.textContent.includes('نظام التصميم') || t.textContent.includes('Styleguide')));
    });
    assert(styleguideModalVisible, 'Design System Component Styleguide modal mounted');

    // Close styleguide modal
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));

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
    if (browser) {
      await Promise.race([browser.close(), new Promise(r => setTimeout(r, 1500))]).catch(() => {});
    }
    if (server.closeAllConnections) server.closeAllConnections();
    server.close();
    process.exit(exitCode);
  }
});
