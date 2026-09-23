const helmet = require('helmet');

// 2-bosqich himoya: Helmet 
// Express.js xavfsizlik teshiklarini yopadi, sayt sarlavhalarini (HTTP Headers) to'g'rilaydi.
// Cross-Site Scripting (XSS) va ma'lumot o'g'irlanishining oldini oladi.
const securityLayer2 = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"],
            objectSrc: ["'none'"],
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
            upgradeInsecureRequests: []
        }
    },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "same-site" }
});

module.exports = securityLayer2;
