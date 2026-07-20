export const WRITING_STORAGE_VERSION = 1;
export const WRITING_STORAGE_KEY = "hsk-study-companion:writing";

export type WritingFeedbackSections = {
  strengths: string[];
  grammarAndClarity: string[];
  naturalWording: string[];
  lessonVocabulary: string[];
  revisionSuggestions: string[];
};

export type WritingFeedbackEntry = {
  id: string;
  createdAt: string;
  draftSnapshot: string;
  feedback: WritingFeedbackSections;
};

export type WritingWorkspace = {
  draft: string;
  draftUpdatedAt: string | null;
  feedbackHistory: WritingFeedbackEntry[];
};

type WritingEnvelope = {
  version: typeof WRITING_STORAGE_VERSION;
  workspaces: Record<string, WritingWorkspace>;
};

export interface WritingRepository {
  load(lessonId: string): WritingWorkspace;
  saveDraft(lessonId: string, draft: string): WritingWorkspace;
  addFeedback(lessonId: string, entry: WritingFeedbackEntry): WritingWorkspace;
  reset(lessonId: string): void;
}

const emptyWorkspace = (): WritingWorkspace => ({
  draft: "",
  draftUpdatedAt: null,
  feedbackHistory: [],
});

const isFeedbackEntry = (value: unknown): value is WritingFeedbackEntry => {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<WritingFeedbackEntry>;
  return typeof entry.id === "string"
    && typeof entry.createdAt === "string"
    && typeof entry.draftSnapshot === "string"
    && Boolean(entry.feedback)
    && Array.isArray(entry.feedback?.strengths)
    && Array.isArray(entry.feedback?.grammarAndClarity)
    && Array.isArray(entry.feedback?.naturalWording)
    && Array.isArray(entry.feedback?.lessonVocabulary)
    && Array.isArray(entry.feedback?.revisionSuggestions);
};

const normalizeWorkspace = (value: unknown): WritingWorkspace => {
  if (!value || typeof value !== "object") return emptyWorkspace();
  const workspace = value as Partial<WritingWorkspace>;
  return {
    draft: typeof workspace.draft === "string" ? workspace.draft : "",
    draftUpdatedAt: typeof workspace.draftUpdatedAt === "string" ? workspace.draftUpdatedAt : null,
    feedbackHistory: Array.isArray(workspace.feedbackHistory)
      ? workspace.feedbackHistory.filter(isFeedbackEntry)
      : [],
  };
};

class BrowserWritingRepository implements WritingRepository {
  load(lessonId: string) {
    return normalizeWorkspace(this.read().workspaces[lessonId]);
  }

  saveDraft(lessonId: string, draft: string) {
    const envelope = this.read();
    const workspace = normalizeWorkspace(envelope.workspaces[lessonId]);
    const nextWorkspace = {
      ...workspace,
      draft,
      draftUpdatedAt: new Date().toISOString(),
    };
    this.write({
      ...envelope,
      workspaces: { ...envelope.workspaces, [lessonId]: nextWorkspace },
    });
    return nextWorkspace;
  }

  addFeedback(lessonId: string, entry: WritingFeedbackEntry) {
    const envelope = this.read();
    const workspace = normalizeWorkspace(envelope.workspaces[lessonId]);
    const nextWorkspace = {
      ...workspace,
      feedbackHistory: [entry, ...workspace.feedbackHistory],
    };
    this.write({
      ...envelope,
      workspaces: { ...envelope.workspaces, [lessonId]: nextWorkspace },
    });
    return nextWorkspace;
  }

  reset(lessonId: string) {
    const envelope = this.read();
    const { [lessonId]: _removed, ...remainingWorkspaces } = envelope.workspaces;
    void _removed;
    this.write({ ...envelope, workspaces: remainingWorkspaces });
  }

  private read(): WritingEnvelope {
    if (typeof window === "undefined") {
      return { version: WRITING_STORAGE_VERSION, workspaces: {} };
    }

    const raw = window.localStorage.getItem(WRITING_STORAGE_KEY);
    if (!raw) return { version: WRITING_STORAGE_VERSION, workspaces: {} };

    try {
      const parsed = JSON.parse(raw) as Partial<WritingEnvelope>;
      if (parsed.version !== WRITING_STORAGE_VERSION || !parsed.workspaces || typeof parsed.workspaces !== "object") {
        return { version: WRITING_STORAGE_VERSION, workspaces: {} };
      }
      return { version: WRITING_STORAGE_VERSION, workspaces: parsed.workspaces };
    } catch {
      return { version: WRITING_STORAGE_VERSION, workspaces: {} };
    }
  }

  private write(envelope: WritingEnvelope) {
    window.localStorage.setItem(WRITING_STORAGE_KEY, JSON.stringify(envelope));
  }
}

export const writingRepository: WritingRepository = new BrowserWritingRepository();

export const createWritingFeedback = (
  draft: string,
  lessonVocabulary: string[],
  usefulPatterns: string[]
): WritingFeedbackEntry => {
  const compactDraft = draft.trim();
  const characterCount = compactDraft.length;
  const usedVocabulary = lessonVocabulary.filter((word) => compactDraft.includes(word));
  const unusedVocabulary = lessonVocabulary.filter((word) => !compactDraft.includes(word)).slice(0, 3);
  const usedPatterns = usefulPatterns.filter((pattern) => {
    const anchors = pattern.split(/[…，。！？、]/).map((part) => part.trim()).filter((part) => part.length >= 2);
    return anchors.some((anchor) => compactDraft.includes(anchor));
  });
  const sentences = compactDraft.split(/[。！？!?]/).map((sentence) => sentence.trim()).filter(Boolean);
  const longestSentence = sentences.reduce((longest, sentence) => Math.max(longest, sentence.length), 0);
  const timestamp = new Date().toISOString();

  return {
    id: typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `writing-feedback-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: timestamp,
    draftSnapshot: compactDraft,
    feedback: {
      strengths: [
        characterCount >= 140
          ? "You developed the reflection with enough detail for the lesson task."
          : "You have established a clear starting point that can be developed further.",
        usedVocabulary.length > 0
          ? `You connected the response to the lesson through ${usedVocabulary.join("、")}.`
          : "Your response stays focused on a personal experience and its meaning.",
      ],
      grammarAndClarity: [
        sentences.length >= 3
          ? "The response has several clear sentence units, which helps the reader follow the experience and reflection."
          : "Consider separating the situation, reaction, and reflection into distinct sentences or paragraphs.",
        longestSentence > 55
          ? "One sentence is quite long. Splitting it near a comma may make the main idea easier to follow."
          : "Sentence length is manageable; check that each pronoun clearly refers to the intended person.",
      ],
      naturalWording: [
        compactDraft.includes("我觉得")
          ? "Where you write “我觉得,” try “我意识到” when describing a realization; it sounds more reflective here."
          : "For a reflective transition, “我意识到……” can connect the event to what you learned.",
        usedPatterns.length > 0
          ? "The lesson pattern you used supports a natural reflective tone. Read the sentence aloud once to check its rhythm."
          : "A closing transition such as “从那以后，我……” can make the ending feel more natural.",
      ],
      lessonVocabulary: usedVocabulary.length > 0
        ? [
            `Used effectively: ${usedVocabulary.join("、")}.`,
            unusedVocabulary.length > 0
              ? `If it fits your meaning, consider one of these lesson words: ${unusedVocabulary.join("、")}.`
              : "You already draw on a broad range of this lesson’s vocabulary.",
          ]
        : [
            `Try adding one relevant lesson word, such as ${unusedVocabulary.join("、") || "启示"}, where it genuinely fits.`,
            "Use lesson vocabulary to sharpen your meaning, not simply to increase the number of advanced words.",
          ],
      revisionSuggestions: [
        characterCount < 160
          ? "Add one concrete detail about what the child said or did, then explain why that moment mattered to you."
          : "On the next pass, remove any repeated background detail so the realization remains the focus.",
        "Check that the final paragraph states both the lesson you learned and one change you made afterward.",
      ],
    },
  };
};
