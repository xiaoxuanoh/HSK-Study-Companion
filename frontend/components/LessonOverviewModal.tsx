"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { LessonSummary } from "@/lib/types";

const SECTIONS = [
  "Warm-up",
  "Passage",
  "Vocabulary",
  "Grammar Notes",
  "Word Distinction",
  "Exercises",
  "Writing",
  "Expansion",
];

export default function LessonOverviewModal({
  lesson,
  onClose
}: {
  lesson: LessonSummary;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const controls = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      const first = controls[0];
      const last = controls.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 p-3 sm:px-4 sm:py-10" role="presentation" onMouseDown={onClose}>
      <div ref={dialogRef} className="mx-auto max-h-[calc(100dvh-1.5rem)] max-w-2xl overflow-y-auto rounded-xl bg-white p-4 shadow-xl sm:max-h-[calc(100dvh-5rem)] sm:p-6" role="dialog" aria-modal="true" aria-labelledby="lesson-overview-title" aria-describedby="lesson-overview-description" onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id="lesson-overview-title" className="text-xl font-semibold text-ink sm:text-2xl">{lesson.lesson_title_chinese}</h2>
            <p className="break-words text-sm text-muted">{lesson.lesson_title_english}</p>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} className="-mr-2 -mt-2 flex min-h-11 shrink-0 items-center px-2 text-sm text-muted hover:text-ink">Close</button>
        </div>

        <p id="lesson-overview-description" className="mb-5 text-sm text-muted">
          You will study passage reading, vocabulary nuance, grammar logic, near-synonym distinctions, exercises,
          writing, and expansion in a teacher-style sequence.
        </p>

        <ul className="mb-6 space-y-2">
          {SECTIONS.map((section) => {
            const done = lesson.progress > 0;
            return (
              <li key={section} className="flex items-center gap-3 text-sm">
                <span aria-hidden="true" className={`shrink-0 font-medium ${done ? "text-accent" : "text-stone-300"}`}>✓</span>
                <span className={done ? "text-ink" : "text-muted"}>{section}</span>
              </li>
            );
          })}
        </ul>

        <Link
          href={`/lessons/${lesson.id}`}
          className="inline-flex min-h-11 items-center justify-center rounded bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          {lesson.progress > 0 ? "Continue Lesson" : "Start Lesson"}
        </Link>
      </div>
    </div>
  );
}
