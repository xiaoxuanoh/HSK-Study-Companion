"use client";

import Link from "next/link";
import type { LessonSummary } from "@/lib/types";

export default function LessonOverviewModal({
  lesson,
  onClose
}: {
  lesson: LessonSummary;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/30 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-ink">{lesson.lesson_title_chinese}</h2>
            <p className="text-sm text-muted">{lesson.lesson_title_english}</p>
          </div>
          <button onClick={onClose} className="text-sm text-muted hover:text-ink">Close</button>
        </div>

        <p className="mb-4 text-sm text-slate-700">
          You will study passage reading, vocabulary nuance, grammar logic, near-synonym distinctions, exercises,
          writing, expansion, and notebook review in a teacher-style sequence.
        </p>

        <ul className="mb-5 grid grid-cols-2 gap-2 text-sm text-slate-700">
          {[
            "Warm-up",
            "Passage",
            "Vocabulary",
            "Grammar Notes",
            "Word Distinction",
            "Exercises",
            "Writing",
            "Expansion",
            "Notebook"
          ].map((item) => (
            <li key={item} className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>

        <Link
          href={`/lessons/${lesson.id}`}
          className="inline-flex rounded bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Start Lesson
        </Link>
      </div>
    </div>
  );
}
