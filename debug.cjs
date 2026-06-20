const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'dist')));
const server = app.listen(3000, async () => {
  console.log('Server running on 3000');
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    page.on('requestfailed', req => console.log('REQUEST FAILED:', req.url(), req.failure()?.errorText));

    await page.goto('http://localhost:3000');
    console.log('Page loaded');
    
    // Wait for the button
    await page.waitForSelector('button');
    console.log('Buttons found');
    
    // Find Quick Login button
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
    } else {
      console.log('Quick Login button not found');
    }
    
    await browser.close();
  } catch (e) {
    console.log('SCRIPT ERROR:', e);
  } finally {
    server.close();
  }
});
