// ============================================================
// ABDUGOFFOROV PLATFORM — LOKAL MAXFIY KALITLAR VA TOKENLAR SKANERI
// Vazifasi: Kod bazasida va commit'ga tayyorlanayotgan fayllarda
// Telegram tokenlari, API kalitlar, shaxsiy kalitlar (Private Keys)
// va maxfiy ma'lumotlar ochiq qolib ketishini 100% to'sish.
// ============================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Xavfli maxfiy ma'lumotlar shablonlari (Regex Patterns)
const SECRET_PATTERNS = [
  {
    name: 'Telegram Bot Token',
    regex: /\b([0-9]{8,10}:[a-zA-Z0-9_-]{35})\b/g,
    mask: (val) => val.slice(0, 6) + '...' + val.slice(-4)
  },
  {
    name: 'Private Cryptographic Key',
    regex: /-----BEGIN (?:RSA|EC|OPENSSH|PGP|PRIVATE) KEY-----/g,
    mask: () => '-----BEGIN ... KEY-----'
  },
  {
    name: 'Google / Gemini API Key',
    regex: /\b(AIza[0-9A-Za-z-_]{35})\b/g,
    mask: (val) => val.slice(0, 6) + '...' + val.slice(-4)
  },
  {
    name: 'GitHub Personal Access Token',
    regex: /\b(gh[pousr]_[0-9A-Za-z]{36,255})\b/g,
    mask: (val) => val.slice(0, 6) + '...' + val.slice(-4)
  },
  {
    name: 'Slack Token',
    regex: /\b(xox[baprs]-[0-9A-Za-z]{10,48})\b/g,
    mask: (val) => val.slice(0, 6) + '...' + val.slice(-4)
  },
  {
    name: 'AWS Access Key ID',
    regex: /\b(AKIA[0-9A-Z]{16})\b/g,
    mask: (val) => val.slice(0, 4) + '...' + val.slice(-4)
  },
  {
    name: 'Ma\'lumotlar bazasi Connection String (parol bilan)',
    regex: /(?:postgres|mysql|mongodb(?:\+srv)?):\/\/[a-zA-Z0-9_.-]+:([^@\s/]+)@/g,
    mask: () => 'protocol://user:***@host'
  }
];

// Tekshirishdan istisno qilinadigan fayl va papkalar
const IGNORED_PATHS = [
  'node_modules',
  '.git',
  'dist',
  '.env',
  '.env.example',
  'package-lock.json',
  'GEMINI.md',
  'gemini.md'
];

// Matnli fayllar kengaytmasi
const SCANNABLE_EXTENSIONS = ['.js', '.mjs', '.html', '.css', '.json', '.txt', '.md', '.yml', '.yaml'];

function isIgnored(filePath) {
  const rel = path.relative(rootDir, filePath).replace(/\\/g, '/');
  return IGNORED_PATHS.some(ignored => rel === ignored || rel.startsWith(ignored + '/'));
}

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (isIgnored(fullPath)) continue;
    if (item.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase();
      if (SCANNABLE_EXTENSIONS.includes(ext)) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

export function scanFiles(filesToScan = null) {
  const files = filesToScan || getAllFiles(rootDir);
  const findings = [];

  for (const file of files) {
    if (isIgnored(file)) continue;
    if (!fs.existsSync(file)) continue;

    let content = '';
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch (_) {
      continue;
    }

    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      for (const pattern of SECRET_PATTERNS) {
        pattern.regex.lastIndex = 0;
        let match;
        while ((match = pattern.regex.exec(line)) !== null) {
          const matchedVal = match[0];
          // Test yoki dummy namunaviy qiymatlarni o'tkazib yuboramiz
          if (
            matchedVal.includes('your_') ||
            matchedVal.includes('example') ||
            matchedVal.includes('0000000000') ||
            matchedVal.includes('test_token')
          ) {
            continue;
          }

          findings.push({
            file: path.relative(rootDir, file).replace(/\\/g, '/'),
            line: i + 1,
            rule: pattern.name,
            maskedValue: pattern.mask ? pattern.mask(matchedVal) : '***'
          });
        }
      }
    }
  }

  return findings;
}

// CLI sifatida to'g'ridan-to'g'ri ishga tushirilganda
const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectExecution) {
  console.log('🛡️ [SECRET-SCANNER] Loyihada maxfiy kalit va tokenlar qidirilmoqda...');
  const findings = scanFiles();

  if (findings.length > 0) {
    console.error('\n🚨 XAVF: Maxfiy kalitlar yoki tokenlar aniqlandi!\n');
    findings.forEach(f => {
      console.error(`  ❌ [${f.rule}] ${f.file}:${f.line} -> (${f.maskedValue})`);
    });
    console.error('\nIltimos, ushbu maxfiy qiymatlarni koddan olib tashlab, faqat .env ga joylashtiring!\n');
    process.exit(1);
  } else {
    console.log('✅ Toza! Birorta ham ochiq token yoki maxfiy kalit topilmadi.');
    process.exit(0);
  }
}
