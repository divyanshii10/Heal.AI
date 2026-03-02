const axios = require("axios");
require("dotenv").config();

async function testGroq() {
    const rawText = "WELLNESS MEDICAL CENTER Dr. Sarah Mitchell, MD, FACP Internal Medicine License #: MED12345 123 Healthcare Ave, Medical MC 12345 Phone: (555) 123-4567 Email: dr.mitchell@wellnessmedical.com Date: 2026-03-02 PATIENT INFORMATION Name: Lana Del rey Age: 45 years Gender: Female Weight: 50 kg Diagnosis: Upper Respiratory R PRESCRIPTION 1. Amoxicillin Dosage: 500mg Frequency: Three times daily Duration: 10 days Instructions: Complete entire course Prescribed by: Dr. Sarah Mitchell";

    const prompt = `You are a medical AI assistant. Analyze the following text extracted from a prescription via OCR: "${rawText}".
Identify any likely symptoms, diagnoses, or medications from this text. Based strictly on the medical context found in the text, predict the single most likely condition or disease.
Respond ONLY with a raw JSON object (no markdown, no backticks) in the following format:
{
  "detected_symptoms": ["list", "of", "symptoms", "or", "medications"],
  "predicted_disease": "Name of the condition",
  "confidence": 85
}`;

    try {
        const groqResponse = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                temperature: 0.1,
                // response_format: { type: "json_object" }, // Enforce JSON Object
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

        let llmContent = groqResponse.data.choices[0].message.content;
        console.log("Raw LLM output:", llmContent);

        llmContent = llmContent.replace(/```json/g, "").replace(/```/g, "").trim();
        const llmResult = JSON.parse(llmContent);
        console.log("Parsed JSON:", llmResult);

    } catch (err) {
        console.error("Error:", err.message);
        if (err.response) console.error(err.response.data);
    }
}

testGroq();
