from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..security.tokens import decode_token
from ..services.progression_service import ProgressionService
from ..schemas.progression import ProgressionEventRequest, ProgressionResponse
from pydantic import BaseModel
from typing import Optional
import uuid

router = APIRouter(prefix="/api/progression", tags=["progression"])

def get_current_user_id(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload["sub"]

class IdempotentEventRequest(BaseModel):
    eventId: Optional[str] = None
    event: str
    entityId: Optional[str] = ""
    score: Optional[int] = 0

@router.get("/me", response_model=ProgressionResponse)
def get_progression(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    return ProgressionService.get_progression(db, user_id)

@router.post("/event")
def apply_progression_event(req: IdempotentEventRequest, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    event_id = req.eventId or str(uuid.uuid4())
    res, err = ProgressionService.process_event_idempotent(
        db, user_id, event_id, req.event, req.entityId, req.score
    )
    if err:
        raise HTTPException(status_code=400, detail=err)
    return res

@router.post("/migrate", response_model=ProgressionResponse)
def migrate_local_data(data: dict, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    prog = ProgressionService.get_progression(db, user_id)
    if "level" in data and isinstance(data["level"], int):
        prog.level = min(max(data["level"], 1), 100)
    if "xp" in data and isinstance(data["xp"], int):
        prog.xp = min(max(data["xp"], 0), 10000000)
        prog.total_xp = prog.xp
    if "coins" in data and isinstance(data["coins"], int):
        prog.coins = min(max(data["coins"], 0), 10000000)
        prog.total_coins_earned = prog.coins
    db.commit()
    db.refresh(prog)
    return prog
