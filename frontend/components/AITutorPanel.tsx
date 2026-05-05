"use client";

type Props = {
  currentFocus: string;
  response: string;
  onAsk: (query: string) => void;
  onClose: () => void;
};

const actions = [
  "Explain simply",
  "Break down sentence",
  "Explain grammar",
  "Compare similar words",
  "Give examples",
  "Why is my answer wrong?",
  "Make a mini quiz",
  "Save this"
];

export default function AITutorPanel({ currentFocus, response, onAsk, onClose }: Props) {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-ink">AI Tutor</h3>
          <p className="mt-0.5 text-xs text-muted">Focus: {currentFocus}</p>
        </div>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-card-hover hover:text-ink"
          aria-label="Close AI Tutor"
        >
          ✕
        </button>
      </div>

      <div className="mt-2 flex gap-2 text-xs">
        <span className="rounded bg-paper px-2 py-1 text-muted border border-stone-200">EN</span>
        <span className="rounded bg-paper px-2 py-1 text-muted border border-stone-200">中文</span>
        <span className="rounded bg-paper px-2 py-1 text-muted border border-stone-200">Both</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action}
            onClick={() => onAsk(action)}
            className="rounded border border-stone-200 px-2 py-1 text-xs text-ink hover:bg-card-hover"
          >
            {action}
          </button>
        ))}
      </div>

      <div className="mt-4 flex-1 overflow-y-auto rounded border border-stone-200 bg-paper p-3 text-sm text-ink whitespace-pre-line">
        {response}
      </div>
    </div>
  );
}
