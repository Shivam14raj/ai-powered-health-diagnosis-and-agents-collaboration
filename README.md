# 🩺 AI-Powered Health Diagnosis Web Application

This is an AI-powered Health Diagnosis system that allows users to submit their symptoms through an interactive form, which includes filters such as gender, sleep cycle, and symptom duration. The application uses machine learning (TensorFlow) for disease prediction and offers personalized recommendations, such as diet suggestions from AI agents. Additionally, it integrates an OCR-based AI agent that processes and converts patient reports into a structured format, storing the data in a hospital database automatically.

> **Disclaimer**: This tool is for **informational purposes only** and should not be considered medical advice. Always consult with a certified healthcare professional for diagnosis and treatment.

---

## 🌟 Features

- ✅ **Symptom Submission Form**: Users can enter their symptoms and additional personal information (e.g., gender, sleep cycle).
- 🧠 **AI-Powered Diagnosis**: The system predicts possible diseases based on user inputs using machine learning models.
- 🍎 **Diet Recommendations**: AI agents provide personalized diet suggestions based on health diagnosis.
- 🩸 **Gender-Based Filters**: Adjustments to symptom analysis based on gender (e.g., period tracking for females).
- ⏳ **Symptom Duration Filter**: Adjusts diagnosis predictions based on how long symptoms have been present.
- 🏥 **OCR Agent**: Users can upload patient reports, and the OCR AI agent extracts and stores relevant data in a hospital database.
- 🔒 **Anonymous Usage**: No login required; users can interact with the system anonymously.
- 🌐 **Built Using**: HTML, CSS, JavaScript, TensorFlow (for machine learning), Supabase (for database), and N8N.io (for AI agent automation).

---

## 🧪 How It Works

### 1. **Symptom Submission** 📝
   - Users input their symptoms, gender, and the duration of symptoms to start the diagnosis process.

### 2. **AI-Based Disease Prediction** 🤖
   - The app analyzes the provided data using a TensorFlow.js machine learning model and predicts potential diseases like:
     - COVID-19
     - Flu
     - Migraine
     - Heart Disease
     - Gastritis, etc.

### 3. **Personalized Diet Recommendations** 🍏
   - Based on the diagnosis, an AI agent suggests a personalized diet plan to help manage or alleviate symptoms.

### 4. **Gender-Specific Adjustments** 👩‍⚕️
   - The app checks if the user is female and considers their period cycle to adjust predictions accordingly.

### 5. **OCR Medical Report Upload** 🏥
   - Users upload scanned medical reports, which are processed and stored in the hospital database. The OCR agent extracts relevant information from the reports, making it easier for healthcare providers to review.

---
---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Machine Learning**: TensorFlow for disease prediction
- **Backend (optional)**: Node.js / Python Flask / Django
- **Automation**: N8N.io (for AI agent tasks such as diet recommendations)
- **OCR AI Agent**: Optical Character Recognition for extracting data from medical reports
- **Hosting**: GitHub Pages / Netlify / platforms

---

## 📁 Project Structure

ai-health-diagnosis-app/
│
├── index.html
├── style.css
├── app.js
├── /models
│ └── diseasePredictionModel.js # TensorFlow model for disease prediction
├── /agents
│ ├── dietRecommendationAgent.js # AI agent for diet recommendations
│ └── ocrAgent.js # OCR AI agent for report processing
├── /database
│ └── supabase.js # Connection to Supabase database
├── /assets
│ └── images/ # Interactive icons for features
└── README.md

---

This structure is flexible, allowing for scalability as you incorporate more features like AI agents, symptom filters, and the OCR-based report processing. Let me know if you need further customization or integration details!
