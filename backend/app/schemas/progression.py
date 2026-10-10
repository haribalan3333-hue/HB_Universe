from pydantic import BaseModel
from typing import Optional, List

class ProgressionResponse(BaseModel):
    level: int
    xp: int
    maxXp: int
    coins: int
    rank: str
    current_streak: int
    longest_streak: int
    last_activity_date: str
    total_xp: int
    total_coins_earned: int
    total_coins_spent: int

class ProgressionEventRequest(BaseModel):
    event_type: str # GAME_COMPLETED, MEDIA_COMPLETED, AI_CHAT, CHALLENGE_COMPLETED, etc.
    entity_id: Optional[str] = None
    score: Optional[int] = 0

class MigrationRequest(BaseModel):
    level: int
    xp: int
    coins: int
    streak: int
    achievements: List[str]
