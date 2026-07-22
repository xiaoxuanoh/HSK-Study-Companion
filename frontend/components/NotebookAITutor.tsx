"use client";

import { useEffect, useRef, useState } from "react";
import AITutorPanel from "@/components/AITutorPanel";
import type { StudyTextSelection } from "@/components/TextSelectionActions";
import { askAI } from "@/lib/api";
import { makeNotebookDedupeKey, type NotebookSource, useNotebook } from "@/lib/notebook";

type Message = { role: "user" | "assistant"; content: string };

type Props = {
  source?: NotebookSource;
};

export default function NotebookAITutor({ source }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentFocus, setCurrentFocus] = useState("");
  const [iconPosition, setIconPosition] = useState<{ x: number; y: number } | null>(null);
  const { items, addItem } = useNotebook();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragState = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!dragState.current.active) return;
      const deltaX = event.clientX - dragState.current.startX;
      const deltaY = event.clientY - dragState.current.startY;
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) dragState.current.moved = true;
      setIconPosition({
        x: Math.max(8, Math.min(dragState.current.originX + deltaX, window.innerWidth - 56)),
        y: Math.max(8, Math.min(dragState.current.originY + deltaY, window.innerHeight - 56)),
      });
    };
    const finishDrag = () => {
      dragState.current.active = false;
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", finishDrag);
    window.addEventListener("pointercancel", finishDrag);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finishDrag);
      window.removeEventListener("pointercancel", finishDrag);
    };
  }, []);

  const onAsk = async (query: string) => {
    setMessages((previous) => [...previous, { role: "user", content: query }]);
    const response = await askAI(source?.lessonId ?? "hsk6-lesson-01", query);
    setMessages((previous) => [...previous, { role: "assistant", content: response }]);
  };

  const explainSelection = (selection: StudyTextSelection) => {
    setCurrentFocus(selection.text);
    const learnerMessage = `Explain “${selection.text}”`;
    const contextSuffix = selection.context !== selection.text
      ? ` The surrounding AI Tutor message is: ${selection.context}`
      : "";
    setMessages((previous) => [...previous, { role: "user", content: learnerMessage }]);
    void askAI(
      source?.lessonId ?? "hsk6-lesson-01",
      `Explain the selected text “${selection.text}” from our AI Tutor conversation.${contextSuffix}`
    ).then((response) => {
      setMessages((previous) => [...previous, { role: "assistant", content: response }]);
    });
  };

  const selectionDedupeKey = (selection: StudyTextSelection) => makeNotebookDedupeKey(
    "phrase",
    source?.lessonId ?? "course-wide",
    `ai-tutor:${selection.text}`
  );

  const closeTutor = () => {
    setIsOpen(false);
    window.requestAnimationFrame(() => buttonRef.current?.focus());
  };

  return (
    <>
      {isOpen ? (
        <div className="fixed inset-0 z-[60] overflow-hidden bg-card xl:inset-y-0 xl:left-auto xl:w-[340px] xl:border-l xl:border-stone-200 xl:shadow-xl">
          <AITutorPanel
            currentFocus={currentFocus}
            messages={messages}
            onAsk={onAsk}
            onClear={() => {
              setMessages([]);
              setCurrentFocus("");
            }}
            onClose={closeTutor}
            emptyStateText="Ask a study question, then select any useful part of the conversation to explain it further or save it."
            selectionActions={{
              isSaved: (selection) => items.some((item) => item.dedupeKey === selectionDedupeKey(selection)),
              onAddToNotebook: (selection) => addItem({
                type: "phrase",
                title: selection.text,
                context: selection.context,
                sourceSection: "AI Tutor",
                source,
                dedupeKey: selectionDedupeKey(selection),
              }),
              onExplainMore: explainSelection,
            }}
          />
        </div>
      ) : (
        <button
          ref={buttonRef}
          type="button"
          aria-label="Open AI tutor"
          aria-haspopup="dialog"
          aria-expanded={false}
          aria-controls="ai-tutor-panel"
          className="fixed z-50 flex h-12 w-12 touch-none cursor-grab select-none items-center justify-center rounded-full bg-accent text-xl text-white shadow-lg transition-colors hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          style={iconPosition ? { left: iconPosition.x, top: iconPosition.y } : { right: 24, bottom: 24 }}
          onPointerDown={(event) => {
            event.preventDefault();
            const rect = event.currentTarget.getBoundingClientRect();
            dragState.current = {
              active: true,
              startX: event.clientX,
              startY: event.clientY,
              originX: rect.left,
              originY: rect.top,
              moved: false,
            };
          }}
          onClick={(event) => {
            if (event.detail === 0 || !dragState.current.moved) setIsOpen(true);
          }}
        >
          <span aria-hidden="true">✦</span>
        </button>
      )}
    </>
  );
}
