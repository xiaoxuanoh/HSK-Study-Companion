"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

type GrammarItem = {
  id: string;
  grammarPoint: string;
  type: string;
  coreMeaning: string;
  structure: string;
  logic: Record<string, string>;
  tone: string;
  example: string;
  breakdown: string[];
  commonMistake: string;
  miniPractice: string;
};

type Position = { x: number; y: number; above: boolean };

export default function GrammarPopup({
  item,
  position,
  onClose,
  onExplain,
  isInNotebook,
  onAddToNotebook,
  notebookHref,
}: {
  item: GrammarItem;
  position: Position;
  onClose: () => void;
  onExplain: () => void;
  isInNotebook: boolean;
  onAddToNotebook: () => void;
  notebookHref?: string | null;
}) {
  const popupRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isCompact = window.innerWidth < 640;
  const availableHeight = position.above
    ? Math.max(160, position.y - 16)
    : Math.max(160, window.innerHeight - position.y - 16);
  const style: React.CSSProperties = isCompact
    ? { bottom: 8, left: 8, maxHeight: window.innerHeight - 16 }
    : position.above
      ? { bottom: window.innerHeight - position.y + 8, left: position.x, maxHeight: availableHeight }
      : { top: position.y + 8, left: position.x, maxHeight: availableHeight };

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handlePointerDown = (event: MouseEvent) => {
      if (!popupRef.current?.contains(event.target as Node)) onClose();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !popupRef.current) return;
      const controls = Array.from(
        popupRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')
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

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.grammarPoint} grammar details`}
      className="fixed z-50 w-[calc(100vw-16px)] max-w-xl overflow-y-auto overscroll-contain rounded-xl border border-stone-200 bg-white shadow-xl"
      style={style}
    >
      <header className="sticky top-0 z-10 flex flex-wrap items-start gap-x-4 gap-y-3 bg-white p-4 sm:p-5">
        <div className="mr-auto min-w-0">
          <h3 className="text-xl font-semibold text-ink">{item.grammarPoint}</h3>
          <span className="mt-2 inline-flex rounded-full bg-paper px-2 py-1 text-[11px] font-medium text-muted">
            {item.type}
          </span>
        </div>
        <div className="ml-auto flex shrink-0 flex-wrap items-center justify-end gap-1.5">
          <button type="button" onClick={onExplain} className="min-h-9 rounded-lg bg-accent px-2.5 py-1.5 text-[11px] font-medium text-white hover:bg-accent-hover">
            Explain More
          </button>
          {isInNotebook && notebookHref ? (
            <Link
              href={notebookHref}
              className="inline-flex min-h-9 items-center rounded-lg border border-stone-300 px-2.5 py-1.5 text-[11px] font-medium text-accent hover:bg-paper hover:text-accent-hover"
            >
              View in Notebook
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAddToNotebook}
              disabled={isInNotebook}
              className="min-h-9 rounded-lg border border-stone-300 px-2.5 py-1.5 text-[11px] font-medium text-ink hover:bg-paper disabled:cursor-default disabled:border-accent/40 disabled:bg-paper disabled:text-accent"
            >
              {isInNotebook ? "✓ In Notebook" : "Add to Notebook"}
            </button>
          )}
          <button ref={closeButtonRef} type="button" onClick={onClose} className="flex min-h-9 shrink-0 items-center px-1.5 text-[11px] text-muted hover:text-ink">
            Close
          </button>
        </div>
        <span className="sr-only" aria-live="polite">
          {isInNotebook ? `${item.grammarPoint} is already in My Notebook.` : ""}
        </span>
      </header>

      <div className="p-4 sm:p-5">
        <p className="text-sm leading-6 text-ink">{item.coreMeaning}</p>

        <div className="mt-4 rounded-lg border border-stone-200 bg-paper p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Structure</p>
          <p className="mt-1 font-medium text-ink">{item.structure}</p>
        </div>

      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">How it works</p>
        <dl className="mt-2 grid gap-2 sm:grid-cols-2">
          {Object.entries(item.logic).map(([label, explanation]) => (
            <div key={label} className="rounded-lg border border-stone-200 p-3">
              <dt className="font-semibold text-ink">{label}</dt>
              <dd className="mt-1 text-sm leading-5 text-muted">{explanation}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-4 space-y-3 text-sm leading-6">
        <p className="text-ink"><span className="font-semibold">Tone:</span> {item.tone}</p>
        <div className="rounded-lg bg-paper p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Example</p>
          <p className="mt-1 text-ink">{item.example}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Breakdown</p>
        <ul className="mt-2 space-y-2 text-sm leading-5 text-ink">
          {item.breakdown.map((part) => (
            <li key={part} className="flex gap-2">
              <span className="text-accent">•</span>
              <span>{part}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-lg border border-stone-200 p-3 text-sm leading-5">
        <p className="font-semibold text-ink">Common mistake</p>
        <p className="mt-1 text-muted">{item.commonMistake}</p>
      </div>

      <div className="mt-3 rounded-lg bg-paper p-3 text-sm leading-5">
        <p className="font-semibold text-ink">Try it</p>
        <p className="mt-1 text-muted">{item.miniPractice}</p>
      </div>

      </div>
    </div>
  );
}
