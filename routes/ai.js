/**
 * ============================================================
 * ABDUGOFFOROV AI ROUTES (O'chirilgan)
 * Foydalanuvchi talabiga ko'ra sun'iy intellekt xizmati to'liq to'xtatilgan.
 * ============================================================
 */

const express = require('express');
const router = express.Router();

router.use((req, res) => {
    res.status(404).json({ ok: false, error: "AI moduli saytdan olib tashlangan" });
});

module.exports = router;

