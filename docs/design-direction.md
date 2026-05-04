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
