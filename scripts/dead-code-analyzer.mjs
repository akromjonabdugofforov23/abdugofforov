import fs from 'fs';
import path from 'path';

// O'lik kodni (dead code) analiz qiluvchi sodda skript

const jsDir = path.join(process.cwd(), 'js');
const isFixMode = process.argv.includes('--fix');

const DEAD_ITEMS = [
    { name: 'openMobileMenu', type: 'function', file: 'navigation.js' },
    { name: 'closeMobileMenu', type: 'function', file: 'navigation.js' },
    { name: 'toggleMusicGroup', type: 'function', file: 'posts.js' },
    { name: 'heroMainTitle', type: 'variable', file: 'state.js' },
    { name: 'runTypewriter', type: 'function', file: 'animations.js' },
    { name: 'initHeroCta', type: 'function', file: 'animations.js' },
    { name: 'defaultPosts', type: 'variable', file: 'state.js' },
    { name: 'refreshParticlesTheme', type: 'function', file: 'theme.js' }
];

console.log('🔍 Dead Code Analyzer ishga tushdi...');

let totalRemoved = 0;

if (isFixMode) {
    console.log('🛠️  Fix rejimi yoqilgan. O\\'lik kodlar o\\'chiriladi.\\n');
}

for (const item of DEAD_ITEMS) {
    const filePath = path.join(jsDir, item.file);
    if (!fs.existsSync(filePath)) {
        continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    
    if (content.includes(item.name)) {
        if (isFixMode) {
            let newContent = content;
            if (item.type === 'function') {
                const funcRegex = new RegExp(`function\\s+${item.name}\\s*\\([^)]*\\)\\s*\\{[^}]*\\}`, 'g');
                newContent = newContent.replace(funcRegex, '');
                const globalRegex = new RegExp(`window\\.${item.name}\\s*=\\s*${item.name};?`, 'g');
                newContent = newContent.replace(globalRegex, '');
            } else if (item.type === 'variable') {
                const varRegex = new RegExp(`(?:let|const|var|window\\.)\\s*${item.name}\\s*=[^;]+;`, 'g');
                newContent = newContent.replace(varRegex, '');
            }
            
            if (newContent !== content) {
                fs.writeFileSync(filePath, newContent, 'utf-8');
                console.log(`✅ O'chirildi: ${item.name} (${item.file})`);
                totalRemoved++;
            }
        } else {
            console.log(`❌ O'lik kod topildi: ${item.name} (${item.file})`);
        }
    }
}

if (isFixMode) {
    console.log(`\\n🎉 Jami ${totalRemoved} ta o'lik element o'chirildi!`);
} else {
    console.log(`\\n💡 Ularni avtomatik o'chirish uchun: node scripts/dead-code-analyzer.mjs --fix`);
}
