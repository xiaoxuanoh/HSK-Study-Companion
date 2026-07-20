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
                                            ├─> Lesson Toolbar
                                            │     ├─> Dashboard
                                            │     ├─> Current lesson information
                                            │     └─> My Notebook (course-wide page)
                                            │
                                            ├─> Left Panel: Section Navigation
                                            │     ├─> Warm-up
                                            │     ├─> Passage
                                            │     ├─> Vocabulary
                                            │     ├─> Grammar Notes
                                            │     ├─> Word Distinction
                                            │     ├─> Exercises
                                            │     ├─> Writing / Application
                                            │     └─> Expansion
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
  └─> [Add to Notebook] on vocabulary or grammar details, or an incorrect exercise
        ├─> Duplicate check for the same lesson item
        └─> Item saved to versioned browser storage
              └─> Dedicated Notebook page provides:
                    ├─> Search and type filters
                    ├─> Default grouping by source lesson
                    ├─> Source-lesson links
                    ├─> Editable personal remarks
                    ├─> Standalone personal notes
                    └─> Removal with confirmation
```

## Writing / Application Flow

```
Writing / Application Section
  ├─> Review the prompt, writing plan, and useful lesson patterns
  └─> Compose in a large editor
        ├─> Character count updates while typing
        ├─> Draft saves automatically to versioned browser storage
        ├─> [Clear draft] requires confirmation
        ├─> [Reset workspace] requires confirmation and removes local feedback history
        └─> [Get Feedback] saves a feedback entry for the current draft
              ├─> Strengths
              ├─> Grammar and clarity
              ├─> More natural wording
              ├─> Relevant lesson vocabulary
              └─> Revision suggestions (no marks, scores, or grades)
```
