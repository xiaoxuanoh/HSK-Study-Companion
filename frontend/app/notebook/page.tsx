import Link from "next/link";
import { mockLesson } from "@/lib/mockData";

type NotebookItem = {
  id: string;
  type: string;
  word?: string;
  pinyin?: string;
  meaning?: string;
  grammarPoint?: string;
  structure?: string;
  myAnswer?: string;
  correctAnswer?: string;
  reason?: string;
  note?: string;
};

const savedItems = mockLesson.sections.notebook.savedItems as NotebookItem[];

function getItemTitle(item: NotebookItem) {
  if (item.word) return item.word;
  if (item.grammarPoint) return item.grammarPoint;
  if (item.type === "mistake") return "Exercise mistake";
  return "Notebook item";
}

function getItemSummary(item: NotebookItem) {
  if (item.meaning) return item.meaning;
  if (item.structure) return item.structure;
  if (item.reason) return item.reason;
  return item.note;
}

export default function NotebookPage() {
  return (
    <div className="min-h-[100dvh] bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-paper px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">HSK Study Companion</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">My Notebook</h1>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-stone-300 bg-card px-4 text-sm font-medium transition-colors hover:bg-card-hover"
          >
            <span aria-hidden="true">←</span>
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <section aria-labelledby="notebook-introduction" className="rounded-xl border border-stone-200 bg-card p-5 shadow-sm sm:p-6">
          <h2 id="notebook-introduction" className="text-lg font-semibold">Your course-wide study workspace</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Vocabulary, grammar, mistakes, and personal study notes from every lesson belong here, separate from the lesson sections.
          </p>
        </section>

        <section aria-labelledby="lesson-one-notes" className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm text-muted">Lesson {mockLesson.lesson.number}</p>
              <h2 id="lesson-one-notes" className="text-xl font-semibold">
                {mockLesson.lesson.titleChinese}
              </h2>
              <p className="mt-1 text-sm text-muted">{mockLesson.lesson.titleEnglish}</p>
            </div>
            <Link
              href={`/lessons/${mockLesson.id}`}
              className="inline-flex min-h-11 items-center text-sm font-medium text-accent hover:text-accent-hover"
            >
              Return to lesson →
            </Link>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {savedItems.map((item) => (
              <article key={item.id} className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{item.type}</p>
                <h3 className="mt-2 text-lg font-semibold">{getItemTitle(item)}</h3>
                {item.pinyin ? <p className="mt-0.5 text-sm text-muted">{item.pinyin}</p> : null}
                {getItemSummary(item) ? (
                  <p className="mt-3 text-sm leading-6 text-ink">{getItemSummary(item)}</p>
                ) : null}
                {item.type === "mistake" && item.myAnswer && item.correctAnswer ? (
                  <p className="mt-3 text-sm text-muted">
                    Your answer: {item.myAnswer} · Correct answer: {item.correctAnswer}
                  </p>
                ) : null}
                {item.note ? <p className="mt-3 border-t border-stone-200 pt-3 text-sm leading-6 text-muted">{item.note}</p> : null}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
