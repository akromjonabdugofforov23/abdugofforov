// ============================================================
// ABDUGOFFOROV PLATFORM — TIKLASH VOSITASI (EMERGENCY RESTORE)
// Vazifasi: data/backups/ dagi zaxira nusxalaridan birini xavfsiz tiklash.
// Tiklashdan oldin joriy holatning ham avtomatik zaxirasini oladi.
// ============================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createBackup } from './emergency-backup.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const dbPath = path.join(rootDir, 'data', 'db.json');
const backupsDir = path.join(rootDir, 'data', 'backups');

export function restoreBackup(targetFileName = null) {
  if (!fs.existsSync(backupsDir)) {
    console.error('❌ data/backups katalogi mavjud emas.');
    return false;
  }

  const allBackups = fs.readdirSync(backupsDir)
    .filter(f => f.startsWith('backup_') && f.endsWith('.json'))
    .sort()
    .reverse();

  if (allBackups.length === 0) {
    console.error('❌ data/backups ichida birorta ham zaxira fayl topilmadi.');
    return false;
  }

  const fileToRestore = targetFileName || allBackups[0];
  const restoreFilePath = path.join(backupsDir, fileToRestore);

  if (!fs.existsSync(restoreFilePath)) {
    console.error(`❌ Ko'rsatilgan zaxira fayli topilmadi: ${fileToRestore}`);
    return false;
  }

  let restoreData;
  try {
    const raw = fs.readFileSync(restoreFilePath, 'utf8');
    restoreData = JSON.parse(raw);
  } catch (err) {
    console.error(`❌ Zaxira fayli JSON strukturasi buzilgan: ${err.message}`);
    return false;
  }

  // 1. Tiklashdan oldin hozirgi holatning yangi zaxirasini olamiz (Safe-Rollback)
  console.log('🔄 Tiklashdan oldin xavfsiz avto-zaxira olinmoqda...');
  createBackup();

  // 2. data/db.json ga yozamiz
  fs.writeFileSync(dbPath, JSON.stringify(restoreData, null, 2), 'utf8');

  console.log(`\n🎉 [TIKLASH MUVAFFAQIYATLI]`);
  console.log(`   ✅ Tiklangan fayl: ${fileToRestore}`);
  console.log(`   📊 Ma'lumotlar tiklandi:`);
  console.log(`      - Maqolalar: ${(restoreData.posts || []).length} ta`);
  console.log(`      - Foydalanuvchilar: ${(restoreData.users || []).length} ta`);
  console.log(`      - Test natijalari: ${(restoreData.results || []).length} ta`);
  console.log(`      - Iqtiboslar: ${(restoreData.quotes || []).length} ta\n`);

  return true;
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const chosenFile = process.argv[2] || null;
  restoreBackup(chosenFile);
}
