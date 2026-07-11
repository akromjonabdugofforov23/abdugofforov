const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

// 1. Extract flashcardDecks
const fcRegex = /const flashcardDecks = \{([\s\S]*?)\};\s*\/\/\s*============================================================\s*\/\/\s*NEMIS TILI TESTLARI/m;
const fcMatch = appJs.match(fcRegex);

if (fcMatch) {
    const fcCode = `export const flashcardDecks = {${fcMatch[1]}};`;
    fs.writeFileSync('data-flashcards.js', fcCode);
    appJs = appJs.replace(fcRegex, '// ===== KARTOCHKALAR (FLASHCARDS) OLIb TASHLANDI =====\n\n// ============================================================\n// NEMIS TILI TESTLARI');
    console.log('Extracted flashcards');
} else {
    console.log('Could not find flashcards block');
}

// 2. Extract deutschTests
// The object starts with `const deutschTests = {` and ends before `// ===== PORTFOLIO SAHIFASI =====`
const testRegex = /const deutschTests = \{([\s\S]*?)\};\s*\/\/\s*============================================================\s*\/\/\s*PORTFOLIO SAHIFASI/m;
const testMatch = appJs.match(testRegex);

if (testMatch) {
    const testCode = `export const deutschTests = {${testMatch[1]}};`;
    fs.writeFileSync('data-tests.js', testCode);
    appJs = appJs.replace(testRegex, '// ===== NEMIS TESTLARI OLIB TASHLANDI =====\n\n// ============================================================\n// PORTFOLIO SAHIFASI');
    console.log('Extracted deutschTests');
} else {
    console.log('Could not find deutschTests block');
}

// 3. Add Imports to top of app.js
const imports = `import { flashcardDecks } from './data-flashcards.js';\nimport { deutschTests } from './data-tests.js';\n\n`;
appJs = imports + appJs;

// 4. Expose all functions to window
const functionRegex = /^function\s+([a-zA-Z0-9_]+)\s*\(/gm;
let match;
let exposes = '\n// ===== GLOBAL SCOPE BINDINGS (ES MODULE UCHUN) =====\n';
while ((match = functionRegex.exec(appJs)) !== null) {
    const fnName = match[1];
    exposes += `window.${fnName} = ${fnName};\n`;
}
// Also expose auth and app variables if needed
exposes += `window.flashcardDecks = flashcardDecks;\nwindow.deutschTests = deutschTests;\n`;

appJs += exposes;

fs.writeFileSync('app.js', appJs);
console.log('Updated app.js');

// 5. Update index.html and kay.html to use type="module" for app.js
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace('<script src="app.js"></script>', '<script type="module" src="app.js"></script>');
fs.writeFileSync('index.html', indexHtml);

let kayHtml = fs.readFileSync('kay.html', 'utf8');
kayHtml = kayHtml.replace('<script src="app.js"></script>', '<script type="module" src="app.js"></script>');
fs.writeFileSync('kay.html', kayHtml);
console.log('Updated html files');

// 6. Update build.mjs to include new js files
let buildMjs = fs.readFileSync('build.mjs', 'utf8');
buildMjs = buildMjs.replace(
    "const JS_FILES = ['app.js', 'auth.js', 'i18n.js', 'storage.js', 'sw.js'];", 
    "const JS_FILES = ['data-flashcards.js', 'data-tests.js', 'app.js', 'auth.js', 'i18n.js', 'storage.js', 'sw.js'];"
);
fs.writeFileSync('build.mjs', buildMjs);
console.log('Updated build.mjs');
