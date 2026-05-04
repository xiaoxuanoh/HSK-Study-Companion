from fastapi import APIRouter, HTTPException

from app.models.lesson import LessonResponse, LessonsResponse
from app.services.lesson_service import get_lesson, list_lessons

router = APIRouter(prefix="/api/lessons", tags=["lessons"])


@router.get("", response_model=LessonsResponse)
def get_lessons() -> LessonsResponse:
    return LessonsResponse(lessons=list_lessons())


@router.get("/{lesson_id}", response_model=LessonResponse)
def get_lesson_by_id(lesson_id: str) -> LessonResponse:
    try:
        lesson = get_lesson(lesson_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return LessonResponse(lesson=lesson)
