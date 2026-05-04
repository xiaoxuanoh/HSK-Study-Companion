from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class LessonSummary(BaseModel):
    id: str
    level: str
    unit_number: int
    unit_title_chinese: str
    unit_title_english: str
    lesson_number: int
    lesson_title_chinese: str
    lesson_title_english: str
    progress: int = 0
    last_access_date: Optional[str] = None


class LessonResponse(BaseModel):
    lesson: Dict[str, Any]


class LessonsResponse(BaseModel):
    lessons: List[LessonSummary]
