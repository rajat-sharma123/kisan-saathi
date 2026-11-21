# KISAN SAATHI (किसान साथी)
## Smart Crop Advisory System for Small and Marginal Farmers

> **Developed by Team INNOVIX**  
> **Indian Institute of Information Technology Bhagalpur (IIIT Bhagalpur)**  
> *Society Academia Internship - 1 (SAI - 1)*  
> **Project Mentor & Guide:** Dr. Dilip Kumar Choubey (Dept. of CSE)

---

## 🌾 Project Overview

**KISAN SAATHI** is an intelligent agricultural assistance web platform tailored specifically for Indian small and marginal farmers who face low internet connectivity, varying regional dialects, and limited access to timely agronomic intelligence.

The platform provides **five major modules** designed to eliminate guesswork and improve farmer incomes by 20–30%:

1. **Voice-First Multilingual Chatbot** (आवाज आधारित बहुभाषी सहायक):
   - Speech-to-text and spoken AI-powered advice (TTS).
   - Dialect support for **Hindi, Bhojpuri, Maithili, Magahi, Bengali, Marathi, Punjabi, and English**.
   - Enforces strict agricultural domain boundaries (politely rejects non-farming questions).

2. **Offline Personalized Crop Advisory** (ऑफ़लाइन व्यक्तिगत फसल सलाह):
   - Scientific NPK and soil parameter decision engine running **100% offline**.
   - Calibrated against standard 2200-sample agricultural research datasets and ICAR benchmarks.
   - Calculates exact fertilizer prescriptions (kg/acre of Urea, DAP, MOP), soil suitability ratings, and agronomic rationale.
   - Persistent offline history via browser **IndexedDB**.

3. **AI-Powered Plant Disease Detection** (एआई पौध रोग पहचान):
   - Photo upload and mobile camera capture of infected crop leaves.
   - Pathology diagnostics with confidence estimates, severity ratings, symptoms, and ICAR treatment schedules.
   - **Offline Image Upload Queue**: Automatically queues photos in IndexedDB when offline, with automatic sync when connectivity resumes.
   - Escalation advice with direct link to Krishi Vigyan Kendra (KVK) and Kisan Call Center (1800-180-1551).

4. **Predictive & Actionable Weather Alerts** (सटीक एवं कार्रवाई योग्य मौसम चेतावनी):
   - Real-time weather radar powered by **Open-Meteo API** (GPS or searchable Indian district coordinates).
   - Rule-based Agricultural Intelligence Engine:
     - *Delay pesticide/fertilizer spraying* before expected rainfall.
     - *Heat stress irrigation guidance* during high temperature peaks.
     - *Wind drift hazard alerts* for spray safety.
     - *Frost/cold wave protection* via light evening irrigation.
   - 24-hour temperature and rainfall trend charts using **Recharts**.

5. **Hyper-Local Market Price Intelligence** (स्थानीय मंडी भाव एवं रुझान):
   - Official AGMARKNET / **data.gov.in** compliant mandi prices in **₹ per Quintal (100 kg)**.
   - State and district filters across Bihar, UP, Punjab, Maharashtra, MP, Haryana, and West Bengal.
   - 7-day and 30-day historical price movement line charts.
   - Inter-mandi price arbitrage analysis (e.g. comparing Bhagalpur vs Patna vs Purnia mandis).
   - CSV export functionality for farmers and FPOs.

---

## 🎨 Visual Identity & Design System

The application strictly adheres to a natural agricultural aesthetic:
- **Forest Green (Primary Dark):** `#315D2A`
- **Secondary Green:** `#568B35`
- **Accent Green:** `#82BD4B`
- **Light Green:** `#EAF3E2`
- **Page Background:** `#F7F9F4`
- **Primary Text:** `#202B20`
- **Secondary Text:** `#687568`
- **Border Tone:** `#E3E9DE`

Clean typography (`Inter`), high-contrast buttons, large touch targets, and mobile-first responsive layout (left sidebar on desktop, bottom navigation bar on mobile).

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)

### Installation

```bash
# Clone or navigate to the project directory
cd client

# Install all dependencies
npm install

# Start local development server
npm run dev
```

Visit the local development URL (typically `http://localhost:5173`) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 👥 Team INNOVIX (IIIT Bhagalpur)

| Name | Roll Number | Role |
| :--- | :--- | :--- |
| **Rajat Kumar Sharma** | 240101247 | AI & Full Stack Lead |
| **Shivam Kumar** | 240101131 | Frontend & UI/UX |
| **Vishal Kumar** | 240101248 | Backend & Cloud Services |
| **Rudra Narayan Chaturvedi** | 240101218 | ML Model & Agronomics |
| **Praduman Kumar** | 240101038 | Data Engineering & Mandi API |
| **Ayush Gupta** | 240101089 | Mobile PWA & Testing |

**Under the Guidance of:**  
**Dr. Dilip Kumar Choubey**  
*Department of Computer Science and Engineering, IIIT Bhagalpur*

---

## 📜 Compliance & Agronomic Standards
- **Agronomic Benchmarks:** Indian Council of Agricultural Research (ICAR) & National Rice Research Institute (NRRI)
- **Meteorological Data:** Open-Meteo High-Resolution Forecasting
- **Market Data Standards:** AGMARKNET / Directorate of Marketing & Inspection, Ministry of Agriculture
- **Helpline Integration:** Kisan Call Center (1800-180-1551)
