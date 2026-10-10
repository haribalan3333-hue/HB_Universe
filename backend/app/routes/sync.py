from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..security.tokens import decode_token
from ..services.sync_service import SyncService
from ..services.progression_service import ProgressionService
from pydantic import BaseModel
from typing import Optional, Dict, Any, List

router = APIRouter(prefix="/api/sync", tags=["sync"])

def get_current_user_id(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload["sub"]

class SyncPushRequest(BaseModel):
    settings: Optional[Dict[str, Any]] = None
    avatarCustomization: Optional[Dict[str, Any]] = None
    favorites: Optional[Dict[str, Any]] = None

class SyncEventItem(BaseModel):
    eventId: str
    eventType: str
    entityId: Optional[str] = ""
    score: Optional[int] = 0
    metadata: Optional[Dict[str, Any]] = None

class BatchSyncEventsRequest(BaseModel):
    events: List[SyncEventItem]

@router.get("/pull")
def pull_sync_state(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    return SyncService.pull_full_state(db, user_id)

@router.post("/push")
def push_sync_settings(req: SyncPushRequest, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    cloud = SyncService.push_client_settings(db, user_id, req.settings, req.avatarCustomization, req.favorites)
    return {"status": "synced", "updatedAt": cloud.updated_at.isoformat() if cloud.updated_at else ""}

@router.post("/events")
def process_sync_events(req: BatchSyncEventsRequest, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    results = []
    for ev in req.events:
        res, err = ProgressionService.process_event_idempotent(
            db, user_id, ev.eventId, ev.eventType, ev.entityId, ev.score, ev.metadata
        )
        if not err:
            results.append({
                "eventId": ev.eventId,
                "status": "applied" if not res.get("duplicate") else "duplicate_ignored",
                "xpGained": res.get("xpGained", 0),
                "coinsGained": res.get("coinsGained", 0)
            })
    return {"status": "success", "processed": len(results), "events": results}
