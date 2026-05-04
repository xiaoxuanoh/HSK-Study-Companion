from typing import Optional

from pydantic import BaseModel


class AIExplainRequest(BaseModel):
    lesson_id: str
    query: str
    context_type: Optional[str] = "general"
    context_id: Optional[str] = None


class AIExplainResponse(BaseModel):
    response: str
