from fastapi import APIRouter

from app.models.notebook import NotebookResponse, NotebookSaveRequest, NotebookSaveResponse
from app.services.lesson_service import get_lesson
from app.services.notebook_service import list_items, load_default_items, save_item

router = APIRouter(prefix="/api/notebook", tags=["notebook"])


@router.get("", response_model=NotebookResponse)
def get_notebook() -> NotebookResponse:
    lesson = get_lesson("hsk6-lesson-01")
    load_default_items(lesson)
    return NotebookResponse(items=list_items())


@router.post("/save", response_model=NotebookSaveResponse)
def save_notebook(payload: NotebookSaveRequest) -> NotebookSaveResponse:
    saved = save_item(payload.item)
    return NotebookSaveResponse(ok=True, item=saved)
