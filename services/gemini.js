/**
 * ============================================================
 * GOOGLE GEMINI AI SERVICE
 * To'g'ridan-to'g'ri Google Gemini REST API bilan ulanuvchi
 * nol-qaramlikli (zero-dependency) yuqori tezlikdagi modul.
 * ============================================================
 */

const https = require('https');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

async function generateContent(prompt, systemInstruction = '') {
    if (!GEMINI_API_KEY) {
        return getMockAIResponse(prompt, systemInstruction);
    }

    return new Promise((resolve, reject) => {
        const payload = {
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ]
        };

        if (systemInstruction) {
            payload.systemInstruction = {
                parts: [{ text: systemInstruction }]
            };
        }

        const dataString = JSON.stringify(payload);
        const options = {
            hostname: 'generativelanguage.googleapis.com',
            port: 443,
            path: `/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(dataString)
            },
            timeout: 15000
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', chunk => { responseData += chunk; });
            res.on('end', () => {
                try {
                    const json = JSON.parse(responseData);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        const candidate = json.candidates?.[0]?.content?.parts?.[0]?.text;
                        resolve(candidate || "Kechirasiz, javob matni topilmadi.");
                    } else {
                        console.warn("Gemini API qaytargan xatolik:", json.error?.message || responseData);
                        resolve(getMockAIResponse(prompt, systemInstruction));
                    }
                } catch (e) {
                    resolve(getMockAIResponse(prompt, systemInstruction));
                }
            });
        });

        req.on('error', (err) => {
            console.warn("Gemini so'rovida tarmoq xatosi:", err.message);
            resolve(getMockAIResponse(prompt, systemInstruction));
        });

        req.on('timeout', () => {
            req.destroy();
            resolve(getMockAIResponse(prompt, systemInstruction));
        });

        req.write(dataString);
        req.end();
    });
}

function getMockAIResponse(prompt, systemInstruction) {
    if (systemInstruction.includes('Nemis') || prompt.toLowerCase().includes('deutsch') || prompt.toLowerCase().includes('nemis')) {
        return `🇩🇪 [Kay AI Nemis Tili Ustasi]\nSizning savolingiz: "${prompt.slice(0, 80)}..."\n\nMaslahat: Nemis tilida grammatika va so'z tartibini o'rganishda artikllar (der, die, das) va fe'lning gapdagi 2-o'rinda kelish qoidasiga doim e'tibor bering.\n(Eslatma: To'liq jonli javoblar uchun server muhitida GEMINI_API_KEY o'rnatilgan bo'lishi kerak).`;
    }
    return `🤖 [Kay AI Assistent]\nSo'rovingiz qabul qilindi. Siz: "${prompt.slice(0, 80)}..." haqida so'radingiz.\n\nSayt va ta'lim loyihasi bo'yicha maslahat berishga doim tayyorman!`;
}

module.exports = {
    generateContent
};
