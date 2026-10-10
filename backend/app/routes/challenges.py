from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..security.tokens import decode_token
from ..schemas.challenge import ChallengeCompletionRequest, ChallengeCompletionResponse, DailyChallengeResponse
from ..services.progression_service import ProgressionService
from ..schemas.progression import ProgressionEventRequest

router = APIRouter(prefix="/api/challenges", tags=["challenges"])

def get_user_id(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload["sub"]

@router.get("/daily", response_model=DailyChallengeResponse)
def get_daily_challenge():
    return {
        "id": "daily-quiz-01",
        "title": "Cosmic AI Quantum Mastery",
        "description": "Answer 5 high-speed AI & Universe architecture questions with >80% accuracy.",
        "xpReward": 500,
        "coinReward": 150,
        "expiresAt": "2026-10-05T00:00:00Z"
    }

@router.post("/complete", response_model=ChallengeCompletionResponse)
def complete_challenge(req: ChallengeCompletionRequest, user_id: str = Depends(get_user_id), db: Session = Depends(get_db)):
    event_req = ProgressionEventRequest(
        event="CHALLENGE_COMPLETED",
        entityId=req.challengeId,
        score=req.score
    )
    prog, err = ProgressionService.apply_event(db, user_id, event_req)
    if err:
        raise HTTPException(status_code=400, detail=err)
    return {"xpEarned": 400, "coinsEarned": 120, "status": "completed"}
