const express = require('express');
const router = express.Router();
const path = require('path');

// Asosiy sahifa (Frontend) uchun marshrut
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Deutsch akademiyasi
router.get(['/deutsch', '/deutsch/'], (req, res) => {
    res.sendFile(path.join(__dirname, '../deutsch.html'));
});

const ADMIN_GATE_KEY = 'kay_admin_7904cc18';

function hasAdminGateLocal(req) {
    if (req.query.gate === ADMIN_GATE_KEY) return true;
    const cookies = req.headers.cookie || '';
    if (cookies.includes(`kay_admin_gate=${ADMIN_GATE_KEY}`)) return true;
    return false;
}

// Micro-Tools & Dev Utilities (Faqat admin uchun — skanerlar uchun 404)
router.get(['/tools', '/tools/', '/tools.html'], (req, res) => {
    if (!hasAdminGateLocal(req)) {
        return res.status(404).type('text/plain').send('404 Not Found');
    }
    res.cookie('kay_admin_gate', ADMIN_GATE_KEY, { maxAge: 86400000, httpOnly: true, sameSite: 'lax' });
    res.sendFile(path.join(__dirname, '../tools.html'));
});

// Interaktiv CV & Portfolio (Faqat admin uchun — skanerlar uchun 404)
router.get(['/cv', '/cv/', '/cv.html'], (req, res) => {
    if (!hasAdminGateLocal(req)) {
        return res.status(404).type('text/plain').send('404 Not Found');
    }
    res.cookie('kay_admin_gate', ADMIN_GATE_KEY, { maxAge: 86400000, httpOnly: true, sameSite: 'lax' });
    res.sendFile(path.join(__dirname, '../cv.html'));
});

// API tekshirish uchun test marshruti
router.get('/api/status', (req, res) => {
    res.json({
        status: "success",
        message: "Sayt va xavfsizlik qatlamlari a'lo darajada ishlamoqda!",
        ai_module: "Ready for integration"
    });
});

module.exports = router;
