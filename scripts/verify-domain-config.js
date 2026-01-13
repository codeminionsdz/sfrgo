#!/usr/bin/env node

/**
 * SAFRGO Domain Configuration Verifier
 * 
 * This script verifies that all URLs in the SAFRGO project
 * are correctly configured to use the production domain.
 * 
 * Run with: node scripts/verify-domain-config.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 SAFRGO Domain Configuration Verifier\n');

// Configuration
const PRODUCTION_DOMAIN = 'https://safrgo.online';
const ENV_VARIABLE = 'NEXT_PUBLIC_APP_URL';

// Results tracking
const results = {
  passed: [],
  failed: [],
  warnings: []
};

// Check 1: Environment file exists
console.log('1️⃣  Checking environment configuration...');
const envPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes(ENV_VARIABLE)) {
    const match = envContent.match(new RegExp(`${ENV_VARIABLE}=(.+)`));
    if (match) {
      const configuredDomain = match[1].trim();
      if (configuredDomain === PRODUCTION_DOMAIN) {
        results.passed.push(`✅ ${ENV_VARIABLE} correctly set to ${PRODUCTION_DOMAIN}`);
      } else {
        results.warnings.push(`⚠️  ${ENV_VARIABLE} is set to "${configuredDomain}" (expected: ${PRODUCTION_DOMAIN})`);
      }
    }
  } else {
    results.failed.push(`❌ ${ENV_VARIABLE} not found in .env.local`);
  }
} else {
  results.failed.push('❌ .env.local file not found');
}

// Check 2: Files use correct pattern
console.log('2️⃣  Checking updated files...');

const filesToCheck = [
  'components/agency/qr-code-card.tsx',
  'components/agency/printable-qr-code.tsx',
  'components/agency/qr-code-showcase.tsx',
  'components/agency/share-offer-button.tsx',
  'app/(app)/offers/[id]/page.tsx',
  'components/auth/signup-form.tsx',
  'app/test-qr/page.tsx'
];

const correctPattern = new RegExp(`process\\.env\\.${ENV_VARIABLE}.*${PRODUCTION_DOMAIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);

filesToCheck.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (correctPattern.test(content)) {
      results.passed.push(`✅ ${file}`);
    } else {
      // Check if it uses the variable at all
      if (content.includes(ENV_VARIABLE)) {
        results.warnings.push(`⚠️  ${file} - uses ${ENV_VARIABLE} but pattern might differ`);
      } else {
        results.failed.push(`❌ ${file} - doesn't use ${ENV_VARIABLE}`);
      }
    }
  } else {
    results.failed.push(`❌ ${file} - file not found`);
  }
});

// Check 3: No hardcoded localhost
console.log('3️⃣  Checking for hardcoded localhost URLs...');

const componentsDir = path.join(process.cwd(), 'components');
const appDir = path.join(process.cwd(), 'app');

function checkForLocalhost(dir, results) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      checkForLocalhost(filePath, results);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const localhostMatches = content.match(/http:\/\/localhost:\d+/g);
      
      if (localhostMatches && !filePath.includes('node_modules')) {
        const relativePath = path.relative(process.cwd(), filePath);
        results.warnings.push(`⚠️  Found localhost URL in ${relativePath}`);
      }
    }
  });
}

checkForLocalhost(componentsDir, results);
checkForLocalhost(appDir, results);

// Check 4: Documentation exists
console.log('4️⃣  Checking documentation...');

const docsToCheck = [
  'docs/DOMAIN_CONFIGURATION.md',
  'docs/DOMAIN_QUICK_REF.md',
  'docs/DOMAIN_MIGRATION_SUMMARY.md'
];

docsToCheck.forEach(doc => {
  const docPath = path.join(process.cwd(), doc);
  if (fs.existsSync(docPath)) {
    results.passed.push(`✅ ${doc}`);
  } else {
    results.warnings.push(`⚠️  ${doc} not found`);
  }
});

// Print results
console.log('\n' + '='.repeat(60));
console.log('📊 VERIFICATION RESULTS\n');

if (results.passed.length > 0) {
  console.log('✅ PASSED:\n');
  results.passed.forEach(msg => console.log(`   ${msg}`));
  console.log('');
}

if (results.warnings.length > 0) {
  console.log('⚠️  WARNINGS:\n');
  results.warnings.forEach(msg => console.log(`   ${msg}`));
  console.log('');
}

if (results.failed.length > 0) {
  console.log('❌ FAILED:\n');
  results.failed.forEach(msg => console.log(`   ${msg}`));
  console.log('');
}

// Summary
console.log('='.repeat(60));
console.log('\n📈 SUMMARY:');
console.log(`   Passed: ${results.passed.length}`);
console.log(`   Warnings: ${results.warnings.length}`);
console.log(`   Failed: ${results.failed.length}`);

// Final status
console.log('\n🎯 STATUS: ', results.failed.length === 0 ? '✅ READY FOR DEPLOYMENT' : '❌ NEEDS ATTENTION');
console.log('');

// Exit code
process.exit(results.failed.length > 0 ? 1 : 0);
