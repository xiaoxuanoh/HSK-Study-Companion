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
                                                  ├─> Contextual suggestion chips
                                                  ├─> Chat-style response thread
                                                  └─> Text input and Send action
```

## Vocabulary Popup Flow

```
Passage Section (middle panel)
  └─> Sage-underlined vocabulary word (visible without hover)
        └─> [Hover / focus] → subtle accent background
              └─> [Click] → scroll-safe popup appears near the word
                    ├─> Sticky action header (Explain More, Add to Notebook, Close)
                    ├─> Word + pinyin
                    ├─> Part of speech
                    ├─> Short meaning
                    ├─> Sample sentence
                    ├─> [Explain more] → loads full explanation in AI tutor panel
                    └─> [Add to Notebook] → saves word once and shows its saved state
```

## Grammar Detail Flow

```
Grammar Notes Section
  └─> Select a grammar card
        └─> Scroll-safe detail popup
              ├─> Sticky action header (Explain More, Add to Notebook, Close)
              ├─> Meaning and structure
              ├─> How it works, tone, and examples
              ├─> [Explain More] → opens the AI tutor with grammar context
              └─> [Add to Notebook] → saves once and shows its saved state
```

## AI Tutor Quick Action Flow

```
AI Tutor Panel (right panel)
  ├─> Contextual suggestion chips:
  │     ├─> Explain simply
  │     ├─> Break down sentence
  │     ├─> Explain grammar
  │     ├─> Compare similar words
  │     ├─> Give examples
  │     ├─> Why is my answer wrong?
  │     └─> Make a mini quiz
  ├─> Closing and reopening retains the conversation for the current lesson visit
  ├─> [Clear chat] removes the current conversation after confirmation
  ├─> Leaving or reloading the lesson starts a fresh conversation
  └─> Typed questions receive mock responses for the selected context
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
                    ├─> Three recent fixed-size previews in a horizontal row
                    ├─> Unboxed [View all notes] selection after the final preview
                    ├─> Lesson collection page with every saved note
                    ├─> Detail popup for complete content and editable personal remarks
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
