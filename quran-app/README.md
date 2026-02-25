# 📖 Quran — The Noble Recitation

A high-end, production-ready Quran web application with an iOS 26 glassmorphism aesthetic.

## ✨ Features

- **114 Surahs** loaded dynamically from [Alquran.cloud API](https://alquran.cloud/api)
- **Search** by surah name, translation, or number
- **Filter** by Meccan / Medinan revelation type
- **Multiple translations** (English Sahih International, Pickthall, Russian Kuliev/Osmanov, French)
- **Persistent Audio Player** — play full surah audio with progress scrubbing
- **5 Reciters** — Mishary Alafasy, Al-Sudais, Abdullah Basfar, Al-Husary, Al-Minshawi
- **Beautiful Arabic script** — Scheherazade New / Amiri fonts
- **iOS 26 Design** — Advanced glassmorphism, fluid animations, ultra-rounded corners
- **Mobile-first** — feels like a native iOS app

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel — it auto-detects Next.js.

## 📁 File Structure

```
quran-app/
├── app/
│   ├── layout.jsx          # Root layout with AudioProvider
│   ├── page.jsx            # Home page — Surah grid
│   ├── globals.css         # Design system / iOS 26 glass tokens
│   └── surah/
│       └── [id]/
│           └── page.jsx    # Dynamic reading page
├── components/
│   ├── Header.jsx          # Sticky glassmorphism header
│   ├── AudioPlayer.jsx     # Persistent floating audio player
│   ├── SurahCard.jsx       # Individual surah list card
│   ├── SurahGrid.jsx       # Search + filter + grid
│   ├── AyahView.jsx        # Ayah cards with Arabic + translation
│   ├── SurahPlayButton.jsx # Play/pause button (client)
│   └── TranslationSelector.jsx  # Language dropdown
├── context/
│   └── AudioContext.jsx    # Global audio state
├── lib/
│   └── api.js              # Alquran.cloud API helpers
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── jsconfig.json
└── vercel.json
```

## 🎨 Design System

- **Colors**: Deep navy/space background, indigo + violet accents, emerald for Medinan surahs
- **Glass**: `rgba(255,255,255,0.06)` bg + `backdrop-filter: blur(20px)` + white border
- **Typography**: SF Pro Display (system), Scheherazade New + Amiri for Arabic
- **Motion**: CSS animations with stagger delays, cubic-bezier spring physics
- **Radius**: 24px–40px (cards), 100px (pills/buttons)

## 🔌 API

Data from **alquran.cloud** — free, no auth required:

| Endpoint | Usage |
|----------|-------|
| `GET /v1/surah` | All 114 surahs metadata |
| `GET /v1/surah/:id` | Surah with Arabic ayahs |
| `GET /v1/surah/:id/:edition` | Surah with translation |

Audio from **cdn.islamic.network**:
`https://cdn.islamic.network/quran/audio-surah/128/{reciter}/{surah}.mp3`
