# Agent Instructions — HSK Study Companion

## Project Goal

Build a polished first-draft HSK self-study website that provides teacher-style explanations, near-synonym reasoning, grammar breakdowns, and mock AI tutor support. Start with HSK 6 Lesson 1 as the pilot.

## Current Priority

The latest `agent/add-lesson-navigation` checkpoint includes all eight lesson-refinement points, navigation/card/popup polish, the reviewed responsive/accessibility and AI-chat work, the learner-approved Notebook shelf refinement, and cross-device lesson text selection with Add to Notebook and Explain More actions. The current refinement extends the Tutor launcher to Notebook routes and applies the same scoped actions to Tutor conversation text. Supabase work remains paused on `feature/supabase-integration`; do not merge, extend, or activate it unless the user explicitly resumes that work.

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
- Lesson study page with section navigation, content, and mock AI tutor
- Sections: Warm-up, Passage, Vocabulary, Grammar Notes, Word Distinction, Exercises, Writing, Expansion
- Dedicated course-wide My Notebook page with versioned browser persistence
- Clickable vocabulary popups in Passage section
- Cross-device selected-text actions for saving contextual Phrases or opening AI Tutor
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

### GitHub Publishing

- Direct Git commits and pushes to `origin` are supported through the configured HTTPS remote and macOS Keychain credential helper.
- The GitHub CLI (`gh`) is not installed and is not required for ordinary `git commit` or `git push` operations. Only treat it as a prerequisite when a GitHub-specific operation such as opening or managing a pull request actually requires it.
- Before reporting a GitHub authentication blocker, verify the branch/upstream with `git status -sb` and `git branch -vv`; use the existing tracked remote for an explicitly requested push.

## Current Branch State

- `main` and `origin/main` contain the tested Next.js 16 security upgrade at `e41f637`.
- `agent/add-lesson-navigation` contains the learner-approved responsive/accessibility, AI-chat, Notebook shelf/collection, and selected-text workflows in its latest checkpoint.
- The latest checkpoint passes ESLint, TypeScript, backend pytest, `git diff --check`, and an isolated production build.
- `feature/supabase-integration` contains the paused Supabase foundation at `3cbccf6` and is not part of `main`.
- Do not assume pushing `main` includes or activates Supabase.
