const helmet = require('helmet');

// 2-bosqich himoya: Helmet 
// Express.js xavfsizlik teshiklarini yopadi, sayt sarlavhalarini (HTTP Headers) to'g'rilaydi.
// Cross-Site Scripting (XSS) va ma'lumot o'g'irlanishining oldini oladi.
const securityLayer2 = helmet();

module.exports = securityLayer2;
