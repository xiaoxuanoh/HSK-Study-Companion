"use client";

import { useEffect, useSyncExternalStore } from "react";

export const NOTEBOOK_STORAGE_VERSION = 5;
export const NOTEBOOK_STORAGE_KEY = "hsk-study-companion:notebook";

export type NotebookItemType = "vocabulary" | "phrase" | "grammar" | "mistake" | "personal-note";

export type NotebookSource = {
  lessonId: string;
  lessonNumber: number;
  titleChinese: string;
  titleEnglish: string;
};

export type NotebookExerciseContext = {
  kind: "multiple-choice" | "fill-in-the-blank";
  prompt: string;
  sentence?: string;
  options?: Array<{ id: string; text: string }>;
  wordBank?: string[];
  sentences?: Array<{ id: string; before: string; after: string }>;
};

export type NotebookItem = {
  id: string;
  type: NotebookItemType;
  title: string;
  pinyin?: string;
  summary?: string;
  structure?: string;
  myAnswer?: string;
  correctAnswer?: string;
  reason?: string;
  selectedAnswerExplanation?: string;
  correctAnswerExplanation?: string;
  overallExplanation?: string;
  exerciseContext?: NotebookExerciseContext;
  personalNote: string;
  source?: NotebookSource;
  dedupeKey?: string;
  createdAt: string;
  updatedAt: string;
};

export type NewNotebookItem = Omit<NotebookItem, "id" | "createdAt" | "updatedAt" | "personalNote"> & {
  personalNote?: string;
};

type NotebookEnvelope = {
  version: typeof NOTEBOOK_STORAGE_VERSION;
  items: NotebookItem[];
};

type StoredNotebookEnvelope = {
  version?: number;
  items?: unknown[];
};

export interface NotebookRepository {
  getSnapshot(): readonly NotebookItem[];
  subscribe(onChange: () => void): () => void;
  initialize(items: readonly NotebookItem[]): void;
  add(item: NewNotebookItem): boolean;
  updatePersonalNote(id: string, personalNote: string): void;
  remove(id: string): void;
}

const NOTEBOOK_CHANGE_EVENT = "hsk-study-companion:notebook-change";
const EMPTY_ITEMS: readonly NotebookItem[] = [];

const lessonOneSource: NotebookSource = {
  lessonId: "hsk6-lesson-01",
  lessonNumber: 1,
  titleChinese: "孩子给我们的启示",
  titleEnglish: "An epiphany from the children",
};

const exerciseTwoContext: NotebookExerciseContext = {
  kind: "multiple-choice",
  prompt: "选择合适的词完成句子",
  sentence: "这件事_____很复杂，但我们还是要认真解决。",
  options: [
    { id: "A", text: "当然" },
    { id: "B", text: "固然" },
    { id: "C", text: "虽然" },
    { id: "D", text: "既然" },
  ],
};

const exerciseTwoSelectedExplanation = "当然 means 'of course' — it confirms something expected, with no contrast. It doesn't fit the sentence structure here.";
const exerciseTwoCorrectExplanation = "固然 is correct because it acknowledges that the complexity is true while preparing for the contrasting point that follows.";
const exerciseTwoOverallExplanation = "固然 is correct because it acknowledges the complexity (A) while signaling that a contrasting point follows (we still need to solve it = B). The sentence has a concession + contrast structure.";

export const initialNotebookItems: readonly NotebookItem[] = [
  {
    id: "nb-1",
    type: "vocabulary",
    title: "启示",
    pinyin: "qǐshì",
    summary: "insight; lesson learned from experience",
    personalNote: "Remember: 启示 is a noun. 启发 can be a verb.",
    source: lessonOneSource,
    dedupeKey: "vocabulary:hsk6-lesson-01:启示",
    createdAt: "2026-05-04T10:00:00Z",
    updatedAt: "2026-05-04T10:00:00Z",
  },
  {
    id: "nb-2",
    type: "grammar",
    title: "固然",
    structure: "A 固然……，但是 B",
    personalNote: "Always needs a contrast clause. Don't use as 当然.",
    source: lessonOneSource,
    dedupeKey: "grammar:hsk6-lesson-01:固然",
    createdAt: "2026-05-04T10:05:00Z",
    updatedAt: "2026-05-04T10:05:00Z",
  },
  {
    id: "nb-3",
    type: "mistake",
    title: "选择合适的词完成句子",
    myAnswer: "A. 当然",
    correctAnswer: "B. 固然",
    reason: exerciseTwoSelectedExplanation,
    selectedAnswerExplanation: exerciseTwoSelectedExplanation,
    correctAnswerExplanation: exerciseTwoCorrectExplanation,
    overallExplanation: exerciseTwoOverallExplanation,
    exerciseContext: exerciseTwoContext,
    personalNote: "",
    source: lessonOneSource,
    dedupeKey: "mistake:hsk6-lesson-01:ex-2",
    createdAt: "2026-05-04T10:10:00Z",
    updatedAt: "2026-05-04T10:10:00Z",
  },
];

export const makeNotebookDedupeKey = (
  type: Exclude<NotebookItemType, "personal-note">,
  lessonId: string,
  contentId: string
) => `${type}:${lessonId}:${contentId}`;

const isNotebookItem = (value: unknown): value is NotebookItem => {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<NotebookItem>;
  return typeof item.id === "string"
    && typeof item.type === "string"
    && typeof item.title === "string"
    && typeof item.personalNote === "string"
    && typeof item.createdAt === "string"
    && typeof item.updatedAt === "string";
};

const normalizeLegacyItem = (item: NotebookItem): NotebookItem => {
  const hasLegacyLessonSource = item.source?.lessonId === "hsk6-u1-l1";
  const normalizedDedupeKey = item.dedupeKey?.replace(":hsk6-u1-l1:", ":hsk6-lesson-01:");
  const normalizedItem: NotebookItem = hasLegacyLessonSource
    ? { ...item, source: lessonOneSource, dedupeKey: normalizedDedupeKey }
    : { ...item, dedupeKey: normalizedDedupeKey };
  const isSeededExerciseTwo = normalizedItem.type === "mistake"
    && (normalizedItem.id === "nb-3" || normalizedItem.dedupeKey === "mistake:hsk6-lesson-01:ex-2");

  if (!isSeededExerciseTwo) return normalizedItem;
  return {
    ...normalizedItem,
    title: "选择合适的词完成句子",
    myAnswer: normalizedItem.myAnswer === "A" ? "A. 当然" : normalizedItem.myAnswer,
    correctAnswer: normalizedItem.correctAnswer === "B" ? "B. 固然" : normalizedItem.correctAnswer,
    selectedAnswerExplanation: normalizedItem.selectedAnswerExplanation ?? exerciseTwoSelectedExplanation,
    correctAnswerExplanation: normalizedItem.correctAnswerExplanation ?? exerciseTwoCorrectExplanation,
    overallExplanation: normalizedItem.overallExplanation ?? exerciseTwoOverallExplanation,
    exerciseContext: normalizedItem.exerciseContext ?? exerciseTwoContext,
  };
};

const migrateStoredItems = (envelope: StoredNotebookEnvelope): NotebookItem[] | null => {
  if (!Array.isArray(envelope.items)) return null;
  const items = envelope.items.filter(isNotebookItem);

  if (
    envelope.version !== 1
    && envelope.version !== 2
    && envelope.version !== 3
    && envelope.version !== 4
    && envelope.version !== NOTEBOOK_STORAGE_VERSION
  ) {
    return null;
  }
  return items.map(normalizeLegacyItem);
};

class BrowserNotebookRepository implements NotebookRepository {
  private cachedRaw: string | null | undefined;
  private cachedItems: readonly NotebookItem[] = EMPTY_ITEMS;

  getSnapshot = (): readonly NotebookItem[] => {
    if (typeof window === "undefined") return EMPTY_ITEMS;
    const raw = window.localStorage.getItem(NOTEBOOK_STORAGE_KEY);
    if (raw === this.cachedRaw) return this.cachedItems;

    this.cachedRaw = raw;
    if (!raw) {
      this.cachedItems = EMPTY_ITEMS;
      return this.cachedItems;
    }

    try {
      const envelope = JSON.parse(raw) as StoredNotebookEnvelope;
      const items = migrateStoredItems(envelope);
      if (!items) {
        this.cachedItems = EMPTY_ITEMS;
        return this.cachedItems;
      }
      this.cachedItems = items;
    } catch {
      this.cachedItems = EMPTY_ITEMS;
    }
    return this.cachedItems;
  };

  subscribe = (onChange: () => void) => {
    window.addEventListener("storage", onChange);
    window.addEventListener(NOTEBOOK_CHANGE_EVENT, onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener(NOTEBOOK_CHANGE_EVENT, onChange);
    };
  };

  initialize = (items: readonly NotebookItem[]) => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(NOTEBOOK_STORAGE_KEY);
    if (!raw) {
      this.write(items);
      return;
    }

    try {
      const envelope = JSON.parse(raw) as StoredNotebookEnvelope;
      if (envelope.version === 1 || envelope.version === 2 || envelope.version === 3 || envelope.version === 4) {
        const migratedItems = migrateStoredItems(envelope);
        if (migratedItems) this.write(migratedItems);
      }
    } catch {
      // Preserve unreadable data instead of overwriting it automatically.
    }
  };

  add = (item: NewNotebookItem) => {
    const currentItems = this.getSnapshot();
    if (item.dedupeKey && currentItems.some((savedItem) => savedItem.dedupeKey === item.dedupeKey)) {
      return false;
    }

    const timestamp = new Date().toISOString();
    const id = typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `notebook-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    this.write([
      {
        ...item,
        id,
        personalNote: item.personalNote ?? "",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      ...currentItems,
    ]);
    return true;
  };

  updatePersonalNote = (id: string, personalNote: string) => {
    const timestamp = new Date().toISOString();
    this.write(this.getSnapshot().map((item) => (
      item.id === id ? { ...item, personalNote, updatedAt: timestamp } : item
    )));
  };

  remove = (id: string) => {
    this.write(this.getSnapshot().filter((item) => item.id !== id));
  };

  private write(items: readonly NotebookItem[]) {
    const envelope: NotebookEnvelope = {
      version: NOTEBOOK_STORAGE_VERSION,
      items: [...items],
    };
    const raw = JSON.stringify(envelope);
    window.localStorage.setItem(NOTEBOOK_STORAGE_KEY, raw);
    this.cachedRaw = raw;
    this.cachedItems = envelope.items;
    window.dispatchEvent(new Event(NOTEBOOK_CHANGE_EVENT));
  }
}

export const notebookRepository: NotebookRepository = new BrowserNotebookRepository();

export function useNotebook() {
  useEffect(() => {
    notebookRepository.initialize(initialNotebookItems);
  }, []);

  const items = useSyncExternalStore(
    notebookRepository.subscribe,
    notebookRepository.getSnapshot,
    () => EMPTY_ITEMS
  );

  return {
    items,
    addItem: notebookRepository.add.bind(notebookRepository),
    updatePersonalNote: notebookRepository.updatePersonalNote.bind(notebookRepository),
    removeItem: notebookRepository.remove.bind(notebookRepository),
  };
}
