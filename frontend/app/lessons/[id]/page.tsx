"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import AITutorPanel from "@/components/AITutorPanel";
import ExerciseCard, { type ExerciseItem } from "@/components/ExerciseCard";
import GrammarPopup from "@/components/GrammarPopup";
import TextSelectionActions, { type StudyTextSelection } from "@/components/TextSelectionActions";
import VocabPopup from "@/components/VocabPopup";
import WritingWorkspace from "@/components/WritingWorkspace";
import { askAI, getLesson } from "@/lib/api";
import { getNotebookItemHref, makeNotebookDedupeKey, useNotebook } from "@/lib/notebook";
import type { LessonData } from "@/lib/types";

const sectionOrder = [
  "warmup",
  "passage",
  "vocabulary",
  "grammar",
  "wordDistinction",
  "exercises",
  "writing",
  "expansion"
] as const;

const lessonSectionStorageKey = (lessonId: string) => `hsk-study-companion:lesson-section:${lessonId}`;
const lessonSectionChangeEvent = "hsk-study-companion:lesson-section-change";

type SectionKey = (typeof sectionOrder)[number];

const getSavedLessonSection = (lessonId: string): SectionKey => {
  const savedSection = window.localStorage.getItem(lessonSectionStorageKey(lessonId));
  return savedSection && sectionOrder.includes(savedSection as SectionKey)
    ? (savedSection as SectionKey)
    : "warmup";
};

const subscribeToLessonSection = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(lessonSectionChangeEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(lessonSectionChangeEvent, onStoreChange);
  };
};

type VocabItem = {
  id: string;
  word: string;
  pinyin: string;
  partOfSpeech: string;
  meaning: string;
  simpleExplanation: string;
  example: string;
};

type WarmupPrompt = { id: string; chinese: string; english: string };
type PassageParagraph = { id: string; text: string };
type GrammarItem = {
  id: string;
  grammarPoint: string;
  type: string;
  coreMeaning: string;
  structure: string;
  logic: Record<string, string>;
  tone: string;
  example: string;
  breakdown: string[];
  commonMistake: string;
  miniPractice: string;
};
type DistinctionRow = { dimension: string; word1: string; word2: string };
type DistinctionGroup = { id: string; words: string[]; sharedMeaning: string; comparison: DistinctionRow[] };
export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: lessonId } = use(params);
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const section = useSyncExternalStore<SectionKey>(
    subscribeToLessonSection,
    () => getSavedLessonSection(lessonId),
    () => "warmup"
  );
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [currentFocus, setCurrentFocus] = useState("");
  const [popupWord, setPopupWord] = useState<string | null>(null);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number; above: boolean } | null>(null);
  const [selectedGrammarId, setSelectedGrammarId] = useState<string | null>(null);
  const [grammarPopupPos, setGrammarPopupPos] = useState<{ x: number; y: number; above: boolean } | null>(null);
  const { items: notebook, addItem: addNotebookItem } = useNotebook();
  const [aiOpen, setAiOpen] = useState(false);
  const [iconPos, setIconPos] = useState<{ x: number; y: number } | null>(null);
  const vocabTriggerRef = useRef<HTMLElement | null>(null);
  const grammarTriggerRef = useRef<HTMLElement | null>(null);
  const aiButtonRef = useRef<HTMLButtonElement | null>(null);
  const selectionScopeRef = useRef<HTMLDivElement | null>(null);
  const aiReturnFocusRef = useRef<HTMLElement | null>(null);
  const aiOpenedFromButtonRef = useRef(false);

  const dragState = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  });

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!dragState.current.active) return;
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) dragState.current.moved = true;
      setIconPos({
        x: Math.max(8, Math.min(dragState.current.originX + dx, window.innerWidth - 56)),
        y: Math.max(8, Math.min(dragState.current.originY + dy, window.innerHeight - 56)),
      });
    };
    const onPointerUp = () => {
      if (!dragState.current.active) return;
      dragState.current.active = false;
    };
    const onPointerCancel = () => {
      dragState.current.active = false;
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerCancel);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
    };
  }, []);

  useEffect(() => {
    getLesson(lessonId).then((data) => {
      setLesson(data);
    });
  }, [lessonId]);

  const vocabByWord = useMemo(() => {
    if (!lesson) return {} as Record<string, VocabItem>;
    const map: Record<string, VocabItem> = {};
    for (const item of lesson.sections.vocabulary.items as VocabItem[]) {
      map[item.word] = item;
    }
    return map;
  }, [lesson]);

  const onAsk = async (query: string) => {
    if (!lesson) return;
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    const res = await askAI(lesson.id, query);
    setMessages((prev) => [...prev, { role: "assistant", content: res }]);
  };

  const requestTutorExplanation = async ({
    focus,
    learnerMessage,
    query,
  }: {
    focus: string;
    learnerMessage: string;
    query: string;
  }) => {
    if (!lesson) return;
    setCurrentFocus(focus);
    setMessages((prev) => [...prev, { role: "user", content: learnerMessage }]);
    const res = await askAI(lesson.id, query);
    setMessages((prev) => [...prev, { role: "assistant", content: res }]);
  };

  const handleAiClose = () => {
    setAiOpen(false);
    window.requestAnimationFrame(() => {
      const returnTarget = aiOpenedFromButtonRef.current ? aiButtonRef.current : aiReturnFocusRef.current;
      returnTarget?.focus();
      aiOpenedFromButtonRef.current = false;
      aiReturnFocusRef.current = null;
    });
  };

  const handleAiClear = () => {
    setMessages([]);
    setCurrentFocus("");
  };

  const closeVocabPopup = (restoreFocus = true) => {
    setPopupWord(null);
    setPopupPos(null);
    if (restoreFocus) window.requestAnimationFrame(() => vocabTriggerRef.current?.focus());
  };

  const closeGrammarPopup = (restoreFocus = true) => {
    setSelectedGrammarId(null);
    setGrammarPopupPos(null);
    if (restoreFocus) window.requestAnimationFrame(() => grammarTriggerRef.current?.focus());
  };

  const handleSectionChange = (nextSection: SectionKey) => {
    window.getSelection()?.removeAllRanges();
    window.localStorage.setItem(lessonSectionStorageKey(lessonId), nextSection);
    window.dispatchEvent(new Event(lessonSectionChangeEvent));
    setPopupWord(null);
    setPopupPos(null);
    setSelectedGrammarId(null);
    setGrammarPopupPos(null);
  };

  const getPopupPosition = (rect: DOMRect, maxWidth = 384) => {
    const popupWidth = Math.min(maxWidth, window.innerWidth - 16);
    const x = Math.max(8, Math.min(rect.left, window.innerWidth - popupWidth - 8));
    const above = rect.bottom > window.innerHeight * 0.6;
    return { x, y: above ? rect.top : rect.bottom, above };
  };

  if (!lesson) return <main className="p-4 text-ink sm:p-6">Loading lesson...</main>;

  const notebookSource = {
    lessonId: lesson.id,
    lessonNumber: lesson.lesson.number,
    titleChinese: lesson.lesson.titleChinese,
    titleEnglish: lesson.lesson.titleEnglish,
  };
  const vocabItem = popupWord ? vocabByWord[popupWord] : null;
  const vocabDedupeKey = vocabItem
    ? makeNotebookDedupeKey("vocabulary", lesson.id, vocabItem.word)
    : null;
  const vocabIsInNotebook = vocabItem
    ? notebook.some((item) => item.dedupeKey === vocabDedupeKey)
    : false;
  const savedVocabItem = vocabDedupeKey
    ? notebook.find((item) => item.dedupeKey === vocabDedupeKey)
    : undefined;
  const grammarItems = lesson.sections.grammar.items as GrammarItem[];
  const selectedGrammar = selectedGrammarId
    ? grammarItems.find((item) => item.id === selectedGrammarId) ?? null
    : null;
  const grammarDedupeKey = selectedGrammar
    ? makeNotebookDedupeKey("grammar", lesson.id, selectedGrammar.grammarPoint)
    : null;
  const grammarIsInNotebook = selectedGrammar
    ? notebook.some((item) => item.dedupeKey === grammarDedupeKey)
    : false;
  const savedGrammarItem = grammarDedupeKey
    ? notebook.find((item) => item.dedupeKey === grammarDedupeKey)
    : undefined;
  const phraseDedupeKey = (selection: StudyTextSelection) => makeNotebookDedupeKey(
    "phrase",
    lesson.id,
    `${selection.sectionKey}:${selection.text}`
  );

  const renderPassage = () => {
    const highlights = lesson.sections.passage.vocabularyHighlights as Record<string, string>;
    return (
      <article className="mt-4 max-w-4xl overflow-hidden rounded-xl border border-stone-200 bg-card shadow-sm">
        <div className="border-b border-stone-200 bg-paper/60 px-5 py-3 sm:px-7">
          <p className="text-sm leading-6 text-muted">
            <span className="border-b-2 border-accent/70 font-medium text-ink">带下划线的词语</span>
            可以点击查看详情。 Select an underlined word to view details or ask the AI tutor.
          </p>
        </div>
        <div className="space-y-5 p-5 sm:p-7">
          {(lesson.sections.passage.paragraphs as PassageParagraph[]).map((p) => {
            const parts = p.text.split(/(爽快|嚷嚷|拿手|郑重|疑惑|反问|瞬间|意识|忽略|宽容|嫉妒|嘲笑|讨好|附和|融洽|亲密|固然|督促|约束|启示|和睦)/g);
            return (
              <p key={p.id} className="relative text-lg leading-9 text-ink">
                {parts.map((part, idx) => {
                  if (highlights[part]) {
                    return (
                      <button
                        key={`${p.id}-${idx}`}
                        type="button"
                        aria-haspopup="dialog"
                        aria-expanded={popupWord === part}
                        onClick={(e) => {
                          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                          vocabTriggerRef.current = e.currentTarget;
                          setSelectedGrammarId(null);
                          setGrammarPopupPos(null);
                          setPopupWord(part);
                          setPopupPos(getPopupPosition(rect));
                        }}
                        className={`rounded-sm border-b-2 border-accent/70 px-0.5 font-medium text-ink transition-colors focus-visible:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                          popupWord === part ? "bg-accent/15" : "hover:bg-accent/10"
                        }`}
                      >
                        {part}
                      </button>
                    );
                  }
                  return <span key={`${p.id}-${idx}`}>{part}</span>;
                })}
              </p>
            );
          })}
        </div>
      </article>
    );
  };

  return (
    <div className="flex h-[100dvh] min-w-0 flex-col">
      {/* Lesson navigation and identity */}
      <header className="sticky top-0 z-40 shrink-0 border-b border-stone-200 bg-paper px-4 py-2.5 sm:px-6 sm:py-3">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="truncate text-xs text-muted">
              Lesson {lesson.lesson.number}
              <span aria-hidden="true" className="mx-1.5">·</span>
              {lesson.lesson.titleEnglish}
            </p>
            <h1 className="mt-0.5 truncate text-xl font-semibold text-ink sm:text-2xl">
              {lesson.lesson.titleChinese}
            </h1>
          </div>

          <nav aria-label="Lesson navigation" className="flex shrink-0 flex-col items-stretch gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
            <Link
              href="/dashboard"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-stone-300 bg-card px-2.5 text-xs font-medium text-ink transition-colors hover:bg-card-hover sm:min-h-11 sm:gap-2 sm:px-4 sm:text-sm"
            >
              <span aria-hidden="true">←</span>
              <span>Dashboard</span>
            </Link>
            <Link
              href="/notebook"
              className="inline-flex min-h-10 items-center rounded-lg border border-stone-300 bg-card px-2.5 text-xs font-medium text-ink transition-colors hover:bg-card-hover sm:min-h-11 sm:px-4 sm:text-sm"
            >
              My Notebook
            </Link>
          </nav>
        </div>
      </header>

      {/* Body: nav + content + optional AI panel */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Horizontal section tabs on smaller screens; left rail on desktop. */}
        <aside className="w-full shrink-0 overflow-x-auto border-b border-stone-200 bg-paper p-2 lg:w-64 lg:overflow-y-auto lg:border-b-0 lg:p-3">
          <div className="lg:rounded-xl lg:border lg:border-stone-200 lg:bg-card lg:p-3 lg:shadow-sm">
            <p className="sr-only lg:not-sr-only lg:mb-2 lg:px-2 lg:text-xs lg:font-semibold lg:uppercase lg:tracking-wide lg:text-muted">Sections</p>
            <div className="flex min-w-max gap-1 bg-card lg:block lg:min-w-0 lg:space-y-0.5 lg:bg-transparent">
              {sectionOrder.map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-current={section === key ? "page" : undefined}
                  onClick={() => handleSectionChange(key)}
                  className={`min-h-11 whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-100 lg:w-full ${
                    section === key
                      ? "border-b-2 border-accent font-semibold text-ink lg:border-b-0 lg:bg-white lg:shadow-sm"
                      : "text-muted hover:text-ink lg:hover:bg-white/60"
                  }`}
                >
                  {lesson.sections[key].title}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Content — scrolls independently */}
        <main className="relative min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl font-semibold text-ink">{lesson.sections[section].title}</h2>

          <div
            ref={selectionScopeRef}
            tabIndex={-1}
            className="focus:outline-none"
            onClickCapture={(event) => {
              if (window.getSelection()?.toString().trim()) {
                event.preventDefault();
                event.stopPropagation();
              }
            }}
          >
            {section === "warmup" && (
            <ol className="mt-4 overflow-hidden rounded-xl border border-stone-200 bg-card shadow-sm">
              {(lesson.sections.warmup.prompts as WarmupPrompt[]).map((p, index) => (
                <li key={p.id} className="flex items-start gap-3 border-b border-stone-200 p-4 last:border-b-0 sm:gap-4 sm:p-5">
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-paper text-sm font-semibold text-accent-hover"
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[17px] font-medium leading-7 text-ink">{p.chinese}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{p.english}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}

            {section === "passage" && renderPassage()}

            {section === "vocabulary" && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {(lesson.sections.vocabulary.items as VocabItem[]).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={popupWord === item.word}
                  onClick={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    vocabTriggerRef.current = event.currentTarget;
                    setSelectedGrammarId(null);
                    setGrammarPopupPos(null);
                    setPopupWord(item.word);
                    setPopupPos(getPopupPosition(rect));
                  }}
                  className={`flex min-h-44 flex-col items-stretch justify-start rounded-xl border p-5 text-left shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-paper ${
                    popupWord === item.word
                      ? "border-accent bg-white shadow-md"
                      : "border-stone-200 bg-card"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-xl font-semibold leading-snug text-ink">{item.word}</h3>
                      <p className="mt-2 text-sm text-muted">{item.pinyin}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-paper px-2 py-1 text-[11px] font-medium text-muted">
                      {item.partOfSpeech}
                    </span>
                  </div>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-ink">{item.meaning}</p>
                </button>
              ))}
            </div>
          )}

            {section === "grammar" && (
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {grammarItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={selectedGrammarId === item.id}
                  onClick={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    grammarTriggerRef.current = event.currentTarget;
                    setPopupWord(null);
                    setPopupPos(null);
                    setSelectedGrammarId(item.id);
                    setGrammarPopupPos(getPopupPosition(rect, 576));
                  }}
                  className={`flex min-h-44 flex-col items-stretch justify-start rounded-xl border p-5 text-left shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-paper ${
                    selectedGrammarId === item.id
                      ? "border-accent bg-white shadow-md"
                      : "border-stone-200 bg-card"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-semibold leading-snug text-ink">{item.grammarPoint}</h3>
                    <span className="shrink-0 rounded-full bg-paper px-2 py-1 text-[11px] font-medium text-muted">
                      {item.type}
                    </span>
                  </div>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-ink">{item.coreMeaning}</p>
                </button>
              ))}
            </div>
          )}

            {section === "wordDistinction" && (
            <div className="mt-4 space-y-5">
              {(lesson.sections.wordDistinction.groups as DistinctionGroup[]).map((group) => (
                <article key={group.id} className="min-w-0 rounded-lg border border-stone-200 bg-card p-4">
                  <h3 className="text-lg font-semibold text-ink">{group.words[0]} vs {group.words[1]}</h3>
                  <p className="mt-2 text-sm text-muted">{group.sharedMeaning}</p>
                  <div className="mt-3 overflow-x-auto rounded-lg">
                  <table className="w-full min-w-[34rem] border-collapse text-sm">
                    <thead>
                      <tr className="bg-paper">
                        <th className="border border-stone-200 p-2 text-left text-muted font-medium">Dimension</th>
                        <th className="border border-stone-200 p-2 text-left font-medium text-ink">{group.words[0]}</th>
                        <th className="border border-stone-200 p-2 text-left font-medium text-ink">{group.words[1]}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.comparison.map((row) => (
                        <tr key={row.dimension} className="odd:bg-paper">
                          <td className="border border-stone-200 p-2 text-muted">{row.dimension}</td>
                          <td className="border border-stone-200 p-2 text-ink">{row.word1}</td>
                          <td className="border border-stone-200 p-2 text-ink">{row.word2}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </article>
              ))}
            </div>
          )}

            {section === "exercises" && (
            <div className="mt-4 space-y-4">
              {(lesson.sections.exercises.items as ExerciseItem[]).map((item) => {
                const mistakeDedupeKey = makeNotebookDedupeKey("mistake", lesson.id, item.id);
                const savedMistakeItem = notebook.find((savedItem) => savedItem.dedupeKey === mistakeDedupeKey);
                return (
                  <ExerciseCard
                    key={item.id}
                    item={item}
                    isInNotebook={Boolean(savedMistakeItem)}
                    notebookHref={savedMistakeItem ? getNotebookItemHref(savedMistakeItem) : null}
                    onAddMistake={(mistake) => addNotebookItem({
                      type: "mistake",
                      title: mistake.title,
                      myAnswer: mistake.myAnswer,
                      correctAnswer: mistake.correctAnswer,
                      reason: mistake.reason,
                      selectedAnswerExplanation: mistake.selectedAnswerExplanation,
                      correctAnswerExplanation: mistake.correctAnswerExplanation,
                      overallExplanation: mistake.overallExplanation,
                      exerciseContext: mistake.exerciseContext,
                      source: notebookSource,
                      dedupeKey: mistakeDedupeKey,
                    })}
                  />
                );
              })}
            </div>
          )}

            {section === "writing" && (
            <WritingWorkspace
              key={lesson.id}
              lessonId={lesson.id}
              prompt={lesson.sections.writing.prompt}
              promptExplanation={lesson.sections.writing.promptExplanation}
              writingPlan={lesson.sections.writing.writingPlan}
              usefulPatterns={lesson.sections.writing.usefulPatterns}
              lessonVocabulary={(lesson.sections.vocabulary.items as VocabItem[]).map((item) => item.word)}
            />
          )}

            {section === "expansion" && (
            <article className="mt-4 max-w-4xl overflow-hidden rounded-xl border border-stone-200 bg-card shadow-sm">
              <header className="border-b border-stone-200 bg-paper/60 px-5 py-4 sm:px-7">
                <h3 className="font-semibold text-ink">{lesson.sections.expansion.reading.title}</h3>
              </header>
              <div className="p-5 sm:p-7">
                <p className="text-lg leading-9 text-ink" lang="zh-CN">
                  {lesson.sections.expansion.reading.content}
                </p>
                <p className="mt-6 text-base leading-8 text-muted">
                  {lesson.sections.expansion.reading.translation}
                </p>
              </div>
            </article>
            )}
          </div>

          <TextSelectionActions
            key={section}
            scopeRef={selectionScopeRef}
            sectionKey={section}
            sectionTitle={lesson.sections[section].title}
            isSaved={(selection) => notebook.some((item) => item.dedupeKey === phraseDedupeKey(selection))}
            getNotebookHref={(selection) => {
              const savedItem = notebook.find((item) => item.dedupeKey === phraseDedupeKey(selection));
              return savedItem ? getNotebookItemHref(savedItem) : null;
            }}
            onAddToNotebook={(selection) => addNotebookItem({
              type: "phrase",
              title: selection.text,
              context: selection.context,
              sourceSection: selection.sectionTitle,
              source: notebookSource,
              dedupeKey: phraseDedupeKey(selection),
            })}
            onExplainMore={(selection) => {
              aiOpenedFromButtonRef.current = false;
              aiReturnFocusRef.current = selectionScopeRef.current;
              setAiOpen(true);
              setPopupWord(null);
              setPopupPos(null);
              setSelectedGrammarId(null);
              setGrammarPopupPos(null);
              const contextSuffix = selection.context !== selection.text
                ? ` The surrounding lesson context is: ${selection.context}`
                : "";
              void requestTutorExplanation({
                focus: selection.text,
                learnerMessage: `Explain “${selection.text}”`,
                query: `Explain the selected text “${selection.text}” from the ${selection.sectionTitle} section in this lesson.${contextSuffix}`,
              });
            }}
          />

          {vocabItem && popupPos ? (
            <VocabPopup
              item={vocabItem}
              position={popupPos}
              itemType="vocabulary"
              isInNotebook={vocabIsInNotebook}
              notebookHref={savedVocabItem ? getNotebookItemHref(savedVocabItem) : null}
              onClose={() => closeVocabPopup()}
              onExplain={() => {
                const word = vocabItem.word;
                aiOpenedFromButtonRef.current = false;
                aiReturnFocusRef.current = vocabTriggerRef.current;
                setAiOpen(true);
                closeVocabPopup(false);
                void requestTutorExplanation({
                  focus: word,
                  learnerMessage: `Explain ${word}`,
                  query: `Explain ${word} in this lesson context`,
                });
              }}
              onAddToNotebook={() => {
                addNotebookItem({
                  type: "vocabulary",
                  title: vocabItem.word,
                  pinyin: vocabItem.pinyin,
                  summary: vocabItem.meaning,
                  source: notebookSource,
                  dedupeKey: vocabDedupeKey ?? undefined,
                });
              }}
            />
          ) : null}

          {selectedGrammar && grammarPopupPos ? (
            <GrammarPopup
              item={selectedGrammar}
              position={grammarPopupPos}
              onClose={() => closeGrammarPopup()}
              onExplain={() => {
                const grammarPoint = selectedGrammar.grammarPoint;
                aiOpenedFromButtonRef.current = false;
                aiReturnFocusRef.current = grammarTriggerRef.current;
                setAiOpen(true);
                closeGrammarPopup(false);
                void requestTutorExplanation({
                  focus: grammarPoint,
                  learnerMessage: `Explain the grammar pattern ${grammarPoint}`,
                  query: `Explain the grammar pattern ${grammarPoint} in this lesson context and show how to use it naturally.`,
                });
              }}
              isInNotebook={grammarIsInNotebook}
              notebookHref={savedGrammarItem ? getNotebookItemHref(savedGrammarItem) : null}
              onAddToNotebook={() => addNotebookItem({
                type: "grammar",
                title: selectedGrammar.grammarPoint,
                summary: selectedGrammar.coreMeaning,
                structure: selectedGrammar.structure,
                source: notebookSource,
                dedupeKey: grammarDedupeKey ?? undefined,
              })}
            />
          ) : null}
        </main>

        {/* Full-screen study surface on smaller screens; inline panel on wide desktops. */}
        {aiOpen && (
          <div className="fixed inset-0 z-[60] flex min-w-0 flex-col overflow-hidden bg-card xl:static xl:z-auto xl:w-[340px] xl:shrink-0 xl:border-l xl:border-stone-200">
            <AITutorPanel
              currentFocus={currentFocus}
              messages={messages}
              onAsk={onAsk}
              onClear={handleAiClear}
              onClose={handleAiClose}
              selectionActions={{
                isSaved: (selection) => notebook.some((item) => item.dedupeKey === phraseDedupeKey(selection)),
                getNotebookHref: (selection) => {
                  const savedItem = notebook.find((item) => item.dedupeKey === phraseDedupeKey(selection));
                  return savedItem ? getNotebookItemHref(savedItem) : null;
                },
                onAddToNotebook: (selection) => addNotebookItem({
                  type: "phrase",
                  title: selection.text,
                  summary: selection.context,
                  context: selection.context,
                  sourceSection: selection.sectionTitle,
                  source: notebookSource,
                  dedupeKey: phraseDedupeKey(selection),
                }),
                onExplainMore: (selection) => {
                  const contextSuffix = selection.context !== selection.text
                    ? ` The surrounding AI Tutor message is: ${selection.context}`
                    : "";
                  void requestTutorExplanation({
                    focus: selection.text,
                    learnerMessage: `Explain “${selection.text}”`,
                    query: `Explain the selected text “${selection.text}” from our AI Tutor conversation.${contextSuffix}`,
                  });
                },
              }}
            />
          </div>
        )}
      </div>

      {/* Draggable AI icon — hidden when panel is open */}
      {!aiOpen && (
        <button
          ref={aiButtonRef}
          type="button"
          aria-label="Open AI tutor"
          aria-haspopup="dialog"
          aria-expanded={aiOpen}
          aria-controls="ai-tutor-panel"
          className="fixed z-50 flex h-12 w-12 touch-none cursor-grab select-none items-center justify-center rounded-full text-xl text-white shadow-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          style={iconPos
            ? { left: iconPos.x, top: iconPos.y, backgroundColor: "#7A9E7E" }
            : { right: 24, bottom: 24, backgroundColor: "#7A9E7E" }}
          onPointerDown={(e) => {
            e.preventDefault();
            const rect = e.currentTarget.getBoundingClientRect();
            dragState.current = {
              active: true,
              startX: e.clientX,
              startY: e.clientY,
              originX: rect.left,
              originY: rect.top,
              moved: false,
            };
          }}
          onClick={(event) => {
            if (event.detail === 0 || !dragState.current.moved) {
              aiOpenedFromButtonRef.current = true;
              aiReturnFocusRef.current = null;
              setAiOpen(true);
            }
          }}
        >
          ✦
        </button>
      )}
    </div>
  );
}
