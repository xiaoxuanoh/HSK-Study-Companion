"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import AITutorPanel from "@/components/AITutorPanel";
import ExerciseCard, { type ExerciseItem } from "@/components/ExerciseCard";
import GrammarPopup from "@/components/GrammarPopup";
import VocabPopup from "@/components/VocabPopup";
import { askAI, getLesson } from "@/lib/api";
import type { LessonData } from "@/lib/types";

const sectionOrder = [
  "warmup",
  "passage",
  "vocabulary",
  "grammar",
  "wordDistinction",
  "exercises",
  "writing",
  "expansion",
  "notebook"
] as const;

type SectionKey = (typeof sectionOrder)[number];

type NotebookItem = {
  id?: string;
  type: string;
  word?: string;
  note?: string;
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
  const [section, setSection] = useState<SectionKey>("warmup");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [currentFocus, setCurrentFocus] = useState("");
  const [popupWord, setPopupWord] = useState<string | null>(null);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number; above: boolean } | null>(null);
  const [selectedGrammarId, setSelectedGrammarId] = useState<string | null>(null);
  const [grammarPopupPos, setGrammarPopupPos] = useState<{ x: number; y: number; above: boolean } | null>(null);
  const [notebook, setNotebook] = useState<NotebookItem[]>([]);
  const [aiOpen, setAiOpen] = useState(false);
  const [iconPos, setIconPos] = useState<{ x: number; y: number } | null>(null);

  const dragState = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragState.current.active) return;
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) dragState.current.moved = true;
      setIconPos({ x: dragState.current.originX + dx, y: dragState.current.originY + dy });
    };
    const onMouseUp = () => {
      if (!dragState.current.active) return;
      if (!dragState.current.moved) setAiOpen((prev) => !prev);
      dragState.current.active = false;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  useEffect(() => {
    getLesson(lessonId).then((data) => {
      setLesson(data);
      setNotebook((data.sections.notebook.savedItems as NotebookItem[]) || []);
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

  const handleAiClose = () => {
    setAiOpen(false);
    setMessages([]);
    setCurrentFocus("");
  };

  const saveNotebook = (item: NotebookItem) => setNotebook((prev) => [item, ...prev]);

  const handleSectionChange = (nextSection: SectionKey) => {
    setSection(nextSection);
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

  if (!lesson) return <main className="p-6 text-ink">Loading lesson...</main>;

  const vocabItem = popupWord ? vocabByWord[popupWord] : null;
  const grammarItems = lesson.sections.grammar.items as GrammarItem[];
  const selectedGrammar = selectedGrammarId
    ? grammarItems.find((item) => item.id === selectedGrammarId) ?? null
    : null;

  const renderPassage = () => {
    const highlights = lesson.sections.passage.vocabularyHighlights as Record<string, string>;
    return (
      <div className="space-y-4">
        {(lesson.sections.passage.paragraphs as PassageParagraph[]).map((p) => {
          const parts = p.text.split(/(爽快|嚷嚷|拿手|郑重|疑惑|反问|瞬间|意识|忽略|宽容|嫉妒|嘲笑|讨好|附和|融洽|亲密|固然|督促|约束|启示|和睦)/g);
          return (
            <p key={p.id} className="relative text-[17px] leading-8 text-ink">
              {parts.map((part, idx) => {
                if (highlights[part]) {
                  return (
                    <button
                      key={`${p.id}-${idx}`}
                      onClick={(e) => {
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        setSelectedGrammarId(null);
                        setGrammarPopupPos(null);
                        setPopupWord(part);
                        setPopupPos(getPopupPosition(rect));
                      }}
                      className="rounded bg-amber-100 px-1 hover:bg-amber-200"
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
    );
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top bar */}
      <header className="shrink-0 border-b border-stone-200 px-6 py-3">
        <p className="text-xs text-muted">Lesson {lesson.lesson.number}</p>
        <div className="flex items-baseline gap-3">
          <h1 className="text-xl font-semibold text-ink">{lesson.lesson.titleChinese}</h1>
          <span className="text-sm text-muted">{lesson.lesson.titleEnglish}</span>
        </div>
      </header>

      {/* Body: nav + content + optional AI panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left nav — scrolls independently */}
        <aside className="w-[220px] shrink-0 overflow-y-auto bg-paper p-3">
          <div className="rounded-xl border border-stone-200 bg-card p-3 shadow-sm">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted">Sections</p>
            <div className="space-y-0.5">
              {sectionOrder.map((key) => (
                <button
                  key={key}
                  onClick={() => handleSectionChange(key)}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-100 ${
                    section === key
                      ? "bg-white font-semibold text-ink shadow-sm"
                      : "text-muted hover:text-ink hover:bg-white/60"
                  }`}
                >
                  {lesson.sections[key].title}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Content — scrolls independently */}
        <main className="relative flex-1 overflow-y-auto p-8">
          <h2 className="text-xl font-semibold text-ink">{lesson.sections[section].title}</h2>

          {section === "warmup" && (
            <ul className="mt-4 list-disc space-y-2 pl-6 text-ink">
              {(lesson.sections.warmup.prompts as WarmupPrompt[]).map((p) => (
                <li key={p.id}>
                  <p>{p.chinese}</p>
                  <p className="text-sm text-muted">{p.english}</p>
                </li>
              ))}
            </ul>
          )}

          {section === "passage" && <div className="mt-4">{renderPassage()}</div>}

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
                    setSelectedGrammarId(null);
                    setGrammarPopupPos(null);
                    setPopupWord(item.word);
                    setPopupPos(getPopupPosition(rect));
                  }}
                  className={`min-h-32 rounded-xl border p-4 text-left shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-paper ${
                    popupWord === item.word
                      ? "border-accent bg-white shadow-md"
                      : "border-stone-200 bg-card"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-semibold leading-none text-ink">{item.word}</h3>
                      <p className="mt-2 text-sm text-muted">{item.pinyin}</p>
                    </div>
                    <span className="rounded-full bg-paper px-2 py-1 text-[11px] font-medium text-muted">
                      {item.partOfSpeech}
                    </span>
                  </div>
                  <p className="mt-4 line-clamp-2 text-sm leading-5 text-ink">{item.meaning}</p>
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
                    setPopupWord(null);
                    setPopupPos(null);
                    setSelectedGrammarId(item.id);
                    setGrammarPopupPos(getPopupPosition(rect, 576));
                  }}
                  className={`min-h-44 rounded-xl border p-5 text-left shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-paper ${
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
                <article key={group.id} className="rounded-lg border border-stone-200 bg-card p-4">
                  <h3 className="text-lg font-semibold text-ink">{group.words[0]} vs {group.words[1]}</h3>
                  <p className="mt-2 text-sm text-muted">{group.sharedMeaning}</p>
                  <table className="mt-3 w-full border-collapse text-sm">
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
                </article>
              ))}
            </div>
          )}

          {section === "exercises" && (
            <div className="mt-4 space-y-4">
              {(lesson.sections.exercises.items as ExerciseItem[]).map((item) => (
                <ExerciseCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {section === "writing" && (
            <article className="mt-4 rounded-lg border border-stone-200 bg-card p-4 text-sm">
              <p className="font-medium text-ink">{lesson.sections.writing.prompt.chinese}</p>
              <p className="text-muted">{lesson.sections.writing.prompt.english}</p>
              <p className="mt-3 text-ink">{lesson.sections.writing.promptExplanation}</p>
              <h4 className="mt-3 font-semibold text-ink">Suggested correction style</h4>
              <ul className="list-disc pl-6 text-muted">
                <li>Suggested correction: adjust wording for clarity and grammar.</li>
                <li>More natural version: improve flow and tone.</li>
                <li>Another possible version: preserve your voice with a different valid expression.</li>
              </ul>
            </article>
          )}

          {section === "expansion" && (
            <article className="mt-4 space-y-3 rounded-lg border border-stone-200 bg-card p-4 text-sm">
              <p className="text-ink">{lesson.sections.expansion.reading.content}</p>
              <p className="text-muted">{lesson.sections.expansion.reading.translation}</p>
            </article>
          )}

          {section === "notebook" && (
            <div className="mt-4 space-y-3">
              {notebook.length === 0 && (
                <p className="text-sm text-muted">No saved items yet. Click a vocabulary word in the passage and save it.</p>
              )}
              {notebook.map((item, idx) => (
                <article key={`${item.id ?? "item"}-${idx}`} className="rounded border border-stone-200 bg-card p-3 text-sm">
                  <p className="text-xs text-muted uppercase tracking-wide">{item.type}</p>
                  <p className="mt-1 font-medium text-ink">{item.word}</p>
                  {item.note && <p className="mt-1 text-muted">{item.note}</p>}
                </article>
              ))}
            </div>
          )}

          {vocabItem && popupPos ? (
            <VocabPopup
              item={vocabItem}
              position={popupPos}
              onClose={() => { setPopupWord(null); setPopupPos(null); }}
              onExplain={() => {
                const word = vocabItem.word;
                setCurrentFocus(word);
                setAiOpen(true);
                setPopupWord(null);
                setPopupPos(null);
                askAI(lesson!.id, `Explain ${word} in this lesson context`).then((res) => {
                  setMessages((prev) => [...prev, { role: "assistant", content: res }]);
                });
              }}
              onSave={() => {
                saveNotebook({ type: "vocabulary", word: vocabItem.word, note: `Saved from passage: ${vocabItem.word}` });
                setPopupWord(null);
                setPopupPos(null);
              }}
            />
          ) : null}

          {selectedGrammar && grammarPopupPos ? (
            <GrammarPopup
              item={selectedGrammar}
              position={grammarPopupPos}
              onClose={() => {
                setSelectedGrammarId(null);
                setGrammarPopupPos(null);
              }}
            />
          ) : null}
        </main>

        {/* AI Tutor panel — inline, pushes content when open */}
        {aiOpen && (
          <div className="w-[340px] shrink-0 flex flex-col border-l border-stone-200 bg-card overflow-hidden">
            <AITutorPanel
              currentFocus={currentFocus}
              messages={messages}
              onAsk={onAsk}
              onClose={handleAiClose}
            />
          </div>
        )}
      </div>

      {/* Draggable AI icon — hidden when panel is open */}
      {!aiOpen && (
        <div
          className="fixed z-50 flex h-12 w-12 cursor-grab items-center justify-center rounded-full shadow-lg select-none text-white text-xl transition-colors duration-150"
          style={iconPos
            ? { left: iconPos.x, top: iconPos.y, backgroundColor: "#7A9E7E" }
            : { right: 24, bottom: 24, backgroundColor: "#7A9E7E" }}
          onMouseDown={(e) => {
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
        >
          ✦
        </div>
      )}
    </div>
  );
}
