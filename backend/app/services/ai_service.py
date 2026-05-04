from app.models.ai import AIExplainRequest


def mock_explain(payload: AIExplainRequest) -> str:
    query = payload.query.strip()
    if not query:
        return "Please share a word, sentence, or grammar point you want to understand."

    return (
        "Teacher-style explanation (mock):\n"
        f"- Focus: {query}\n"
        "- Meaning: This item expresses a specific nuance in context.\n"
        "- Sentence function: It shapes tone and logic, not just dictionary meaning.\n"
        "- Why it fits: In this lesson, it supports reflective, honest communication.\n"
        "- Common mistake: Choosing a near-synonym with a different tone/register.\n"
        "- Try this: Use it in one personal sentence about family communication."
    )
