"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import ExerciseReviewModal from "@/components/ExerciseReviewModal";
import type { NotebookItem, NotebookItemType } from "@/lib/notebook";

export const notebookTypeLabels: Record<NotebookItemType, string> = {
  vocabulary: "Vocabulary",
  phrase: "Phrases",
  grammar: "Grammar",
  mistake: "Mistakes",
  "personal-note": "Personal Notes",
};

function NotebookDetailsModal({
  item,
  onClose,
  onUpdateNote,
  onRemove,
}: {
  item: NotebookItem;
  onClose: () => void;
  onUpdateNote: (id: string, note: string) => void;
  onRemove: (id: string) => void;
}) {
  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(item.personalNote);
  const [confirmingRemoval, setConfirmingRemoval] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const viewQuestionButtonRef = useRef<HTMLButtonElement>(null);
  const noteLabel = item.type === "personal-note" ? "Note" : "Personal remark";
  const summaryLabel = item.type === "phrase" ? "Explanation" : null;
  const contextLabel = item.type === "phrase" ? "Original context" : "Lesson context";

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (showQuestion) return;
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

  const saveNote = () => {
    const nextNote = noteDraft.trim();
    onUpdateNote(item.id, nextNote);
    setNoteDraft(nextNote);
    setEditingNote(false);
  };

  const closeQuestion = useCallback(() => {
    setShowQuestion(false);
    window.requestAnimationFrame(() => viewQuestionButtonRef.current?.focus());
  }, []);

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-black/35 p-3 backdrop-blur-sm sm:p-6"
      role="presentation"
      onMouseDown={onClose}
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`notebook-details-title-${item.id}`}
          onKeyDown={handleKeyDown}
          onMouseDown={(event) => event.stopPropagation()}
          className="w-full max-w-xl overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl"
        >
          <header className="flex items-start justify-between gap-4 border-b border-stone-200 px-4 py-4 sm:px-6">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">{notebookTypeLabels[item.type]}</p>
              <h2 id={`notebook-details-title-${item.id}`} className="mt-1 break-words text-xl font-semibold text-ink sm:text-2xl">
                {item.title}
              </h2>
              {item.pinyin ? <p className="mt-1 text-sm text-muted">{item.pinyin}</p> : null}
              {item.sourceSection ? <p className="mt-1 text-xs text-muted">From {item.sourceSection}</p> : null}
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl text-muted hover:bg-paper hover:text-ink"
              aria-label="Close note details"
            >
              ×
            </button>
          </header>

          <div className="max-h-[calc(100dvh-9rem)] overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
            <time className="text-xs text-muted" dateTime={item.createdAt}>
              Saved {new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(item.createdAt))}
            </time>

            {item.summary ? (
              summaryLabel ? (
                <section className="mt-4" aria-labelledby={`notebook-summary-${item.id}`}>
                  <h3 id={`notebook-summary-${item.id}`} className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {summaryLabel}
                  </h3>
                  <p className="mt-1 text-base leading-7 text-ink">{item.summary}</p>
                </section>
              ) : (
                <p className="mt-4 text-base leading-7 text-ink">{item.summary}</p>
              )
            ) : null}
            {item.context && item.context !== item.title ? (
              <div className="mt-4 rounded-xl bg-paper p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{contextLabel}</p>
                <p className="mt-1 text-sm leading-6 text-ink">{item.context}</p>
              </div>
            ) : null}
            {item.structure ? (
              <div className="mt-4 rounded-xl bg-paper p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Structure</p>
                <p className="mt-1 font-medium leading-7 text-ink">{item.structure}</p>
              </div>
            ) : null}
            {item.type === "mistake" ? (
              <div className="mt-4">
                <dl className="space-y-3 rounded-xl bg-paper p-4">
                  {item.myAnswer ? (
                    <div>
                      <dt className="text-sm font-semibold text-muted">Your selection</dt>
                      <dd className="mt-1 font-medium text-rose-700">{item.myAnswer}</dd>
                    </div>
                  ) : null}
                  {item.correctAnswer ? (
                    <div>
                      <dt className="text-sm font-semibold text-muted">Correct answer</dt>
                      <dd className="mt-1 font-medium text-accent-hover">{item.correctAnswer}</dd>
                    </div>
                  ) : null}
                  {item.overallExplanation ? (
                    <div>
                      <dt className="text-sm font-semibold text-muted">Explanation</dt>
                      <dd className="mt-1 text-sm leading-6 text-ink">{item.overallExplanation}</dd>
                    </div>
                  ) : null}
                </dl>
                {item.exerciseContext ? (
                  <button
                    ref={viewQuestionButtonRef}
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded={showQuestion}
                    onClick={() => setShowQuestion(true)}
                    className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover"
                  >
                    <span aria-hidden="true">↗</span>
                    View full question
                  </button>
                ) : null}
              </div>
            ) : null}

            <section className="mt-5 border-t border-stone-200 pt-5" aria-labelledby={`notebook-remark-${item.id}`}>
              <h3 id={`notebook-remark-${item.id}`} className="text-xs font-semibold uppercase tracking-wide text-muted">
                {noteLabel}
              </h3>
              {editingNote ? (
                <div>
                  <textarea
                    aria-labelledby={`notebook-remark-${item.id}`}
                    value={noteDraft}
                    onChange={(event) => setNoteDraft(event.target.value)}
                    rows={5}
                    className="mt-2 w-full resize-y rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm leading-6 text-ink"
                    placeholder={item.type === "personal-note" ? "Write your note…" : "Add a memory aid, example, or reminder…"}
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button type="button" onClick={saveNote} className="min-h-11 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover">
                      Save {item.type === "personal-note" ? "note" : "remark"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNoteDraft(item.personalNote);
                        setEditingNote(false);
                      }}
                      className="min-h-11 rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-ink hover:bg-paper"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink">
                    {item.personalNote || "No personal remark yet."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setNoteDraft(item.personalNote);
                      setEditingNote(true);
                    }}
                    className="mt-2 min-h-11 text-sm font-medium text-accent hover:text-accent-hover"
                  >
                    {item.personalNote
                      ? `Edit ${item.type === "personal-note" ? "note" : "remark"}`
                      : "Add remark"}
                  </button>
                </div>
              )}
            </section>

            <div className="mt-4 border-t border-stone-200 pt-4">
              {confirmingRemoval ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3" role="alert">
                  <p className="text-sm font-medium text-rose-800">Remove this item from My Notebook?</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onRemove(item.id);
                        onClose();
                      }}
                      className="min-h-11 rounded-lg bg-rose-700 px-4 py-2 text-sm font-medium text-white hover:bg-rose-800"
                    >
                      Yes, remove
                    </button>
                    <button type="button" onClick={() => setConfirmingRemoval(false)} className="min-h-11 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-paper">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmingRemoval(true)} className="min-h-11 text-sm font-medium text-rose-700 hover:text-rose-800">
                  Remove from Notebook
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showQuestion && item.exerciseContext ? <ExerciseReviewModal item={item} onClose={closeQuestion} /> : null}
    </div>
  );
}

export default function NotebookCard({
  item,
  onUpdateNote,
  onRemove,
  htmlId,
  isHighlighted = false,
  className = "",
}: {
  item: NotebookItem;
  onUpdateNote: (id: string, note: string) => void;
  onRemove: (id: string) => void;
  htmlId?: string;
  isHighlighted?: boolean;
  className?: string;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const detailsButtonRef = useRef<HTMLButtonElement>(null);
  const noteLabel = item.type === "personal-note" ? "Note" : "Personal remark";
  const phrasePreview = item.type === "phrase"
    ? item.summary || "No explanation yet."
    : null;

  const closeDetails = useCallback(() => {
    setShowDetails(false);
    window.requestAnimationFrame(() => detailsButtonRef.current?.focus());
  }, []);

  return (
    <>
      <article
        id={htmlId}
        className={`scroll-mt-28 flex h-[18rem] min-w-0 flex-col overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition-shadow ${
          isHighlighted ? "border-accent ring-2 ring-accent/50" : "border-stone-200"
        } ${className}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{notebookTypeLabels[item.type]}</p>
            <h3 className="mt-1 line-clamp-2 break-words text-lg font-semibold text-ink">{item.title}</h3>
            {item.pinyin ? <p className="mt-0.5 line-clamp-1 text-sm text-muted">{item.pinyin}</p> : null}
            {item.sourceSection ? <p className="mt-0.5 line-clamp-1 text-xs text-muted">From {item.sourceSection}</p> : null}
          </div>
          <time className="shrink-0 text-xs text-muted" dateTime={item.createdAt}>
            {new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(item.createdAt))}
          </time>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          {item.summary ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink">{item.summary}</p> : null}
          {phrasePreview && !item.summary ? (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{phrasePreview}</p>
          ) : null}
          {item.structure ? (
            <div className="mt-3 rounded-lg bg-paper p-3 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Structure</p>
              <p className="mt-1 line-clamp-2 font-medium text-ink">{item.structure}</p>
            </div>
          ) : null}
          {item.type === "mistake" ? (
            <dl className="mt-3 space-y-1.5 rounded-lg bg-paper px-3 py-2 text-sm">
              {item.myAnswer ? (
                <div>
                  <dt className="font-semibold text-muted">Your selection</dt>
                  <dd className="mt-0.5 line-clamp-1 font-medium text-rose-700">{item.myAnswer}</dd>
                </div>
              ) : null}
              {item.correctAnswer ? (
                <div>
                  <dt className="font-semibold text-muted">Correct answer</dt>
                  <dd className="mt-0.5 line-clamp-1 font-medium text-accent-hover">{item.correctAnswer}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </div>

        <div className="border-t border-stone-200 pt-3">
          <p className="text-sm text-muted">
            <span className="font-semibold text-ink">{noteLabel}:</span>{" "}
            <span className={item.personalNote ? "font-medium text-accent-hover" : ""}>
              {item.personalNote ? "Yes" : "No"}
            </span>
          </p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4">
            <button
              ref={detailsButtonRef}
              type="button"
              aria-haspopup="dialog"
              aria-expanded={showDetails}
              onClick={() => setShowDetails(true)}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover"
            >
              View details <span aria-hidden="true">→</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Remove this item from My Notebook?")) onRemove(item.id);
              }}
              className="min-h-11 text-sm font-medium text-rose-700 hover:text-rose-800"
            >
              Remove
            </button>
          </div>
        </div>
      </article>

      {showDetails ? (
        <NotebookDetailsModal
          item={item}
          onClose={closeDetails}
          onUpdateNote={onUpdateNote}
          onRemove={onRemove}
        />
      ) : null}
    </>
  );
}
