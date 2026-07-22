"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent, type RefObject } from "react";

export type StudyTextSelection = {
  text: string;
  context: string;
  sectionKey: string;
  sectionTitle: string;
};

type SelectionState = StudyTextSelection & {
  x: number;
  y: number;
  appearsAbove: boolean;
};

type Props = {
  scopeRef: RefObject<HTMLElement | null>;
  sectionKey: string;
  sectionTitle: string;
  isSaved: (selection: StudyTextSelection) => boolean;
  onAddToNotebook: (selection: StudyTextSelection) => boolean;
  onExplainMore: (selection: StudyTextSelection) => void;
};

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

const parentElement = (node: Node | null) => (
  node instanceof Element ? node : node?.parentElement ?? null
);

export default function TextSelectionActions({
  scopeRef,
  sectionKey,
  sectionTitle,
  isSaved,
  onAddToNotebook,
  onExplainMore,
}: Props) {
  const [selection, setSelection] = useState<SelectionState | null>(null);
  const [feedback, setFeedback] = useState("");
  const actionPointerDownRef = useRef(false);
  const selectingRef = useRef(false);
  const selectionTimerRef = useRef<number | null>(null);

  const dismiss = useCallback((clearBrowserSelection = false) => {
    setSelection(null);
    setFeedback("");
    if (clearBrowserSelection) window.getSelection()?.removeAllRanges();
  }, []);

  const readSelection = useCallback(() => {
    const scope = scopeRef.current;
    const browserSelection = window.getSelection();
    if (!scope || !browserSelection || browserSelection.rangeCount === 0 || browserSelection.isCollapsed) {
      if (actionPointerDownRef.current) return;
      setSelection(null);
      setFeedback("");
      return;
    }

    const range = browserSelection.getRangeAt(0);
    const startElement = parentElement(range.startContainer);
    const endElement = parentElement(range.endContainer);
    if (!startElement || !endElement || !scope.contains(startElement) || !scope.contains(endElement)) {
      setSelection(null);
      setFeedback("");
      return;
    }

    const text = normalizeText(browserSelection.toString());
    if (!text) {
      setSelection(null);
      setFeedback("");
      return;
    }

    const contextElement = startElement.closest("[data-selection-context], p, li, td, th, button, article");
    const rawContext = contextElement && scope.contains(contextElement)
      ? (contextElement.textContent ?? "")
      : text;
    const context = normalizeText(rawContext);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    const toolbarHalfWidth = 140;
    const x = Math.max(toolbarHalfWidth + 8, Math.min(rect.left + rect.width / 2, window.innerWidth - toolbarHalfWidth - 8));
    const appearsAbove = rect.top > 84;
    setSelection({
      text,
      context,
      sectionKey,
      sectionTitle,
      x,
      y: appearsAbove ? rect.top - 8 : rect.bottom + 8,
      appearsAbove,
    });
    setFeedback("");
  }, [scopeRef, sectionKey, sectionTitle]);

  useEffect(() => {
    const clearSelectionTimer = () => {
      if (selectionTimerRef.current !== null) {
        window.clearTimeout(selectionTimerRef.current);
        selectionTimerRef.current = null;
      }
    };
    const scheduleRead = (delay = 160) => {
      if (selectingRef.current || actionPointerDownRef.current) return;
      clearSelectionTimer();
      selectionTimerRef.current = window.setTimeout(() => {
        selectionTimerRef.current = null;
        readSelection();
      }, delay);
    };
    const handlePointerDown = (event: globalThis.PointerEvent) => {
      const scope = scopeRef.current;
      if (!scope || !(event.target instanceof Node) || !scope.contains(event.target)) return;
      selectingRef.current = true;
      clearSelectionTimer();
      setSelection(null);
      setFeedback("");
    };
    const handlePointerUp = () => {
      if (!selectingRef.current) return;
      selectingRef.current = false;
      scheduleRead(60);
    };
    const handlePointerCancel = () => {
      selectingRef.current = false;
      clearSelectionTimer();
    };
    const handleSelectionChange = () => scheduleRead();

    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("pointerup", handlePointerUp, true);
    document.addEventListener("pointercancel", handlePointerCancel, true);
    return () => {
      clearSelectionTimer();
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("pointerup", handlePointerUp, true);
      document.removeEventListener("pointercancel", handlePointerCancel, true);
    };
  }, [readSelection, scopeRef]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss(true);
    };
    const handleScroll = () => dismiss();
    window.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [dismiss]);

  if (!selection) return null;

  const studySelection: StudyTextSelection = selection;
  const saved = isSaved(studySelection);
  const preserveSelection = (event: PointerEvent<HTMLButtonElement>) => {
    actionPointerDownRef.current = true;
    event.preventDefault();
  };
  const finishAction = () => {
    actionPointerDownRef.current = false;
  };

  const actions = (
    <>
      <button
        type="button"
        onPointerDown={preserveSelection}
        onPointerCancel={finishAction}
        onClick={() => {
          const added = onAddToNotebook(studySelection);
          setFeedback(added ? "Added to Notebook" : "Already in Notebook");
          finishAction();
        }}
        disabled={saved}
        className="min-h-11 rounded-md px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10 disabled:cursor-default disabled:text-white/60 sm:min-h-9"
      >
        {saved ? "✓ In Notebook" : "Add to Notebook"}
      </button>
      <span className="h-6 w-px bg-white/20 sm:h-5" aria-hidden="true" />
      <button
        type="button"
        onPointerDown={preserveSelection}
        onPointerCancel={finishAction}
        onClick={() => {
          onExplainMore(studySelection);
          finishAction();
          dismiss(true);
        }}
        className="min-h-11 rounded-md px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10 sm:min-h-9"
      >
        Explain More
      </button>
    </>
  );

  return (
    <>
      <div
        role="toolbar"
        aria-label="Actions for selected lesson text"
        className={`fixed z-[55] hidden items-center rounded-lg bg-stone-900 p-0.5 shadow-lg sm:flex ${
          selection.appearsAbove ? "-translate-x-1/2 -translate-y-full" : "-translate-x-1/2"
        }`}
        style={{ left: selection.x, top: selection.y }}
      >
        {actions}
      </div>

      <div
        role="toolbar"
        aria-label="Actions for selected lesson text"
        className="fixed inset-x-3 bottom-3 z-[55] rounded-xl bg-stone-900 p-1 shadow-2xl sm:hidden"
      >
        <div className="flex items-center justify-center">{actions}</div>
        {feedback ? <p className="px-3 pb-2 text-center text-xs text-white/70" aria-live="polite">{feedback}</p> : null}
      </div>

      {feedback ? <span className="sr-only" aria-live="polite">{feedback}</span> : null}
    </>
  );
}
