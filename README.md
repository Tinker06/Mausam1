# MAUSAM — Personalized Weather & Environmental Analytics Platform 🌤️

MAUSAM is a full-stack, responsive weather and environmental intelligence application designed to deliver real-time weather data, multi-day forecasts, severe weather alerts, and lifestyle recommendations tailored to **8 specialized user personas** (Health, Fitness, Beach, Traveler, Parents, Agriculture, Commuters, and Event Planners).

---

## 🌟 Key Features

1. **8 Persona-Driven Intelligence Engines**:
   - **Health**: AQI (Air Quality Index), Pollen tracking (grass, birch, ragweed), UV radiation protection, and asthma alerts.
   - **Fitness**: Optimal workout windows, heat index vs humidity, and electrolyte/hydration guidance.
   - **Beach & Marine**: Wave swell height, sea surface temperature, ocean wind speed, and sunburn prevention.
   - **Traveler**: Transit weather hazards, packing recommendations, and destination climate overview.
   - **Parents**: Child outdoor playtime suitability score, stroller clothing guide, and SPF sunscreen timers.
   - **Agriculture**: Field irrigation timing, crop spray drift wind limits, and rainfall windows.
   - **Commuters**: Road visibility, thunderstorm/rain delay risk, and two-wheeler wind gust advisories.
   - **Event Planners**: Pop-up tent wind safety limits, marquee rain risk, and staging weather safety.

2. **Real Global Weather Integration**:
   - Integrated with **Open-Meteo Weather, Air Quality, Marine, and Geocoding APIs** for real-time worldwide data without requiring expensive API keys.
   - Configurable for OpenWeatherMap via `.env`.

3. **Multilingual Support**:
   - Complete localized UI dictionaries for **English**, **Tamil (தமிழ்)**, and **Hindi (हिंदी)** with instant language switcher.

4. **Modular Weather Alert & FCM Push Pipeline**:
   - Severe & Moderate weather warning classification (`NORMAL`, `MODERATE`, `SEVERE`).
   - Stable alert hash deduplication preventing repeated notifications.
   - Firebase Cloud Messaging (FCM) integration with simulated test push alerts in UI.

5. **Saved Locations Database**:
   - Search cities worldwide with geocoding, save favorite locations to database, set default cities.

---

## 🏗️ Project Architecture

```
Mausam1/
├── frontend/                     # React + TypeScript + Vite + Tailwind CSS Application
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── App.tsx               # Main Dashboard Container
│       ├── i18n/                 # English, Tamil & Hindi Translations
│       │   └── translations.ts
│       ├── services/             # API client & fallback handling
│       │   └── api.ts
│       ├── components/
│       │   ├── Header.tsx        # Top navigation & language picker
│       │   ├── PersonaSelector.tsx
│       │   ├── WeatherHero.tsx   # Temperature hero display
│       │   ├── PersonaInsightsCard.tsx
│       │   ├── EnvironmentalMetrics.tsx
│       │   ├── ForecastSection.tsx # Recharts hourly curve & 7-day forecast
│       │   ├── AlertsBanner.tsx  # Weather warning banner & test push button
│       │   ├── SavedLocationsModal.tsx
│       │   ├── SettingsModal.tsx
│       │   └── PushNotificationToast.tsx
│       └── types/
│           └── weather.ts
│
├── backend/                      # Python FastAPI Application
│   ├── requirements.txt
│   ├── config.py                 # Pydantic environment configuration
│   ├── database.py               # SQLAlchemy async SQLite engine & session
│   ├── models.py                 # SavedLocation, UserModel, AlertHistory models
│   ├── main.py                   # FastAPI app entrypoint & lifespan initialization
│   ├── schemas/                  # Pydantic response schemas
│   │   ├── weather.py
│   │   ├── recommendation.py
│   │   └── alert.py
│   ├── services/
│   │   ├── weather_service.py    # Open-Meteo real weather API fetcher
│   │   ├── persona_engine.py     # Rule engine for 8 personas
│   │   └── alert_pipeline.py     # Severity analysis & FCM deduplication
│   ├── routers/
│   │   ├── weather.py
│   │   ├── recommendations.py
│   │   ├── alerts.py
│   │   ├── locations.py
│   │   └── auth.py
│   └── tests/
│       └── test_mausam_services.py
│
├── .env.example
├── package.json                  # Root workspace script launcher
└── README.md
```

---

## 🚀 Setup & Execution Guide

### Prerequisites
- Node.js (v18+) and npm
- Python (v3.10+)

### 1. Install Backend Dependencies & Run Server
```bash
# From workspace root directory:
python -m pip install -r backend/requirements.txt

# Start FastAPI backend server:
python -m uvicorn backend.main:app --reload --port 8000
```
FastAPI interactive docs will be live at `http://localhost:8000/docs`.

### 2. Install Frontend Dependencies & Run App
```bash
# From workspace root directory:
npm --prefix frontend install

# Start Vite dev server:
npm run dev:frontend
```
Open `http://localhost:3000` in your browser.

---

## 🧪 Running Automated Tests

Run backend unit tests for weather normalization, persona recommendation rules, and alert pipeline:

```bash
python -m pytest backend/tests/test_mausam_services.py
```

---

## 🔑 Environment Configuration

Create a `.env` file in the root directory (see `.env.example`):

```env
APP_NAME=MAUSAM
DEBUG=True
PORT=8000

# OpenWeatherMap Key (Optional; Open-Meteo is used by default)
OPENWEATHER_API_KEY=

# Database
DATABASE_URL=sqlite+aiosqlite:///./mausam.db

# Firebase Credentials (Optional)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
FCM_ENABLED=false
```
