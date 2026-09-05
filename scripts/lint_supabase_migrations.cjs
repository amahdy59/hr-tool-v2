const fs = require('fs');
const path = require('path');

console.log('🗄️ [Migration Linter] Scanning Supabase SQL migrations and seeds...');
console.log('--------------------------------------------------');

const rootDir = path.join(__dirname, '..');
const migrationsDir = path.join(rootDir, 'supabase', 'migrations');
const seedFile = path.join(rootDir, 'supabase', 'seed.sql');

let filesToScan = [];
if (fs.existsSync(migrationsDir)) {
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .map(f => path.join(migrationsDir, f));
  filesToScan = filesToScan.concat(files);
}

if (fs.existsSync(seedFile)) {
  filesToScan.push(seedFile);
}

let hasErrors = false;
let totalCheckedUuids = 0;

// RFC-4122 strict hex UUID pattern
const strictUuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
// Potential UUID string candidate in SQL (single quoted 36 chars with 4 hyphens)
const uuidCandidateRegex = /'([0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{12})'/g;
// Dangerous uuid LIKE comparison without text cast: id like '...'
const unsafeUuidLikeRegex = /\b(id|employee_id|department_id|job_title_id)\s+(like|ilike)\b/gi;

filesToScan.forEach(file => {
  const relativePath = path.relative(rootDir, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // 1. Check UUID candidates for non-hex characters
    let match;
    uuidCandidateRegex.lastIndex = 0;
    while ((match = uuidCandidateRegex.exec(line)) !== null) {
      totalCheckedUuids++;
      const candidate = match[1];
      if (!strictUuidRegex.test(candidate)) {
        console.error(`   ❌ [Invalid UUID Syntax] ${relativePath}:${lineNum} - "${candidate}" contains invalid non-hex characters.`);
        hasErrors = true;
      }
    }

    // 2. Check for unsafe UUID operator without cast
    if (unsafeUuidLikeRegex.test(line) && !line.includes('::text')) {
      console.error(`   ❌ [Type Cast Error] ${relativePath}:${lineNum} - UUID column used with LIKE without explicit '::text' cast.`);
      console.error(`      Line: ${line.trim()}`);
      hasErrors = true;
    }
  });
});

console.log(`   Audited ${filesToScan.length} SQL file(s) and validated ${totalCheckedUuids} UUID literal(s).`);

if (hasErrors) {
  console.error('\n💥 [Migration Linter] FAILED: SQL syntax or schema violations detected.');
  process.exit(1);
} else {
  console.log('✅ [Migration Linter] PASSED: All migrations & seeds are strictly compliant.');
  process.exit(0);
}
