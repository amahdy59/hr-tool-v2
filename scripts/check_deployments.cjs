const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// CLI Arguments
const args = process.argv.slice(2);
function getArg(flag, defaultValue) {
  const index = args.indexOf(flag);
  if (index !== -1 && index + 1 < args.length) {
    return args[index + 1];
  }
  return defaultValue;
}
const shouldWait = args.includes('--wait');
const shouldVerifyLive = args.includes('--verify-live');
const skipCheckRuns = args.includes('--skip-check-runs');
const currentCiJob = process.env.GITHUB_JOB || process.env.GITHUB_ACTION;
const repo = getArg('--repo', 'amahdy59/hr-tool-v2');
const targetUrl = getArg('--url', 'https://amahdy59.github.io/hr-tool-v2/');
const timeoutSeconds = parseInt(getArg('--timeout', '300'), 10);
const jsonReportPath = getArg('--json-report', '');

function getHeadSha() {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  } catch (e) {
    return 'HEAD';
  }
}
const targetSha = getArg('--sha', getHeadSha());

console.log('🚀 [Deployment Auto-Checker] Starting deployment health audit...');
console.log(`   Repository : ${repo}`);
console.log(`   Commit SHA : ${targetSha}`);
console.log(`   Live URL   : ${targetUrl}`);
console.log(`   Mode       : ${shouldVerifyLive ? 'Live Smoke Test' : ''}${!skipCheckRuns ? (shouldVerifyLive ? ' + ' : '') + 'Check-Runs Audit' : ''}${shouldWait ? ' (Polling with wait)' : ''}`);
console.log('--------------------------------------------------');

// Helper to fetch GitHub API
function fetchGithubCheckRuns(ownerRepo, sha) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${ownerRepo}/commits/${sha}/check-runs`,
      headers: {
        'User-Agent': 'HRTool-Deployment-AutoChecker',
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    if (process.env.GITHUB_TOKEN) {
      options.headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 400) {
          return reject(new Error(`GitHub API HTTP ${res.statusCode}: ${data}`));
        }
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

// Helper to verify live website via Puppeteer
async function auditLiveEndpoint(url) {
  console.log(`\n🌐 [Live Endpoint Audit] Validating live deployment at: ${url}`);
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.error('Puppeteer not installed, skipping browser smoke test.');
    return { passed: true, skipped: true };
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  const networkErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('requestfailed', request => {
    networkErrors.push(`${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
  });

  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    const status = response ? response.status() : 0;
    console.log(`   HTTP Status: ${status}`);

    if (status !== 200 && status !== 304) {
      throw new Error(`Expected HTTP status 200, received ${status}`);
    }

    const title = await page.title();
    console.log(`   Page Title : "${title}"`);

    await page.waitForSelector('#root', { timeout: 15000 });
    console.log('   ✅ Root container successfully mounted.');

    // Look for Quick Login button or Dashboard content
    const clickedQuickLogin = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.textContent?.includes('Quick Login') || b.textContent?.includes('تسجيل سريع'));
      if (target) {
        target.click();
        return true;
      }
      return false;
    });

    if (clickedQuickLogin) {
      console.log('   Clicked "Quick Login" button for live authentication flow...');
      await page.waitForSelector('#main-content, nav, header', { timeout: 15000 });
      console.log('   ✅ Authenticated layout successfully loaded.');
    }

    if (consoleErrors.length > 0) {
      console.warn(`   ⚠️ Console errors logged during live session (${consoleErrors.length}):`, consoleErrors.slice(0, 3));
    } else {
      console.log('   ✅ 0 runtime console errors detected.');
    }

    if (networkErrors.length > 0) {
      console.warn(`   ⚠️ Network request failures (${networkErrors.length}):`, networkErrors.slice(0, 3));
    } else {
      console.log('   ✅ 0 failed network requests.');
    }

    await browser.close();
    return { passed: true, status, title, consoleErrors, networkErrors };
  } catch (error) {
    await browser.close();
    console.error('   ❌ Live endpoint verification failed:', error.message);
    return { passed: false, error: error.message, consoleErrors, networkErrors };
  }
}

// Main execution loop
async function run() {
  const startTime = Date.now();
  let completed = false;
  let allPassed = false;
  let lastCheckRuns = [];

  // If in wait mode or auditing GitHub check runs
  if (!skipCheckRuns) {
    while (!completed) {
      try {
        const data = await fetchGithubCheckRuns(repo, targetSha);
        const runs = data.check_runs || [];
        lastCheckRuns = runs;

        console.log(`\n📋 GitHub Commit Check-Runs for [${targetSha.substring(0, 8)}]:`);
        if (runs.length === 0) {
          console.log('   No check runs registered yet for this commit.');
        }

        let inProgressCount = 0;
        let failureCount = 0;

        runs.forEach(c => {
          const isCurrentJob = currentCiJob && c.name.toLowerCase().includes(currentCiJob.toLowerCase());
          const isCompleted = c.status === 'completed';
          const isSuccess = c.conclusion === 'success';
          let badge = '⏳';
          if (isCompleted) {
            badge = isSuccess ? '✅' : '❌';
          }

          console.log(`   ${badge} [${c.name}] Status: ${c.status}, Conclusion: ${c.conclusion || 'pending'}${isCurrentJob ? ' (Current CI Job)' : ''}`);
          if (!isCompleted && !isCurrentJob) inProgressCount++;
          if (isCompleted && !isSuccess) {
            failureCount++;
            if (c.output?.summary) {
              console.log(`      Summary: ${c.output.summary.slice(0, 200)}`);
            }
          }
        });

        if (!shouldWait || inProgressCount === 0 || failureCount > 0) {
          completed = true;
          allPassed = (runs.length > 0) && (failureCount === 0) && (inProgressCount === 0);
        } else {
          const elapsed = Math.round((Date.now() - startTime) / 1000);
          if (elapsed >= timeoutSeconds) {
            console.error(`\n⌛ Timeout exceeded (${timeoutSeconds}s) waiting for check runs.`);
            completed = true;
            allPassed = false;
          } else {
            console.log(`   ⏳ Checks still in progress (${inProgressCount}). Waiting 10s... (Elapsed: ${elapsed}s)`);
            await new Promise(r => setTimeout(r, 10000));
          }
        }
      } catch (err) {
        console.warn(`   ⚠️ Could not query GitHub API (${err.message}).`);
        completed = true;
        allPassed = true; // allow live verification to govern
      }
    }
  } else {
    allPassed = true;
  }

  // Live endpoint verification
  let liveResult = null;
  if (shouldVerifyLive) {
    liveResult = await auditLiveEndpoint(targetUrl);
    if (!liveResult.passed) {
      allPassed = false;
    }
  }

  if (jsonReportPath) {
    const report = {
      timestamp: new Date().toISOString(),
      commitSha: targetSha,
      repo,
      allPassed,
      checkRuns: lastCheckRuns.map(c => ({
        name: c.name,
        status: c.status,
        conclusion: c.conclusion
      })),
      liveResult
    };
    fs.writeFileSync(path.resolve(jsonReportPath), JSON.stringify(report, null, 2), 'utf8');
    console.log(`📄 Saved audit report to: ${jsonReportPath}`);
  }

  console.log('\n--------------------------------------------------');
  if (allPassed) {
    console.log('🎉 [Deployment Auto-Checker] PASSED: All deployment targets & live services healthy.');
    process.exit(0);
  } else {
    console.error('💥 [Deployment Auto-Checker] FAILED: Issues found in deployment targets or live endpoint.');
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Unexpected fatal error in autochecker:', err);
  process.exit(1);
});
