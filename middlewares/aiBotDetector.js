// ============================================================
// 3-bosqich himoya: Zamonaviy WAF & AI Bot / Threat Detektori
// Zararli botlar, avtomatik skanerlar, inyeksiyalar (SQLi, XSS, RCE, LFI, SSRF)
// va maxfiy fayllarni skan qiluvchi so'rovlarni aniqlaydi va bloklaydi.
// ============================================================

const MALICIOUS_AGENTS = [
    // Xavfsizlik skanerlari va exploit vositalari
    'sqlmap', 'nikto', 'acunetix', 'havij', 'wpscan', 'masscan', 'zgrab',
    'gobuster', 'dirbuster', 'dirb', 'nmap', 'shodan', 'censys', 'nessus',
    'nuclei', 'httpx', 'ffuf', 'hydra', 'burpcollaborator', 'dirsearch',
    'arachni', 'openvas', 'netsparker', 'qualys', 'whatweb', 'w3af',
    'metasploit', 'zgrab2', 'jaeles', 'wfuzz', 'commix',
    // Zararli va tajovuzkor AI botlar / scraperlar
    'semrushbot', 'ahrefsbot', 'dotbot', 'megaindex', 'mj12bot', 'petalbot', 'bytespider'
];

const BLOCKED_PATHS = [
    /\/\.env(\.|$)/i,
    /\/\.git(\/|$)/i,
    /\/\.aws(\/|$)/i,
    /\/\.ssh(\/|$)/i,
    /\/\.svn(\/|$)/i,
    /\/\.hg(\/|$)/i,
    /\/\.docker(\/|$)/i,
    /\/\.vscode(\/|$)/i,
    /\/\.idea(\/|$)/i,
    /\/\.ds_store/i,
    /\/actuator(\/|$)/i,
    /\/swagger-ui(\/|$)/i,
    /\/openapi\.(json|yaml|yml)/i,
    /\/wp-(admin|login|config|includes|content)/i,
    /\/xmlrpc\.php/i,
    /\/phpmyadmin/i,
    /\/adminer/i,
    /\/eval-stdin\.php/i,
    /\/phpinfo\.php/i,
    /\/setup\.php/i,
    /\/install\.php/i,
    /\/(etc|proc|var|sys)\//i,
    /\/web\.config/i,
    /\/config\.(json|yaml|yml|ini)/i,
    /\.(bak|backup|old|save|swp|tmp|temp|orig|sql|tar|gz|zip|7z|rar|pem|key|crt)$/i,
    /(id_rsa|id_ed25519|credentials|authorized_keys)/i
];

const INJECTION_PATTERNS = [
    // XSS (Cross-Site Scripting)
    /(<script|javascript:|vbscript:|data:text\/html|<iframe|<object|<embed|<svg[^>]*onload|<img[^>]*onerror|document\.(cookie|location)|window\.location|expression\s*\()/i,
    // SQL Injection (Klassik va Blind)
    /(union\s+(all\s+)?select|select\s+.*\s+from|insert\s+into|drop\s+table|update\s+.*\s+set|delete\s+from|exec\s*\(|benchmark\s*\(|waitfor\s+delay|sleep\s*\(|\b(or|and)\b\s+['"\d]\s*=\s*['"\d])/i,
    // Path Traversal va LFI
    /(\.\.\/|\.\.\\|%2e%2e|\/etc\/(passwd|shadow)|boot\.ini|win\.ini)/i,
    // RCE (Remote Code Execution) va Command Injection
    /(\b(system|passthru|exec|shell_exec|popen|proc_open)\s*\(|;\s*(cat|ls|whoami|curl|wget|nc|bash|sh|powershell|cmd)\b|\$\([^\)]+\)|`[^`]+`)/i,
    // SSRF (Server-Side Request Forgery)
    /(169\.254\.169\.254|metadata\.google\.internal)/i,
    // CRLF Injection (HTTP Response Splitting)
    /(%0d%0a|\r\n)/i
];

function checkStringForInjection(str) {
    if (!str || typeof str !== 'string') return null;
    for (const pattern of INJECTION_PATTERNS) {
        if (pattern.test(str)) {
            return pattern;
        }
    }
    return null;
}

const aiBotDetector = (req, res, next) => {
    const userAgent = ((req.get ? req.get('User-Agent') : req.headers?.['user-agent']) || '').toLowerCase();
    const headers = req.headers || {};
    const clientIp = headers['cf-connecting-ip'] || req.ip || headers['x-forwarded-for'] || (req.socket && req.socket.remoteAddress) || 'unknown';
    let originalUrl = '';
    try {
        originalUrl = decodeURIComponent(req.originalUrl || req.url || '');
    } catch (_) {
        originalUrl = req.originalUrl || req.url || '';
    }

    // 1. Zararli skanerlar va exploit botlarini aniqlash
    const isMaliciousScanner = MALICIOUS_AGENTS.some(scanner => userAgent.includes(scanner));
    if (isMaliciousScanner) {
        console.warn(`🛑 [WAF BLOKLANDI] Zararli vosita/bot aniqlandi: [${userAgent}] IP: [${clientIp}]`);
        return res.status(403).json({
            ok: false,
            error: "Xavfsizlik protokoli: So'rov rad etildi (Malicious Agent Detected)."
        });
    }

    // 2. Maxfiy fayllar, konfiguratsiyalar va zaifliklarni skan qilish
    const isProbingSensitive = BLOCKED_PATHS.some(pattern => pattern.test(originalUrl));
    if (isProbingSensitive) {
        console.warn(`🛑 [WAF BLOKLANDI] Himoyalangan resursga so'rov: [${originalUrl}] IP: [${clientIp}]`);
        return res.status(403).json({
            ok: false,
            error: "Xavfsizlik protokoli: Ruxsat berilmagan resurs."
        });
    }

    // 3. URL va Query parametrlari bo'yicha chuqur inyeksiya tekshiruvi
    const urlInjection = checkStringForInjection(originalUrl);
    if (urlInjection) {
        console.warn(`🛑 [WAF BLOKLANDI] Inyeksiya namunasi (URL): [${originalUrl}] IP: [${clientIp}]`);
        return res.status(400).json({
            ok: false,
            error: "Xavfsizlik protokoli: Noto'g'ri yoki xavfli so'rov aniqlandi."
        });
    }

    // 4. Request Body bo'yicha inyeksiya tekshiruvi (agar mavjud bo'lsa va admin post yaratish bo'lmasa)
    if (req.body && typeof req.body === 'object' && !req.path.startsWith('/api/admin/posts')) {
        const checkObject = (obj, depth = 0) => {
            if (depth > 5 || !obj) return null;
            for (const key of Object.keys(obj)) {
                const val = obj[key];
                if (typeof val === 'string') {
                    const match = checkStringForInjection(val);
                    if (match) return val;
                } else if (typeof val === 'object') {
                    const res = checkObject(val, depth + 1);
                    if (res) return res;
                }
            }
            return null;
        };
        const bodyInjection = checkObject(req.body);
        if (bodyInjection) {
            console.warn(`🛑 [WAF BLOKLANDI] Inyeksiya namunasi (Body): IP: [${clientIp}]`);
            return res.status(400).json({
                ok: false,
                error: "Xavfsizlik protokoli: Ruxsat etilmagan simvollar yoki parametrlar."
            });
        }
    }

    next();
};

module.exports = aiBotDetector;
