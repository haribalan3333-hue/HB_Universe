from pydantic import BaseModel
from typing import Optional, List, Any

class ChallengeCompletionRequest(BaseModel):
    challengeId: str
    score: int
    time: int
    answers: Optional[List[Any]] = None

class ChallengeCompletionResponse(BaseModel):
    xpEarned: int
    coinsEarned: int
    status: str = "completed"

class DailyChallengeResponse(BaseModel):
    id: str
    title: str
    description: str
    xpReward: int
    coinReward: int
    expiresAt: str
