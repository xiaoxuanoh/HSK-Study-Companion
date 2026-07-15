"use client";

import { FormEvent, useState } from "react";

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

const normalizeAnswer = (answer: string) => answer.trim().replaceAll(" ", "");

export default function ExerciseCard({ item }: { item: ExerciseItem }) {
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

  return (
    <article className="rounded-xl border border-stone-200 bg-card p-5 shadow-sm">
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
                        className={`w-28 rounded-lg border px-3 py-2 text-center font-medium text-ink outline-none transition ${resultClass}`}
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
                    className={`flex items-start gap-3 rounded-lg border p-3 text-left transition ${resultClass}`}
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

        <div className="mt-5 flex items-center gap-3">
          {submitted ? (
            <button
              type="button"
              onClick={handleRetry}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-ink hover:bg-paper"
            >
              Try again
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
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
        </div>
      ) : null}
    </article>
  );
}
