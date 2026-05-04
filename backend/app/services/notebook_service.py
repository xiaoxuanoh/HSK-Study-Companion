from datetime import datetime, timezone
from typing import Any, Dict, List

IN_MEMORY_NOTEBOOK: List[Dict[str, Any]] = []


def load_default_items(lesson: Dict[str, Any]) -> None:
    if IN_MEMORY_NOTEBOOK:
        return

    for item in lesson.get("sections", {}).get("notebook", {}).get("savedItems", []):
        IN_MEMORY_NOTEBOOK.append(item)


def list_items() -> List[Dict[str, Any]]:
    return IN_MEMORY_NOTEBOOK


def save_item(item: Dict[str, Any]) -> Dict[str, Any]:
    if "id" not in item:
        item["id"] = f"nb-{len(IN_MEMORY_NOTEBOOK) + 1}"
    if "savedAt" not in item:
        item["savedAt"] = datetime.now(timezone.utc).isoformat()
    IN_MEMORY_NOTEBOOK.append(item)
    return item
