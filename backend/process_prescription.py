import sys
import json
import cv2
import easyocr
import re
import warnings

warnings.filterwarnings('ignore')


def preprocess_image(image_path):
    # Read image
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image from {image_path}")
    
    # Grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Resize to improve OCR (upscale if small)
    # height, width = gray.shape
    # gray = cv2.resize(gray, (width * 2, height * 2), interpolation=cv2.INTER_CUBIC)
    
    # Denoise
    denoised = cv2.fastNlMeansDenoising(gray, h=10)
    
    # Thresholding
    # _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    return denoised

def extract_text(image):
    reader = easyocr.Reader(['en'], gpu=False, verbose=False)
    results = reader.readtext(image, detail=0)
    return ' '.join(results)

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        sys.exit(1)
        
    image_path = sys.argv[1]
    
    try:
        # 1. Preprocess
        processed_img = preprocess_image(image_path)
        
        # 2. Extract Text
        raw_text = extract_text(processed_img)
        
        # 3. Output only the text for Node.js (Groq LLM handles the rest)
        output = {
            "extracted_text": raw_text
        }
        
        print(json.dumps(output))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
