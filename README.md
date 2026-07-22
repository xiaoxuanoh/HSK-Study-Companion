# HSK Study Companion

A self-study website for HSK learners that provides teacher-style explanations, near-synonym reasoning, grammar breakdowns, and AI-assisted study support.

**Current Status:** Polished interactive prototype with learner-approved responsive/accessibility, AI-chat, Notebook shelf, and cross-device lesson text-selection refinements
**Current Focus:** HSK 6 Lesson 1 — 孩子给我们的启示 (An epiphany from the children)

---

## The Problem

Textbook and workbook materials for HSK are available, but proper explanations, reasoning, and teacher-like guidance are hard to find. Learners end up copy-pasting content into AI tools repeatedly. This app makes structured HSK study easier with built-in explanations and a context-aware AI tutor.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16.2.10 + React 19.2.7 + TypeScript 5.9.3 + Tailwind CSS |
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
- Writing workspace with prompt guidance, an autosaved local draft, character counter, confirmed reset controls, and retained supportive feedback history
- Responsive AI Tutor with mock context-aware responses, current-visit chat retention, confirmed clearing, and selectable response text
- Cross-device lesson text selection with contextual Add to Notebook and Explain More actions
- AI Tutor launchers on lesson and Notebook routes, with selected Tutor text saved as contextual Phrases
- Dedicated course-wide Notebook with versioned browser persistence, horizontal three-note lesson previews, full lesson collections, fixed-size detail cards, search, filters, remarks, personal notes, and mistake review

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

## Branch Status

- `main` contains the tested framework upgrade.
- `agent/add-lesson-navigation` contains the reviewed responsive/accessibility, AI-chat, Notebook collection, and cross-device lesson text-selection checkpoints.
- `feature/supabase-integration` contains a mock-by-default Supabase foundation and is intentionally paused.
- No live Supabase project has been linked or modified, and existing website routes do not depend on Supabase.

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

For a production-like local preview, stop any running development server first, then run:

```bash
cd frontend
npm run build
npm run start
```
