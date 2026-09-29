/**
 * ============================================================
 * ABDUGOFFOROV AI ROUTES (Gemini Integratsiyasi)
 * Interaktiv chat, nemis tili AI ustozi, va matn tahlili
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const { generateContent } = require('../services/gemini');
const { optionalAuth } = require('../middlewares/auth');

router.use(optionalAuth);

// 1. Umumiy savol-javob AI chat
router.post('/chat', async (req, res) => {
    try {
        const { message, context } = req.body || {};
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ ok: false, error: "Xabar matni talab qilinadi" });
        }

        const systemInstruction = "Siz 'Kay Kundaligi' va Abdugofforov ta'lim platformasining samimiy, intellektual AI yordamchisisiz. Foydalanuvchilarga do'stona, o'zbek tilida aniq va lo'nda javob bering.";
        const reply = await generateContent(message.trim(), systemInstruction);

        res.json({ ok: true, reply });
    } catch (e) {
        res.status(500).json({ ok: false, error: "AI xizmatida xatolik yuz berdi" });
    }
});

// 2. Nemis tili o'rganish bo'yicha maxsus AI ustozi
router.post('/german-tutor', async (req, res) => {
    try {
        const { query, level } = req.body || {};
        if (!query) {
            return res.status(400).json({ ok: false, error: "Savol yoki gap kiritilishi shart" });
        }

        const userLevel = level || 'A1';
        const systemInstruction = `Siz tajribali nemis tili o'qituvchisisiz. Talabaning darajasi: ${userLevel}. Foydalanuvchining nemischa gapidagi grammatik xatolarini ko'rsating, to'g'ri variantini tushuntiring va o'zbek tilida aniq qoidalar keltiring.`;

        const reply = await generateContent(query.trim(), systemInstruction);
        res.json({ ok: true, reply });
    } catch (e) {
        res.status(500).json({ ok: false, error: "AI ustozida xatolik" });
    }
});

// 3. Matn yoki hikoyani qisqartirish (Summarize)
router.post('/summarize', async (req, res) => {
    try {
        const { text } = req.body || {};
        if (!text || text.length < 20) {
            return res.status(400).json({ ok: false, error: "Kamida 20 ta belgidan iborat matn kiriting" });
        }

        const systemInstruction = "Berilgan matnning asosiy mazmunini 3 ta qisqa xulosaga keltirib bering.";
        const reply = await generateContent(text.slice(0, 4000), systemInstruction);

        res.json({ ok: true, summary: reply });
    } catch (e) {
        res.status(500).json({ ok: false, error: "Matnni tahlil qilishda xatolik" });
    }
});

module.exports = router;
