import { mockLesson, mockCourseStructure } from "./mockData";
import type { LessonData, LessonSummary } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function getLessons(): Promise<LessonSummary[]> {
  try {
    const res = await fetch(`${API_BASE}/api/lessons`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed");
    const data = await res.json();
    return data.lessons as LessonSummary[];
  } catch {
    return mockCourseStructure;
  }
}

export async function getLesson(id: string): Promise<LessonData> {
  try {
    const res = await fetch(`${API_BASE}/api/lessons/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed");
    const data = await res.json();
    return data.lesson as LessonData;
  } catch {
    return mockLesson as LessonData;
  }
}

export async function askAI(lessonId: string, query: string): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/api/ai/explain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lesson_id: lessonId, query })
    });
    if (!res.ok) throw new Error("Failed");
    const data = await res.json();
    return data.response as string;
  } catch {
    return `Mock response: ${query}`;
  }
}
