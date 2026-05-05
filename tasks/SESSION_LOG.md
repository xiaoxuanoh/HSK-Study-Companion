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
