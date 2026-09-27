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

// Micro-Tools & Dev Utilities
router.get(['/tools', '/tools/'], (req, res) => {
    res.sendFile(path.join(__dirname, '../tools.html'));
});

// Interaktiv CV & Portfolio
router.get(['/cv', '/cv/'], (req, res) => {
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
