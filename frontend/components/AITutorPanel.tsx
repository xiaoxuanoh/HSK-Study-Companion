"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

type Props = {
  currentFocus: string;
  messages: Message[];
  onAsk: (query: string) => void;
  onClose: () => void;
};

const suggestions = [
  "Explain simply",
  "Break down sentence",
  "Explain grammar",
  "Compare similar words",
  "Give examples",
  "Make a mini quiz",
];

export default function AITutorPanel({ currentFocus, messages, onAsk, onClose }: Props) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const q = input.trim();
    if (!q) return;
    onAsk(q);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-stone-200 px-4 py-3 shrink-0">
        <div>
          <p className="text-xs text-muted">AI Tutor</p>
          <h3 className="text-xl font-semibold text-ink">
            {currentFocus || "Study Assistant"}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-card-hover hover:text-ink"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted">
            Click a vocabulary word and tap &ldquo;Explain More&rdquo; to start.
          </p>
        )}
        {messages.map((msg, idx) =>
          msg.role === "assistant" ? (
            <div key={idx} className="border-l-2 border-accent pl-3 text-sm text-ink whitespace-pre-line">
              {msg.content}
            </div>
          ) : (
            <div key={idx} className="flex justify-end">
              <div className="rounded-lg border border-stone-200 bg-paper px-3 py-2 text-sm text-ink max-w-[85%]">
                {msg.content}
              </div>
            </div>
          )
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips — only after first message */}
      {messages.length > 0 && (
        <div className="shrink-0 px-4 pb-2 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onAsk(s)}
              className="rounded border border-stone-200 px-2 py-1 text-xs text-ink hover:bg-card-hover"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 border-t border-stone-200 px-4 py-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a follow-up question..."
          className="flex-1 rounded border border-stone-200 bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent"
        />
        <button
          onClick={handleSend}
          className="rounded bg-accent px-3 py-2 text-xs text-white hover:bg-accent-hover"
        >
          Send
        </button>
      </div>
    </div>
  );
}
