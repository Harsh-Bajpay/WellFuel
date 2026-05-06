# WellFuel PulseGrid

WellFuel PulseGrid is a futuristic dashboard that blends human energy signals with building energy
signals to prevent burnout, cut peak demand, and coordinate real-time operations. The experience
is designed for hackathon demos: high-contrast neon UI, animated pulse canvas, and AI-guided
recommendations that update as the load slider changes.

## Problem & Value
- **Problem:** Energy-heavy workplaces lose productivity when human fatigue and building demand are
  optimized separately.
- **Solution:** A single pulse score that fuses wearable signals, occupancy, and microgrid data to
  orchestrate schedules, hydration, and energy routing.
- **Value:** Lower burnout risk, faster queue flow, and measurable energy savings.

## What’s Inside
- Scenario switcher for campus, clinic, and factory environments.
- Live pulse canvas driven by scenario data.
- Action cards that simulate AI recommendations.
- Lightweight Node server with JSON APIs for easy Cloud Run deployment.

## Local Run
```bash
npm install
npm run dev
```
Open `http://localhost:8080`.

## Testing
```bash
npm test
```

### API Endpoints
- `GET /api/scenarios` → all scenario data
- `GET /api/impact?site=campus` → specific site data
- `GET /healthz` → health check for Cloud Run

## GCP Deployment (under $5 credits)
This project is designed for **Cloud Run** with buildpacks (no Dockerfile required).

```bash
gcloud run deploy wellfuel-pulsegrid \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

Low-cost stack options:
- **Cloud Run** (scales to zero)
- **Firestore** for storing live pulse events (optional extension)
- **Cloud Storage** for media assets (optional extension)

## Demo Script
1. Pick a scenario (campus/clinic/factory) and show the pulse score reacting.
2. Drag the load slider to simulate stress spikes.
3. Highlight AI-guided actions and zone health improvements.
4. Explain that Cloud Run hosts both the UI and API for pennies.
