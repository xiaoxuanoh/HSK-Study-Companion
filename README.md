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
