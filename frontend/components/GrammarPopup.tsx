"use client";

import { useEffect, useRef } from "react";

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
}: {
  item: GrammarItem;
  position: Position;
  onClose: () => void;
}) {
  const popupRef = useRef<HTMLDivElement>(null);
  const availableHeight = position.above
    ? Math.max(240, position.y - 16)
    : Math.max(240, window.innerHeight - position.y - 16);
  const style: React.CSSProperties = position.above
    ? { bottom: window.innerHeight - position.y + 8, left: position.x, maxHeight: availableHeight }
    : { top: position.y + 8, left: position.x, maxHeight: availableHeight };

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!popupRef.current?.contains(event.target as Node)) onClose();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
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
      aria-label={`${item.grammarPoint} grammar details`}
      className="fixed z-50 w-[calc(100vw-16px)] max-w-xl overflow-y-auto rounded-xl border border-stone-200 bg-white p-5 shadow-xl"
      style={style}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-ink">{item.grammarPoint}</h3>
          <span className="mt-2 inline-flex rounded-full bg-paper px-2 py-1 text-[11px] font-medium text-muted">
            {item.type}
          </span>
        </div>
        <button type="button" onClick={onClose} className="shrink-0 text-xs text-muted hover:text-ink">
          Close
        </button>
      </div>

      <p className="mt-4 text-sm leading-6 text-ink">{item.coreMeaning}</p>

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
  );
}
