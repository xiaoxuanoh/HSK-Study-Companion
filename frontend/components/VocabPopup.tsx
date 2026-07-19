"use client";

import { useEffect, useRef } from "react";

type Item = {
  id: string;
  word: string;
  pinyin: string;
  partOfSpeech: string;
  meaning: string;
  simpleExplanation: string;
  example: string;
};

type Position = { x: number; y: number; above: boolean };

export default function VocabPopup({
  item,
  position,
  onClose,
  onExplain,
  itemType = "vocabulary",
  isInNotebook,
  onAddToNotebook
}: {
  item: Item;
  position: Position;
  onClose: () => void;
  onExplain: () => void;
  itemType?: "vocabulary" | "phrase";
  isInNotebook: boolean;
  onAddToNotebook: () => void;
}) {
  const popupRef = useRef<HTMLDivElement>(null);
  const style: React.CSSProperties = position.above
    ? { bottom: window.innerHeight - position.y + 8, left: position.x }
    : { top: position.y + 8, left: position.x };

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
      aria-label={`${item.word} ${itemType} details`}
      className="fixed z-50 w-[calc(100vw-16px)] max-w-sm rounded-xl border border-stone-200 bg-white p-4 shadow-xl"
      style={style}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-lg font-semibold text-ink">{item.word}</h4>
          <p className="text-xs text-muted">{item.pinyin}</p>
        </div>
        <button onClick={onClose} className="shrink-0 text-xs text-muted hover:text-ink">Close</button>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-full bg-paper px-2 py-1 text-[11px] font-medium text-muted">{item.partOfSpeech}</span>
        <span className="text-sm font-medium text-ink">{item.meaning}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-ink">{item.simpleExplanation}</p>
      <div className="mt-3 rounded-lg bg-paper p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Example</p>
        <p className="mt-1 text-sm leading-6 text-ink">{item.example}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={onExplain} className="rounded bg-accent px-2 py-1 text-xs text-white hover:bg-accent-hover">Explain More</button>
        <button
          type="button"
          onClick={onAddToNotebook}
          disabled={isInNotebook}
          className="rounded border border-stone-300 px-2 py-1 text-xs font-medium text-ink hover:bg-paper disabled:cursor-default disabled:border-accent/40 disabled:bg-paper disabled:text-accent"
        >
          {isInNotebook ? "✓ In Notebook" : "Add to Notebook"}
        </button>
        <span className="sr-only" aria-live="polite">
          {isInNotebook ? `${item.word} is already in My Notebook.` : ""}
        </span>
      </div>
    </div>
  );
}
