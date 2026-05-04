"use client";

type Props = {
  currentFocus: string;
  response: string;
  onAsk: (query: string) => void;
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

export default function AITutorPanel({ currentFocus, response, onAsk }: Props) {
  return (
    <aside className="h-[calc(100vh-2rem)] rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold">AI Tutor</h3>
      <p className="mt-1 text-xs text-muted">Current focus: {currentFocus}</p>
      <div className="mt-2 flex gap-2 text-xs">
        <span className="rounded bg-slate-100 px-2 py-1">EN</span>
        <span className="rounded bg-slate-100 px-2 py-1">中文</span>
        <span className="rounded bg-slate-100 px-2 py-1">Both</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action}
            onClick={() => onAsk(action)}
            className="rounded border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100"
          >
            {action}
          </button>
        ))}
      </div>
      <div className="mt-4 h-[72vh] overflow-y-auto rounded border border-slate-200 bg-slate-50 p-3 text-sm whitespace-pre-line">
        {response}
      </div>
    </aside>
  );
}
