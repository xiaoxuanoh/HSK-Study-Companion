# Agent Instructions — HSK Study Companion

## Project Goal

Build a polished first-draft HSK self-study website that provides teacher-style explanations, near-synonym reasoning, grammar breakdowns, and mock AI tutor support. Start with HSK 6 Lesson 1 as the pilot.

## Current Priority

Continue refining the tested prototype's UI, lesson flow, mobile layout, writing experience, and accessibility. Supabase work is paused on `feature/supabase-integration`; do not merge, extend, or activate it unless the user explicitly resumes that work.

## Build Principles

- Documentation first. Keep docs updated as the project evolves.
- Use mock data first. All lesson content comes from data/hsk6/lesson-01.json.
- Keep frontend and backend modular and clean.
- Do not overbuild. YAGNI. No features beyond the current spec.
- Structure code so Supabase Auth, Supabase Postgres, Supabase Storage, and real AI API can be added later without a full rewrite.
- Keep lesson data and study routes working in mock mode. No live Supabase project has been linked or modified.

## Explanation Philosophy

This is not just a vocabulary app. The core value is teacher-style explanations that help learners understand:
1. What the word/grammar means
2. How it functions in a sentence
3. What tone, nuance, or feeling it creates
4. Why it fits this context
5. Common mistakes to avoid
6. How to use it in a new sentence

See docs/explanation-style.md for full templates.

## MVP Scope

- Landing page
- Dashboard with lesson cards
- Lesson overview modal
- Lesson study page (three-panel layout)
- Sections: Warm-up, Passage, Vocabulary, Grammar Notes, Word Distinction, Exercises, Writing, Expansion, Notebook
- Clickable vocabulary popups in Passage section
- AI tutor panel with mock responses
- FastAPI backend with mock endpoints

## Do Not Build Yet

- Real authentication (a mock-by-default foundation is paused on a separate branch)
- Real database activation or migration application
- Real AI API calls
- OCR or PDF parsing
- File upload
- Payment
- Real deployment configuration

## Coding Style

- TypeScript strict mode in frontend
- Pydantic models in backend
- Use Tailwind classes for static styling. Inline styles are allowed only for runtime-computed values such as draggable or popup coordinates.
- Components should be small and focused
- Services layer in backend separates data from routes
- Mock data lives in data/ and is loaded by backend services

## Git Rule

**Do NOT commit automatically.** Only create git commits when the user explicitly asks. After making changes, summarize what was changed and wait for review.

## Current Branch State

- `main` and `origin/main` contain the tested Next.js 16 security upgrade at `e41f637`.
- `feature/supabase-integration` contains the paused Supabase foundation at `3cbccf6` and is not part of `main`.
- Do not assume pushing `main` includes or activates Supabase.
