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

export type LessonData = {
  id: string;
  level: string;
  unit: { number: number; titleChinese: string; titleEnglish: string };
  lesson: { number: number; titleChinese: string; titleEnglish: string };
  progress: number;
  lastAccessDate: string | null;
  sections: any;
};
