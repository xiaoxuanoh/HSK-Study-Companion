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
- Hover state: darker amber with cursor-pointer
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
- Panels separated by subtle borders or dividers

## Components

### Vocabulary Highlighted Words
- Inline highlight: soft amber background (`bg-amber-100`)
- Hover state: darker amber (`hover:bg-amber-200`) with cursor-pointer
- Click: small popup card appears near the word
- Popup: white card, subtle shadow, close button

### Selected Lesson Text Actions

- Allow text selection throughout the active lesson content without replacing normal vocabulary clicks.
- From `sm` upward, place a compact dark floating toolbar beside the highlighted range.
- Below `sm`, place the same actions in a fixed dark bar near the bottom edge for larger touch targets.
- Keep the two primary actions concise: `Add to Notebook` and `Explain More`.
- Saved excerpts use the Phrases collection and retain their lesson section and surrounding context.

### Vocabulary Cards
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

### Notebook Collections
- Present each lesson as a horizontal shelf ordered by the most recently updated note.
- Show no more than three equal-size preview cards, then an unboxed `View all notes` selection in the same horizontal sequence immediately after the final preview.
- Place the saved-note count in small muted text beneath the lesson heading; do not repeat the count in the View All tile.
- Clamp long preview content to preserve equal card heights and show personal remarks as a Yes/No status. Keep confirmed removal visible on the card; `View details` opens the complete content plus edit and removal actions in a focused dialog.
- The complete lesson collection uses the same fixed-size cards in a responsive grid with collection-specific search and type filters.

### AI Tutor Panel
- Stable `Study Assistant` header; selected words, grammar points, and excerpts appear as learner messages in the conversation
- Clear chat and Close actions
- Contextual suggestion chips (wrap on smaller widths)
- Scrollable chat area
- Assistant responses use a sage left rule; learner messages use light background bubbles
- Closing and reopening preserves the current lesson-visit conversation; clearing requires confirmation

## Avoid

- Bright primary colors (red, green, blue as hero colors)
- Gamification UI (stars, badges, streaks as hero features)
- Overcrowded dashboards
- Random decorative illustrations
- Features not in spec
