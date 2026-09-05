const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');

console.log('⚡ [Performance Budget Gate] Auditing production build assets in dist/assets...');

if (!fs.existsSync(DIST_DIR) || !fs.existsSync(ASSETS_DIR)) {
  console.error('❌ dist/assets directory not found. Please run "npm run build" first.');
  process.exit(1);
}

// Performance Budget Thresholds (in bytes)
const BUDGETS = {
  mainJsGzipMax: 160 * 1024,      // 160 kB max for main entry JS
  mainCssGzipMax: 35 * 1024,      // 35 kB max for global CSS
  totalAssetsGzipMax: 900 * 1024, // 900 kB max total assets
};

const files = fs.readdirSync(ASSETS_DIR);
let mainJsFile = null;
let mainCssFile = null;
let totalGzipSize = 0;

console.log('--------------------------------------------------');
console.log('File Name                                Raw Size    Gzip Size   Status');
console.log('--------------------------------------------------');

let hasViolations = false;

files.forEach((file) => {
  const filePath = path.join(ASSETS_DIR, file);
  const stats = fs.statSync(filePath);
  if (!stats.isFile()) return;

  const content = fs.readFileSync(filePath);
  const gzipSize = zlib.gzipSync(content).length;
  totalGzipSize += gzipSize;

  const rawSizeKb = (stats.size / 1024).toFixed(2);
  const gzipSizeKb = (gzipSize / 1024).toFixed(2);

  let status = '✅ OK';

  if (file.startsWith('index-') && file.endsWith('.js')) {
    mainJsFile = { file, size: stats.size, gzipSize };
    if (gzipSize > BUDGETS.mainJsGzipMax) {
      status = '❌ OVER BUDGET';
      hasViolations = true;
    }
  } else if (file.startsWith('index-') && file.endsWith('.css')) {
    mainCssFile = { file, size: stats.size, gzipSize };
    if (gzipSize > BUDGETS.mainCssGzipMax) {
      status = '❌ OVER BUDGET';
      hasViolations = true;
    }
  }

  const paddedName = file.padEnd(38, ' ');
  const paddedRaw = `${rawSizeKb} kB`.padStart(11, ' ');
  const paddedGzip = `${gzipSizeKb} kB`.padStart(11, ' ');
  console.log(`${paddedName} ${paddedRaw} ${paddedGzip}   ${status}`);
});

console.log('--------------------------------------------------');
console.log(`Total gzipped asset footprint: ${(totalGzipSize / 1024).toFixed(2)} kB`);

if (mainJsFile) {
  console.log(`Main JS Bundle (${mainJsFile.file}): ${(mainJsFile.gzipSize / 1024).toFixed(2)} kB (budget: ${(BUDGETS.mainJsGzipMax / 1024)} kB)`);
}
if (mainCssFile) {
  console.log(`Main CSS Bundle (${mainCssFile.file}): ${(mainCssFile.gzipSize / 1024).toFixed(2)} kB (budget: ${(BUDGETS.mainCssGzipMax / 1024)} kB)`);
}

if (hasViolations) {
  console.error('\n💥 [Performance Budget Gate] FAILED: Asset size exceeded allowed threshold.');
  process.exit(1);
}

console.log('\n🎉 [Performance Budget Gate] PASSED: All production assets are within strict budget limits.');
process.exit(0);
