const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.static(path.join(__dirname, '..', 'dist')));

const server = app.listen(3000, async () => {
  console.log('Server running on port 3000 for Accessibility Audit...');
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

    await page.goto('http://localhost:3000');
    console.log('Page loaded. Performing Quick Login...');
    
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
      await quickLoginBtn.click();
      await new Promise(r => setTimeout(r, 2000));
      console.log('Logged in successfully.');
    } else {
      console.log('Quick Login button not found.');
    }

    console.log('Injecting axe-core...');
    await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.2/axe.min.js' });
    
    console.log('Running Axe Accessibility Audit...');
    const results = await page.evaluate(async () => {
      // @ts-ignore
      return await axe.run();
    });

    console.log('\n--- ACCESSIBILITY AUDIT RESULTS ---');
    console.log(`Violations: ${results.violations.length}`);
    console.log(`Passes: ${results.passes.length}`);
    console.log(`Incomplete: ${results.incomplete.length}`);
    console.log(`Inapplicable: ${results.inapplicable.length}\n`);

    if (results.violations.length > 0) {
      console.log('Violations Detail:');
      results.violations.forEach((violation, idx) => {
        console.log(`\n[Violation ${idx + 1}] ID: ${violation.id}`);
        console.log(`Description: ${violation.description}`);
        console.log(`Impact: ${violation.impact}`);
        console.log(`Help: ${violation.help} (${violation.helpUrl})`);
        console.log('Affected Elements:');
        violation.nodes.forEach((node) => {
          console.log(`  - Target: ${node.target.join(', ')}`);
          if (node.any && node.any.length > 0) {
            console.log(`    Message: ${node.any.map(a => a.message).join(' | ')}`);
          }
        });
      });
    }

    const auditReportPath = path.join('C:\\Users\\AhmedMahdy\\.gemini\\antigravity\\brain\\edcdf155-9bfc-4787-88db-ded0fd670b77', 'accessibility_audit_report.json');
    fs.writeFileSync(auditReportPath, JSON.stringify(results, null, 2));
    console.log(`\nFull report saved to: ${auditReportPath}`);

    await browser.close();
  } catch (e) {
    console.error('Audit Script Error:', e);
  } finally {
    server.close();
    process.exit(0);
  }
});
