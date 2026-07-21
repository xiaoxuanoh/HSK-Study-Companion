# Technical Plan

## Frontend (Next.js 16.2.10 + React 19.2.7 + TypeScript 5.9.3 + Tailwind CSS)

### Pages
- `/` — Landing page
- `/dashboard` — Lesson dashboard
- `/lessons/[id]` — Lesson study page (three-panel layout)
- `/notebook` — Course-wide notebook workspace
- `/notebook/[lessonId]` — Complete saved-note collection for one lesson (or standalone notes)

### Key Components
- `ThreePanel` — three-column layout wrapper
- `LessonCard` — dashboard lesson card
- `LessonOverviewModal` — modal before entering a lesson
- `LeftNav` — lesson section tab navigation
- `AITutorPanel` — right-side AI tutor panel
- `VocabPopup` — small popup on vocabulary word click
- Section components: `PassageSection`, `VocabularySection`, `GrammarSection`, `WordDistinctionSection`, `ExercisesSection`, `WritingSection`, `WarmupSection`, `ExpansionSection`

### State Management
- React local state for current section, selected item, exercise answers, and AI panel content
- AI messages and current focus survive Tutor close/reopen during the mounted lesson visit; confirmed clearing resets them, while leaving or reloading the lesson starts fresh
- `frontend/lib/notebook.ts` provides a versioned local-storage repository and React subscription hook for course-wide notebook data
- Notebook UI depends on the `NotebookRepository` interface so browser storage can later be replaced by an account-backed implementation
- The course-wide overview shows up to three recent, fixed-size cards per collection in a horizontal row followed by a persistent View All tile; long content and item management live in an accessible details dialog
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
- The active frontend notebook persists locally in the learner's browser using a versioned storage envelope
- Mock notebook API endpoints remain available for backend prototyping but are not the frontend notebook's source of truth

## Current Framework Baseline

- Next.js 16 uses asynchronous dynamic-route parameters and Turbopack for production builds.
- Turbopack's root is set to the repository root so `frontend/lib/mockData.ts` can import shared lesson JSON from `data/`.
- ESLint uses the flat configuration in `frontend/eslint.config.mjs`; `next lint` was removed in Next.js 16.
- A package override keeps every PostCSS copy on 8.5.19, including Next.js's transitive dependency.
- The verified baseline passes ESLint, TypeScript, the production build, the production dependency audit, and the backend health test.

## Future Phases

### Real AI Phase
- Backend receives explain/tutor requests
- Calls AI API (Anthropic Claude or similar) with structured prompt
- Returns structured explanation matching the templates in `docs/explanation-style.md`
- Frontend displays streamed or batched response

### Supabase Auth Phase
- Use email-and-password signup and sign-in.
- After email verification, collect a nickname/display name on a separate profile page.
- Protect `/dashboard` and `/lessons/*` only after the standalone authentication flow is stable.
- Backend validates Supabase JWTs before accepting protected persistence writes.

### Supabase Postgres Phase
- Keep lesson content in JSON initially.
- Persist learner-owned profiles and notebook items first, followed by progress, writing versions/feedback, and exercise attempts.
- Require explicit grants, per-user Row Level Security, and cross-user isolation tests before connecting UI features.

### Paused Supabase Foundation

- The isolated foundation is saved at `feature/supabase-integration` commit `3cbccf6`.
- It includes mock-by-default configuration, local Supabase files, a profiles/notebook migration, and standalone signup, verification, nickname, and sign-in pages.
- The landing page, dashboard, lesson routes, JSON loading, and FastAPI endpoints were left unchanged.
- Local migration execution is still pending because the initial Docker image download timed out.
- No remote Supabase project is linked or modified. Resume only with explicit approval, and first bring the latest `main` framework baseline into the feature branch.

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
