"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AITutorPanel from "@/components/AITutorPanel";
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
  tone: string;
  example: string;
  commonMistake: string;
};
type DistinctionRow = { dimension: string; word1: string; word2: string };
type DistinctionGroup = { id: string; words: string[]; sharedMeaning: string; comparison: DistinctionRow[] };
type ExerciseItem = {
  id: string;
  question: string;
  options?: string[];
  explanation: { whyCorrect: string };
};

export default function LessonPage({ params }: { params: { id: string } }) {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [section, setSection] = useState<SectionKey>("warmup");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [currentFocus, setCurrentFocus] = useState("");
  const [popupWord, setPopupWord] = useState<string | null>(null);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number; above: boolean } | null>(null);
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
    setIconPos({ x: window.innerWidth - 72, y: window.innerHeight - 72 });
  }, []);

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
    getLesson(params.id).then((data) => {
      setLesson(data);
      setNotebook(data.sections.notebook.savedItems || []);
    });
  }, [params.id]);

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

  if (!lesson) return <main className="p-6 text-ink">Loading lesson...</main>;

  const vocabItem = popupWord ? vocabByWord[popupWord] : null;

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
                        const x = Math.max(8, Math.min(rect.left, window.innerWidth - 328));
                        const above = rect.bottom > window.innerHeight * 0.6;
                        setPopupWord(part);
                        setPopupPos({ x, y: above ? rect.top : rect.bottom, above });
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
                  onClick={() => setSection(key)}
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
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {(lesson.sections.vocabulary.items as VocabItem[]).map((item) => (
                <article key={item.id} className="rounded-lg border border-stone-200 bg-card p-4">
                  <h3 className="text-xl font-semibold text-ink">{item.word}</h3>
                  <p className="text-sm text-muted">{item.pinyin}</p>
                  <p className="mt-1 text-xs text-muted">{item.partOfSpeech}</p>
                  <p className="mt-2 text-sm text-ink">{item.simpleExplanation}</p>
                  <p className="mt-2 text-sm text-muted">Example: {item.example}</p>
                </article>
              ))}
            </div>
          )}

          {section === "grammar" && (
            <div className="mt-4 space-y-4">
              {(lesson.sections.grammar.items as GrammarItem[]).map((g) => (
                <article key={g.id} className="rounded-lg border border-stone-200 bg-card p-4">
                  <h3 className="text-lg font-semibold text-ink">{g.grammarPoint}</h3>
                  <p className="mt-2 text-sm"><span className="font-medium">Type:</span> {g.type}</p>
                  <p className="text-sm"><span className="font-medium">Core Meaning:</span> {g.coreMeaning}</p>
                  <pre className="mt-2 rounded bg-paper border border-stone-200 p-2 text-sm">{g.structure}</pre>
                  <p className="mt-2 text-sm"><span className="font-medium">Tone:</span> {g.tone}</p>
                  <p className="text-sm"><span className="font-medium">Example:</span> {g.example}</p>
                  <p className="mt-2 text-sm text-muted"><span className="font-medium">Common mistake:</span> {g.commonMistake}</p>
                </article>
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
              {(lesson.sections.exercises.items as ExerciseItem[]).map((ex) => (
                <article key={ex.id} className="rounded-lg border border-stone-200 bg-card p-4">
                  <p className="whitespace-pre-line font-medium text-ink">{ex.question}</p>
                  {ex.options ? (
                    <ul className="mt-3 space-y-1 text-sm">
                      {ex.options.map((opt) => (
                        <li key={opt} className="rounded border border-stone-200 bg-paper px-2 py-1 text-ink">{opt}</li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-3 rounded bg-paper border border-stone-200 p-3 text-sm text-ink">
                    <p><span className="font-medium">Why correct:</span> {ex.explanation.whyCorrect}</p>
                    <p className="mt-2 text-muted">This question tests nuance and sentence logic, not direct translation.</p>
                  </div>
                </article>
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
      {iconPos && !aiOpen && (
        <div
          className="fixed z-50 flex h-12 w-12 cursor-grab items-center justify-center rounded-full shadow-lg select-none text-white text-xl transition-colors duration-150"
          style={{ left: iconPos.x, top: iconPos.y, backgroundColor: "#7A9E7E" }}
          onMouseDown={(e) => {
            e.preventDefault();
            dragState.current = {
              active: true,
              startX: e.clientX,
              startY: e.clientY,
              originX: iconPos.x,
              originY: iconPos.y,
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
