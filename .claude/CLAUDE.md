# CLAUDE.md – HSK Study Companion Development Guide

## Session Ritual

### Start of Session
1. Read `README.md` – confirm product scope and current status.
2. Read `.codex/AGENTS.md`, `tasks/LESSON.md`, and `tasks/SESSION_LOG.md` – confirm project rules, lesson context, and recent progress.
3. Read `frontend/package.json` scripts and `backend/requirements.txt` – align commands with actual repo tooling.
4. Check whether environment files exist without printing secrets:
   - `backend/.env.example`
   - Supabase environment examples exist only on `feature/supabase-integration` while that work is paused.
   - Do not print `.env` or `.env.local` values.
5. Run baseline checks only when dependencies are installed:
   - Frontend: `cd frontend && npm run lint && npx tsc --noEmit`; stop any running development server before `npm run build`
   - Backend: `cd backend && python -m pytest tests/` if pytest and dependencies are installed.

### During Session
1. Write a **3-step micro-plan** for any new work.
2. Execute exactly **one phase**.
3. Run checks before marking tasks complete:
   - During active development: `cd frontend && npm run lint && npx tsc --noEmit`
   - For final validation: stop the development server, then run `cd frontend && npm run build`

### End of Session
1. Run checks when possible:
   - Frontend: `cd frontend && npm run lint && npx tsc --noEmit`; stop the development server before `npm run build`
   - `cd backend && python -m pytest tests/`
2. Verify one happy path:
   - Open app → homepage → dashboard → lesson overview modal → lesson page → passage/vocabulary/AI tutor panel renders.
3. Test one edge case:
   - backend offline fallback, unknown vocabulary word, empty notebook state, or missing optional JSON field.
4. Update `tasks/SESSION_LOG.md` and/or `docs/session-logs/` with:
   - What was completed
   - Commands run
   - Any bugs fixed
   - Any errors/warnings
   - Exact next step
5. If a project gotcha or repeated mistake is discovered or any flaws discovered and is fixed, document it in `tasks/lesson.md` or a dedicated docs file.


---

## ⚠️ Critical Lessons (Read Before Touching Core Features)

**See `tasks/LESSON.md` for important patterns.**

Key things to know:
- **Tailwind first** — use classes for static styling; reserve inline styles for runtime-computed positions such as draggable and popup coordinates
- **TypeScript strict mode** in frontend — avoid `any`, always type your props and API responses
- **Mock data is the source of truth now** — all lesson content loads from `data/hsk6/lesson-01.json` via the backend; do not hardcode content in components
- **Backend is designed for future Supabase migration** — keep service layer clean; do not reach into data files from route handlers directly
- **No auto-commits** — summarize changes and wait for user review before committing anything

**Before touching the AI tutor panel or backend AI service, read `docs/explanation-style.md`.**

---

# Project Overview

**HSK Study Companion** is a structured self-study website for HSK learners that provides teacher-style explanations, near-synonym reasoning, grammar breakdowns, and AI-assisted study support.

## Problem
Textbook and workbook materials for HSK exist, but proper explanations, teacher-like reasoning, and guided context are hard to find. Learners repeatedly copy-paste content into generic AI tools.

## Solution
A full-stack web app that:
1. Presents HSK lessons in a **three-panel study layout** (nav, content, AI tutor)
2. Provides **clickable vocabulary popups** with teacher-style explanations
3. Covers all lesson sections: **Warm-up, Passage, Vocabulary, Grammar Notes, Word Distinction, Exercises, Writing, Expansion, Notebook**
4. Includes a **mock AI tutor panel** (upgradeable to a real backend AI call)
5. Includes a **notebook section** for saving vocabulary and grammar (currently in-memory)
6. Uses **FastAPI backend** serving mock JSON data — structured to swap in Supabase + real AI later

---

# Tech Stack

## Core
- **Next.js 16.2.10 + React 19.2.7 + TypeScript 5.9.3** (frontend, `/frontend`)
- **Tailwind CSS** — classes for static styling; runtime coordinate styles are permitted
- **FastAPI + Python + Pydantic** (backend, `/backend`)

## Data Layer (Now)
- Mock JSON files in `data/hsk6/` loaded by backend services
- Backend returns typed Pydantic models
- Frontend fetches from `lib/api.ts`; falls back to `lib/mockData.ts` if backend is unavailable

## Data Layer (Future)
- **Supabase Postgres** — lesson content, user progress, notebook items, exercise attempts, AI messages
- **Supabase Auth** — login/signup, JWT validation in backend
- **Supabase Storage** — uploaded PDFs and scans

## AI (Future)
- Real AI API calls proxied through FastAPI backend (Anthropic Claude planned)
- Currently: mock responses from `backend/app/services/ai_service.py`

## Testing
- **Frontend**: `npm run lint`, `npx tsc --noEmit`, and `npm run build`
- **Backend**: `pytest` in `backend/tests/`

---

# Architecture

## Request Flow

```
User opens app
      ↓
Landing page (/) → Dashboard (/dashboard)
      ↓
Lesson Overview Modal → Lesson Study Page (/lessons/[id])
      ↓
Three-panel layout: LeftNav | Content Sections | AITutorPanel
      ↓
Click vocabulary word → VocabPopup → optional add to notebook
      ↓
Ask AI tutor → mock response (future: FastAPI → AI API)
```

## File Organization

```
HSK-Study-Companion/
├── data/hsk6/             # Mock lesson JSON (lesson-01.json)
├── backend/
│   ├── app/
│   │   ├── api/           # Route handlers
│   │   ├── core/          # Config, settings
│   │   ├── models/        # Pydantic models
│   │   ├── services/      # Business logic, data loading
│   │   └── main.py        # FastAPI app, CORS, routers
│   ├── tests/
│   ├── run.py
│   └── requirements.txt
├── frontend/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── lib/               # api.ts, types.ts, mockData.ts
│   └── package.json
├── docs/
│   ├── product-brief.md
│   ├── technical-plan.md
│   ├── explanation-style.md
│   ├── content-structure.md
│   ├── design-direction.md
│   └── user-flow.md
├── tasks/
│   ├── SESSION_LOG.md     # Per-session work log
│   └── LESSON.md          # Accumulated lessons / gotchas
├── assets/reference/      # Uploaded PDFs, scans
└── README.md
```

---

# Workflow Rules

## Before Coding
- Write a **3-step micro-plan** (action, expected output, blockers)
- If stuck, stop and re-plan instead of trying random fixes
- Always read existing code before modifying
- Read `docs/explanation-style.md` before touching vocabulary popup or AI tutor content
- **YAGNI** — do not overbuild; no features beyond the current spec

## Before Marking Done
- **Run checks**: `cd frontend && npm run lint && npx tsc --noEmit`; stop the development server before `npm run build`
- **Verify one happy path**: Landing → Dashboard → Lesson modal → Lesson study page → click vocabulary
- **Test one edge case**: backend down, empty notebook, missing JSON field
- **Update `tasks/SESSION_LOG.md`** with commands run and observed behavior
- Never claim "it should work" — actually verify it in the browser

## Bug Fixing
- Read the **full error** and identify the file and function
- Fix **root cause**, not symptoms
- **Verify after fixing** with lint/build and manual UI check
- Log lessons in `tasks/LESSON.md`

## Documentation
- **Documentation first** — keep docs updated as the project evolves; update `tasks/SESSION_LOG.md` and relevant `docs/` files when anything changes

## Code Quality
- Use Tailwind for static styling; inline styles are limited to runtime-computed coordinates or other values that cannot be expressed statically
- TypeScript strict mode — type all props, API responses, and service return values
- Pydantic models for all backend request/response shapes
- Components should be small and focused — split sections into separate components
- Services layer separates data loading from route logic
- Handle missing/null fields in JSON gracefully — don't assume all fields are present
- Get it **working first**, then simplify
- Refactor only if logic repeats 3+ times

## Git Rule
**Do NOT commit automatically.** Only create git commits when the user explicitly asks. After making changes, summarize what was changed and wait for review.

---

# Key Implementation Details

## Explanation Quality (Core Value)
The app's main value is not vocabulary lookup — it is teacher-style explanations. Every vocabulary popup, grammar note, and AI tutor response should answer:
1. What does this word/grammar mean?
2. How does it function in a sentence?
3. What tone or nuance does it carry?
4. Why does it fit this context?
5. What mistakes do learners commonly make?
6. How can you use it in a new sentence?

See `docs/explanation-style.md` for full templates.

## Near-Synonym Tables
Near synonyms are one of the hardest parts of HSK study. Word distinction sections should always include:
- Side-by-side comparison of meaning, register, and grammatical behaviour
- At least one example sentence per word
- A brief summary of when to use which

## Mock Data Structure
All lesson content comes from `data/hsk6/lesson-01.json`. Backend services load this file via `services/lesson_service.py`. Do not read data files directly from route handlers. This indirection exists so Supabase queries can replace file loading in a later phase.

## API Confidence Levels
Responses are effectively classified by source:

**REAL DATA (local JSON)**: lesson vocabulary, grammar, and exercises from `lesson-01.json`
**MOCK AI**: structured fake responses from `ai_service.py` — clearly labeled as mock in the UI until real AI is wired
**FALLBACK (frontend mock)**: `lib/mockData.ts` used only if backend is unreachable

## Future-Proofing Rules
- Keep `services/` thin and focused on data loading — no business logic in route handlers
- Type all API responses with Pydantic (backend) and TypeScript interfaces (frontend)
- Never hardcode lesson content in components — always fetch from backend
- Notebook state will move to Supabase Postgres; keep notebook logic isolated so it can be extracted

## Current Framework and Branch Baseline

- `main` and `origin/main` contain the verified Next.js 16 upgrade at `e41f637`.
- ESLint uses `frontend/eslint.config.mjs`; Next.js 16 no longer provides `next lint`.
- Dynamic route parameters are promises in Next.js 16; the lesson page unwraps them with React `use()`.
- Turbopack root is configured at the repository level so frontend fallback code can import `data/hsk6/lesson-01.json`.
- `feature/supabase-integration` is paused at `3cbccf6`. It is mock-by-default, is not merged into `main`, and has not changed a live Supabase project.
- If Supabase work resumes, first integrate the latest `main` into that feature branch and rerun its full validation.

## Error Handling
- Frontend fetches wrapped in try/catch; fall back to `lib/mockData.ts` on failure
- Backend AI service wrapped in try/catch; return structured mock on failure
- Missing JSON fields handled with `.get()` and sensible defaults in Python services
- No app crash from missing optional lesson data

---

# Backend Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| GET | /api/lessons | List all lessons |
| GET | /api/lessons/{lesson_id} | Get full lesson data |
| POST | /api/ai/explain | Get mock AI explanation |
| GET | /api/notebook | Get mock notebook items |
| POST | /api/notebook/save | Save item to mock notebook |

---

# Success Criteria

✅ App starts successfully: `cd frontend && npm run dev` and `cd backend && python run.py`
✅ Frontend lint and build pass: `npm run lint && npm run build`
✅ Dashboard shows lesson cards loaded from backend
✅ Lesson overview modal opens and displays lesson title + summary
✅ Three-panel lesson study page renders all sections
✅ Vocabulary words in passage are clickable and show popup with explanation
✅ Grammar notes, word distinction tables, exercises, and writing sections render
✅ AI tutor panel responds to questions with mock explanations
✅ Notebook section shows saved items; add/remove works in local state
✅ App remains usable if backend is offline (frontend mock fallback)
✅ Static styling uses Tailwind; inline styles are limited to runtime positioning

---

# Notes for Future Work

1. **Supabase Auth**
   - Resume the isolated mock-by-default foundation only after explicit approval
   - Use email/password signup, six-digit email verification, and separate nickname setup
   - Protect `/dashboard` and `/lessons/*` only after standalone auth is stable
   - Backend validates JWT from Supabase on protected persistence endpoints

2. **Supabase Postgres**
   - Keep lesson content in JSON during the first persistence phase
   - Connect profiles and notebook items first, followed by progress, writing, and submitted exercise attempts
   - Move lesson content into database tables only in a later, separately reviewed phase

3. **Supabase Storage**
   - Allow users to upload PDFs/scans
   - Store in Supabase Storage bucket
   - Trigger OCR/extraction pipeline

4. **Real AI API**
   - Backend receives explain/tutor requests
   - Calls Anthropic Claude (or similar) with structured prompt from `docs/explanation-style.md`
   - Returns structured explanation; frontend renders with appropriate section styling
   - Stream or batch response depending on UX need

5. **OCR / PDF Extraction**
   - Accept uploaded PDF via backend endpoint
   - Run OCR (Tesseract or cloud OCR)
   - Parse extracted text into lesson JSON structure
   - Store in Supabase Postgres

6. **More Lessons**
   - Expand beyond HSK 6 Lesson 1
   - Add lesson selection and progress tracking

7. **Notebook Persistence**
   - Current notebook resets on server restart (in-memory dict)
   - Move to Supabase Postgres; hydrate on load

---

# Do Not Build Yet

These are explicitly out of scope until the prototype phase is complete:

- **Activated authentication** — the isolated Supabase foundation is paused and must not affect current routes
- **Live database changes** — do not link or migrate a remote Supabase project without explicit approval
- **Real AI API calls** — backend AI service returns mock strings only
- **OCR or PDF parsing**
- **File upload**
- **Payment**
- **Real deployment configuration**

---

# Key Constraints

- **Frontend-first prototype** (Next.js + React SPA with App Router)
- **Mock data only now** — `data/hsk6/lesson-01.json` is the only data source
- **No real AI yet** — `ai_service.py` returns mock strings
- **No persistent storage yet** — notebook and progress reset on restart
- **No auth yet** — all routes are open
- **No deployment config yet** — local dev only
- **Explanation quality is the product** — never ship vocabulary popups or AI responses without proper teacher-style explanations
