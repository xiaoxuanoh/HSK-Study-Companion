# Session Log

## 2026-07-17 — Upgraded Baseline Reconfirmed

- Reconfirmed the Next.js 16 baseline without changing application code.
- Frontend validation completed:
  - `npm run lint` — passed
  - `npx tsc --noEmit` — passed
  - `npm run build` — passed; `/`, `/dashboard`, and `/lessons/[id]` generated successfully
  - `npm audit --omit=dev` — 0 vulnerabilities
- Backend validation completed:
  - `python -m pytest tests/` — 1 passed
- Production-preview route checks returned HTTP 200 for `/`, `/dashboard`, and `/lessons/hsk6-lesson-01`.
- Backend checks returned HTTP 200 for `/health` and `/api/lessons/hsk6-lesson-01`, with the expected lesson ID and title.
- Verified the backend-offline edge case in headless Chrome: with FastAPI stopped, the lesson rendered from local fallback data with the expected title and section labels.
- Restored the frontend and backend development servers on ports 3000 and 8000 after validation.

### Environment Notes

- The first production build attempt was blocked by the managed sandbox because Turbopack's PostCSS worker could not bind an internal local port; the same build passed with local-process permission.
- The first npm audit attempt was blocked by sandbox DNS; it passed with registry network access.
- Headless Chrome wrote the expected offline-fallback DOM but did not exit by itself, so the completed browser process was terminated after its output was inspected.

### Next Step

- Begin a focused mobile and accessibility review of the lesson-study experience.

## 2026-07-17 — Documentation Alignment and Review

- Updated the root and frontend READMEs, technical plan, Claude guide, Codex agent instructions, session log, and accumulated lessons to match the current repository.
- Recorded Next.js 16.2.10, React 19.2.7, TypeScript 5.9.3, ESLint 9 flat configuration, and the PostCSS security override.
- Clarified that `main`/`origin/main` contain the verified framework upgrade at `e41f637`.
- Clarified that the Supabase foundation is paused separately at `feature/supabase-integration` commit `3cbccf6` and has not modified a live Supabase project.
- Kept the original `docs/superpowers/` implementation plan unchanged as a historical snapshot.
- Reviewed the complete documentation diff against the current branches, dependency manifests, Next.js configuration, ESLint configuration, and installed PostCSS tree.
- Resolved conflicting validation guidance so active development uses lint and TypeScript checks, while production builds run only after the development server is stopped.
- `git diff --check` passed.

### Next Step

- Continue product refinement with a focused mobile and accessibility review; keep Supabase paused until explicitly resumed.

## 2026-07-16 — Next.js 16 Security Upgrade

- Saved the unfinished Supabase foundation on its isolated feature branch before touching the framework baseline.
- Created `chore/nextjs-security-upgrade` from unchanged `main` and upgraded:
  - Next.js 14.2.18 → 16.2.10
  - React and React DOM 18.3.1 → 19.2.7
  - TypeScript 5.6.3 → 5.9.3
  - React, React DOM, and Node type definitions
  - ESLint to supported 9.39.5 with `eslint.config.mjs`
  - PostCSS, Autoprefixer, and Tailwind CSS 3 patch versions
- Replaced removed `next lint` usage with the ESLint CLI.
- Updated the dynamic lesson route to unwrap promised `params` with React `use()`.
- Added a repository-level Turbopack root so frontend fallback code can continue importing lesson JSON from `data/`.
- Added a global PostCSS override to patch Next.js's older nested PostCSS dependency.
- Resolved stricter lint findings by removing a synchronous state update from the draggable AI icon effect and replacing an explicit `any` lesson-section type.
- Validation completed:
  - `npm audit --omit=dev` — 0 vulnerabilities
  - `npm run lint` — passed
  - `npx tsc --noEmit` — passed
  - `npm run build` — passed; `/`, `/dashboard`, and `/lessons/[id]` generated successfully
  - Backend test — 1 passed
- Manually previewed the production frontend with the backend running. Navigation, lessons, typed exercise answers, and feedback behaved as before the upgrade.
- Fast-forwarded the tested upgrade into `main` and pushed commit `e41f637` to `origin/main`.

### Next Step

- Continue product/UI refinement from the upgraded `main`; keep Supabase paused until explicitly resumed.

## 2026-07-16 — Isolated Supabase Foundation Paused

- Saved the mock-by-default Supabase foundation at `feature/supabase-integration` commit `3cbccf6`.
- The isolated branch contains local Supabase configuration, a profiles/notebook migration, and standalone email/password signup, six-digit verification, nickname setup, and sign-in pages.
- Existing landing, dashboard, lesson, JSON, and FastAPI flows were not changed or protected.
- No remote Supabase project was linked or modified.
- Local migration execution and isolation testing remain pending because the first Docker image download timed out.
- Supabase implementation is intentionally paused; the branch was not merged or pushed as part of the Next.js upgrade.

### Next Step

- If Supabase is resumed later, first integrate the latest `main` into the feature branch, then complete local migration, RLS, and cross-user isolation tests before connecting notebook persistence.

## 2026-07-14 — Interactive Lesson UI Checkpoint

- Added compact responsive vocabulary cards that open detailed vocabulary popups.
- Added compact grammar cards with a wider, scroll-safe detail popup.
- Added interactive fill-in-the-blank and multiple-choice exercises with independent answer state, submission feedback, reasoning, and retry actions.
- Added keyboard focus/dialog behavior and popup dismissal improvements.
- Saved the completed UI checkpoint on `main` before beginning the isolated Supabase work.

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

## 2026-05-05 — Dashboard Layout Redesign

- Added `CLAUDE.md` to project root as the working guide for Claude Code sessions.
- Configured ESLint (ESLint 8 + `eslint-config-next@14`) — was missing entirely; added `.eslintrc.json`.
- Fixed pre-existing TypeScript error in `app/lessons/[id]/page.tsx` (`part` parameter implicitly typed as `any`).
- Redesigned dashboard page (`app/dashboard/page.tsx`):
  - Moved "Lesson Dashboard" title from left sidebar to top header bar.
  - Removed left sticky panel entirely.
  - Each unit row is a horizontally scrollable flex row.
  - First item in each row is an inline unit header (large bold Chinese title, no card box).
  - Lesson cards widened and font sizes increased for readability.
  - Button shows "Start" (progress = 0) or "Continue" (progress > 0); both open lesson overview modal.
- Expanded `lib/mockData.ts` with `mockCourseStructure`: all 5 units × 4 lessons (20 total); only Unit 1 Lesson 1 has real content.
- Updated `lib/api.ts` fallback to return full course structure instead of single lesson.

### Bug Encountered: Stale `.next` Cache After Package Install
Installing `eslint` and `eslint-config-next` while the dev server was running caused webpack module errors:
- `TypeError: __webpack_modules__[moduleId] is not a function`
- `Error: Cannot find module './[hash].js'`

**Fix applied:** Kill dev server → `rm -rf .next` → restart.
**Lesson logged in `LESSON.md`:** Always stop the dev server before installing packages.

### Next Step
- Continue refining dashboard layout and visual design as needed.
- Begin work on lesson study page improvements or other features as directed.

## 2026-05-05 — Dashboard & Modal Polish, Color System

### Dashboard
- Removed Start/Continue button from lesson cards — entire card is now the clickable element.
- Card hover: whole card background darkens to `card-hover` (#EDE8DF), same warm tone, not a different color.
- Progress bar added at the bottom of each card (placeholder 0% for all; sage green fill).
- Cards widened to `w-80` so English titles fit on one line without wrapping.
- Unit header block changed to `items-start` — top-aligned with cards instead of vertically centred.

### Color System
- Replaced blue-gray accent with **pastel sage green** across the whole platform.
- Custom colors defined in `tailwind.config.ts`:
  - `paper`: `#F6F1E9` — warm cream page background
  - `card`: `#FDFAF5` — warm white card background
  - `card-hover`: `#EDE8DF` — darker warm tone for card hover
  - `accent`: `#7A9E7E` — pastel sage green
  - `accent-hover`: `#5E8262` — darker sage for button/link hover
  - `ink`: `#2A2825` — warm dark text
  - `muted`: `#7A7268` — warm gray muted text
- Body background updated in `globals.css` to `#F6F1E9`.
- All buttons (landing page, modal) updated to use `hover:bg-accent-hover` — no more blue-gray hover.

### Lesson Overview Modal
- Replaced two-column plain section grid with a single-column checklist.
- Each section row has an empty circle indicator (ready for real completion state later).
- Button label: "Start Lesson" if `progress === 0`, "Continue Lesson" if `progress > 0`.
- Navigation unchanged — button links directly to `/lessons/${lesson.id}`.

### Deferred / Next Steps
- Lesson description in modal: currently a hardcoded generic sentence. When real content is ready, add a `description` field to `lesson-01.json`, expose it through the backend and `LessonSummary` type, and render it dynamically in the modal.
- Section checklist completion state: circles are all empty for now. Wire to real progress data when Supabase is integrated.
- Lesson study page refinements: not yet started this session.
- No commits made this session — user has not asked to commit.

## 2026-05-06 — Lesson Study Page Refinements

### Layout restructure
- Replaced 3-column fixed grid with `flex-col h-screen` layout:
  - Sticky top header bar (2-line: `Lesson N` label + Chinese title + English inline)
  - Body: `flex flex-1 overflow-hidden` — left nav and content scroll independently
  - Left nav and content each have their own `overflow-y-auto`
- Removed all `slate-*` colors from lesson page — now uses `text-ink`, `text-muted`, `bg-card`, `bg-paper` throughout

### Left nav (app/lessons/[id]/page.tsx)
- `aside` is now `bg-paper` with no border — blends into page background
- Inside: a single rounded card box (`rounded-xl border border-stone-200 bg-card shadow-sm`) containing "SECTIONS" label + all nav items
- Active item: `bg-white shadow-sm font-semibold text-ink` (floating white card within the box)
- Inactive items: `text-muted hover:text-ink hover:bg-white/60`
- Removed vertical separator between nav and content

### AI Tutor
- Removed fixed overlay — AI panel now lives inline in the flex row, pushing content when open
- Floating draggable `✦` icon (sage green circle, fixed positioned, bottom-right default)
  - Drag to reposition; click to open panel
  - Icon hides when panel is open
- Panel has a visible `✕` close button (circular, top-right)
- `onExplain` in VocabPopup now also opens the AI panel automatically

### Lesson Overview Modal (components/LessonOverviewModal.tsx)
- Replaced empty circle indicators with `✓` tick marks
- Two-tone: light gray (`text-stone-300`) for incomplete, sage green (`text-accent`) for completed
- Currently all gray since `progress === 0` for all lessons; will update automatically when real progress data is wired

### TypeScript cleanup
- Replaced all `any` types in lesson page with explicit types: `NotebookItem`, `VocabItem`, `WarmupPrompt`, `PassageParagraph`, `GrammarItem`, `DistinctionGroup`, `ExerciseItem`

### Build rule update
- Confirmed: only run `npm run lint` during active dev (safe while dev server is running)
- Never run `npm run build` while dev server is alive — causes stale `.next` chunk hash errors
- Recovery: `pkill -f "next dev" && rm -rf .next && npm run dev`

### Deferred / Next Steps
- Modal description: still hardcoded generic sentence — needs `description` field in JSON + `LessonSummary` type
- Section checklist completion: all gray ticks — wire to real progress data when Supabase is integrated
- No commits made this session — user commits manually when asked

## 2026-06-26 — Vocab Popup Repositioning & AI Tutor Chatbot Redesign

### Vocab Popup (components/VocabPopup.tsx)
- Changed from `absolute` (rendered at bottom of content area) to `fixed` positioned near the clicked word
- Position is calculated from the word's bounding rect at click time (`getBoundingClientRect`)
- Smart flip: if word is below 60% of viewport height, popup appears above the word; otherwise below
- x-axis clamped to prevent bleed off right edge of screen
- Width changed from fixed `w-80` to `w-fit min-w-[200px] max-w-xs` — shrinks to content, no dead whitespace
- Fixed leftover `slate-*` color references to use project color system (`border-stone-200`, `text-muted`, `text-ink`)
- Clicking "Explain More" now closes the popup (Option A) and hands off to the AI panel — avoids popup overlapping AI panel

### AI Tutor Panel (components/AITutorPanel.tsx) — full redesign
- Redesigned from static response box to chatbot-style message thread
- Header: small "AI Tutor" label on top, large word title (`currentFocus`) below — word is now the focus, not the panel label
- Scrollable message thread:
  - Assistant messages: left-aligned with sage green left border (`border-l-2 border-accent`)
  - User messages: right-aligned soft bubble (`bg-paper border border-stone-200`)
- Auto-scrolls to latest message via `bottomRef`
- Suggestion chips appear only after first message (contextual, not always visible)
- Text input + Send button at bottom; Enter key also sends
- Removed EN / 中文 / Both language toggle (was non-functional)

### State changes (app/lessons/[id]/page.tsx)
- Replaced `aiResponse: string` + `focus: string` with `messages: { role: 'user' | 'assistant', content: string }[]` + `currentFocus: string`
- `onAsk` appends user message then assistant response to thread
- `onExplain` (triggered by "Explain More") appends only the assistant response — no user bubble since it's word-click triggered, not user-typed
- `handleAiClose` clears messages and resets `currentFocus` on panel close

### Conversation behavior
- Panel stays open + user clicks "Explain More" on another word: thread continues, focus updates to new word, new explanation appended
- Panel closed then reopened: thread resets (clean state)
- AI responses remain independent per word — no cross-word context bleed unless user explicitly asks

### Deferred / Next Steps
- Locked sections: discussed and deferred — needs Supabase progress tracking first
- Modal description: still hardcoded — deferred
- Section checklist completion: all gray — deferred until Supabase
- No commits made this session — user commits manually when asked
