import fs from 'fs';
import path from 'path';

const appJsPath = path.join(process.cwd(), 'app.js');
const jsDir = path.join(process.cwd(), 'js');
const appJsContent = fs.readFileSync(appJsPath, 'utf-8');

function extractBetween(startMarker, endMarker) {
    const startIndex = appJsContent.indexOf(startMarker);
    if (startIndex === -1) return '';
    let endIndex = appJsContent.length;
    if (endMarker) {
        endIndex = appJsContent.indexOf(endMarker, startIndex);
        if (endIndex === -1) endIndex = appJsContent.length;
    }
    return appJsContent.substring(startIndex, endIndex).trim();
}

// 1. admin.js (Admin PIN va Admin Panel qismlari)
const adminPinContent = extractBetween('// ===== ADMIN PIN AUTHENTICATION =====', '// ===== PORTFOLIO VIEW =====');
fs.writeFileSync(path.join(jsDir, 'admin.js'), adminPinContent);
console.log('✅ js/admin.js yaratildi');

// 2. navigation.js (SPA Navigation va Skeleton/Live Search)
const navContent1 = extractBetween('// ===== SPA NAVIGATION =====', '// ===== LIKE HANDLING =====');
fs.writeFileSync(path.join(jsDir, 'navigation.js'), navContent1);
console.log('✅ js/navigation.js yaratildi');

// 3. deutsch-data.js (Nemis tili test bazasi)
const deutschDataContent = extractBetween('// ==========================================\n// NEMIS TILI TEST BAZASI (DATA)', '// ==========================================\n// NEMIS TILI TEST ENGINE');
fs.writeFileSync(path.join(jsDir, 'deutsch-data.js'), deutschDataContent);
console.log('✅ js/deutsch-data.js yaratildi');

// 4. deutsch.js (Nemis test engine)
const deutschEngineContent = extractBetween('// ==========================================\n// NEMIS TILI TEST ENGINE', '// ==========================================\n// TURNIR TIZIMI');
fs.writeFileSync(path.join(jsDir, 'deutsch.js'), deutschEngineContent);
console.log('✅ js/deutsch.js yaratildi');

// 5. tournament.js (Turnir tizimi)
const tournamentContent = extractBetween('// ==========================================\n// TURNIR TIZIMI', '// ===== AUTH UI =====');
fs.writeFileSync(path.join(jsDir, 'tournament.js'), tournamentContent);
console.log('✅ js/tournament.js yaratildi');

// 6. flashcards.js (Kartochkalar)
const flashcardsContent = extractBetween('// ===== FLASHCARDS DATA =====', '// ===== TIL / i18n =====');
fs.writeFileSync(path.join(jsDir, 'flashcards.js'), flashcardsContent);
console.log('✅ js/flashcards.js yaratildi');

// 7. particles.js (Hero Particles)
const particlesContent = extractBetween('// ===== HERO PARTICLES (CANVAS) =====', '// ===== GERMANY CAROUSEL =====');
fs.writeFileSync(path.join(jsDir, 'particles.js'), particlesContent);
console.log('✅ js/particles.js yaratildi');

// 8. animations.js (Intro Splash, Carousel, Typewriter, Tilt)
const introSplash = extractBetween('// ===== INTRO SPLASH ANIMATION =====', '// ===== SCROLL REVEAL =====');
const scrollReveal = extractBetween('// ===== SCROLL REVEAL =====', '// ===== FLOATING ADD BUTTON =====');
const carousel = extractBetween('// ===== GERMANY CAROUSEL =====', '// ===== HERO TYPEWRITER =====');
const typewriter = extractBetween('// ===== HERO TYPEWRITER =====', '// ===== 3D TILT EFFECT =====');
const tilt = extractBetween('// ===== 3D TILT EFFECT =====', '// ===== BOOTSTRAP =====');
const animationsContent = [introSplash, scrollReveal, carousel, typewriter, tilt].join('\n\n');
fs.writeFileSync(path.join(jsDir, 'animations.js'), animationsContent);
console.log('✅ js/animations.js yaratildi');

// 9. auth-ui.js
const authUiContent = extractBetween('// ===== AUTH UI =====', null); // end of file
fs.writeFileSync(path.join(jsDir, 'auth-ui.js'), authUiContent);
console.log('✅ js/auth-ui.js yaratildi');

// 10. posts.js (Post render, like, form, save, file handle)
const saveSync = extractBetween('// 6. Ma\'lumotlarni saqlash', '// 7. Hero qismini yangilash');
const postRender = extractBetween('// 8. Maqolalarni ko\'rsatish (Render)', '// ===== AUXILIARY VIEWS =====');
const likeHandle = extractBetween('// ===== LIKE HANDLING =====', '// 10. Batafsil ko\'rish (Modal)');
const postDetail = extractBetween('// 10. Batafsil ko\'rish (Modal)', '// 11. Yangi Post Qo\'shish / Tahrirlash Formasi');
const postForm = extractBetween('// 11. Yangi Post Qo\'shish / Tahrirlash Formasi', '// ===== ADMIN PIN AUTHENTICATION =====');
const lightbox = extractBetween('// ===== RASM LIGHTBOX (bosilganda kattalashtirish) =====', '// ===== DOIMIY MUSIQA PLEYERI =====');
const readingTags = extractBetween('// ===== READING TIME & TAGS =====', '// ===== COMMENT REPLY =====');
const commentReply = extractBetween('// ===== COMMENT REPLY =====', '// ===== TEST RESULTS HISTORY =====');

const postsContent = [
    saveSync,
    postRender,
    likeHandle,
    postDetail,
    postForm,
    lightbox,
    commentReply
].join('\n\n');
fs.writeFileSync(path.join(jsDir, 'posts.js'), postsContent);
console.log('✅ js/posts.js yaratildi');

console.log('Barcha modullar ajratildi!');
