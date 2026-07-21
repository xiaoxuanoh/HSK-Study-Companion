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

### Isolated build validation while development continues

If the running development server should not be stopped, do not run `next build` against the same `frontend/.next` directory. Validate from an isolated temporary checkout or copy instead.

- Include the repository-level `data/` directory because `frontend/lib/mockData.ts` imports `data/hsk6/lesson-01.json`.
- Reuse the installed `frontend/node_modules` through a temporary symlink when appropriate.
- Run lint and the webpack production build in the temporary frontend directory.
- A temporary build that omits `data/` will fail with `Can't resolve '../../data/hsk6/lesson-01.json'`; that is a validation-copy problem, not an application regression.

## Notebook item terminology

- Existing selectable words in the Passage are curated vocabulary entries, including multi-character Chinese words.
- Reserve `phrase` for reusable collocations, chunks, or selected excerpts rather than treating every multi-character word as a phrase.
- The Notebook data model may keep phrase support future-ready even when no current UI creates phrase records.
- A future text-selection menu may offer “Add to Notebook,” “Ask AI Tutor,” and “Explain selection”; it should not automatically claim that every arbitrary selection is linguistically a phrase.

---

## Next.js 16 Upgrade Patterns

- Next.js 16 removes `next lint`. Use the ESLint CLI through `npm run lint`, backed by `frontend/eslint.config.mjs`.
- Keep ESLint on the latest compatible 9.x release until all plugins bundled by `eslint-config-next` support ESLint 10. The top-level peer range alone is not sufficient; inspect transitive plugin peer ranges.
- App Router dynamic `params` are promises. Client pages should type them as `Promise<...>` and unwrap them with React `use()`.
- Turbopack restricts module resolution to its configured root. Because lesson JSON lives outside `frontend/`, keep `turbopack.root` pointed at the repository root in `next.config.mjs`.
- Next.js 16.2.10 pins an older nested PostCSS copy. Keep the global `postcss` override aligned with the direct patched PostCSS version and verify with `npm ls postcss` plus `npm audit --omit=dev`.
- After replacing framework dependencies, stop old dev processes and use a clean install. Errors such as missing `next-flight-client-entry-loader` during hot reload usually indicate the old server is observing a partially replaced dependency tree.
- A production preview is `npm run build` followed by `npm run start`; do not judge a major upgrade from a hot-reloaded process that started before the package change.

---

## VocabPopup Positioning Pattern

The vocab popup uses `position: fixed` with coordinates from `getBoundingClientRect()` at click time.

- `above` flag: `rect.bottom > window.innerHeight * 0.6` — popup appears above the word when near the bottom of the viewport
- x clamp: `Math.max(8, Math.min(rect.left, window.innerWidth - 328))` — prevents right-edge bleed (328 = max-w-xs 320 + 8px margin)
- Do NOT use `position: absolute` for this — the content panel is a scrollable container and absolute offsets would be wrong
- Do NOT try to reposition based on `aiOpen` at click time — instead, close the popup when "Explain More" is clicked (Option A, confirmed by user)

## Lesson Card and Detail Popup Alignment

- Vocabulary and grammar summary cards must use top-aligned flex columns. Do not vertically center the card body: definitions with different line counts will otherwise move the word/title vertically.
- Give term/title, pronunciation or badge, and definition their own layout regions so wrapping in one region does not shift another.
- Long vocabulary and grammar details use scroll-safe popups with a sticky action header. Keep `Explain More`, `Add to Notebook` / saved state, and `Close` available without requiring the user to scroll to the bottom.
- Keep popup action controls compact and allow responsive wrapping for narrow viewports or long titles. A separator below the sticky actions is unnecessary unless the content hierarchy becomes unclear.
- Both vocabulary and grammar details support `Explain More`; grammar should hand the selected grammar point and its explanation context to the AI Tutor.

## AI Tutor Panel — Chatbot State Shape

The AI tutor panel uses a messages array, not a single response string:
```ts
messages: { role: 'user' | 'assistant'; content: string }[]
currentFocus: string  // the word or topic being studied
```

- `onExplain` (word clicked → Explain More): appends assistant message only — no user bubble
- `onAsk` (suggestion chip or typed input): appends user message then assistant response
- `handleAiClose`: hides the panel without deleting the current lesson-visit conversation
- `handleAiClear`: clears both `messages` and `currentFocus` after user confirmation
- Leaving or reloading the lesson starts a fresh conversation; persistent cross-visit chat history is deferred
- Panel stays open + new word explained: messages accumulate, `currentFocus` updates to new word
- Below the `xl` breakpoint the Tutor is a modal dialog with trapped focus; at `xl` and above it is an inline complementary panel that does not trap keyboard users

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
  - Writing/Application workspace with lesson guidance, a locally autosaved editor, character count, confirmed clearing controls, supportive feedback, and retained feedback history
  - Expansion reading card with comfortable Chinese typography and a visually distinct English translation
- My Notebook is a dedicated course-wide `/notebook` workspace backed by a versioned browser-storage repository.
- It supports vocabulary, grammar, exercise mistakes, future phrases, and personal notes with search, filtering, source grouping, editable remarks, and confirmed removal.
- Keep each lesson overview compact: order by most recently updated, show at most three equal-size note previews in a horizontal row, and place an unboxed `View all notes` selection immediately after the final preview regardless of the saved-note count.
- Keep full remarks out of the fixed-height preview card and represent their presence as Yes/No. Keep confirmed removal visible on the card. `View details` opens the complete note and its edit/remove actions in an accessible popup; `/notebook/[lessonId]` provides the complete searchable collection.
- Writing/Application drafts and non-scored feedback histories are retained per lesson through a separate versioned browser-storage repository.
- AI tutor panel is mock-only in this phase.
