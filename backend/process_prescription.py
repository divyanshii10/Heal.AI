import sys
import json
import cv2
import easyocr
import re
import warnings

warnings.filterwarnings('ignore')

# Mapping of common diagnoses or medications to their likely symptoms present in the model features
SYMPTOM_MAPPING = {
    # Diagnoses
    'upper respiratory': ['cough', 'fever', 'sore throat', 'runny nose', 'congestion'],
    'respiratory infection': ['cough', 'fever', 'sore throat', 'runny nose'],
    'bronchitis': ['cough', 'fever', 'chest tightness', 'shortness of breath'],
    'hypertension': ['headache', 'dizziness', 'chest pain'],
    'diabetes': ['increased thirst', 'frequent urination', 'fatigue', 'weight loss'],
    'migraine': ['headache', 'nausea', 'vomiting', 'photophobia'],
    'allergies': ['sneezing', 'runny nose', 'itching', 'rash'],
    'asthma': ['wheezing', 'shortness of breath', 'chest tightness', 'cough'],
    'gastroenteritis': ['diarrhea', 'nausea', 'vomiting', 'abdominal pain'],
    'uti': ['burning with urination', 'frequent urination', 'pelvic pain'],
    'urinary tract infection': ['burning with urination', 'frequent urination', 'pelvic pain'],
    'arthritis': ['joint pain', 'joint stiffness', 'swelling'],
    'anemia': ['fatigue', 'weakness', 'dizziness'],
    'depression': ['depression', 'fatigue', 'loss of appetite', 'trouble sleeping'],
    'anxiety': ['anxiety and nervousness', 'palpitations', 'sweating', 'restlessness'],
    
    # Medications (antibiotics often imply infection/fever)
    'amoxicillin': ['fever', 'cough', 'sore throat'],
    'azithromycin': ['fever', 'cough', 'sore throat'],
    'ciprofloxacin': ['fever', 'abdominal pain', 'burning with urination'],
    'ibuprofen': ['pain', 'fever', 'headache'],
    'acetaminophen': ['pain', 'fever', 'headache'],
    'paracetamol': ['pain', 'fever', 'headache'],
    'lisinopril': ['hypertension', 'chest pain'],
    'metformin': ['increased thirst', 'frequent urination'],
    'albuterol': ['wheezing', 'shortness of breath', 'cough'],
    'omeprazole': ['heartburn', 'indigestion', 'epigastric pain'],
    'cetirizine': ['runny nose', 'itching', 'sneezing'],
    'loratadine': ['runny nose', 'itching', 'sneezing'],
}


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

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_symptoms(text, feature_list):
    detected_symptoms = set()
    cleaned_text = text.lower()
    
    # 1. Direct feature matching (exact or high fuzzy match)
    for feature in feature_list:
        if feature in cleaned_text:
            detected_symptoms.add(feature)
            continue
            
        score = fuzz.partial_ratio(feature, cleaned_text)
        if score > 85: # High threshold for partial match
            detected_symptoms.add(feature)
            
    # 2. Indirect matching via Diagnoses & Medications Mapping
    for keyword, mapped_symptoms in SYMPTOM_MAPPING.items():
        if keyword in cleaned_text:
            for mapped_sym in mapped_symptoms:
                if mapped_sym in feature_list: # Ensure mapped symptom is in our trained features
                    detected_symptoms.add(mapped_sym)
        else:
            # Fuzzy match mapping keywords as well, in case of OCR errors
            if fuzz.partial_ratio(keyword, cleaned_text) > 90:
                for mapped_sym in mapped_symptoms:
                    if mapped_sym in feature_list:
                        detected_symptoms.add(mapped_sym)
            
    return list(detected_symptoms)

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
