<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?style=flat-square&logo=google" />
</p>

<h1 align="center">🛡️ RentProof</h1>
<h3 align="center">AI that understands your property's condition.</h3>

<p align="center">
  Capture your room. Let AI identify visible damage. Get a documented condition report.<br/>
  Compare it when you move out to resolve deposit disputes — instantly.
</p>

---

## 🎯 What is RentProof?

RentProof is an AI-powered property inspection and rental management platform built for the Indian rental ecosystem. Its core feature lets tenants and landlords walk through a flat/PG/room with their phone camera while AI analyzes the property, identifies visible damage, and creates a detailed digital condition report.

**RentProof doesn't just store evidence. It understands the property.**

### The Problem

Every year, millions of Indian tenants lose security deposits to disputes over property damage — with no verifiable proof of what the property looked like at move-in vs move-out.

### The Solution

```
Upload/Capture real image
        ↓
AI Vision Analysis (Gemini 2.5 Flash)
        ↓
Detect visible issues
        ↓
Bounding boxes on the actual image
        ↓
Finding details + Condition score
        ↓
Move-in / Move-out comparison report
```

---

## ✨ Core Feature: AI Property Inspection

<table>
<tr>
<td width="50%">

### 🔍 What it does

- **Guided room-by-room scanning** — Select rooms (Bedroom, Kitchen, Bathroom, etc.) and capture photos of each area (Walls, Ceiling, Floor, Fixtures)
- **Real AI image analysis** — Each uploaded photo is sent to Gemini 2.5 Flash Vision which analyzes the actual image for visible damage
- **Annotated bounding boxes** — Detected issues are highlighted directly on the image with color-coded severity markers
- **Condition scoring** — An overall 0–100 score derived from actual findings, not predetermined
- **Move-in vs Move-out comparison** — Side-by-side diff showing new damage, worsened, repaired, and unchanged items

</td>
<td width="50%">

### 🧠 AI Principles

- **Never invents damage** — If the image is clean, the AI returns zero findings
- **Bounding boxes come from the model** — Not hardcoded
- **Confidence levels** — Every finding includes a confidence score; low-confidence findings are flagged
- **No deposit auto-deduction** — Shows "Potentially Relevant Damage" only
- **Transparent mode indicator** — UI clearly shows `Live Vision AI` vs `Demo Simulation`
- **Safety disclaimer** — Always states it's not a professional inspection

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A **Gemini API key** (free at [aistudio.google.com](https://aistudio.google.com/apikey)) — optional, app works in demo mode without it

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/RentProof.git
cd RentProof

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Required for Supabase (auth & data persistence)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Required for Live AI Inspection (leave empty for Demo Mode)
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Run

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:5173`.

---

## 🏗️ Architecture

```
src/
├── components/
│   ├── ai-inspection/       # Core AI inspection UI
│   │   ├── AnnotatedImage   # SVG bounding box overlay on images
│   │   ├── ConditionScoreGauge  # Animated circular score gauge
│   │   ├── FindingCard      # Individual finding with severity/confidence
│   │   ├── RoomCard         # Room summary with mini condition bar
│   │   ├── ImageUploadZone  # Guided area capture with camera support
│   │   └── ComparisonCard   # Move-in vs move-out diff card
│   ├── ai/                  # AI chat assistant
│   ├── dashboard/           # Metric cards, health score, activity
│   ├── layout/              # Sidebar, TopBar, AppLayout
│   ├── maintenance/         # Maintenance request cards
│   ├── payments/            # Payment tracking components
│   ├── timeline/            # Event timeline
│   └── ui/                  # Reusable primitives (Button, Card, Modal, etc.)
├── pages/
│   ├── AIInspectionPage     # AI inspection dashboard
│   ├── AIInspectionWizardPage  # Multi-step guided inspection flow
│   ├── AIComparisonPage     # Move-in vs move-out comparison
│   ├── DashboardPage        # Main dashboard (tenant & landlord views)
│   ├── LandingPage          # Public landing page
│   ├── LoginPage            # Authentication
│   ├── PaymentsPage         # Payment history & recording
│   ├── TimelinePage         # Rental event timeline
│   ├── MaintenancePage      # Maintenance requests
│   ├── DocumentsPage        # Document locker
│   ├── EvidencePage         # Evidence center (photo gallery)
│   └── ReportsPage          # Analytics & reports
├── services/
│   ├── inspectionAIService  # Dual-mode AI vision service (Gemini / Mock)
│   └── ...                  # Property, timeline, payment services
├── contexts/
│   └── AuthContext           # Auth state + demo mode toggle
├── lib/
│   ├── gemini               # Gemini SDK client initialization
│   ├── demoData             # Demo mode mock data
│   ├── demoInspectionData   # Demo inspection reports
│   └── supabase             # Supabase client
└── types/
    ├── inspection            # AI inspection type system
    └── index                 # Core app types
```

### AI Service Architecture

```
inspectionAIService.ts
        │
        ├── isVisionAPIAvailable()
        │       └── checks VITE_GEMINI_API_KEY
        │
        ├── Live Vision AI (when key is configured)
        │       ├── Image → base64 conversion
        │       ├── Gemini 2.5 Flash multimodal call
        │       ├── Structured JSON response (responseMimeType)
        │       ├── Parse findings with bounding boxes
        │       └── Console debug logging
        │
        └── Demo Simulation (when key is absent)
                ├── Room-specific mock findings database
                ├── Simulated processing delay
                └── UI clearly labels results as "Demo"
```

---

## 📱 Features

| Feature | Description |
|---------|-------------|
| **AI Property Inspection** | Upload photos → AI analyzes → Bounding boxes → Condition report |
| **Move-in / Move-out Comparison** | Side-by-side diff detecting new damage, worsened, and repaired items |
| **Dual Role Support** | Separate tenant and landlord dashboard views |
| **Payment Tracking** | Record, verify, and visualize rent payments with charts |
| **Maintenance Requests** | Submit and track maintenance issues |
| **Document Locker** | Upload and organize rental documents by category |
| **Evidence Center** | Photo evidence gallery with masonry layout |
| **Timeline** | Chronological event log of all rental activities |
| **Reports & Analytics** | Comprehensive rental health reports with Recharts |
| **AI Chat Assistant** | Contextual AI assistant for rental queries |
| **Demo Mode** | Full app experience without any API keys using `demoLogin()` |

---

## 🔑 Demo Mode

RentProof works fully without any backend or API keys configured:

1. Open the app → Click **"Get Started"** on the landing page
2. On the login screen, click **"Try Demo as Tenant"** or **"Try Demo as Landlord"**
3. Explore the full application with realistic Indian rental data

**Demo credentials:**
- Tenant: Aarav Sharma (Flat B-402, Sunrise Residency, Indirapuram)
- Landlord: Rahul Mehta
- Rent: ₹18,000/month | Deposit: ₹36,000

> When using AI Inspection in Demo Mode, the header will show a yellow **"⚠️ Demo Simulation"** badge. Findings are predetermined and do not reflect the uploaded image.

---

## 🤖 Enabling Live AI

To switch from Demo Simulation to Live Vision AI:

1. Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Add it to your `.env` file:
   ```env
   VITE_GEMINI_API_KEY=your_actual_key_here
   ```
3. Restart the dev server (`npm run dev`)
4. The inspection wizard will now show a green **"✨ Live Vision AI"** badge
5. Upload real property photos — AI will analyze only what's actually visible

### Console Debug Output (Live Mode)

```
[RentProof AI] Mode: LIVE
[RentProof AI] Image received: yes
[RentProof AI] Image type: image/jpeg
[RentProof AI] Sending image to Gemini...
[RentProof AI] Gemini response received
[RentProof AI] Findings detected: 0
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + TypeScript 6 |
| **Build** | Vite 8 |
| **Styling** | Tailwind CSS 4 (CSS-first config) |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **AI** | Google Gemini 2.5 Flash via `@google/genai` SDK |
| **Auth & DB** | Supabase (with full demo mode fallback) |
| **Routing** | React Router 7 |

---

## 🇮🇳 Built for India

- All currency in **₹ (INR)**
- Property context: Flats, PGs, rooms in Indian cities
- Indian rental law awareness in the AI assistant
- Realistic demo data set in Indirapuram, Ghaziabad, UP

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

<p align="center">
  <strong>RentProof</strong> — Every rental deserves proof. 🛡️
</p>
