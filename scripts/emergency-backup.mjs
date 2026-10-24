// ============================================================
// ABDUGOFFOROV PLATFORM — FAVQULODDA ZAXIRA YARATISH (EMERGENCY BACKUP)
// Vazifasi: data/db.json ma'lumotlarini tekshirib, xavfsiz vaqt tamg'asi
// bilan data/backups/ katalogiga arxivlaydi.
// ============================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const dbPath = path.join(rootDir, 'data', 'db.json');
const backupsDir = path.join(rootDir, 'data', 'backups');

export function createBackup() {
  if (!fs.existsSync(dbPath)) {
    console.error('❌ data/db.json fayli topilmadi!');
    return false;
  }

  let dbData;
  try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    dbData = JSON.parse(raw);
  } catch (err) {
    console.error(`❌ db.json faylini o'qishda xatolik: ${err.message}`);
    return false;
  }

  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }

  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const backupFileName = `backup_${timestamp}.json`;
  const backupFilePath = path.join(backupsDir, backupFileName);

  fs.writeFileSync(backupFilePath, JSON.stringify(dbData, null, 2), 'utf8');

  // Eski nusxalarni tozalash (faqat oxirgi 15 tasini saqlab qolamiz)
  const allBackups = fs.readdirSync(backupsDir)
    .filter(f => f.startsWith('backup_') && f.endsWith('.json'))
    .sort()
    .reverse();

  if (allBackups.length > 15) {
    allBackups.slice(15).forEach(oldFile => {
      try { fs.unlinkSync(path.join(backupsDir, oldFile)); } catch (_) {}
    });
  }

  console.log(`\n💾 [FAVQULODDA ZAXIRA] Muvaffaqiyatli saqlandi:`);
  console.log(`   📁 Fayl: data/backups/${backupFileName}`);
  console.log(`   📊 Ma'lumotlar holati:`);
  console.log(`      - Maqolalar (posts): ${(dbData.posts || []).length} ta`);
  console.log(`      - Foydalanuvchilar (users): ${(dbData.users || []).length} ta`);
  console.log(`      - Test natijalari (results): ${(dbData.results || []).length} ta`);
  console.log(`      - Vazifalar (tasks): ${(dbData.tasks || []).length} ta`);
  console.log(`      - Iqtiboslar (quotes): ${(dbData.quotes || []).length} ta\n`);

  return backupFilePath;
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  createBackup();
}
