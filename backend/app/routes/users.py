from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from ..database import get_db
from ..security.tokens import decode_token
from ..services.user_service import UserService
from ..services.sync_service import SyncService
from ..repositories.activity_repository import ActivityRepository
from ..schemas.user import UserResponse, UserUpdateRequest
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/users", tags=["users"])

def get_current_user_id(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload["sub"]

class PrivacyUpdateRequest(BaseModel):
    is_private: bool

@router.get("/me", response_model=UserResponse)
def get_me(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    user = UserService.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/me", response_model=UserResponse)
def update_me(updates: UserUpdateRequest, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    user = UserService.update_user(db, user_id, updates)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/me/privacy")
def update_privacy(req: PrivacyUpdateRequest, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    user = UserService.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_private = req.is_private
    db.commit()
    db.refresh(user)
    return {"status": "success", "is_private": user.is_private}

@router.delete("/me")
def delete_me(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    success = UserService.delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Account successfully deleted from cloud database"}

@router.get("/me/export")
def export_user_data(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Full GDPR/Cloud Data Export for authenticated user"""
    return SyncService.pull_full_state(db, user_id)

@router.get("/me/activity")
def get_activity(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    activities = ActivityRepository.get_recent(db, user_id, limit=20)
    return [
        {
            "id": a.id,
            "type": a.type,
            "entityId": a.entity_id,
            "createdAt": a.created_at.isoformat() if a.created_at else ""
        } for a in activities
    ]
