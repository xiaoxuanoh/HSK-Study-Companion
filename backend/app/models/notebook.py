from typing import Any, Dict, List

from pydantic import BaseModel


class NotebookItem(BaseModel):
    id: str
    type: str
    content: Dict[str, Any]
    saved_at: str


class NotebookResponse(BaseModel):
    items: List[Dict[str, Any]]


class NotebookSaveRequest(BaseModel):
    item: Dict[str, Any]


class NotebookSaveResponse(BaseModel):
    ok: bool
    item: Dict[str, Any]
