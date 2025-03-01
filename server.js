import express from 'express';
import cors from 'cors';  // cors paketini import ediyoruz
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

// CORS middleware'ini kullan
app.use(cors());
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
    res.send("Kyrax AI Server Çalışıyor! 🚀");
});

// OpenAI yerine Groq API ile sohbet endpointi
app.post('/ask', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: userMessage }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(500).json({ error: errorData.error.message });
        }

        const data = await response.json();
        res.json({ response: data.choices[0].message.content });

    } catch (error) {
        console.error("Bağlantı Hatası:", error);
        res.status(500).json({ error: "Bir hata oluştu, lütfen tekrar deneyin." });
    }
});

app.listen(port, () => {
    console.log(`Kyrax AI server running on http://localhost:${port}`);
});
