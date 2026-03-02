const Tesseract = require("tesseract.js");

async function testOCR() {
    console.log("Starting Tesseract OCR...");
    try {
        const { data: { text } } = await Tesseract.recognize(
            'mock_rx.jpg',
            'eng',
            { logger: m => console.log(m.status, Math.round(m.progress * 100) + "%") }
        );
        console.log("=== Extracted Text ===");
        console.log(text);
    } catch (error) {
        console.error("OCR Failed:", error);
    }
}

testOCR();
