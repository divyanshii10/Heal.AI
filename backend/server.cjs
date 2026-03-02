const path = require("path");
const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs/promises");
const Tesseract = require("tesseract.js");

const axios = require("axios");
require("dotenv").config();

const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

/* ===============================
   MIDDLEWARE
================================ */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://heal-ai-n770.onrender.com",
    "https://heal-ai-1-dkr8.onrender.com"
  ],
}));

app.use(express.json());

/* ===============================
   HEALTH CHECK (IMPORTANT)
================================ */
app.get("/health", (_, res) => {
  res.json({ status: "Backend running ✅" });
});

/* ===============================
   CHATBOT ROUTE
================================ */
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `
You are Heal.AI — a calm, empathetic health assistant.
You do NOT diagnose or prescribe.
You provide emotional support, guidance, and encourage professional help.
            `,
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    res.json({
      reply: response.data.choices[0].message.content,
    });
  } catch (err) {
    console.error("❌ Chat error:", err?.response?.data || err.message);
    res.status(500).json({ error: "AI failed to respond" });
  }
});

/* ===============================
   SYMPTOM PREDICTION ROUTE
================================ */
app.post('/api/predict', async (req, res) => {
  try {
    console.log("📥 Incoming request body:", req.body);

    const { symptoms, duration, severity } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ error: "No symptoms provided" });
    }

    const baseDir = path.resolve(__dirname);
    const userDataPath = path.join(baseDir, 'user_data.json');

    await fs.writeFile(
      userDataPath,
      JSON.stringify({ symptoms, duration, severity }, null, 2)
    );

    console.log("✅ user_data.json written");

    await new Promise((resolve, reject) => {
      exec('python predict_from_json.py', { cwd: baseDir }, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const result = await fs.readFile(
      path.join(baseDir, 'predicted.json'),
      'utf-8'
    );

    res.json(JSON.parse(result));
  } catch (err) {
    console.error("❌ Backend error:", err);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

/* ===============================
   PRESCRIPTION OCR ROUTE
================================ */
app.post("/api/process-prescription", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }

  const imagePath = req.file.path;

  try {
    console.log("Starting Tesseract OCR on:", imagePath);
    // 1. Run Native Node OCR (Tesseract.js) to bypass Python/Render memory limits
    const { data: { text: rawText } } = await Tesseract.recognize(
      imagePath,
      'eng'
    );

    // Clean up uploaded file
    await fs.unlink(imagePath).catch(console.error);

    if (!rawText || rawText.length < 3) {
      return res.json({
        extracted_text: rawText || "None",
        detected_symptoms: [],
        predicted_disease: "No text detected",
        confidence: 0
      });
    }

    console.log("OCR Success, extracted length:", rawText.length);

    // 2. Pass extracted text to Groq API to predict disease
    const prompt = `You are a medical AI assistant. Analyze the following text extracted from a prescription via OCR: "${rawText}".
Identify any likely symptoms, diagnoses, or medications from this text. Based strictly on the medical context found in the text, predict the single most likely condition or disease.
Respond ONLY with a raw JSON object (no markdown, no backticks) in the following format:
{
  "detected_symptoms": ["list", "of", "symptoms", "or", "medications"],
  "predicted_disease": "Name of the condition",
  "confidence": 85
}`;

    const groqResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        temperature: 0.1, // Low temperature for consistent JSON
        messages: [
          { role: "system", content: "You strictly output raw JSON only." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    // Parse JSON from LLM
    let llmContent = groqResponse.data.choices[0].message.content;
    llmContent = llmContent.replace(/```json/g, "").replace(/```/g, "").trim();
    const llmResult = JSON.parse(llmContent);

    // Merge OCR text and LLM prediction to send to frontend
    res.json({
      extracted_text: rawText,
      detected_symptoms: llmResult.detected_symptoms || [],
      predicted_disease: llmResult.predicted_disease || "Unknown",
      confidence: llmResult.confidence || 0
    });

  } catch (err) {
    console.error("❌ Invalid output from pipeline:", err);
    // Ensure file is deleted even if it fails
    fs.unlink(imagePath).catch(() => { });
    res.status(500).json({ error: "Failed to analyze prescription with AI" });
  }
});



/* ===============================
   SERVER START
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});

