import puppeteer from 'puppeteer';

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER PAGE ERROR:', err.toString()));
  page.on('error', err => console.log('BROWSER ERROR:', err.toString()));

  console.log('Navigating to app...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  
  console.log('Clicking Arabic toggle if present...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const arBtn = btns.find(b => b.textContent && (b.textContent.includes('العربية') || b.textContent.includes('Arabic')));
    if (arBtn) {
      console.log('Found Arabic button, clicking...');
      arBtn.click();
    }
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  console.log('Navigating to Profile from Sidebar...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a'));
    const profileSidebar = btns.find(b => b.textContent && (b.textContent.includes('الملف الشخصي') || b.textContent.includes('Profile')));
    if (profileSidebar) {
      console.log('Found Profile sidebar button, clicking...');
      profileSidebar.click();
    }
  });

  await new Promise(r => setTimeout(r, 1000));
  
  console.log('Clicking Professional Profile TAB...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const profBtn = btns.find(b => b.textContent && (b.textContent.includes('الملف المهني') || b.textContent.includes('Professional Profile')));
    if (profBtn) {
      console.log('Found Professional Profile TAB, clicking...');
      profBtn.click();
    } else {
      console.log('COULD NOT FIND Professional Profile TAB!');
    }
  });
  
  await new Promise(r => setTimeout(r, 3000));
  
  await browser.close();
  console.log('Done.');
})();
