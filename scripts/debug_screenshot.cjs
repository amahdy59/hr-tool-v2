const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.static(path.join(__dirname, 'dist')));
const server = app.listen(3000, async () => {
  console.log('Server running on 3000');
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    await page.goto('http://localhost:3000');
    console.log('Page loaded');
    
    await page.waitForSelector('button');
    
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
      
      // Wait for 2 seconds to allow rendering
      await new Promise(r => setTimeout(r, 2000));
      
      const screenshotPath = path.join('C:\\Users\\AhmedMahdy\\.gemini\\antigravity\\brain\\1c00d329-17ae-4ee2-bd31-b51d2348f899', 'screenshot_after_login.png');
      await page.screenshot({ path: screenshotPath });
      console.log('Screenshot saved to ' + screenshotPath);
    }
    
    await browser.close();
  } catch (e) {
    console.log('SCRIPT ERROR:', e);
  } finally {
    server.close();
  }
});
