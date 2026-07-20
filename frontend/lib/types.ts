export type LessonSummary = {
  id: string;
  level: string;
  unit_number: number;
  unit_title_chinese: string;
  unit_title_english: string;
  lesson_number: number;
  lesson_title_chinese: string;
  lesson_title_english: string;
  progress: number;
  last_access_date: string | null;
};

export type LessonPayload = {
  lesson: LessonData;
};

export type LessonsPayload = {
  lessons: LessonSummary[];
};

type LessonSection = {
  title: string;
};

export type LessonData = {
  id: string;
  level: string;
  unit: { number: number; titleChinese: string; titleEnglish: string };
  lesson: { number: number; titleChinese: string; titleEnglish: string };
  progress: number;
  lastAccessDate: string | null;
  sections: {
    warmup: LessonSection & { prompts: unknown[] };
    passage: LessonSection & { vocabularyHighlights: Record<string, string>; paragraphs: unknown[] };
    vocabulary: LessonSection & { items: unknown[] };
    grammar: LessonSection & { items: unknown[] };
    wordDistinction: LessonSection & { groups: unknown[] };
    exercises: LessonSection & { items: unknown[] };
    writing: LessonSection & {
      prompt: { chinese: string; english: string };
      promptExplanation: string;
      writingPlan: string[];
      usefulPatterns: string[];
      sampleAnswer: { chinese: string; english: string };
      correctionNote: string;
    };
    expansion: LessonSection & {
      reading: { content: string; translation: string };
    };
    notebook: LessonSection & { savedItems?: unknown[] };
  };
};
