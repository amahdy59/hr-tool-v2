const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const path = require('path');

const devServer = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'pipe'
});

devServer.stdout.on('data', (data) => console.log('DEV STDOUT:', data.toString()));
devServer.stderr.on('data', (data) => console.log('DEV STDERR:', data.toString()));

setTimeout(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

    console.log('Navigating to dev server...');
    await page.goto('http://localhost:5173');
    
    await page.waitForSelector('button');
    const buttons = await page.$$('button');
    let quickLoginBtn;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Quick Login')) {
        quickLoginBtn = btn;
        break;
      }
    }
    
    if (quickLoginBtn) {
      console.log('Clicking Quick Login...');
      await quickLoginBtn.click();
      await new Promise(r => setTimeout(r, 2000));
      
      const screenshotPath = path.join('C:\\Users\\AhmedMahdy\\.gemini\\antigravity\\brain\\1c00d329-17ae-4ee2-bd31-b51d2348f899', 'screenshot_dev_after_login.png');
      await page.screenshot({ path: screenshotPath });
      console.log('Screenshot saved to ' + screenshotPath);
    }
    
    await browser.close();
  } catch (e) {
    console.log('SCRIPT ERROR:', e);
  } finally {
    devServer.kill();
    process.exit(0);
  }
}, 5000); // Wait 5 seconds for dev server to start
