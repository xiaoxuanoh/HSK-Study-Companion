"use client";

import { useEffect, useRef, useState } from "react";
import {
  createWritingFeedback,
  type WritingFeedbackEntry,
  writingRepository,
} from "@/lib/writing";

type WritingWorkspaceProps = {
  lessonId: string;
  prompt: { chinese: string; english: string };
  promptExplanation: string;
  writingPlan: string[];
  usefulPatterns: string[];
  lessonVocabulary: string[];
};

const feedbackGroups: Array<{
  key: keyof WritingFeedbackEntry["feedback"];
  label: string;
}> = [
  { key: "strengths", label: "Strengths" },
  { key: "grammarAndClarity", label: "Grammar & clarity" },
  { key: "naturalWording", label: "More natural wording" },
  { key: "lessonVocabulary", label: "Lesson vocabulary" },
  { key: "revisionSuggestions", label: "Revision suggestions" },
];

export default function WritingWorkspace({
  lessonId,
  prompt,
  promptExplanation,
  writingPlan,
  usefulPatterns,
  lessonVocabulary,
}: WritingWorkspaceProps) {
  const [draft, setDraft] = useState("");
  const [draftUpdatedAt, setDraftUpdatedAt] = useState<string | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<WritingFeedbackEntry[]>([]);
  const [ready, setReady] = useState(false);
  const latestDraftRef = useRef(draft);
  const readyRef = useRef(ready);

  useEffect(() => {
    latestDraftRef.current = draft;
    readyRef.current = ready;
  }, [draft, ready]);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      const workspace = writingRepository.load(lessonId);
      setDraft(workspace.draft);
      setDraftUpdatedAt(workspace.draftUpdatedAt);
      setFeedbackHistory(workspace.feedbackHistory);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(loadTimer);
  }, [lessonId]);

  useEffect(() => {
    if (!ready) return;
    const saveTimer = window.setTimeout(() => {
      const workspace = writingRepository.saveDraft(lessonId, draft);
      setDraftUpdatedAt(workspace.draftUpdatedAt);
    }, 400);
    return () => window.clearTimeout(saveTimer);
  }, [draft, lessonId, ready]);

  useEffect(() => () => {
    if (readyRef.current) writingRepository.saveDraft(lessonId, latestDraftRef.current);
  }, [lessonId]);

  const clearDraft = () => {
    if (!draft || !window.confirm("Clear this draft? Your feedback history will be kept.")) return;
    const workspace = writingRepository.saveDraft(lessonId, "");
    setDraft("");
    setDraftUpdatedAt(workspace.draftUpdatedAt);
  };

  const resetWorkspace = () => {
    if ((!draft && feedbackHistory.length === 0)
      || !window.confirm("Reset this writing workspace? This will permanently remove the draft and all local feedback history for this lesson.")) {
      return;
    }
    writingRepository.reset(lessonId);
    setDraft("");
    setDraftUpdatedAt(null);
    setFeedbackHistory([]);
  };

  const getFeedback = () => {
    if (!draft.trim()) return;
    const entry = createWritingFeedback(draft, lessonVocabulary, usefulPatterns);
    const workspace = writingRepository.addFeedback(lessonId, entry);
    setFeedbackHistory(workspace.feedbackHistory);
  };

  const latestFeedback = feedbackHistory[0];

  return (
    <div className="mt-4 max-w-5xl space-y-5">
      <section className="overflow-hidden rounded-xl border border-stone-200 bg-card shadow-sm">
        <div className="border-b border-stone-200 p-5 sm:p-6">
          <p className="text-lg font-semibold leading-8 text-ink" lang="zh-CN">{prompt.chinese}</p>
          <p className="mt-1 leading-6 text-muted">{prompt.english}</p>
          <p className="mt-4 text-sm leading-6 text-ink">{promptExplanation}</p>
        </div>

        <div className="grid gap-5 bg-paper/40 p-5 sm:p-6 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Writing plan</h3>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-ink">
              {writingPlan.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent-hover">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Useful lesson patterns</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {usefulPatterns.map((pattern) => (
                <span key={pattern} className="rounded-full border border-stone-200 bg-card px-3 py-1.5 text-sm text-ink" lang="zh-CN">
                  {pattern}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-ink">Your essay</h3>
            <p className="mt-1 text-sm text-muted">
              Your draft is saved automatically in this browser.
            </p>
          </div>
          <p aria-live="polite" className="text-sm font-medium text-muted">
            {draft.length} characters <span aria-hidden="true">·</span> about 200 suggested
          </p>
        </div>

        <label className="mt-4 block">
          <span className="sr-only">Essay draft</span>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            lang="zh-CN"
            rows={12}
            placeholder="从一个具体的经历开始……"
            className="min-h-72 w-full resize-y rounded-xl border border-stone-300 bg-white px-4 py-4 text-lg leading-8 text-ink shadow-inner outline-none transition focus:border-accent"
          />
        </label>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted" aria-live="polite">
            {draftUpdatedAt ? `Saved locally ${new Date(draftUpdatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Not saved yet"}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={clearDraft}
              disabled={!draft}
              className="min-h-11 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-stone-400 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Clear draft
            </button>
            <button
              type="button"
              onClick={resetWorkspace}
              disabled={!draft && feedbackHistory.length === 0}
              className="min-h-11 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-stone-400 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Reset workspace
            </button>
            <button
              type="button"
              onClick={getFeedback}
              disabled={!draft.trim()}
              className="min-h-11 rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-45"
            >
              Get Feedback
            </button>
          </div>
        </div>
      </section>

      {latestFeedback ? (
        <section className="rounded-xl border border-accent/35 bg-card p-5 shadow-sm sm:p-6" aria-labelledby="latest-feedback-title">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-hover">Supportive feedback</p>
              <h3 id="latest-feedback-title" className="mt-1 text-xl font-semibold text-ink">Your latest feedback</h3>
            </div>
            <time className="text-xs text-muted" dateTime={latestFeedback.createdAt}>
              {new Date(latestFeedback.createdAt).toLocaleString()}
            </time>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">
            Use what helps your revision. This guidance does not assign a score or grade.
          </p>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {feedbackGroups.map((group) => (
              <article key={group.key} className="rounded-lg border border-stone-200 bg-paper/55 p-4">
                <h4 className="font-semibold text-ink">{group.label}</h4>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted">
                  {latestFeedback.feedback[group.key].map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {feedbackHistory.length > 0 ? (
        <section className="rounded-xl border border-stone-200 bg-card p-5 shadow-sm sm:p-6">
          <h3 className="text-lg font-semibold text-ink">Feedback history</h3>
          <p className="mt-1 text-sm text-muted">Each entry keeps the draft you submitted at that moment.</p>
          <div className="mt-4 space-y-2">
            {feedbackHistory.map((entry, index) => (
              <details key={entry.id} className="rounded-lg border border-stone-200 bg-paper/50">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-ink">
                  {index === 0 ? "Latest feedback" : `Feedback ${feedbackHistory.length - index}`} · {entry.draftSnapshot.length} characters · {new Date(entry.createdAt).toLocaleString()}
                </summary>
                <div className="border-t border-stone-200 px-4 py-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">Submitted draft</h4>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted" lang="zh-CN">{entry.draftSnapshot}</p>
                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    {feedbackGroups.map((group) => (
                      <div key={group.key} className="rounded-lg bg-card p-3">
                        <h4 className="text-sm font-semibold text-ink">{group.label}</h4>
                        <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">
                          {entry.feedback[group.key].map((item) => <li key={item}>{item}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
