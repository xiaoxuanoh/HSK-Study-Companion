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

## Dev Server Rule

**Always stop the dev server before installing packages or making dependency changes.**

If the dev server is running when packages are installed, the `.next` build cache becomes stale and the app will throw errors like:
- `TypeError: __webpack_modules__[moduleId] is not a function`
- `Error: Cannot find module './[hash].js'`

**Fix:** Kill the server, delete `.next`, then restart:
```bash
pkill -f "next dev"
rm -rf .next
npm run dev
```

Never rely on hot reload surviving a package install mid-session.

**Also apply this rule after changing any config file** (`tailwind.config.ts`, `next.config.mjs`, `postcss.config.js`). Config changes force a full webpack recompile with new chunk hashes — the running dev server will try to load old chunk names that no longer exist and crash.

**Never run `npm run build` while the dev server is running.** Both processes write to `.next` and will produce conflicting chunk hashes. Always kill the dev server before building.

---

## Source Material

A reconstructed Lesson 1 PDF exists as a reference in assets/reference/. Page 9 was originally split into two scans and has been merged into one reconstructed page.

**Important:** Do not OCR or parse the PDF in the app. Use data/hsk6/lesson-01.json as the structured source of truth for the prototype.

Future lessons should be added by creating new lesson JSON files in data/hsk{level}/.

## Build vs Lint Rule (Critical)

**Never run `npm run build` while the dev server is running.**
- Both write to `.next` with different webpack chunk hashes → `Cannot find module './[hash].js'` crashes
- During active development: only run `npm run lint` (ESLint + TypeScript only, does not touch `.next`)
- Only run `npm run build` after killing the dev server
- Recovery when it happens: `pkill -f "next dev" && rm -rf .next && npm run dev`

---

## Current Prototype Status (Baseline)

- FastAPI mock endpoints are implemented and running against JSON data.
- Next.js prototype pages are implemented:
  - Landing page
  - Dashboard with lesson card + overview modal
  - Lesson study page with three-panel layout
- Lesson sections are wired from `data/hsk6/lesson-01.json`:
  - Warm-up
  - Passage (highlighted clickable vocabulary popup)
  - Vocabulary
  - Grammar notes
  - Word distinction tables
  - Exercises reasoning
  - Writing/application guidance
  - Expansion
  - Notebook (mock local state)
- AI tutor panel is mock-only in this phase.
