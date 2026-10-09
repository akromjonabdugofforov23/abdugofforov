const helmet = require('helmet');

// 2-bosqich himoya: Helmet 
// Express.js xavfsizlik teshiklarini yopadi, sayt sarlavhalarini (HTTP Headers) to'g'rilaydi.
// Cross-Site Scripting (XSS) va ma'lumot o'g'irlanishining oldini oladi.
const helmetMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"],
            objectSrc: ["'none'"],
            workerSrc: ["'self'", "blob:"],
            manifestSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://static.cloudflareinsights.com",
                "https://cdnjs.cloudflare.com",
                "https://cdn.jsdelivr.net",
                "https://challenges.cloudflare.com",
                "https://telegram.org"
            ],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            mediaSrc: ["'self'", "data:", "blob:"],
            frameSrc: [
                "https://www.youtube-nocookie.com",
                "https://www.youtube.com",
                "https://challenges.cloudflare.com",
                "https://oauth.telegram.org"
            ],
            connectSrc: [
                "'self'",
                "https://abdugofforov.uz",
                "https://*.abdugofforov.uz",
                "https://ipapi.co",
                "https://api.open-meteo.com",
                "https://cloudflareinsights.com",
                "https://oauth.telegram.org"
            ],
            upgradeInsecureRequests: [],
            reportUri: ['/csp-report']
        }
    },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "same-site" },
    crossOriginEmbedderPolicy: { policy: "credentialless" },
    dnsPrefetchControl: { allow: false },
    originAgentCluster: true,
    permittedCrossDomainPolicies: { permittedPolicies: "none" },
    hsts: {
        maxAge: 63072000, // 2 yil (HSTS Preload tavsiyasi)
        includeSubDomains: true,
        preload: true
    },
    xFrameOptions: { action: 'deny' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

const securityLayer2 = (req, res, next) => {
    helmetMiddleware(req, res, () => {
        res.setHeader('X-XSS-Protection', '0');
        res.setHeader('Permissions-Policy', 'accelerometer=(), autoplay=(), camera=(), cross-origin-isolated=(), display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(self), screen-wake-lock=(), sync-xhr=(), usb=(), xr-spatial-tracking=()');
        res.setHeader('Reporting-Endpoints', 'csp-endpoint="https://abdugofforov.uz/csp-report"');
        next();
    });
};

module.exports = securityLayer2;
