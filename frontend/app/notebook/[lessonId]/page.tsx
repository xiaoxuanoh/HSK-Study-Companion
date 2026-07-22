"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import NotebookCard from "@/components/NotebookCard";
import { type NotebookItem, type NotebookItemType, useNotebook } from "@/lib/notebook";

type FilterValue = "all" | NotebookItemType;

const filters: Array<{ value: FilterValue; label: string }> = [
  { value: "all", label: "All" },
  { value: "vocabulary", label: "Vocabulary" },
  { value: "phrase", label: "Phrases" },
  { value: "grammar", label: "Grammar" },
  { value: "mistake", label: "Mistakes" },
  { value: "personal-note", label: "Personal Notes" },
];

const matchesSearch = (item: NotebookItem, query: string) => {
  if (!query) return true;
  const searchableText = [
    item.title,
    item.pinyin,
    item.summary,
    item.context,
    item.sourceSection,
    item.structure,
    item.myAnswer,
    item.correctAnswer,
    item.reason,
    item.selectedAnswerExplanation,
    item.correctAnswerExplanation,
    item.overallExplanation,
    item.exerciseContext?.prompt,
    item.exerciseContext?.sentence,
    item.exerciseContext?.options?.map((option) => `${option.id} ${option.text}`).join(" "),
    item.exerciseContext?.wordBank?.join(" "),
    item.exerciseContext?.sentences?.map((sentence) => `${sentence.before} ${sentence.after}`).join(" "),
    item.personalNote,
  ].filter(Boolean).join(" ").toLocaleLowerCase();
  return searchableText.includes(query);
};

export default function LessonNotebookPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { items, updatePersonalNote, removeItem } = useNotebook();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");
  const isStandalone = lessonId === "standalone";

  const lessonItems = useMemo(() => items
    .filter((item) => (isStandalone ? !item.source : item.source?.lessonId === lessonId))
    .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt)), [isStandalone, items, lessonId]);
  const source = lessonItems.find((item) => item.source)?.source;
  const query = search.trim().toLocaleLowerCase();
  const visibleItems = useMemo(() => lessonItems.filter((item) => (
    (filter === "all" || item.type === filter) && matchesSearch(item, query)
  )), [filter, lessonItems, query]);

  const collectionTitle = isStandalone ? "Standalone Notes" : source?.titleChinese ?? "Lesson Notes";

  return (
    <div className="min-h-[100dvh] bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-paper px-4 py-2.5 sm:px-6 sm:py-3">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">My Notebook</p>
            <h1 className="mt-0.5 truncate text-xl font-semibold sm:text-2xl">{collectionTitle}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {source ? (
              <Link
                href={`/lessons/${source.lessonId}`}
                className="inline-flex min-h-11 items-center rounded-lg border border-stone-300 bg-card px-4 text-sm font-medium hover:bg-card-hover"
              >
                Source lesson
              </Link>
            ) : null}
            <Link
              href="/notebook"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-stone-300 bg-card px-4 text-sm font-medium hover:bg-card-hover"
            >
              <span aria-hidden="true">←</span>
              My Notebook
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <section aria-labelledby="lesson-notebook-heading">
          {source ? <p className="text-sm text-muted">Lesson {source.lessonNumber}</p> : <p className="text-sm text-muted">Course-wide</p>}
          <h2 id="lesson-notebook-heading" className="mt-1 text-2xl font-semibold sm:text-3xl">{collectionTitle}</h2>
          {source ? <p className="mt-1 text-sm text-muted">{source.titleEnglish}</p> : null}
          <p className="mt-1 text-xs text-muted">
            {lessonItems.length} saved {lessonItems.length === 1 ? "note" : "notes"}
          </p>
        </section>

        <section aria-labelledby="lesson-notebook-tools" className="mt-6 rounded-xl border border-stone-200 bg-card p-4 shadow-sm sm:p-5">
          <h2 id="lesson-notebook-tools" className="sr-only">Search and filter this collection</h2>
          <label htmlFor="lesson-notebook-search" className="text-sm font-medium text-ink">Search this lesson’s notes</label>
          <input
            id="lesson-notebook-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="mt-2 min-h-11 w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm"
            placeholder="Search words, explanations, or remarks…"
          />
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Filter notes by type">
            {filters.map((option) => {
              const count = option.value === "all"
                ? lessonItems.length
                : lessonItems.filter((item) => item.type === option.value).length;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={filter === option.value}
                  onClick={() => setFilter(option.value)}
                  className={`min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    filter === option.value
                      ? "border-accent bg-accent text-white"
                      : "border-stone-300 bg-white text-ink hover:bg-paper"
                  }`}
                >
                  {option.label} ({count})
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-8" aria-live="polite">
          {visibleItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-stone-300 bg-card p-8 text-center">
              <h2 className="text-lg font-semibold">No matching notes</h2>
              <p className="mt-2 text-sm text-muted">
                {lessonItems.length === 0 ? "This collection does not contain any saved notes yet." : "Try another search or filter."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleItems.map((item) => (
                <NotebookCard
                  key={item.id}
                  item={item}
                  onUpdateNote={updatePersonalNote}
                  onRemove={removeItem}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
