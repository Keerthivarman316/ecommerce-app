const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash';

const chat = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        const url = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

        const body = {
            contents: [{
                parts: [{
                    text: `You are a helpful shopping assistant for LootBay, a gaming PC e-commerce store. 
Help users find products, answer questions about PC building, and assist with orders. 
Keep responses concise and friendly.

User: ${message}`
                }]
            }]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('Gemini API error:', err);
            return res.status(500).json({ error: 'AI service error', details: err });
        }

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
        res.json({ reply });

    } catch (err) {
        console.error('Chat controller error:', err.message);
        res.status(500).json({ error: 'AI service unavailable', details: err.message });
    }
};

module.exports = { chat };