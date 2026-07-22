"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import NotebookCard from "@/components/NotebookCard";
import {
  type NotebookItem,
  type NotebookItemType,
  type NotebookSource,
  useNotebook,
} from "@/lib/notebook";

type FilterValue = "all" | NotebookItemType;

const filters: Array<{ value: FilterValue; label: string }> = [
  { value: "all", label: "All" },
  { value: "vocabulary", label: "Vocabulary" },
  { value: "phrase", label: "Phrases" },
  { value: "grammar", label: "Grammar" },
  { value: "mistake", label: "Mistakes" },
  { value: "personal-note", label: "Personal Notes" },
];

type NotebookGroup = {
  key: string;
  source?: NotebookSource;
  items: NotebookItem[];
};

export default function NotebookPage() {
  const { items, addItem, updatePersonalNote, removeItem } = useNotebook();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");

  const filteredItems = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return items.filter((item) => {
      if (filter !== "all" && item.type !== filter) return false;
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
        item.source?.titleChinese,
        item.source?.titleEnglish,
        item.source ? `Lesson ${item.source.lessonNumber}` : "",
      ].filter(Boolean).join(" ").toLocaleLowerCase();
      return searchableText.includes(query);
    });
  }, [filter, items, search]);

  const groups = useMemo(() => {
    const grouped = new Map<string, NotebookGroup>();
    for (const item of filteredItems) {
      const key = item.source?.lessonId ?? "standalone";
      const group = grouped.get(key) ?? { key, source: item.source, items: [] };
      group.items.push(item);
      grouped.set(key, group);
    }
    return [...grouped.values()].map((group) => ({
      ...group,
      items: group.items.sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt)),
    })).sort((left, right) => {
      if (!left.source) return 1;
      if (!right.source) return -1;
      return left.source.lessonNumber - right.source.lessonNumber;
    });
  }, [filteredItems]);

  const groupCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      const key = item.source?.lessonId ?? "standalone";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [items]);

  const createStandaloneNote = () => {
    const title = noteTitle.trim();
    const summary = noteBody.trim();
    if (!title || !summary) return;
    addItem({ type: "personal-note", title, personalNote: summary });
    setNoteTitle("");
    setNoteBody("");
    setShowNoteForm(false);
  };

  return (
    <div className="min-h-[100dvh] bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-paper px-4 py-2.5 sm:px-6 sm:py-3">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">HSK Study Companion</p>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <h1 className="text-xl font-semibold sm:text-2xl">My Notebook</h1>
              <p className="text-xs text-muted">{items.length} {items.length === 1 ? "item" : "items"} saved on this browser</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowNoteForm((visible) => !visible)}
              className="inline-flex min-h-11 items-center rounded-lg bg-accent px-4 text-sm font-medium text-white hover:bg-accent-hover"
            >
              + New Note
            </button>
            <Link
              href="/dashboard"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-stone-300 bg-card px-4 text-sm font-medium transition-colors hover:bg-card-hover"
            >
              <span aria-hidden="true">←</span>
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {showNoteForm ? (
          <section aria-labelledby="new-note-title" className="rounded-xl border border-accent/40 bg-card p-5 shadow-sm sm:p-6">
            <h2 id="new-note-title" className="text-lg font-semibold">Create a standalone note</h2>
            <p className="mt-1 text-sm text-muted">Capture something useful even when it is not connected to a lesson.</p>
            <div className="mt-4 grid gap-4">
              <label className="text-sm font-medium text-ink">
                Title
                <input
                  value={noteTitle}
                  onChange={(event) => setNoteTitle(event.target.value)}
                  className="mt-2 min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 font-normal"
                  placeholder="e.g. Words to review this week"
                />
              </label>
              <label className="text-sm font-medium text-ink">
                Note
                <textarea
                  value={noteBody}
                  onChange={(event) => setNoteBody(event.target.value)}
                  rows={4}
                  className="mt-2 w-full resize-y rounded-lg border border-stone-300 bg-white px-3 py-2 font-normal leading-6"
                  placeholder="Write your note…"
                />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={createStandaloneNote}
                disabled={!noteTitle.trim() || !noteBody.trim()}
                className="min-h-11 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add Note
              </button>
              <button type="button" onClick={() => setShowNoteForm(false)} className="min-h-11 rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-paper">
                Cancel
              </button>
            </div>
          </section>
        ) : null}

        <section aria-labelledby="notebook-tools" className={`${showNoteForm ? "mt-6" : ""} rounded-xl border border-stone-200 bg-card p-4 shadow-sm sm:p-5`}>
          <h2 id="notebook-tools" className="sr-only">Search and filter notebook</h2>
          <label htmlFor="notebook-search" className="text-sm font-medium text-ink">Search My Notebook</label>
          <input
            id="notebook-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="mt-2 min-h-11 w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm"
            placeholder="Search words, explanations, remarks, or lessons…"
          />
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Filter notebook by type">
            {filters.map((option) => {
              const count = option.value === "all" ? items.length : items.filter((item) => item.type === option.value).length;
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
          {groups.length === 0 ? (
            <div className="rounded-xl border border-dashed border-stone-300 bg-card p-8 text-center">
              <h2 className="text-lg font-semibold">No matching notebook items</h2>
              <p className="mt-2 text-sm text-muted">
                {items.length === 0 ? "Add an item from a lesson or create a standalone note." : "Try another search or filter."}
              </p>
            </div>
          ) : null}

          <div className="space-y-10">
            {groups.map((group) => (
              <section key={group.key} aria-labelledby={`notebook-group-${group.key}`}>
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-stone-200 pb-3">
                  <div>
                    {group.source ? (
                      <>
                        <p className="text-sm text-muted">Lesson {group.source.lessonNumber}</p>
                        <h2 id={`notebook-group-${group.key}`} className="text-xl font-semibold">{group.source.titleChinese}</h2>
                        <p className="mt-1 text-sm text-muted">{group.source.titleEnglish}</p>
                        <p className="mt-1 text-xs text-muted">
                          {groupCounts.get(group.key) ?? 0} saved {(groupCounts.get(group.key) ?? 0) === 1 ? "note" : "notes"}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-muted">Course-wide</p>
                        <h2 id={`notebook-group-${group.key}`} className="text-xl font-semibold">Standalone Notes</h2>
                        <p className="mt-1 text-xs text-muted">
                          {groupCounts.get(group.key) ?? 0} saved {(groupCounts.get(group.key) ?? 0) === 1 ? "note" : "notes"}
                        </p>
                      </>
                    )}
                  </div>
                  {group.source ? (
                    <Link href={`/lessons/${group.source.lessonId}`} className="inline-flex min-h-11 items-center text-sm font-medium text-accent hover:text-accent-hover">
                      Open source lesson →
                    </Link>
                  ) : null}
                </div>

                <div
                  className="-mx-4 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
                  aria-label={`${group.source ? `Lesson ${group.source.lessonNumber}` : "Standalone"} note previews`}
                >
                  {group.items.slice(0, 3).map((item) => (
                    <NotebookCard
                      key={item.id}
                      item={item}
                      onUpdateNote={updatePersonalNote}
                      onRemove={removeItem}
                      className="w-[82vw] max-w-[21rem] shrink-0 snap-start sm:w-80 lg:w-[calc((100%_-_2rem)/3)] lg:max-w-none"
                    />
                  ))}
                  <Link
                    href={`/notebook/${group.key}`}
                    className="group flex h-[18rem] w-[82vw] max-w-[21rem] shrink-0 snap-start flex-col items-center justify-center p-6 text-center text-accent transition-colors hover:text-accent-hover sm:w-80 lg:w-[calc((100%_-_2rem)/3)] lg:max-w-none"
                    aria-label={`View all notes for ${group.source ? `Lesson ${group.source.lessonNumber}` : "Standalone Notes"}`}
                  >
                    <span className="text-2xl leading-none" aria-hidden="true">→</span>
                    <span className="mt-1 text-lg font-semibold">View all notes</span>
                    <span className="mt-1 text-sm text-muted transition-colors group-hover:text-ink">Open the complete collection</span>
                  </Link>
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
