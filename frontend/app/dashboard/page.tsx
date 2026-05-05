"use client";

import { useEffect, useState } from "react";
import LessonOverviewModal from "@/components/LessonOverviewModal";
import { getLessons } from "@/lib/api";
import type { LessonSummary } from "@/lib/types";

type UnitGroup = {
  unit_number: number;
  unit_title_chinese: string;
  unit_title_english: string;
  lessons: LessonSummary[];
};

function groupByUnit(lessons: LessonSummary[]): UnitGroup[] {
  const map = new Map<number, UnitGroup>();
  for (const lesson of lessons) {
    if (!map.has(lesson.unit_number)) {
      map.set(lesson.unit_number, {
        unit_number: lesson.unit_number,
        unit_title_chinese: lesson.unit_title_chinese,
        unit_title_english: lesson.unit_title_english,
        lessons: [],
      });
    }
    map.get(lesson.unit_number)!.lessons.push(lesson);
  }
  return Array.from(map.values()).sort((a, b) => a.unit_number - b.unit_number);
}

export default function DashboardPage() {
  const [units, setUnits] = useState<UnitGroup[]>([]);
  const [selected, setSelected] = useState<LessonSummary | null>(null);

  useEffect(() => {
    getLessons().then((lessons) => setUnits(groupByUnit(lessons)));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <header className="border-b border-stone-200 px-6 py-5">
        <h1 className="text-3xl font-semibold text-ink">Lesson Dashboard</h1>
      </header>

      {/* One horizontally scrollable row per unit */}
      <main className="flex-1 py-8 space-y-10">
        {units.map((unit) => (
          <section key={unit.unit_number}>
            <div className="flex gap-6 overflow-x-auto px-6 pb-2 items-start">
              {/* Inline unit header — no box, top-aligned */}
              <div className="shrink-0 w-52 pt-1">
                <p className="text-sm text-muted">Unit {unit.unit_number}</p>
                <p className="text-3xl font-bold text-ink leading-tight">{unit.unit_title_chinese}</p>
                <p className="text-base text-muted mt-1">{unit.unit_title_english}</p>
              </div>

              {/* Lesson cards */}
              {unit.lessons.map((lesson) => (
                <article
                  key={lesson.id}
                  onClick={() => setSelected(lesson)}
                  className="w-80 shrink-0 rounded-xl border border-stone-200 bg-card hover:bg-card-hover cursor-pointer p-5 shadow-sm transition-colors duration-150 flex flex-col"
                >
                  <p className="text-sm text-muted">Lesson {lesson.lesson_number}</p>
                  <h2 className="mt-1 text-xl font-semibold text-ink leading-snug whitespace-nowrap overflow-hidden text-ellipsis">
                    {lesson.lesson_title_chinese}
                  </h2>
                  <p className="text-base text-muted mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                    {lesson.lesson_title_english}
                  </p>

                  {/* Progress bar pinned to bottom */}
                  <div className="mt-auto pt-4">
                    <div className="h-1.5 w-full rounded-full bg-stone-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${lesson.progress}%` }}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>

      {selected ? (
        <LessonOverviewModal lesson={selected} onClose={() => setSelected(null)} />
      ) : null}
    </div>
  );
}
