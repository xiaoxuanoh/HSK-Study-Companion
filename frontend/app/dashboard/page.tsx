"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const modalTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    getLessons().then((lessons) => setUnits(groupByUnit(lessons)));
  }, []);

  const closeLessonModal = useCallback(() => {
    setSelected(null);
    window.requestAnimationFrame(() => modalTriggerRef.current?.focus());
  }, []);

  return (
    <div className="flex min-h-[100dvh] min-w-0 flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-paper px-4 py-2.5 sm:px-6 sm:py-3">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">HSK Study Companion</p>
            <h1 className="mt-0.5 text-xl font-semibold text-ink sm:text-2xl">Dashboard</h1>
          </div>
          <Link
            href="/notebook"
            className="inline-flex min-h-11 items-center rounded-lg border border-stone-300 bg-card px-4 text-sm font-medium text-ink transition-colors hover:bg-card-hover"
          >
            My Notebook
          </Link>
        </div>
      </header>

      {/* One horizontally scrollable row per unit */}
      <main className="flex-1 space-y-10 py-6 sm:py-8">
        {units.map((unit) => (
          <section key={unit.unit_number} className="px-4 sm:px-6">
            <div className="flex min-w-0 flex-col items-start gap-4 lg:flex-row lg:gap-6">
              {/* Inline unit header — no box, top-aligned */}
              <div className="w-full shrink-0 pt-1 lg:w-52">
                <p className="text-sm text-muted">Unit {unit.unit_number}</p>
                <p className="text-2xl font-bold leading-tight text-ink sm:text-3xl">{unit.unit_title_chinese}</p>
                <p className="text-base text-muted mt-1">{unit.unit_title_english}</p>
              </div>

              {/* Lesson cards */}
              <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:overflow-x-auto lg:pb-2">
                {unit.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded={selected?.id === lesson.id}
                    onClick={(event) => {
                      modalTriggerRef.current = event.currentTarget;
                      setSelected(lesson);
                    }}
                    className="flex min-h-36 w-full min-w-0 flex-col rounded-xl border border-stone-200 bg-card p-5 text-left shadow-sm transition-colors duration-150 hover:bg-card-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-paper lg:w-80 lg:shrink-0"
                  >
                    <p className="text-sm text-muted">Lesson {lesson.lesson_number}</p>
                    <span className="mt-1 block w-full overflow-hidden text-ellipsis whitespace-nowrap text-xl font-semibold leading-snug text-ink">
                      {lesson.lesson_title_chinese}
                    </span>
                    <p className="mt-1 w-full overflow-hidden text-ellipsis whitespace-nowrap text-base text-muted">
                      {lesson.lesson_title_english}
                    </p>

                    {/* Progress bar pinned to bottom */}
                    <div className="mt-auto w-full pt-4">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${lesson.progress}%` }}
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>

      {selected ? (
        <LessonOverviewModal lesson={selected} onClose={closeLessonModal} />
      ) : null}
    </div>
  );
}
