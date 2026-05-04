"use client";

import { useEffect, useState } from "react";
import LessonOverviewModal from "@/components/LessonOverviewModal";
import { getLessons } from "@/lib/api";
import type { LessonSummary } from "@/lib/types";

export default function DashboardPage() {
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [selected, setSelected] = useState<LessonSummary | null>(null);

  useEffect(() => {
    getLessons().then(setLessons);
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Lesson Dashboard</h1>
      <p className="mt-2 text-slate-600">HSK 6 pilot flow with teacher-style explanation support.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {lessons.map((lesson) => (
          <article key={lesson.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs text-slate-500">Unit {lesson.unit_number}</p>
            <h2 className="text-xl font-semibold">{lesson.lesson_title_chinese}</h2>
            <p className="text-sm text-slate-600">{lesson.lesson_title_english}</p>
            <progress className="mt-4 h-2 w-full overflow-hidden rounded [&::-webkit-progress-bar]:bg-slate-100 [&::-webkit-progress-value]:bg-accent" max={100} value={lesson.progress} />
            <button
              onClick={() => setSelected(lesson)}
              className="mt-4 rounded bg-accent px-3 py-2 text-sm text-white hover:bg-slate-700"
            >
              Start / Continue
            </button>
          </article>
        ))}
      </div>

      {selected ? <LessonOverviewModal lesson={selected} onClose={() => setSelected(null)} /> : null}
    </main>
  );
}
