# Technical Plan

## Frontend (Next.js 14 + React + TypeScript + Tailwind CSS)

### Pages
- `/` — Landing page
- `/dashboard` — Lesson dashboard
- `/lessons/[id]` — Lesson study page (three-panel layout)

### Key Components
- `ThreePanel` — three-column layout wrapper
- `LessonCard` — dashboard lesson card
- `LessonOverviewModal` — modal before entering a lesson
- `LeftNav` — lesson section tab navigation
- `AITutorPanel` — right-side AI tutor panel
- `VocabPopup` — small popup on vocabulary word click
- Section components: `PassageSection`, `VocabularySection`, `GrammarSection`, `WordDistinctionSection`, `ExercisesSection`, `WritingSection`, `WarmupSection`, `NotebookSection`, `ExpansionSection`

### State Management
- React `useState` and `useContext` for current section, selected item, AI panel content, notebook items
- No external state library needed for the prototype

### API
- `lib/api.ts` — typed fetch functions to FastAPI backend
- `lib/types.ts` — shared TypeScript types
- `lib/mockData.ts` — fallback mock data (used if backend is unavailable)

## Backend (FastAPI + Python)

### Structure
```
backend/app/
  api/          # Route handlers
  core/         # Config, settings
  models/       # Pydantic models
  services/     # Business logic, data loading
  main.py       # FastAPI app, CORS, router registration
```

### Endpoints (Phase 1 — Mock)

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| GET | /api/lessons | List all lessons |
| GET | /api/lessons/{lesson_id} | Get lesson data |
| POST | /api/ai/explain | Get mock AI explanation |
| GET | /api/notebook | Get mock notebook items |
| POST | /api/notebook/save | Save item to mock notebook |

### Data Loading
- `services/lesson_service.py` loads `data/hsk6/lesson-01.json`
- Returns typed Pydantic models
- Designed so a Supabase Postgres client can replace file loading later

## Mock Data Phase (Now)

- All lesson content from `data/hsk6/lesson-01.json`
- AI responses are mock strings returned by `services/ai_service.py`
- Notebook is in-memory dict (resets on server restart)

## Future Phases

### Real AI Phase
- Backend receives explain/tutor requests
- Calls AI API (Anthropic Claude or similar) with structured prompt
- Returns structured explanation matching the templates in `docs/explanation-style.md`
- Frontend displays streamed or batched response

### Supabase Auth Phase
- Add Supabase Auth client to frontend
- Protect `/dashboard` and `/lessons/*` routes
- Backend validates JWT from Supabase

### Supabase Postgres Phase
- Replace JSON file loading with Supabase Postgres queries
- Tables: profiles, lessons, lesson_sections, vocabulary, synonym_groups, user_progress, notebook_items, exercise_attempts, ai_messages

### Supabase Storage Phase
- Allow users to upload PDFs and scans
- Store in Supabase Storage bucket
- Trigger OCR/extraction pipeline

### OCR / PDF Extraction Phase
- Accept uploaded PDF via backend endpoint
- Run OCR (e.g., Tesseract or cloud OCR)
- Parse extracted text into lesson JSON structure
- Store in Supabase Postgres

### Deployment
- Frontend: Vercel (Next.js native)
- Backend: Railway, Render, or Fly.io
- Environment variables for API URLs, Supabase keys, AI API keys
