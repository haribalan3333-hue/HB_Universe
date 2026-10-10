from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..security.tokens import decode_token

router = APIRouter(prefix="/api/achievements", tags=["achievements"])

def get_user_id(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload["sub"]

@router.get("")
def get_achievements(user_id: str = Depends(get_user_id), db: Session = Depends(get_db)):
    return [
        {"id": "ach-first-login", "name": "Universe Pioneer", "unlockedAt": "2026-10-04T00:00:00Z"},
        {"id": "ach-pilot-rank", "name": "HB Explorer", "unlockedAt": "2026-10-04T00:00:00Z"}
    ]

@router.post("/unlock")
def unlock_achievement(payload: dict, user_id: str = Depends(get_user_id), db: Session = Depends(get_db)):
    return {"message": "Achievement unlocked", "unlocked": True}
