const axios = require("axios");
require("dotenv").config();

async function testGroqVision() {
    try {
        // 1x1 transparent png
        const image2base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

        console.log("Testing Groq Vision API...");
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.2-90b-vision-preview",
                temperature: 0.1,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Extract all text from this prescription."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/png;base64,${image2base64}`
                                }
                            }
                        ]
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`
                }
            }
        );

        console.log("VISION SUCCESS. Output:");
        console.log(response.data.choices[0].message.content);
    } catch (err) {
        console.error("VISION FAILED:", err.response ? err.response.data : err.message);
    }
}

testGroqVision();
