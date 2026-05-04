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
