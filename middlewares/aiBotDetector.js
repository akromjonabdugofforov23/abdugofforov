// ============================================================
// 3-bosqich himoya: WAF & AI Bot / Threat Detektori
// Zararli botlar, avtomatik skanerlar, inyeksiyalar va
// maxfiy fayllarni qidiruvchi so'rovlarni aniqlaydi va bloklaydi.
// ============================================================

const MALICIOUS_AGENTS = [
    'sqlmap',
    'nikto',
    'acunetix',
    'havij',
    'wpscan',
    'masscan',
    'zgrab',
    'gobuster',
    'dirbuster',
    'dirb',
    'nmap',
    'shodan',
    'censys',
    'nessus'
];

const BLOCKED_PATHS = [
    /\/\.env/i,
    /\/\.git/i,
    /\/\.aws/i,
    /\/wp-(admin|login|config|includes)/i,
    /\/xmlrpc\.php/i,
    /\/phpmyadmin/i,
    /\/eval-stdin\.php/i,
    /\/(etc|proc|var)\//i,
    /\/config\.(json|yaml|yml|ini)/i,
    /\.bak$/i,
    /\.sql$/i
];

const INJECTION_PATTERNS = [
    /(<script|javascript:|<iframe|<object)/i,
    /(union\s+select|select\s+.*\s+from|insert\s+into|drop\s+table)/i,
    /(\.\.\/|\.\.\\|%2e%2e)/i
];

const aiBotDetector = (req, res, next) => {
    const userAgent = (req.get('User-Agent') || '').toLowerCase();
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const originalUrl = decodeURIComponent(req.originalUrl || req.url || '');

    // 1. User-Agent mavjud emasligi yoki qora ro'yxatdagi skanerlar
    if (!userAgent) {
        console.warn(`⚠️ [WAF] User-Agent mavjud bo'lmagan so'rov: IP [${clientIp}] URL [${req.method} ${req.url}]`);
    }

    const isMaliciousScanner = MALICIOUS_AGENTS.some(scanner => userAgent.includes(scanner));
    if (isMaliciousScanner) {
        console.warn(`🛑 [WAF BLOKLANDI] Zararli skaner aniqlandi: [${userAgent}] IP: [${clientIp}]`);
        return res.status(403).json({
            ok: false,
            error: "Xavfsizlik protokoli: So'rov rad etildi (Malicious Agent Detected)."
        });
    }

    // 2. Maxfiy fayllar va zaifliklarni skan qilishga urinishlar
    const isProbingSensitive = BLOCKED_PATHS.some(pattern => pattern.test(originalUrl));
    if (isProbingSensitive) {
        console.warn(`🛑 [WAF BLOKLANDI] Maxfiy yo'lga so'rov: [${originalUrl}] IP: [${clientIp}]`);
        return res.status(403).json({
            ok: false,
            error: "Xavfsizlik protokoli: Ruxsat berilmagan resurs."
        });
    }

    // 3. Path Traversal va Inyeksiya belgilari
    const hasInjection = INJECTION_PATTERNS.some(pattern => pattern.test(originalUrl));
    if (hasInjection) {
        console.warn(`🛑 [WAF BLOKLANDI] Inyeksiya/Traversal namunasi: [${originalUrl}] IP: [${clientIp}]`);
        return res.status(400).json({
            ok: false,
            error: "Xavfsizlik protokoli: Noto'g'ri yoki xavfli so'rov."
        });
    }

    next();
};

module.exports = aiBotDetector;
