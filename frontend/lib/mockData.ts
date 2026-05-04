import lessonData from "../../data/hsk6/lesson-01.json";

export const mockLesson = lessonData;

export const mockLessonSummary = {
  id: lessonData.id,
  level: lessonData.level,
  unit_number: lessonData.unit.number,
  unit_title_chinese: lessonData.unit.titleChinese,
  unit_title_english: lessonData.unit.titleEnglish,
  lesson_number: lessonData.lesson.number,
  lesson_title_chinese: lessonData.lesson.titleChinese,
  lesson_title_english: lessonData.lesson.titleEnglish,
  progress: lessonData.progress,
  last_access_date: lessonData.lastAccessDate
};
