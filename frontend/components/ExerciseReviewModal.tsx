"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import type { NotebookItem } from "@/lib/notebook";

export default function ExerciseReviewModal({
  item,
  onClose,
}: {
  item: NotebookItem;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const context = item.exerciseContext;
  const selectedExplanation = item.selectedAnswerExplanation ?? item.reason;
  const correctExplanation = item.correctAnswerExplanation;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;
    const controls = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

  if (!context) return null;

  return (
    <div
      className="fixed inset-0 z-[80] overflow-y-auto bg-black/35 p-3 backdrop-blur-sm sm:p-6"
      role="presentation"
      onMouseDown={onClose}
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`exercise-review-title-${item.id}`}
          aria-describedby={`exercise-review-description-${item.id}`}
          onKeyDown={handleKeyDown}
          onMouseDown={(event) => event.stopPropagation()}
          className="w-full max-w-2xl overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl"
        >
          <header className="flex items-start justify-between gap-4 border-b border-stone-200 px-4 py-4 sm:px-6">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Exercise Review</p>
              <h2 id={`exercise-review-title-${item.id}`} className="mt-1 text-xl font-semibold text-ink sm:text-2xl">
                {context.prompt}
              </h2>
              <p id={`exercise-review-description-${item.id}`} className="mt-1 text-sm text-muted">
                Review the original question and compare your selection with the correct answer.
              </p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl text-muted hover:bg-paper hover:text-ink"
              aria-label="Close exercise review"
            >
              ×
            </button>
          </header>

          <div className="max-h-[calc(100dvh-9rem)] overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
            {context.sentence ? (
              <p className="rounded-xl bg-paper p-4 text-lg font-medium leading-8 text-ink">
                {context.sentence}
              </p>
            ) : null}

            {context.options ? (
              <ul className={`${context.sentence ? "mt-4" : ""} space-y-2`}>
                {context.options.map((option) => {
                  const wasSelected = item.myAnswer?.startsWith(`${option.id}.`);
                  const isCorrect = item.correctAnswer?.startsWith(`${option.id}.`);
                  return (
                    <li
                      key={option.id}
                      className={`flex items-start justify-between gap-3 rounded-xl border p-3.5 ${
                        isCorrect
                          ? "border-accent/50 bg-emerald-50"
                          : wasSelected
                            ? "border-rose-300 bg-rose-50"
                            : "border-stone-200 bg-paper"
                      }`}
                    >
                      <span className="text-base leading-6 text-ink">{option.id}. {option.text}</span>
                      {isCorrect ? <span className="shrink-0 text-xs font-semibold text-accent-hover">Correct</span> : null}
                      {!isCorrect && wasSelected ? <span className="shrink-0 text-xs font-semibold text-rose-700">Your selection</span> : null}
                    </li>
                  );
                })}
              </ul>
            ) : null}

            {context.wordBank ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Word bank</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {context.wordBank.map((word) => (
                    <span key={word} className="rounded-full border border-stone-200 bg-paper px-3 py-1.5 text-ink">{word}</span>
                  ))}
                </div>
              </div>
            ) : null}

            {context.sentences ? (
              <ol className="mt-4 space-y-3">
                {context.sentences.map((sentence) => (
                  <li key={sentence.id} className="rounded-xl bg-paper p-4 text-base leading-7 text-ink">
                    <span className="font-semibold text-muted">{sentence.id}. </span>
                    {sentence.before}<span className="mx-1 inline-block min-w-20 border-b border-ink" aria-label="blank" />{sentence.after}
                  </li>
                ))}
              </ol>
            ) : null}

            {selectedExplanation || correctExplanation ? (
              <section className="mt-5 border-t border-stone-200 pt-5" aria-labelledby={`answer-explanations-${item.id}`}>
                <h3 id={`answer-explanations-${item.id}`} className="text-lg font-semibold text-ink">Answer explanations</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {selectedExplanation ? (
                    <article className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Why your selection does not fit</p>
                      <h4 className="mt-2 font-semibold text-ink">{item.myAnswer}</h4>
                      <p className="mt-2 text-sm leading-6 text-muted">{selectedExplanation}</p>
                    </article>
                  ) : null}
                  {correctExplanation ? (
                    <article className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-accent-hover">Why the correct answer fits</p>
                      <h4 className="mt-2 font-semibold text-ink">{item.correctAnswer}</h4>
                      <p className="mt-2 text-sm leading-6 text-muted">{correctExplanation}</p>
                    </article>
                  ) : null}
                </div>
              </section>
            ) : null}

            {item.overallExplanation ? (
              <section className="mt-5 rounded-xl border border-stone-200 bg-paper p-4" aria-labelledby={`overall-explanation-${item.id}`}>
                <h3 id={`overall-explanation-${item.id}`} className="font-semibold text-ink">Explanation</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{item.overallExplanation}</p>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
