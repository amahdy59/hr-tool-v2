const { openPreferences, navigate } = require('./browser_ui_helpers.cjs');
module.exports = async function mobileExperienceChecks({ browser, baseUrl, assert }) {
  for (const language of ['en', 'ar']) {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    const failures = [];
    page.on('pageerror', error => failures.push(error.message));
    page.setDefaultTimeout(20000);
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.evaluateOnNewDocument(lang => { localStorage.setItem('i18nextLng', lang); localStorage.setItem('app-theme', 'light'); }, language);
    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle0' });
      assert(await page.evaluate(() => {
        const demo = document.querySelector('[aria-labelledby="demo-access-heading"]');
        const card = document.querySelector('[data-slot="login-card"]');
        return demo && card && !card.contains(demo) && !document.querySelector('form').contains(demo);
      }), `Demo entry is outside the sign-in card (${language})`);
      await page.click('[aria-label="Case Study"], [aria-label="دراسة الحالة"]');
      await page.waitForSelector('#case-story-heading');
      assert(await page.evaluate(() => document.querySelector('#case-story-heading') && document.querySelector('#case-validation') && document.querySelector('figure ol')?.children.length === 4), `Case study explains the problem, decisions, journey, and limits (${language})`);
      await page.click('[role="tabpanel"]:not([hidden]) button');
      await page.waitForSelector('[role="dialog"] img');
      await page.goBack(); await page.waitForSelector('[role="dialog"]', { hidden: true });
      assert(await page.$('#hero-heading') !== null, `Back closes the screenshot and preserves the case study (${language})`);
      await page.goBack(); await page.waitForSelector('[data-slot="login-card"]');
      await page.click('[aria-labelledby="demo-access-heading"] button');
      await page.waitForSelector('[data-screen="dashboard"] figure');
      for (const size of [{width:320,height:568},{width:390,height:844},{width:430,height:932},{width:667,height:375}]) {
        await page.setViewport({ ...size, isMobile: true, hasTouch: true });
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        const layout = await page.evaluate(() => {
          const main = document.querySelector('#main-content');
          const bar = document.querySelector('.mobile-bottom-bar');
          const controls = [...bar.querySelectorAll('button')].map(button => button.getBoundingClientRect());
          const chart = document.querySelector('[data-screen="dashboard"] figure');
          return { pageFits: document.documentElement.scrollWidth <= innerWidth, contentFits: main.scrollWidth <= main.clientWidth + 1, clearNavigation: main.getBoundingClientRect().bottom <= bar.getBoundingClientRect().top + 1, targetsFit: controls.every(r => r.width >= 44 && r.height >= 44 && r.left >= 0 && r.right <= innerWidth + 1), chartLabels: chart.querySelectorAll('dd').length === 4, contentBottom: main.getBoundingClientRect().bottom, navigationTop: bar.getBoundingClientRect().top };
        });
        assert(layout.pageFits && layout.contentFits && layout.clearNavigation && layout.targetsFit && layout.chartLabels, `Mobile hierarchy, chart labels, and navigation fit ${size.width}×${size.height} (${language})`, JSON.stringify(layout));
      }
      await page.setViewport({ width:390,height:844,isMobile:true,hasTouch:true });
      await page.evaluate(() => document.querySelector('#main-content').scrollTo({ top:300,behavior:'instant' }));
      const scroll = await page.$eval('#main-content', element => element.scrollTop);
      await page.click('.mobile-bottom-bar [data-nav="requests"]');
      await page.waitForSelector('[data-screen="requests"] figure');
      const search = '[data-screen="requests"] input[type="search"]';
      await page.type(search, 'nonexistent-mobile-record');
      await page.waitForFunction(() => document.querySelectorAll('[data-screen="requests"] ul > li').length === 0);
      assert(true, `Request search exposes an empty state (${language})`);
      await page.click('.mobile-bottom-bar [data-nav="attendance"]');
      await page.waitForSelector('[data-screen="attendance"]:not([hidden])');
      await page.goBack(); await page.waitForSelector('[data-screen="requests"]:not([hidden])');
      assert(await page.$eval(search, element => element.value) === 'nonexistent-mobile-record', `Back preserves request search state (${language})`);
      await page.goBack(); await page.waitForSelector('[data-screen="dashboard"]:not([hidden])');
      await page.waitForFunction(value => Math.abs(document.querySelector('#main-content').scrollTop - value) < 2, {}, scroll);
      assert(true, `Back restores the previous list position (${language})`);
      await page.click('[data-slot="new-request"]'); await page.waitForSelector('[data-panel="new-request"]');
      await page.click('[data-panel="new-request"] button:has(.lucide-calendar-plus)');
      await page.waitForSelector('#leave-notes');
      const pinned = await page.evaluate(() => {
        const dialog = document.querySelector('[data-layout="form"]');
        const footer = dialog.querySelector('[data-slot="dialog-footer"]');
        const scroller = dialog.querySelector('[data-slot="dialog-scroll"]');
        const before = footer.getBoundingClientRect().top; scroller.scrollTop = scroller.scrollHeight;
        const after = footer.getBoundingClientRect();
        return !scroller.contains(footer) && before === after.top && after.bottom <= innerHeight && after.height > 44;
      });
      assert(pinned, `Request action stays outside the scrolling form (${language})`);
      await page.focus('#leave-notes'); await page.type('#leave-notes','Mobile draft retained');
      assert(await page.$eval('#leave-notes', element => parseFloat(getComputedStyle(element).fontSize) >= 16), `Mobile input text is readable at 16px (${language})`);
      await page.evaluate(() => {
        Object.defineProperty(window.visualViewport, 'height', { value: 450, configurable: true });
        window.visualViewport.dispatchEvent(new Event('resize'));
      });
      await page.waitForFunction(() => document.documentElement.classList.contains('keyboard-open'));
      await page.waitForFunction(() => document.querySelector('[data-layout="form"]').getBoundingClientRect().bottom <= window.visualViewport.offsetTop + window.visualViewport.height + 1);
      assert(await page.evaluate(() => document.querySelector('[data-layout="form"]').getBoundingClientRect().bottom <= window.visualViewport.offsetTop + window.visualViewport.height + 1), `Keyboard viewport keeps the form above the keyboard (${language})`);
      await page.evaluate(() => { delete window.visualViewport.height; window.visualViewport.dispatchEvent(new Event('resize')); });
      await page.goBack(); await page.waitForSelector('#leave-notes',{hidden:true});
      await page.click('[data-slot="new-request"]'); await page.waitForSelector('[data-panel="new-request"]');
      await page.click('[data-panel="new-request"] button:has(.lucide-calendar-plus)'); await page.waitForSelector('#leave-notes');
      assert(await page.$eval('#leave-notes', element => element.value) === 'Mobile draft retained', `Closing and reopening restores the request draft (${language})`);
      await page.keyboard.press('Escape'); await page.waitForSelector('#leave-notes',{hidden:true});
      await openPreferences(page);
      assert(await page.evaluate(() => document.querySelector('[data-panel="accessibility"]').contains(document.activeElement)), `Preferences opens through the mobile menu with focus (${language})`);
      await page.goBack(); await page.waitForSelector('[data-panel="accessibility"]',{hidden:true});
      await navigate(page,'requests');
      await page.waitForSelector(search); await page.focus(search); await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); await page.keyboard.press('Backspace');
      assert(await page.$eval(search, element => element.value) === '', `Request filters can be cleared (${language})`);
      await page.waitForSelector('[data-screen="requests"] ul > li');
      await page.click('[data-screen="requests"] ul > li button'); await page.waitForSelector('[role="dialog"] ol');
      assert(await page.$$eval('[role="dialog"] ol > li', elements => elements.length) === 3, `Request details include a labeled progress diagram (${language})`);
      await page.goBack(); await page.waitForSelector('[role="dialog"]',{hidden:true});
      assert(failures.length === 0, `Mobile journeys produce no uncaught errors (${language})`, failures.join('; '));
    } finally { await context.close(); }
  }
};
