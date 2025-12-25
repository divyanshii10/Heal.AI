<h1>🧠 Heal.AI – Smart Health Assistant</h1>

<p>
🚀 <b>Live Demo:</b>
<a href="https://heal-ai-n770.onrender.com" target="_blank">
https://heal-ai-n770.onrender.com
</a>
</p>

<p>
Heal.AI is an AI-powered healthcare assistant designed to help users understand their symptoms,
analyze medical prescriptions, and get intelligent health insights using Machine Learning and NLP.
The platform integrates <b>image analysis</b>, <b>symptom prediction</b>, and
<b>AI-driven assistance</b> into a single web application.
</p>

<hr/>

<h2>✨ Key Features</h2>

<h3>🔍 Symptom Analysis</h3>
<ul>
  <li>Users can enter symptoms manually</li>
  <li>AI model predicts possible health conditions</li>
  <li>Intelligent suggestions based on trained ML models</li>
</ul>

<h3>🖼️ Prescription Image Analysis (OCR)</h3>
<ul>
  <li>Upload medical prescription images</li>
  <li>Extract text from images using OCR</li>
  <li>Identify symptoms, medicines, and medical terms</li>
</ul>

<h3>🤖 AI-Powered Assistance</h3>
<ul>
  <li>Smart chatbot for health-related queries</li>
  <li>Helps users understand prescriptions and symptoms</li>
  <li>Fast, interactive, and easy to use</li>
</ul>

<h3>🌐 Full-Stack Deployment</h3>
<ul>
  <li>Frontend + Backend + ML integrated</li>
  <li>Deployed on Render with a single live link</li>
</ul>

<hr/>

<h2>🛠️ Tech Stack</h2>

<h3>Frontend</h3>
<ul>
  <li>React (Vite)</li>
  <li>Tailwind CSS</li>
  <li>Framer Motion</li>
</ul>

<h3>Backend</h3>
<ul>
  <li>Node.js</li>
  <li>Express.js</li>
  <li>REST APIs</li>
  <li>Python script integration</li>
</ul>

<h3>Machine Learning & Image Processing</h3>
<ul>
  <li>Python</li>
  <li>NumPy, Pandas</li>
  <li>Scikit-learn</li>
  <li>Tesseract OCR</li>
  <li>OpenCV</li>
  <li>Joblib</li>
</ul>

<hr/>

<h2>🧩 System Architecture</h2>

<pre>
User
 ↓
Frontend (React)
 ↓
Backend (Node + Express)
 ↓
Python Scripts (ML + OCR)
 ↓
Prediction / Extracted Symptoms
 ↓
Response to User
</pre>



<h2>📂 Project Structure</h2>

<pre>
└── 📁frontend
    └── 📁src
        └── 📁components
            ├── Footer.tsx
            ├── Hero.tsx
            ├── Navbar.tsx
        └── 📁pages
            ├── Chatbot.tsx
            ├── FAQ.tsx
            ├── Features.tsx
            ├── HomePage.tsx
            ├── ImageUploader.tsx
            ├── SymptomsAnalysis.tsx
        ├── App.tsx
        ├── config.ts
        ├── icons8-health-16.png
        ├── index.css
        ├── main.tsx
        ├── vite-env.d.ts
└── 📁backend
    ├── .env
    ├── .gitignore
    ├── dataset_symptoms.zip
    ├── Dockerfile
    ├── label_encoder.pkl
    ├── logistic_regression_model.pkl
    ├── model_features.pkl
    ├── model_training.py
    ├── package-lock.json
    ├── package.json
    ├── predict_from_json.py
    ├── predicted.json
    ├── requirements.txt
    ├── runtime.txt
    ├── server.cjs
    └── user_data.json
</pre>

<hr/>

<h2>⚙️ Installation (Local Setup)</h2>

<h3>1️⃣ Clone Repository</h3>
<pre>
git clone https://github.com/your-username/Heal.AI.git
cd Heal.AI
</pre>

<h3>2️⃣ Backend Setup</h3>
<pre>
cd backend
npm install
node server.cjs
</pre>

<h3>3️⃣ Python ML Setup</h3>
<pre>
cd ml
pip install -r requirements.txt
python predict_from_json.py
</pre>

<h3>4️⃣ Frontend Setup</h3>
<pre>
cd frontend
npm install
npm run dev
</pre>

<hr/>

<h2>📦 Python Requirements</h2>

<pre>
numpy
pandas
matplotlib
seaborn
scikit-learn
joblib
pytesseract
opencv-python
pillow
</pre>

<hr/>

<h2>🎯 Use Cases</h2>
<ul>
  <li>Quick symptom checking</li>
  <li>Understanding medical prescriptions</li>
  <li>AI-assisted preliminary health guidance</li>
  <li>Educational healthcare assistance</li>
</ul>

<p><b>⚠️ Disclaimer:</b> Heal.AI is not a replacement for professional medical advice.</p>

<hr/>

>
