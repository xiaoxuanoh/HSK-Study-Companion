# HSK Study Companion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished first-draft full-stack HSK Study Companion prototype focusing on HSK 6 Lesson 1, with teacher-style explanations, near-synonym comparison, and a mock AI tutor panel.

**Architecture:** Next.js frontend (three-panel lesson layout) calls a FastAPI backend that serves mock JSON data. No real auth, database, OCR, or AI API in this phase — all data is mocked. Structure is designed so Supabase Auth/Postgres/Storage and real AI can be added later.

**Tech Stack:** Next.js 14 + React + TypeScript + Tailwind CSS / FastAPI + Python 3.11 / Mock JSON data

---

## Phase 1 — Documentation & Repo Scaffolding

### Task 1: Root-level docs and config files

**Files:**
- Create: `README.md`
- Create: `AGENTS.md`
- Create: `LESSON.md`
- Create: `SESSION_LOG.md`
- Create: `.claude/settings.local.json`
- Create: `.codex/AGENTS.md`
- Create: `assets/reference/README.md`

- [ ] Create `.claude/settings.local.json`
```json
{
  "permissions": {
    "allow": [],
    "deny": []
  }
}
```

- [ ] Create `.codex/AGENTS.md`
```markdown
# Codex Agent Instructions

Refer to the root AGENTS.md for full project rules.

Key rules for Codex:
- Do NOT commit automatically. Only commit when the user explicitly requests it.
- Use mock data only. Do not implement real auth, database, OCR, or AI API.
- Follow the explanation style defined in docs/explanation-style.md.
- Keep frontend and backend modular and separate.
```

- [ ] Create `assets/reference/README.md`
```markdown
# Reference Assets

This folder contains reference materials used during development (e.g., reconstructed lesson PDFs, scan images).

Do not OCR or parse these files programmatically in the app. Use structured JSON in data/ as the source of truth.

Note: The reconstructed Lesson 1 PDF was prepared from textbook scans. Page 9 was originally split into two scans and has been merged into one reconstructed page.
```

- [ ] Create `LESSON.md`
```markdown
# Pilot Lesson Reference

## Lesson Details

- **Course:** HSK Standard Course 6 上
- **Unit:** Unit 1 — 生活点滴 / Moments of life
- **Lesson:** Lesson 1
- **Title (Chinese):** 孩子给我们的启示
- **Title (English):** An epiphany from the children

## Lesson Sections

1. Warm-up (热身)
2. Text / Passage (课文)
3. Vocabulary (词语)
4. Notes / Grammar (注释)
5. Word Distinction / Near Synonyms (词语辨析)
6. Exercises (练习)
7. Application / Writing (应用)
8. Expansion (扩展)

## Source Material

A reconstructed Lesson 1 PDF exists as a reference in assets/reference/. Page 9 was originally split into two scans and has been merged into one reconstructed page.

**Important:** Do not OCR or parse the PDF in the app. Use data/hsk6/lesson-01.json as the structured source of truth for the prototype.

Future lessons should be added by creating new lesson JSON files in data/hsk{level}/.
```

- [ ] Create `SESSION_LOG.md`
```markdown
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
```

- [ ] Create `AGENTS.md`
```markdown
# Agent Instructions — HSK Study Companion

## Project Goal

Build a polished first-draft HSK self-study website that provides teacher-style explanations, near-synonym reasoning, grammar breakdowns, and mock AI tutor support. Start with HSK 6 Lesson 1 as the pilot.

## Current Priority

Build and iterate on the first prototype. Focus on clean structure, realistic mock interactions, and a lesson study flow that can be extended to future lessons.

## Build Principles

- Documentation first. Keep docs updated as the project evolves.
- Use mock data first. All lesson content comes from data/hsk6/lesson-01.json.
- Keep frontend and backend modular and clean.
- Do not overbuild. YAGNI. No features beyond the current spec.
- Structure code so Supabase Auth, Supabase Postgres, Supabase Storage, and real AI API can be added later without a full rewrite.

## Explanation Philosophy

This is not just a vocabulary app. The core value is teacher-style explanations that help learners understand:
1. What the word/grammar means
2. How it functions in a sentence
3. What tone, nuance, or feeling it creates
4. Why it fits in this context
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

- Real authentication (Supabase Auth planned)
- Real database (Supabase Postgres planned)
- Real AI API calls
- OCR or PDF parsing
- File upload
- Payment
- Real deployment configuration

## Coding Style

- TypeScript strict mode in frontend
- Pydantic models in backend
- No inline styles — use Tailwind classes
- Components should be small and focused
- Services layer in backend separates data from routes
- Mock data lives in data/ and is loaded by backend services

## Git Rule

**Do NOT commit automatically.** Only create git commits when the user explicitly asks. After making changes, summarize what was changed and wait for review.
```

- [ ] Create `README.md`
```markdown
# HSK Study Companion

A self-study website for HSK learners that provides teacher-style explanations, near-synonym reasoning, grammar breakdowns, and AI-assisted study support.

**Current Status:** Polished first-draft prototype  
**Current Focus:** HSK 6 Lesson 1 — 孩子给我们的启示 (An epiphany from the children)

---

## The Problem

Textbook and workbook materials for HSK are available, but proper explanations, reasoning, and teacher-like guidance are hard to find. Learners end up copy-pasting content into AI tools repeatedly. This app makes structured HSK study easier with built-in explanations and a context-aware AI tutor.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + React + TypeScript + Tailwind CSS |
| Backend | FastAPI + Python |
| Data (now) | Mock JSON files |
| Auth (future) | Supabase Auth |
| Database (future) | Supabase Postgres |
| Storage (future) | Supabase Storage |
| AI (future) | Real AI API via FastAPI backend |

## MVP Features

- Landing page with product overview
- Dashboard with lesson cards and progress
- Lesson overview modal
- Three-panel lesson study page
- Clickable vocabulary popups with explanations
- Grammar notes in handwritten-note style
- Word distinction / near-synonym comparison tables
- Exercise section with answer reasoning
- Writing section with prompt guidance and mock correction
- AI tutor panel with mock context-aware responses
- Notebook/review section (mock local state)

## Future Plans

- **Supabase Auth** — user login/signup, sessions
- **Supabase Postgres** — lesson content, user progress, saved vocabulary/grammar, exercise attempts, AI message history
- **Supabase Storage** — uploaded PDFs, scans, lesson page images
- **Real AI API** — backend-proxied AI calls for explanations
- **OCR/PDF extraction** — parse uploaded lesson scans

## Not Yet Built

- Authentication
- Real database
- Real AI API
- OCR / PDF parsing
- File upload
- Payment
- Production deployment

## Project Structure

```
HSK-Study-Companion/
├── data/hsk6/         # Mock lesson JSON data
├── backend/           # FastAPI backend
├── frontend/          # Next.js frontend
├── docs/              # Project documentation
└── assets/reference/  # Reference materials (PDFs, scans)
```

## Getting Started

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python run.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
```

---

### Task 2: Detailed documentation files

**Files:**
- Create: `docs/product-brief.md`
- Create: `docs/user-flow.md`
- Create: `docs/design-direction.md`
- Create: `docs/content-structure.md`
- Create: `docs/technical-plan.md`
- Create: `docs/session-logs/2026-05-04.md`

- [ ] Create `docs/product-brief.md`
```markdown
# Product Brief — HSK Study Companion

## Problem

HSK learners (especially at levels 5–6) have access to textbooks and workbooks, but lack proper explanations, grammar reasoning, and teacher-like guidance. The common workaround — copy-pasting content into AI chatbots — is tedious and lacks structure.

## Target Users

- Self-studying HSK learners, especially HSK 5–6
- Learners who have textbooks but want deeper explanations
- People studying without a teacher or tutoring session

## Why HSK 6 First

HSK 6 is where grammar nuance, near-synonym distinctions, and writing sophistication become critical. The vocabulary and grammar at this level require reasoning, not just memorization. This makes HSK 6 the highest-value starting point.

## Core Value Proposition

Not just translation — teacher-style reasoning.

The app explains:
1. What the word or grammar means
2. How it functions in the sentence
3. What tone, nuance, or feeling it creates
4. Why it fits this context
5. Common mistakes to avoid
6. How to use it in a new sentence

## MVP Scope

- HSK 6 Lesson 1 pilot
- Landing + Dashboard + Lesson study flow
- Three-panel lesson layout
- Clickable vocabulary in passage
- Grammar notes (structured handwritten-note style)
- Word distinction / near synonym tables
- Exercise answer reasoning
- Writing prompt guidance with mock correction
- Mock AI tutor panel

## Signature Features

- **Clickable vocabulary in context** — click any highlighted word in the passage to see a quick popup, then open a full explanation in the AI panel
- **Near-synonym comparison tables** — one of the hardest parts of HSK; structured side-by-side comparison
- **Grammar cards in handwritten-note style** — structure, logic, tone, example, breakdown, common mistake
- **Exercise answer reasoning** — not just the correct answer but WHY, and why alternatives are wrong
- **Writing correction** — careful, acknowledges multiple valid expressions; not a rigid single answer
- **AI tutor panel** — context-aware, no copy-pasting required

## Long-Term Vision

- Full HSK 6 course (all lessons)
- HSK 5 and other levels
- User accounts and progress tracking
- Uploaded PDF/scan support
- Community notes
- Spaced repetition for vocabulary review

## Future Infrastructure

- **Supabase Auth** — user login/signup, sessions
- **Supabase Postgres** — lessons, vocabulary, grammar points, user progress, notebook items, exercise attempts, AI chat history
- **Supabase Storage** — uploaded PDFs, scans, lesson images
- **Real AI API** — backend-proxied explanations and tutor responses
```

- [ ] Create `docs/user-flow.md`
```markdown
# User Flow

## Primary Study Flow

```
Landing Page
  └─> [Start Studying] button
        └─> Dashboard
              └─> Lesson Card (Lesson 1: 孩子给我们的启示)
                    └─> [Start / Continue] button
                          └─> Lesson Overview Modal
                                ├─> Lesson title and brief
                                ├─> "What will you learn?" summary
                                ├─> Section list with recommended order
                                └─> [Start Lesson] button
                                      └─> Lesson Study Page (three-panel)
                                            ├─> Left Panel: Section Navigation
                                            │     ├─> Warm-up
                                            │     ├─> Passage
                                            │     ├─> Vocabulary
                                            │     ├─> Grammar Notes
                                            │     ├─> Word Distinction
                                            │     ├─> Exercises
                                            │     ├─> Writing / Application
                                            │     ├─> Expansion
                                            │     └─> Notebook
                                            │
                                            ├─> Middle Panel: Section Content
                                            │     └─> (changes based on left nav selection)
                                            │
                                            └─> Right Panel: AI Tutor
                                                  ├─> Current selected item
                                                  ├─> Language toggle (EN / 中文 / Both)
                                                  ├─> Quick action buttons
                                                  └─> Chat-style response area
```

## Vocabulary Popup Flow

```
Passage Section (middle panel)
  └─> Highlighted vocabulary word
        └─> [Hover] → word darkens
              └─> [Click] → small popup appears
                    ├─> Word + pinyin
                    ├─> Part of speech
                    ├─> Short meaning
                    ├─> Sample sentence
                    ├─> [Explain more] → loads full explanation in AI tutor panel
                    └─> [Save] → saves word to Notebook
```

## AI Tutor Quick Action Flow

```
AI Tutor Panel (right panel)
  ├─> Quick action buttons:
  │     ├─> Explain simply
  │     ├─> Break down sentence
  │     ├─> Explain grammar
  │     ├─> Compare similar words
  │     ├─> Give examples
  │     ├─> Why is my answer wrong?
  │     ├─> Make a mini quiz
  │     └─> Save this
  └─> Chat area shows mock response for selected item
```

## Notebook Save Flow

```
Any section
  └─> [Save] button on vocabulary card / grammar card / exercise explanation
        └─> Item added to Notebook section (local mock state)
              └─> Notebook section shows:
                    ├─> Saved vocabulary
                    ├─> Saved grammar points
                    ├─> Saved wrong answers
                    ├─> Saved AI explanations
                    └─> Saved writing corrections
```
```

- [ ] Create `docs/design-direction.md`
```markdown
# Design Direction

## Overall Feel

**"A serious self-study workspace with a helpful teacher beside you."**

- Calm, modern, academic, focused
- Not childish. Not gamified. Not flashy.
- Clean typography with good spacing
- Supports Chinese and English text clearly side by side

## Color Palette

- Background: warm white or very light gray (#FAFAF8 or #F5F5F2)
- Primary accent: muted slate blue or indigo (not bright)
- Text: dark charcoal (#1C1C1E or similar)
- Secondary text: medium gray
- Borders: soft, light gray
- Highlighted vocabulary: soft amber/yellow tint background
- Hover state: darker amber or slate underline
- Cards: white with subtle shadow

## Typography

- Heading: clean sans-serif (Inter or system-ui)
- Body: readable, good line-height (1.7+)
- Chinese text: ensure font supports CJK characters (use system fonts as fallback)
- Code/example blocks: slight background tint, monospace or semi-mono

## Layout

### Dashboard
- Card-based grid layout
- Each lesson card shows: title (Chinese + English), unit, progress bar, last access, start button
- Clean whitespace between cards

### Lesson Study Page
- Three-panel layout:
  - Left: narrow navigation sidebar (~200–240px), scrollable section tabs
  - Middle: main content panel (flexible width), scrollable
  - Right: AI tutor panel (~320–360px), sticky/fixed-height with internal scroll
- All three panels visible simultaneously on desktop
- Panels should have subtle borders or dividers between them

## Components

### Vocabulary Highlighted Words
- Inline highlight: soft amber background (`bg-amber-100` or similar)
- Hover state: darker amber (`hover:bg-amber-200`) with cursor-pointer
- Click: small popup card appears near the word
- Popup: white card, subtle shadow, close button

### Vocabulary Cards
- Clean card layout
- Chinese word prominent (large font)
- Pinyin in gray below
- Part of speech tag (pill style)
- Meaning, simple explanation, example, near synonyms
- Save button (bookmark icon)

### Grammar Cards
- Structured like handwritten notes but digitally clean
- Labeled sections: Type / Core Meaning / Structure / Logic / Tone / Example / Breakdown / Common Mistake
- Light gray section labels
- Code-block style for structure patterns (e.g., A 固然……，但是 B)

### Word Distinction Tables
- Side-by-side comparison table
- Row labels: Shared meaning / Main difference / Tone / Common usage / Example / Common mistake / Memory clue
- Light table borders, alternating row tint

### Exercise Cards
- Question text
- Option buttons (for multiple choice)
- Reveal button → shows explanation
- Explanation: why correct + why others are wrong

### AI Tutor Panel
- Header with selected item name
- Language toggle: EN | 中文 | Both
- Quick action button row (wraps on smaller widths)
- Scrollable chat area
- Each response: light background bubble, structured content

## Avoid

- Bright primary colors (red, green, blue as hero colors)
- Gamification UI (stars, badges, streaks as hero features)
- Overcrowded dashboards
- Random decorative illustrations
- Features not in spec
```

- [ ] Create `docs/content-structure.md`
```markdown
# Content Structure

## Hierarchy

```
Course
  └─> Level (e.g., HSK 6)
        └─> Unit (e.g., Unit 1 — 生活点滴)
              └─> Lesson (e.g., Lesson 1 — 孩子给我们的启示)
                    └─> Section (e.g., Vocabulary, Grammar Notes)
                          └─> Content Block (e.g., a vocabulary item, a grammar card)
```

This hierarchy is not hardcoded for HSK 6. Future lessons are added by creating new JSON files.

## Adding Future Lessons

- Add `data/hsk6/lesson-02.json`, `lesson-03.json`, etc.
- Add `data/hsk5/lesson-01.json` for HSK 5 content
- Backend lesson service loads any file matching the pattern

## Data File Convention

```
data/
  hsk6/
    lesson-01.json
    lesson-02.json
  hsk5/
    lesson-01.json
```

## Content Block Types

| Type | Description |
|------|-------------|
| `warmup` | Discussion prompts before the passage |
| `passage` | Text paragraphs with vocabulary highlights map |
| `vocabulary` | Vocabulary items with pinyin, POS, meaning, examples, synonyms |
| `grammar` | Grammar notes with structure, logic, tone, example, breakdown |
| `word_distinction` | Near-synonym comparison groups |
| `exercise` | Questions with options, correct answer, and reasoning |
| `writing` | Writing prompt with plan, patterns, sample answer |
| `expansion` | Extended reading or listening content |
| `notebook` | Saved items (local state, not a content block type) |

## Future Database Tables (Not Implemented Yet)

Document only — do not implement:

| Table | Purpose |
|-------|---------|
| `profiles` | User accounts and preferences |
| `lessons` | Lesson metadata (title, unit, level, order) |
| `lesson_sections` | Section metadata per lesson |
| `vocabulary` | Vocabulary items linked to lessons |
| `synonym_groups` | Groups of near-synonyms |
| `synonym_items` | Individual entries in a synonym group |
| `user_progress` | Per-user lesson/section progress |
| `notebook_items` | Saved vocabulary, grammar, mistakes, explanations |
| `exercise_attempts` | User's exercise answer history |
| `ai_messages` | AI tutor conversation history per user per lesson |
| `uploaded_files` | User-uploaded PDFs, scans, images |
```

- [ ] Create `docs/technical-plan.md`
```markdown
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
- Section components: `PassageSection`, `VocabularySection`, `GrammarSection`, `WordDistinctionSection`, `ExercisesSection`, `WritingSection`, `WarmupSection`, `NotebookSection`

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
- Returns structured explanation matching the templates in docs/explanation-style.md
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
```

- [ ] Create `docs/session-logs/2026-05-04.md`
```markdown
# Session Log — 2026-05-04

## Session Goal

Set up the HSK Study Companion project from scratch. Build the full repo structure, documentation, mock data, backend skeleton, and frontend first-draft prototype.

## Decisions Made

### Project Direction
- Start with HSK 6 Lesson 1 as the pilot lesson
- The core value is teacher-style explanations, not just vocabulary translation
- Near synonyms (词语辨析) are a major focus — identified as one of the hardest parts for the learner
- Explanation style should mirror handwritten self-study notes: mixed Chinese/English, clear structure, plain language

### Technical Decisions
- Frontend: Next.js 14 + React + TypeScript + Tailwind CSS
- Backend: FastAPI + Python
- Data: Mock JSON files in data/hsk6/
- No real auth, database, OCR, or AI API in this phase
- Backend service layer designed to be swappable with Supabase Postgres later
- Frontend API layer designed to be swappable with real backend later

### Content Decisions
- Passage section: highlight key vocabulary inline; click to open popup
- AI tutor panel: always visible on lesson page; context-aware via selected item
- Writing correction section: careful language — "suggested correction," not "the only correct version"
- Notebook: local mock state for now; designed for Supabase Postgres later

### Reference Material
- Reconstructed Lesson 1 PDF prepared from textbook scans
- Page 9 was originally split into two scans; merged into one reconstructed page
- PDF is a reference only — do not OCR or parse in this phase

## Files Created This Session

### Documentation
- README.md
- AGENTS.md
- LESSON.md
- SESSION_LOG.md
- .claude/settings.local.json
- .codex/AGENTS.md
- assets/reference/README.md
- docs/product-brief.md
- docs/user-flow.md
- docs/design-direction.md
- docs/content-structure.md
- docs/explanation-style.md
- docs/technical-plan.md
- docs/session-logs/2026-05-04.md (this file)

### Data
- data/hsk6/lesson-01.json

### Backend
- backend/app/main.py
- backend/app/api/ (health, lessons, ai, notebook)
- backend/app/core/config.py
- backend/app/models/ (lesson, notebook)
- backend/app/services/ (lesson_service, ai_service, notebook_service)
- backend/requirements.txt
- backend/.env.example
- backend/run.py
- backend/README.md

### Frontend
- frontend/ (Next.js 14 project)
- frontend/app/ (landing, dashboard, lesson pages)
- frontend/components/ (all lesson, dashboard, layout components)
- frontend/lib/ (types, api, mockData)

## Git Rule

Do not commit automatically. Only commit when explicitly asked by the user.

## Next Steps

1. Review documentation files
2. Review mock data structure
3. Test backend endpoints (run FastAPI dev server)
4. Review frontend pages and components in browser
5. Iterate on explanation style and content depth
6. Plan next session: add more lesson content, improve AI tutor responses
```

---

### Task 3: Explanation style doc

**Files:**
- Create: `docs/explanation-style.md`

- [ ] Create `docs/explanation-style.md` with full templates (see content below — this is the most important doc)

Content:
```markdown
# Explanation Style Guide

The explanation style should help the learner understand HSK content the way a good teacher would explain it — not just translation, but reasoning, nuance, and usage guidance.

## Grammar Explanation Template

Each grammar point should include:

| Field | Description |
|-------|-------------|
| Grammar Point | The word or pattern |
| Type | Part of speech or grammatical category |
| Core Meaning | One clear sentence |
| Structure | Pattern formula |
| Logic | What A and B represent |
| Tone | Formal/informal, written/spoken, feel |
| Example | Authentic or textbook sentence |
| Breakdown | Component-by-component explanation |
| Common Mistake | What learners get wrong |
| Mini Practice | A fill-in or textbook connection |

### Example

**Grammar Point:** 固然

**Type:** Conjunction

**Core Meaning:** Used to acknowledge that A is true, while emphasizing B as more important or as a contrast.

**Structure:**
```
A 固然……，但是 / 可是 / 却 / 然而 B……
```

**Logic:**
- A = admitted fact (the speaker accepts this is true)
- B = the speaker's real focus, stronger point, or counterpoint

**Tone:** Formal / written. Often used when the speaker means: "Yes, A is true, but B matters more." Rarely used in casual conversation.

**Example:**
> 这项工作固然很辛苦，可是很有意义。

**Breakdown:**
- 这项工作固然很辛苦 → admits that the work is tiring (A)
- 可是很有意义 → emphasizes that the work is meaningful (B)

**Common Mistake:** Do not use 固然 when there is no contrast or shift in focus. It requires a B clause to complete the meaning.

**Mini Practice:** Textbook connection — appears in Lesson 1 exercises; try using it to write a sentence about study habits.

---

## Vocabulary Explanation Template

| Field | Description |
|-------|-------------|
| Word | Chinese characters |
| Pinyin | Pronunciation |
| Part of Speech | Noun, verb, adj, adv, etc. |
| Core Meaning | One clear sentence |
| Simple Explanation | Plain language, learner-friendly |
| Usage Feeling | When and how it's used; tone |
| Common Collocations | Common word partners |
| Example Sentence | Chinese example |
| Translation | English translation |
| Near Synonyms | Related words to compare |
| Common Mistake | What learners get wrong |

### Example

**Word:** 启示  
**Pinyin:** qǐshì  
**Part of Speech:** Noun

**Core Meaning:** An insight, lesson, or realization gained from an experience.

**Simple Explanation:** When something happens and you learn an important idea from it — that idea is 启示. It's the "lesson life taught you."

**Usage Feeling:** Slightly formal. Often used in writing or reflection. Feels like something meaningful was gained.

**Common Collocations:** 给我启示 / 从……中得到启示 / 启示我们

**Example Sentence:** 这件事给了我很大的启示。

**Translation:** This incident gave me a great lesson / insight.

**Near Synonyms:** 启发、感悟、领悟

**Common Mistake:** 启示 (insight/revelation) vs 启发 (to inspire/enlighten) — 启示 is usually a noun; 启发 can be a verb. "老师启发了我" (correct) vs "老师启示了我" (less natural).

---

## Word Distinction / Near Synonym Template

Use table format where possible.

| Field | Description |
|-------|-------------|
| Shared Meaning | What both words have in common |
| Main Difference | The key distinction |
| Tone | Formal/informal, written/spoken, intensity |
| Common Usage | Typical contexts or collocations |
| Example | Sentence showing the distinction |
| Common Mistake | What learners confuse |
| Memory Clue | A phrase or trick to remember the difference |

### Example

**当然 vs 固然**

| | 当然 | 固然 |
|--|------|------|
| Core meaning | Of course / naturally | Admittedly / indeed |
| Function | Confirms something expected or obvious | Concedes A before making point B |
| Tone | Neutral to casual | Formal, written |
| Requires contrast? | No | Yes — needs a B clause |
| Example | 当然可以。Of course. | 这固然重要，但……This is admittedly important, but… |
| Common mistake | Sometimes confused when both seem to mean "yes/sure" | Using 固然 without a contrasting B clause |
| Memory clue | 当然 = "of course" (natural/obvious) | 固然 = "admittedly true, but…" (concession + contrast) |

---

## Exercise Explanation Template

| Field | Description |
|-------|-------------|
| Question | The exercise question |
| User Answer | The learner's selected answer (if available) |
| Correct Answer | The correct option |
| Why Correct | Reasoning for the correct answer |
| Why Others Are Wrong | Option-by-option explanation of distractors |
| Related Grammar/Vocab | What concept this exercise tests |
| Mistake Reason | Why learners commonly get this wrong |
| Save to Notebook | Option to save this mistake |
| Generate Similar | Option to create a similar practice question |

---

## Writing / Application Feedback Template

**Important:** Be careful and accurate. Do not present every correction as the only possible answer. More than one correct expression may exist.

| Field | Description |
|-------|-------------|
| Prompt Explanation | What the writing task asks for |
| Writing Plan | Suggested structure (e.g., intro / example / reflection) |
| Useful Sentence Patterns | Key patterns for this topic |
| Sample Answer | A complete model answer |
| User Draft Area | Text area for learner's own writing |
| Suggested Correction | Specific correction with explanation |
| Why | The reason for the correction |
| Alternative Natural Version | Another valid way to express it |
| Note | Reminder that multiple correct versions exist |

### Correction Language

Use wording like:
- "Suggested correction: …"
- "A more natural version: …"
- "Another possible expression: …"
- "Both … and … are acceptable here."
- "This is grammatically correct but sounds more natural as …"

Avoid:
- "This is wrong." (without explanation)
- "The correct answer is …" (implies only one option)
- Correcting style choices that are actually valid
```

---

## Phase 2 — Mock Data

### Task 4: lesson-01.json

**Files:**
- Create: `data/hsk6/lesson-01.json`

- [ ] Create `data/hsk6/lesson-01.json` with representative sample content

The JSON should include:
- lesson metadata
- warmup prompts
- passage paragraphs with vocabularyHighlights map
- vocabulary items (subset of the full vocab list)
- grammar notes
- word distinction groups
- exercises
- writing prompt
- expansion sample
- notebook mock items

(Full content in Task 4 implementation step)

---

## Phase 3 — Backend

### Task 5: FastAPI project setup

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/.env.example`
- Create: `backend/run.py`
- Create: `backend/README.md`
- Create: `backend/app/__init__.py`
- Create: `backend/app/core/__init__.py`
- Create: `backend/app/core/config.py`
- Create: `backend/app/api/__init__.py`
- Create: `backend/app/models/__init__.py`
- Create: `backend/app/services/__init__.py`
- Create: `backend/tests/__init__.py`

- [ ] Create `backend/requirements.txt`
```
fastapi==0.111.0
uvicorn[standard]==0.29.0
pydantic==2.7.1
pydantic-settings==2.2.1
python-dotenv==1.0.1
httpx==0.27.0
pytest==8.2.0
pytest-asyncio==0.23.6
```

- [ ] Create and run backend setup:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Task 6: Backend models and config

**Files:**
- Create: `backend/app/core/config.py`
- Create: `backend/app/models/lesson.py`
- Create: `backend/app/models/notebook.py`

### Task 7: Backend services

**Files:**
- Create: `backend/app/services/lesson_service.py`
- Create: `backend/app/services/ai_service.py`
- Create: `backend/app/services/notebook_service.py`

### Task 8: Backend routes and main app

**Files:**
- Create: `backend/app/api/health.py`
- Create: `backend/app/api/lessons.py`
- Create: `backend/app/api/ai.py`
- Create: `backend/app/api/notebook.py`
- Create: `backend/app/main.py`
- Create: `backend/run.py`

---

## Phase 4 — Frontend

### Task 9: Next.js project scaffold

**Files:**
- Create: `frontend/` (via `npx create-next-app@latest`)
- Create: `frontend/.env.local.example`
- Create: `frontend/lib/types.ts`
- Create: `frontend/lib/api.ts`
- Create: `frontend/lib/mockData.ts`

- [ ] Scaffold Next.js:
```bash
cd /path/to/HSK-Study-Companion
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

### Task 10: Shared types and API client

**Files:**
- Create: `frontend/lib/types.ts`
- Create: `frontend/lib/api.ts`
- Create: `frontend/lib/mockData.ts`

### Task 11: Landing page

**Files:**
- Modify: `frontend/app/page.tsx`
- Modify: `frontend/app/layout.tsx`

### Task 12: Dashboard page and lesson card

**Files:**
- Create: `frontend/app/dashboard/page.tsx`
- Create: `frontend/components/dashboard/LessonCard.tsx`
- Create: `frontend/components/dashboard/LessonOverviewModal.tsx`

### Task 13: Lesson study page and three-panel layout

**Files:**
- Create: `frontend/app/lessons/[id]/page.tsx`
- Create: `frontend/components/layout/ThreePanel.tsx`
- Create: `frontend/components/lesson/LeftNav.tsx`
- Create: `frontend/components/lesson/AITutorPanel.tsx`

### Task 14: Passage section with vocabulary popups

**Files:**
- Create: `frontend/components/lesson/sections/PassageSection.tsx`
- Create: `frontend/components/lesson/VocabPopup.tsx`

### Task 15: Vocabulary, Grammar, Word Distinction sections

**Files:**
- Create: `frontend/components/lesson/sections/VocabularySection.tsx`
- Create: `frontend/components/lesson/sections/GrammarSection.tsx`
- Create: `frontend/components/lesson/sections/WordDistinctionSection.tsx`

### Task 16: Exercises, Writing, Warmup sections

**Files:**
- Create: `frontend/components/lesson/sections/ExercisesSection.tsx`
- Create: `frontend/components/lesson/sections/WritingSection.tsx`
- Create: `frontend/components/lesson/sections/WarmupSection.tsx`

### Task 17: Notebook section and Expansion section

**Files:**
- Create: `frontend/components/lesson/sections/NotebookSection.tsx`
- Create: `frontend/components/lesson/sections/ExpansionSection.tsx`
```
