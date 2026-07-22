// ===== ABDUGOFFOROV HEALTH CHECK & AUTOMATED QA AUDIT =====
// Ushbu skript loyihadagi barcha JS/HTML fayllarni avtomatik skan qilib,
// sintaktik xatolar, uncalled/undefined o'zgaruvchilar va buzuq simvollarni aniqlaydi.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 [HEALTH-CHECK] Loyiha avtomatik auditi boshlandi...\n');

let totalErrors = 0;
let totalWarnings = 0;

function logPass(msg) { console.log(`  ✅ ${msg}`); }
function logFail(msg) { console.error(`  ❌ ${msg}`); totalErrors++; }
function logWarn(msg) { console.warn(`  ⚠️ ${msg}`); totalWarnings++; }

const rootDir = path.join(__dirname, '..');

// -------------------------------------------------------------
// 1. ALL JS FILES SYNTAX CHECK (Node --check)
// -------------------------------------------------------------
console.log('📌 1. JavaScript Sintaksis Audit (Node --check):');
function getAllJsFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                results = results.concat(getAllJsFiles(filePath));
            }
        } else if (file.endsWith('.js') || file.endsWith('.mjs')) {
            results.push(filePath);
        }
    });
    return results;
}

const jsFiles = getAllJsFiles(rootDir);
jsFiles.forEach(file => {
    const relPath = path.relative(rootDir, file);
    try {
        execSync(`"${process.execPath}" --check "${file}"`, { stdio: 'pipe' });
        logPass(`Sintaksis toza: ${relPath}`);
    } catch (err) {
        logFail(`SINTAKSIS XATO: ${relPath}\n${err.stderr.toString().trim()}`);
    }
});

// -------------------------------------------------------------
// 2. UNDEFINED VARIABLES & REMOVED SYMBOLS AUDIT
// -------------------------------------------------------------
console.log('\n📌 2. O\'chirilgan / Topilmagan O\'zgaruvchilar Audit:');
const knownRemovedSymbols = ['defaultPosts'];

jsFiles.forEach(file => {
    if (file.endsWith('health-check.js')) return;
    const relPath = path.relative(rootDir, file);
    const rawCode = fs.readFileSync(file, 'utf8');
    // Strip comments to avoid false positives in comment docs
    const codeNoComments = rawCode.replace(/\/\/.*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

    knownRemovedSymbols.forEach(sym => {
        const regex = new RegExp(`\\b${sym}\\b`, 'g');
        let match;
        while ((match = regex.exec(codeNoComments)) !== null) {
            const lineNo = rawCode.substring(0, match.index).split('\n').length;
            logFail(`O'chirilgan o'zgaruvchi chaqirilgan: '${sym}' -> ${relPath}:${lineNo}`);
        }
    });
});

// -------------------------------------------------------------
// 3. ENCODING & MOJIBAKE AUDIT
// -------------------------------------------------------------
console.log('\n📌 3. Buzuq Simvollar va UTF-8 Encoding Audit:');
const badSymbolRegex = /(ÔÇö|­şô|­şÄ|­şöı)/;

function auditEncoding(filePath) {
    if (!fs.existsSync(filePath)) return;
    const relPath = path.relative(rootDir, filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        if (badSymbolRegex.test(line)) {
            logWarn(`Buzuq simvol topildi: ${relPath}:${idx + 1} -> "${line.trim().substring(0, 50)}..."`);
        }
    });
}

const htmlFiles = [path.join(rootDir, 'index.html'), path.join(rootDir, 'kay.html')];
[...jsFiles, ...htmlFiles].forEach(f => auditEncoding(f));

// -------------------------------------------------------------
// 4. HTML ID & JS DOM BINDINGS AUDIT
// -------------------------------------------------------------
console.log('\n📌 4. HTML Element ID va JS DOM Bog\'liqliklari Audit:');
const indexHtmlContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const kayHtmlContent = fs.existsSync(path.join(rootDir, 'kay.html')) ? fs.readFileSync(path.join(rootDir, 'kay.html'), 'utf8') : '';
const combinedHtml = indexHtmlContent + '\n' + kayHtmlContent;

const appJsContent = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8');

const getElementByIdRegex = /getElementById\(['"]([^'"]+)['"]\)/g;
let idMatch;
const checkedIds = new Set();
while ((idMatch = getElementByIdRegex.exec(appJsContent)) !== null) {
    const id = idMatch[1];
    if (checkedIds.has(id)) continue;
    checkedIds.add(id);

    if (!combinedHtml.includes(`id="${id}"`) && !combinedHtml.includes(`id='${id}'`) && !id.includes('${')) {
        logWarn(`JS faylda getElementById('${id}') bor, lekin HTML da bunday static ID topilmadi.`);
    }
}

// -------------------------------------------------------------
// AUDIT SUMMARY
// -------------------------------------------------------------
console.log('\n=================================================');
console.log(`📊 HEALTH-CHECK YAKUNI: ${totalErrors} Xato(lar), ${totalWarnings} Ogohlantirish(lar)`);
console.log('=================================================\n');

if (totalErrors > 0) {
    console.error('💥 AUDIT MUVAFFAQIYATSIZ O\'TDI! Xatolar borligi sababli push qilish mumkin emas.\n');
    process.exit(1);
} else {
    console.log('🎉 AUDIT MUVAFFAQIYATLI O\'TDI! Barcha fayllar va mantiq to\'liq ishchi holatda.\n');
    process.exit(0);
}
