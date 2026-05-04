"use client";

import { useEffect, useMemo, useState } from "react";
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

export default function LessonPage({ params }: { params: { id: string } }) {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [section, setSection] = useState<SectionKey>("warmup");
  const [aiResponse, setAiResponse] = useState("Select content or ask a quick action for mock teacher-style explanations.");
  const [focus, setFocus] = useState("Lesson overview");
  const [popupWord, setPopupWord] = useState<string | null>(null);
  const [notebook, setNotebook] = useState<any[]>([]);

  useEffect(() => {
    getLesson(params.id).then((data) => {
      setLesson(data);
      setNotebook(data.sections.notebook.savedItems || []);
    });
  }, [params.id]);

  const vocabByWord = useMemo(() => {
    if (!lesson) return {} as Record<string, any>;
    const map: Record<string, any> = {};
    for (const item of lesson.sections.vocabulary.items) {
      map[item.word] = item;
    }
    return map;
  }, [lesson]);

  const onAsk = async (query: string) => {
    if (!lesson) return;
    setFocus(query);
    const res = await askAI(lesson.id, query);
    setAiResponse(res);
  };

  const saveNotebook = (item: any) => setNotebook((prev) => [item, ...prev]);

  if (!lesson) return <main className="p-6">Loading lesson...</main>;

  const vocabItem = popupWord ? vocabByWord[popupWord] : null;

  const renderPassage = () => {
    const highlights = lesson.sections.passage.vocabularyHighlights as Record<string, string>;
    return (
      <div className="space-y-4">
        {lesson.sections.passage.paragraphs.map((p: any) => {
          const parts = p.text.split(/(爽快|嚷嚷|拿手|郑重|疑惑|反问|瞬间|意识|忽略|宽容|嫉妒|嘲笑|讨好|附和|融洽|亲密|固然|督促|约束|启示|和睦)/g);
          return (
            <p key={p.id} className="relative text-[17px] leading-8 text-slate-800">
              {parts.map((part, idx) => {
                if (highlights[part]) {
                  return (
                    <button
                      key={`${p.id}-${idx}`}
                      onClick={() => setPopupWord(part)}
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
    <main className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[220px_1fr_340px]">
      <aside className="h-[calc(100vh-2rem)] rounded-lg border border-slate-200 bg-white p-3">
        <h2 className="mb-3 text-lg font-semibold">Sections</h2>
        <div className="space-y-1">
          {sectionOrder.map((key) => (
            <button
              key={key}
              onClick={() => setSection(key)}
              className={`w-full rounded px-2 py-2 text-left text-sm ${
                section === key ? "bg-slate-900 text-white" : "hover:bg-slate-100"
              }`}
            >
              {lesson.sections[key].title}
            </button>
          ))}
        </div>
      </aside>

      <section className="relative h-[calc(100vh-2rem)] overflow-y-auto rounded-lg border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold">{lesson.lesson.titleChinese}</h1>
        <p className="text-sm text-muted">{lesson.lesson.titleEnglish}</p>
        <h2 className="mt-6 text-xl font-semibold">{lesson.sections[section].title}</h2>

        {section === "warmup" && (
          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-800">
            {lesson.sections.warmup.prompts.map((p: any) => (
              <li key={p.id}>
                <p>{p.chinese}</p>
                <p className="text-sm text-slate-600">{p.english}</p>
              </li>
            ))}
          </ul>
        )}

        {section === "passage" && <div className="mt-4">{renderPassage()}</div>}

        {section === "vocabulary" && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {lesson.sections.vocabulary.items.map((item: any) => (
              <article key={item.id} className="rounded-lg border border-slate-200 p-4">
                <h3 className="text-xl font-semibold">{item.word}</h3>
                <p className="text-sm text-muted">{item.pinyin}</p>
                <p className="mt-1 text-xs">{item.partOfSpeech}</p>
                <p className="mt-2 text-sm">{item.simpleExplanation}</p>
                <p className="mt-2 text-sm text-slate-600">Example: {item.example}</p>
              </article>
            ))}
          </div>
        )}

        {section === "grammar" && (
          <div className="mt-4 space-y-4">
            {lesson.sections.grammar.items.map((g: any) => (
              <article key={g.id} className="rounded-lg border border-slate-200 p-4">
                <h3 className="text-lg font-semibold">{g.grammarPoint}</h3>
                <p className="mt-2 text-sm"><strong>Type:</strong> {g.type}</p>
                <p className="text-sm"><strong>Core Meaning:</strong> {g.coreMeaning}</p>
                <pre className="mt-2 rounded bg-slate-100 p-2 text-sm">{g.structure}</pre>
                <p className="mt-2 text-sm"><strong>Tone:</strong> {g.tone}</p>
                <p className="text-sm"><strong>Example:</strong> {g.example}</p>
                <p className="mt-2 text-sm text-red-700"><strong>Common mistake:</strong> {g.commonMistake}</p>
              </article>
            ))}
          </div>
        )}

        {section === "wordDistinction" && (
          <div className="mt-4 space-y-5">
            {lesson.sections.wordDistinction.groups.map((group: any) => (
              <article key={group.id} className="rounded-lg border border-slate-200 p-4">
                <h3 className="text-lg font-semibold">{group.words[0]} vs {group.words[1]}</h3>
                <p className="mt-2 text-sm">{group.sharedMeaning}</p>
                <table className="mt-3 w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="border p-2 text-left">Dimension</th>
                      <th className="border p-2 text-left">{group.words[0]}</th>
                      <th className="border p-2 text-left">{group.words[1]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.comparison.map((row: any) => (
                      <tr key={row.dimension} className="odd:bg-slate-50">
                        <td className="border p-2">{row.dimension}</td>
                        <td className="border p-2">{row.word1}</td>
                        <td className="border p-2">{row.word2}</td>
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
            {lesson.sections.exercises.items.map((ex: any) => (
              <article key={ex.id} className="rounded-lg border border-slate-200 p-4">
                <p className="whitespace-pre-line font-medium">{ex.question}</p>
                {ex.options ? (
                  <ul className="mt-3 space-y-1 text-sm">
                    {ex.options.map((opt: string) => (
                      <li key={opt} className="rounded border border-slate-200 px-2 py-1">{opt}</li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-3 rounded bg-slate-50 p-3 text-sm">
                  <p><strong>Why correct:</strong> {ex.explanation.whyCorrect}</p>
                  <p className="mt-2"><strong>Reasoning:</strong> This question tests nuance and sentence logic, not direct translation.</p>
                </div>
              </article>
            ))}
          </div>
        )}

        {section === "writing" && (
          <article className="mt-4 rounded-lg border border-slate-200 p-4 text-sm">
            <p className="font-medium">{lesson.sections.writing.prompt.chinese}</p>
            <p className="text-slate-600">{lesson.sections.writing.prompt.english}</p>
            <p className="mt-3">{lesson.sections.writing.promptExplanation}</p>
            <h4 className="mt-3 font-semibold">Suggested correction style</h4>
            <ul className="list-disc pl-6">
              <li>Suggested correction: adjust wording for clarity and grammar.</li>
              <li>More natural version: improve flow and tone.</li>
              <li>Another possible version: preserve your voice with a different valid expression.</li>
            </ul>
          </article>
        )}

        {section === "expansion" && (
          <article className="mt-4 space-y-3 rounded-lg border border-slate-200 p-4 text-sm">
            <p>{lesson.sections.expansion.reading.content}</p>
            <p className="text-slate-600">{lesson.sections.expansion.reading.translation}</p>
          </article>
        )}

        {section === "notebook" && (
          <div className="mt-4 space-y-3">
            {notebook.map((item, idx) => (
              <article key={`${item.id}-${idx}`} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
                <p className="font-medium">{item.type || "saved"}</p>
                <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(item, null, 2)}</pre>
              </article>
            ))}
          </div>
        )}

        {vocabItem ? (
          <VocabPopup
            item={vocabItem}
            onClose={() => setPopupWord(null)}
            onExplain={() => {
              onAsk(`Explain ${vocabItem.word} in this lesson context`);
              setFocus(vocabItem.word);
            }}
            onSave={() => {
              saveNotebook({ type: "vocabulary", word: vocabItem.word, note: `Saved from passage: ${vocabItem.word}` });
              setPopupWord(null);
            }}
          />
        ) : null}
      </section>

      <AITutorPanel currentFocus={focus} response={aiResponse} onAsk={onAsk} />
    </main>
  );
}
