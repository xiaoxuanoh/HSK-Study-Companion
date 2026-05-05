import lessonData from "../../data/hsk6/lesson-01.json";
import type { LessonSummary } from "./types";

export const mockLesson = lessonData;

export const mockLessonSummary: LessonSummary = {
  id: lessonData.id,
  level: lessonData.level,
  unit_number: lessonData.unit.number,
  unit_title_chinese: lessonData.unit.titleChinese,
  unit_title_english: lessonData.unit.titleEnglish,
  lesson_number: lessonData.lesson.number,
  lesson_title_chinese: lessonData.lesson.titleChinese,
  lesson_title_english: lessonData.lesson.titleEnglish,
  progress: lessonData.progress,
  last_access_date: lessonData.lastAccessDate,
};

const UNITS = [
  { number: 1, titleChinese: "生活点滴", titleEnglish: "Moments of Life" },
  { number: 2, titleChinese: "第二单元", titleEnglish: "Unit 2" },
  { number: 3, titleChinese: "第三单元", titleEnglish: "Unit 3" },
  { number: 4, titleChinese: "第四单元", titleEnglish: "Unit 4" },
  { number: 5, titleChinese: "第五单元", titleEnglish: "Unit 5" },
];

export const mockCourseStructure: LessonSummary[] = UNITS.flatMap((unit) =>
  [1, 2, 3, 4].map((lessonNum): LessonSummary => {
    if (unit.number === 1 && lessonNum === 1) return mockLessonSummary;
    return {
      id: `hsk6-u${unit.number}-l${lessonNum}`,
      level: "HSK6",
      unit_number: unit.number,
      unit_title_chinese: unit.titleChinese,
      unit_title_english: unit.titleEnglish,
      lesson_number: lessonNum,
      lesson_title_chinese: `第${lessonNum}课`,
      lesson_title_english: "Coming Soon",
      progress: 0,
      last_access_date: null,
    };
  })
);
