# ForestGuard EcoBlueprint

**Ecology Tracking & Reforestation Blueprint System**

A web application for detecting deforestation at the species level in Kenya forests and generating reforestation blueprints. Integrates KEFRI (Kenya Forestry Research Institute) species data, tracks 12 native tree species with loss breakdown by cause (legal logging, illegal logging, disease, fire), and provides CAD-style visualization of forest regions.

## Project Structure

```
frontend/    — React + Vite SPA (maps, dashboards, education, reports)
backend/     — Python FastAPI (KEFRI webhook, Gemini AI, species & region APIs)
```

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # add your GEMINI_API_KEY
python main.py
```

Open http://localhost:5173

## Features

- **Species-Level Tracking** — 12 native Kenyan tree species with KEFRI codes, conservation status, per-species loss data
- **Ecology Map** — CircleMarker visualization with 3 coloring modes: Region Colors, Habitat Colors, Cutting Hotspots
- **Education Mode** — Polygon map with dual coloring measures, expandable species cards with loss breakdown bars
- **Cutting Hotspots** — 18 active events filterable by cause: legal logging, illegal logging, disease, fire
- **Reforestation Blueprint** — Species-specific reforestation recommendations with carbon sequestration projections
- **CAD Tree Visualization** — Clear geometric tree icons (rounded, conical, umbrella) for species identification
- **KEFRI Webhook API** — Receive real-time forest data from Kenya Forestry Research Institute
- **Gemini AI Integration** — Endpoint for satellite/field photo analysis (requires API key)
- **Analytics & Reporting** — Species loss table, cause breakdown charts, regional comparisons

## Data Sources

- **KEFRI** — 12 native species with conservation status, habitat, and regional distribution
- **Kenya Forest Service** — Regional deforestation metrics and alert data
- **Satellite monitoring** — Hotspot detection and tree loss tracking

## Tech Stack

- **Frontend:** React 19, Vite, Leaflet, Recharts, Lucide React
- **Backend:** Python, FastAPI, Uvicorn
- **Integrations:** Google Gemini AI, KEFRI webhooks

---

*Built with React, Leaflet, Python, FastAPI, and KEFRI data*
