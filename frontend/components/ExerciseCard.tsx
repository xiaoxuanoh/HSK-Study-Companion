"use client";

import { FormEvent, useState } from "react";
import type { NotebookExerciseContext } from "@/lib/notebook";

type FillBlankSentence = {
  id: string;
  before: string;
  after: string;
  answer: string;
};

type FillBlankExplanation = Record<
  string,
  { whyCorrect: string; whyOthersWrong: string }
>;

type MultipleChoiceOption = { id: string; text: string };

type FillBlankExercise = {
  id: string;
  type: "fill_in_the_blank";
  prompt: string;
  wordBank: string[];
  sentences: FillBlankSentence[];
  explanation: FillBlankExplanation;
  relatedConcept: string;
};

type MultipleChoiceExercise = {
  id: string;
  type: "multiple_choice";
  prompt: string;
  sentence?: string;
  options: MultipleChoiceOption[];
  correctAnswer: string;
  explanation: {
    whyCorrect: string;
    optionAnalysis: Record<string, string>;
  };
  relatedConcept: string;
};

export type ExerciseItem = FillBlankExercise | MultipleChoiceExercise;

export type ExerciseMistake = {
  exerciseId: string;
  title: string;
  myAnswer: string;
  correctAnswer: string;
  reason: string;
  selectedAnswerExplanation: string;
  correctAnswerExplanation: string;
  overallExplanation: string;
  exerciseContext: NotebookExerciseContext;
};

const normalizeAnswer = (answer: string) => answer.trim().replaceAll(" ", "");

export default function ExerciseCard({
  item,
  isInNotebook = false,
  onAddMistake,
}: {
  item: ExerciseItem;
  isInNotebook?: boolean;
  onAddMistake?: (mistake: ExerciseMistake) => void;
}) {
  const [fillAnswers, setFillAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isFillBlank = item.type === "fill_in_the_blank";
  const canSubmit = isFillBlank
    ? item.sentences.every((sentence) => fillAnswers[sentence.id]?.trim())
    : Boolean(selectedOption);
  const isCorrect = isFillBlank
    ? item.sentences.every(
        (sentence) => normalizeAnswer(fillAnswers[sentence.id] ?? "") === normalizeAnswer(sentence.answer)
      )
    : selectedOption === item.correctAnswer;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canSubmit) setSubmitted(true);
  };

  const handleRetry = () => {
    setFillAnswers({});
    setSelectedOption("");
    setSubmitted(false);
  };

  const handleAddMistake = () => {
    if (!onAddMistake || isCorrect) return;

    if (isFillBlank) {
      const incorrectSentences = item.sentences.filter(
        (sentence) => normalizeAnswer(fillAnswers[sentence.id] ?? "") !== normalizeAnswer(sentence.answer)
      );
      onAddMistake({
        exerciseId: item.id,
        title: item.prompt,
        myAnswer: incorrectSentences.map((sentence) => `${sentence.id}: ${fillAnswers[sentence.id] || "—"}`).join(" · "),
        correctAnswer: incorrectSentences.map((sentence) => `${sentence.id}: ${sentence.answer}`).join(" · "),
        reason: incorrectSentences.map((sentence) => item.explanation[sentence.id].whyOthersWrong).join(" "),
        selectedAnswerExplanation: incorrectSentences.map((sentence) => item.explanation[sentence.id].whyOthersWrong).join(" "),
        correctAnswerExplanation: incorrectSentences.map((sentence) => item.explanation[sentence.id].whyCorrect).join(" "),
        overallExplanation: incorrectSentences.map((sentence) => item.explanation[sentence.id].whyCorrect).join(" "),
        exerciseContext: {
          kind: "fill-in-the-blank",
          prompt: item.prompt,
          wordBank: item.wordBank,
          sentences: item.sentences.map(({ id, before, after }) => ({ id, before, after })),
        },
      });
      return;
    }

    const selected = item.options.find((option) => option.id === selectedOption);
    const correct = item.options.find((option) => option.id === item.correctAnswer);
    onAddMistake({
      exerciseId: item.id,
      title: item.prompt,
      myAnswer: selected ? `${selected.id}. ${selected.text}` : selectedOption,
      correctAnswer: correct ? `${correct.id}. ${correct.text}` : item.correctAnswer,
      reason: item.explanation.optionAnalysis[selectedOption] || item.explanation.whyCorrect,
      selectedAnswerExplanation: item.explanation.optionAnalysis[selectedOption] || item.explanation.whyCorrect,
      correctAnswerExplanation: item.explanation.optionAnalysis[item.correctAnswer] || item.explanation.whyCorrect,
      overallExplanation: item.explanation.whyCorrect,
      exerciseContext: {
        kind: "multiple-choice",
        prompt: item.prompt,
        sentence: item.sentence,
        options: item.options,
      },
    });
  };

  return (
    <article className="min-w-0 rounded-xl border border-stone-200 bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {isFillBlank ? "Fill in the blank" : "Multiple choice"}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-ink">{item.prompt}</h3>
        </div>
        <span className="rounded-full bg-paper px-3 py-1 text-xs text-muted">{item.relatedConcept}</span>
      </div>

      <form onSubmit={handleSubmit} className="mt-5">
        {isFillBlank ? (
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <span>Word bank:</span>
              {item.wordBank.map((word) => (
                <span key={word} className="rounded-full border border-stone-200 bg-paper px-3 py-1 font-medium text-ink">
                  {word}
                </span>
              ))}
            </div>

            <ol className="mt-5 space-y-4">
              {item.sentences.map((sentence) => {
                const answerIsCorrect =
                  normalizeAnswer(fillAnswers[sentence.id] ?? "") === normalizeAnswer(sentence.answer);
                const resultClass = submitted
                  ? answerIsCorrect
                    ? "border-accent bg-emerald-50"
                    : "border-rose-300 bg-rose-50"
                  : "border-stone-300 bg-white focus:border-accent";

                return (
                  <li key={sentence.id} className="flex flex-wrap items-center gap-2 text-base text-ink">
                    <span className="w-5 shrink-0 font-medium text-muted">{sentence.id}.</span>
                    <span>{sentence.before}</span>
                    <label>
                      <span className="sr-only">Answer for sentence {sentence.id}</span>
                      <input
                        value={fillAnswers[sentence.id] ?? ""}
                        onChange={(event) =>
                          setFillAnswers((previous) => ({ ...previous, [sentence.id]: event.target.value }))
                        }
                        disabled={submitted}
                        autoComplete="off"
                        lang="zh-CN"
                        className={`min-h-11 w-28 max-w-full rounded-lg border px-3 py-2 text-center font-medium text-ink outline-none transition ${resultClass}`}
                        placeholder="输入答案"
                      />
                    </label>
                    <span>{sentence.after}</span>
                    {submitted ? (
                      <span className={`text-sm font-medium ${answerIsCorrect ? "text-accent-hover" : "text-rose-600"}`}>
                        {answerIsCorrect ? "Correct" : `Answer: ${sentence.answer}`}
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </div>
        ) : (
          <div>
            {item.sentence ? <p className="mb-4 text-base font-medium text-ink">{item.sentence}</p> : null}
            <div role="radiogroup" aria-label={item.prompt} className="grid gap-2 sm:grid-cols-2">
              {item.options.map((option) => {
                const isSelected = selectedOption === option.id;
                const isCorrectOption = option.id === item.correctAnswer;
                const resultClass = submitted
                  ? isCorrectOption
                    ? "border-accent bg-emerald-50"
                    : isSelected
                      ? "border-rose-300 bg-rose-50"
                      : "border-stone-200 bg-paper"
                  : isSelected
                    ? "border-accent bg-white shadow-sm"
                    : "border-stone-200 bg-paper hover:border-accent hover:bg-white";

                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={submitted}
                    onClick={() => setSelectedOption(option.id)}
                    className={`flex min-h-11 items-start gap-3 rounded-lg border p-3 text-left transition ${resultClass}`}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                      isSelected || (submitted && isCorrectOption)
                        ? "border-accent bg-accent text-white"
                        : "border-stone-300 text-muted"
                    }`}>
                      {option.id}
                    </span>
                    <span className="pt-0.5 text-sm leading-5 text-ink">{option.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {submitted ? (
            <button
              type="button"
              onClick={handleRetry}
              className="min-h-11 rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-ink hover:bg-paper"
            >
              Try again
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canSubmit}
              className="min-h-11 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Check answer
            </button>
          )}
          {!submitted && !canSubmit ? <p className="text-xs text-muted">Complete the answer first.</p> : null}
        </div>
      </form>

      {submitted ? (
        <div className="mt-5 border-t border-stone-200 pt-5" aria-live="polite">
          <div className={`rounded-lg p-3 ${isCorrect ? "bg-emerald-50" : "bg-rose-50"}`}>
            <p className={`font-semibold ${isCorrect ? "text-accent-hover" : "text-rose-700"}`}>
              {isCorrect ? "Correct — nicely done." : "Not quite — review the explanation below."}
            </p>
          </div>

          {isFillBlank ? (
            <div className="mt-4 space-y-3">
              {item.sentences.map((sentence) => {
                const answerIsCorrect =
                  normalizeAnswer(fillAnswers[sentence.id] ?? "") === normalizeAnswer(sentence.answer);
                const explanation = item.explanation[sentence.id];
                return (
                  <div key={sentence.id} className="rounded-lg bg-paper p-3 text-sm leading-6">
                    <p className="font-semibold text-ink">Sentence {sentence.id}: {sentence.answer}</p>
                    <p className="mt-1 text-ink">{explanation.whyCorrect}</p>
                    {!answerIsCorrect ? <p className="mt-1 text-muted">{explanation.whyOthersWrong}</p> : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 text-sm leading-6">
              <p className="text-ink"><span className="font-semibold">Why:</span> {item.explanation.whyCorrect}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {item.options.map((option) => (
                  <div key={option.id} className="rounded-lg bg-paper p-3">
                    <p className="font-semibold text-ink">{option.id}. {option.text}</p>
                    <p className="mt-1 text-muted">{item.explanation.optionAnalysis[option.id]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isCorrect && onAddMistake ? (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleAddMistake}
                disabled={isInNotebook}
                className="min-h-11 rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-ink hover:bg-white disabled:cursor-default disabled:border-accent/40 disabled:bg-paper disabled:text-accent"
              >
                {isInNotebook ? "✓ Mistake in Notebook" : "Add Mistake to Notebook"}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
