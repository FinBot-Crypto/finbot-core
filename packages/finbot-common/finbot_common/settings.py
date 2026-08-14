from __future__ import annotations

import json
from typing import Any


def parse_setting_value(value: Any) -> Any:
    if isinstance(value, str):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return value
    return value


def load_block_settings(rows: list[tuple]) -> dict[str, Any]:
    settings: dict[str, Any] = {}
    for key, value in rows:
        settings[key] = parse_setting_value(value)
    return settings


def get_bool(settings: dict, key: str, default: bool = False) -> bool:
    val = settings.get(key, default)
    if isinstance(val, bool):
        return val
    if isinstance(val, str):
        return val.lower() in ("true", "1", "yes")
    return bool(val)


def get_float(settings: dict, key: str, default: float) -> float:
    try:
        return float(settings.get(key, default))
    except (TypeError, ValueError):
        return default


def get_int(settings: dict, key: str, default: int) -> int:
    try:
        return int(settings.get(key, default))
    except (TypeError, ValueError):
        return default


def entry_allowed_key(direction: str, tier: str) -> str:
    tier_slug = tier.lower().replace(" ", "_")
    return f"entry.{direction.lower()}_{tier_slug}_enabled"


def entry_regimes_key(direction: str, tier: str) -> str:
    tier_slug = tier.lower().replace(" ", "_")
    return f"entry.{direction.lower()}_{tier_slug}_allowed_regimes"


def entry_regimes_backup_key(direction: str, tier: str) -> str:
    return f"{entry_regimes_key(direction, tier)}_backup"


def parse_regimes_list(settings: dict, key: str, default: list[str] | None = None) -> list[str]:
    default = default or []
    regimes = settings.get(key, default)
    if isinstance(regimes, str):
        try:
            regimes = json.loads(regimes)
        except json.JSONDecodeError:
            regimes = [r.strip() for r in regimes.split(",") if r.strip()]
    if not isinstance(regimes, list):
        return default
    return [str(r).lower() for r in regimes]
