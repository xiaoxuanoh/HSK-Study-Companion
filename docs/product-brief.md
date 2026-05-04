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
