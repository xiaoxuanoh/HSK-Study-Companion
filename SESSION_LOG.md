# Session Log

## 2026-05-04 — Project Setup

- Repository created: HSK-Study-Companion
- Project direction: HSK self-study website focused on teacher-style explanations
- Starting pilot: HSK 6 Lesson 1 — 孩子给我们的启示
- Current version: polished first-draft prototype
- Main goal: design and flow first, full-stack deployable structure later
- Explanation style based on handwritten self-study notes (see docs/explanation-style.md)
- Near synonyms are a major focus — one of the hardest parts for the learner
- Reconstructed Lesson 1 PDF prepared; split page 9 has been merged
- Tech stack: Next.js + React + TypeScript + Tailwind CSS / FastAPI + Python

### Future Plans
- Supabase Auth for login/signup
- Supabase Postgres for lesson content, user progress, notebook items, exercise attempts, AI chat history
- Supabase Storage for uploaded PDFs, scans, lesson page images
- Real AI API through FastAPI backend
- OCR/PDF extraction pipeline

### Git Rule
Do not commit automatically. Only commit when explicitly asked.

### Next Step
Build first-draft prototype with landing, dashboard, lesson overview modal, and lesson study page.

## 2026-05-05 — Baseline Prototype Completed

- Implemented backend FastAPI skeleton and mock endpoints:
  - `GET /health`
  - `GET /api/lessons`
  - `GET /api/lessons/{lesson_id}`
  - `POST /api/ai/explain`
  - `GET /api/notebook`
  - `POST /api/notebook/save`
- Implemented frontend Next.js + TypeScript + Tailwind prototype:
  - Landing page
  - Dashboard lesson card flow
  - Lesson overview modal
  - Three-panel lesson study page
- Wired HSK 6 Lesson 1 mock content from `data/hsk6/lesson-01.json`.
- Added clickable highlighted vocabulary in passage with popup actions.
- Added grammar notes, word distinction tables, exercise reasoning, writing guidance, AI tutor mock panel, and notebook mock section.
- Added project-level `.gitignore` for Python/Node/Next/env/log/editor/OS artifacts.
- Fixed malformed JSON strings in lesson data to restore frontend runtime.
- Created baseline commit:
  - `3da062f` — Scaffold HSK Study Companion prototype (FastAPI + Next.js)

### Next Step
- Pause implementation changes.
- Resume later with UI/content rearrangement and refinement on top of baseline commit `3da062f`.
