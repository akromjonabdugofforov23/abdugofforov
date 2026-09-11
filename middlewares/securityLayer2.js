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
                "https://static.cloudflareinsights.com",
                "https://cdnjs.cloudflare.com",
                "https://cdn.jsdelivr.net",
                "https://challenges.cloudflare.com"
            ],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            mediaSrc: ["'self'", "data:", "blob:"],
            frameSrc: [
                "https://www.youtube-nocookie.com",
                "https://www.youtube.com",
                "https://challenges.cloudflare.com"
            ],
            connectSrc: [
                "'self'",
                "https://api.open-meteo.com",
                "https://cloudflareinsights.com"
            ]
        }
    },
    crossOriginOpenerPolicy: { policy: "same-origin" }
});

module.exports = securityLayer2;
