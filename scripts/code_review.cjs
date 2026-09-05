const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const ts = require('typescript');
const vm = require('vm');

console.log('🔍 [Code Review] Starting automated code quality verification...');
console.log('--------------------------------------------------');

let hasErrors = false;

// 1. TypeScript Check
try {
  console.log('1️⃣ Checking TypeScript types (tsc --noEmit)...');
  execSync('npx tsc --noEmit', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  console.log('   ✅ TypeScript compilation passed with 0 errors.');
} catch (e) {
  console.error('   ❌ TypeScript check failed.');
  hasErrors = true;
}

// 2. PWA Webmanifest Check
try {
  console.log('\n2️⃣ Verifying PWA Manifest (public/manifest.webmanifest)...');
  const manifestPath = path.join(__dirname, '..', 'public', 'manifest.webmanifest');
  if (!fs.existsSync(manifestPath)) {
    throw new Error('manifest.webmanifest not found');
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
  for (const field of requiredFields) {
    if (!manifest[field]) {
      throw new Error(`Missing required manifest field: ${field}`);
    }
  }
  if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
    throw new Error('Manifest must contain at least one icon');
  }
  console.log(`   ✅ PWA manifest valid (${manifest.name}, ${manifest.icons.length} icon(s)).`);
} catch (e) {
  console.error('   ❌ PWA manifest check failed:', e.message);
  hasErrors = true;
}

// 3. Translation Key Symmetry (i18n Parity)
try {
  console.log('\n3️⃣ Verifying i18n Translation Dictionary Parity (EN <-> AR)...');
  const i18nPath = path.join(__dirname, '..', 'src', 'i18n.ts');
  const code = fs.readFileSync(i18nPath, 'utf8');
  const js = ts.transpile(code, { module: ts.ModuleKind.CommonJS });

  const dummy = {};
  dummy.default = dummy;
  dummy.use = () => dummy;
  dummy.init = () => dummy;

  const sandbox = { exports: {}, require: () => dummy };
  vm.createContext(sandbox);
  vm.runInContext(js + '; this.en = en; this.ar = ar;', sandbox);

  function getLeafKeys(obj, prefix = '') {
    let keys = [];
    for (const key of Object.keys(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys = keys.concat(getLeafKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    return keys;
  }

  const enKeys = new Set(getLeafKeys(sandbox.en.translation));
  const arKeys = new Set(getLeafKeys(sandbox.ar.translation));

  const missingInAr = [...enKeys].filter(k => !arKeys.has(k));
  const missingInEn = [...arKeys].filter(k => !enKeys.has(k));

  if (missingInAr.length > 0 || missingInEn.length > 0) {
    if (missingInAr.length > 0) {
      console.error(`   ❌ Missing keys in Arabic dictionary (${missingInAr.length}):`, missingInAr);
    }
    if (missingInEn.length > 0) {
      console.error(`   ❌ Missing keys in English dictionary (${missingInEn.length}):`, missingInEn);
    }
    hasErrors = true;
  } else {
    console.log(`   ✅ i18n dictionary complete: ${enKeys.size} keys verified with 100% parity.`);
  }
} catch (e) {
  console.error('   ❌ i18n key parity check failed:', e.message);
  hasErrors = true;
}

// 4. RTL Logical Property Linter (Disallow physical ml-, mr-, pl-, pr- on UI)
try {
  console.log('\n4️⃣ Verifying RTL Logical CSS Utilities in UI Components...');
  const srcDir = path.join(__dirname, '..', 'src');
  const physicalClassPattern = /\b(mr-|ml-|pl-|pr-)\d+\b/g;

  function scanDir(dir) {
    let files = [];
    for (const item of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        files = files.concat(scanDir(fullPath));
      } else if (/\.(tsx|jsx)$/.test(item)) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const uiFiles = scanDir(srcDir);
  let physicalViolations = [];

  for (const file of uiFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(physicalClassPattern);
    if (matches && matches.length > 0) {
      physicalViolations.push({ file: path.relative(path.join(__dirname, '..'), file), matches });
    }
  }

  if (physicalViolations.length > 0) {
    console.error(`   ❌ Found physical margin/padding classes that break RTL mirroring:`);
    physicalViolations.forEach(v => console.error(`      - ${v.file}: ${v.matches.join(', ')} (use ms-, me-, ps-, pe-)`));
    hasErrors = true;
  } else {
    console.log(`   ✅ RTL logical property compliance: 0 physical spacing violations across ${uiFiles.length} components.`);
  }
} catch (e) {
  console.error('   ❌ RTL logical property check failed:', e.message);
  hasErrors = true;
}

console.log('--------------------------------------------------');
if (hasErrors) {
  console.error('💥 [Code Review] Verification FAILED. Please fix the issues above.');
  process.exit(1);
} else {
  console.log('🎉 [Code Review] All automated code quality checks PASSED.');
  process.exit(0);
}
