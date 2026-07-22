"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import TextSelectionActions, { type StudyTextSelection } from "@/components/TextSelectionActions";

type Message = { role: "user" | "assistant"; content: string };

type Props = {
  currentFocus: string;
  messages: Message[];
  onAsk: (query: string) => void;
  onClear: () => void;
  onClose: () => void;
  emptyStateText?: string;
  selectionActions?: {
    isSaved: (selection: StudyTextSelection) => boolean;
    onAddToNotebook: (selection: StudyTextSelection) => boolean;
    onExplainMore: (selection: StudyTextSelection) => void;
  };
};

const suggestions = [
  "Explain simply",
  "Break down sentence",
  "Explain grammar",
  "Compare similar words",
  "Give examples",
  "Make a mini quiz",
];

export default function AITutorPanel({
  currentFocus,
  messages,
  onAsk,
  onClear,
  onClose,
  emptyStateText = "Select a vocabulary word and choose “Explain More”, or type a question below.",
  selectionActions,
}: Props) {
  const [input, setInput] = useState("");
  const [isModal, setIsModal] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1279px)");
    const updateMode = () => setIsModal(mediaQuery.matches);
    updateMode();
    mediaQuery.addEventListener("change", updateMode);
    return () => mediaQuery.removeEventListener("change", updateMode);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentFocus]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const q = input.trim();
    if (!q) return;
    onAsk(q);
    setInput("");
  };

  const handleClear = () => {
    if (messages.length === 0) return;
    if (!window.confirm("Clear this AI Tutor conversation?")) return;
    setInput("");
    onClear();
    window.requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handlePanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (!isModal || event.key !== "Tab" || !panelRef.current) return;
    const controls = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

  return (
    <div
      id="ai-tutor-panel"
      ref={panelRef}
      role={isModal ? "dialog" : "complementary"}
      aria-modal={isModal || undefined}
      aria-labelledby="ai-tutor-title"
      className="flex h-full flex-col"
      onKeyDown={handlePanelKeyDown}
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-stone-200 px-4 py-3 shrink-0">
        <div>
          <p className="text-xs text-muted">AI Tutor</p>
          <h3 id="ai-tutor-title" className="line-clamp-2 break-words text-xl font-semibold text-ink">
            Study Assistant
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleClear}
            disabled={messages.length === 0}
            className="min-h-11 rounded-lg px-2 text-xs font-medium text-muted hover:bg-card-hover hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear chat
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted hover:bg-card-hover hover:text-ink"
            aria-label="Close AI tutor"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesRef}
        className="flex-1 select-text space-y-4 overflow-y-auto px-4 py-3"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.length === 0 && (
          <p className="text-sm text-muted">{emptyStateText}</p>
        )}
        {messages.map((msg, idx) =>
          msg.role === "assistant" ? (
            <div key={idx} data-selection-context className="border-l-2 border-accent pl-3 text-sm text-ink whitespace-pre-line">
              {msg.content}
            </div>
          ) : (
            <div key={idx} className="flex justify-end">
              <div data-selection-context className="rounded-lg border border-stone-200 bg-paper px-3 py-2 text-sm text-ink max-w-[85%]">
                {msg.content}
              </div>
            </div>
          )
        )}
        <div ref={bottomRef} />
      </div>

      {selectionActions ? (
        <TextSelectionActions
          scopeRef={messagesRef}
          sectionKey="ai-tutor"
          sectionTitle="AI Tutor"
          ariaLabel="Actions for selected AI Tutor text"
          {...selectionActions}
        />
      ) : null}

      {/* Suggestion chips — only after first message */}
      {messages.length > 0 && (
        <div className="flex shrink-0 flex-wrap gap-1.5 px-3 pb-1.5 sm:px-4">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onAsk(s)}
              className="min-h-10 rounded-md border border-stone-200 px-2.5 py-1.5 text-xs leading-5 text-ink hover:bg-card-hover sm:min-h-9"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex shrink-0 gap-2 border-t border-stone-200 px-3 py-3 sm:px-4">
        <label htmlFor="ai-tutor-input" className="sr-only">Ask the AI tutor a question</label>
        <input
          id="ai-tutor-input"
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a follow-up question..."
          className="min-h-11 min-w-0 flex-1 rounded border border-stone-200 bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSend}
          className="min-h-11 rounded bg-accent px-4 py-2 text-xs text-white hover:bg-accent-hover"
        >
          Send
        </button>
      </div>
    </div>
  );
}
