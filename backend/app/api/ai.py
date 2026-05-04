from fastapi import APIRouter

from app.models.ai import AIExplainRequest, AIExplainResponse
from app.services.ai_service import mock_explain

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/explain", response_model=AIExplainResponse)
def explain(payload: AIExplainRequest) -> AIExplainResponse:
    return AIExplainResponse(response=mock_explain(payload))
