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
| `warmup` | Discussion prompts before the passage, presented together in a card with one clearly separated row per prompt |
| `passage` | Text paragraphs with vocabulary highlights map |
| `vocabulary` | Vocabulary items with pinyin, POS, meaning, examples, synonyms |
| `grammar` | Grammar notes with structure, logic, tone, example, breakdown |
| `word_distinction` | Near-synonym comparison groups |
| `exercise` | Questions with options, correct answer, and reasoning |
| `writing` | Writing prompt with plan, patterns, sample answer |
| `expansion` | Extended reading or listening content |

My Notebook is a course-wide learner workspace rather than a lesson content block. Notebook items retain their source-lesson relationship while being accessed from the dedicated `/notebook` page.

Notebook records use a versioned browser-storage envelope and contain a stable ID, item type, display content, optional source-lesson metadata, an editable personal remark, timestamps, and an optional duplicate-prevention key. Supported types are vocabulary, phrases, grammar, mistakes, and standalone personal notes. The storage implementation is accessed through a repository interface so it can later be replaced without rewriting notebook UI components.

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
