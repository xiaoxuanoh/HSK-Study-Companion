import json
from pathlib import Path
from typing import Any, Dict, List

from app.models.lesson import LessonSummary


ROOT_DIR = Path(__file__).resolve().parents[3]
DATA_DIR = ROOT_DIR / "data"


def _load_lesson_files() -> List[Path]:
    return sorted(DATA_DIR.glob("hsk*/lesson-*.json"))


def load_lessons() -> List[Dict[str, Any]]:
    lessons: List[Dict[str, Any]] = []
    for path in _load_lesson_files():
        with path.open("r", encoding="utf-8") as f:
            lessons.append(json.load(f))
    return lessons


def list_lessons() -> List[LessonSummary]:
    summaries: List[LessonSummary] = []
    for lesson in load_lessons():
        summaries.append(
            LessonSummary(
                id=lesson["id"],
                level=lesson["level"],
                unit_number=lesson["unit"]["number"],
                unit_title_chinese=lesson["unit"]["titleChinese"],
                unit_title_english=lesson["unit"]["titleEnglish"],
                lesson_number=lesson["lesson"]["number"],
                lesson_title_chinese=lesson["lesson"]["titleChinese"],
                lesson_title_english=lesson["lesson"]["titleEnglish"],
                progress=lesson.get("progress", 0),
                last_access_date=lesson.get("lastAccessDate"),
            )
        )
    return summaries


def get_lesson(lesson_id: str) -> Dict[str, Any]:
    for lesson in load_lessons():
        if lesson["id"] == lesson_id:
            return lesson
    raise KeyError(f"Lesson not found: {lesson_id}")
