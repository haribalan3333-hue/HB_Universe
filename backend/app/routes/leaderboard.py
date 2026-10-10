from fastapi import APIRouter, Depends, Header, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..repositories.leaderboard_repository import LeaderboardRepository
from ..repositories.user_repository import UserRepository
from ..security.tokens import decode_token

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])

def get_optional_user_id(authorization: str = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        payload = decode_token(token)
        if payload and "sub" in payload:
            return payload["sub"]
    return None

@router.get("")
def get_leaderboard(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    type: str = Query("GLOBAL"),
    db: Session = Depends(get_db)
):
    entries, total = LeaderboardRepository.get_ranked_players(db, page=page, limit=limit, time_filter=type)
    return {
        "entries": entries,
        "page": page,
        "limit": limit,
        "total": total,
        "type": type
    }

@router.get("/me")
def get_my_leaderboard_position(user_id: str = Depends(get_optional_user_id), db: Session = Depends(get_db)):
    if not user_id:
        return {"rank": None, "message": "Not authenticated"}
    return LeaderboardRepository.get_user_rank(db, user_id)

@router.get("/user/{username}")
def get_public_user_profile(username: str, db: Session = Depends(get_db)):
    user = UserRepository.get_by_username(db, username)
    if not user or user.is_private or not user.is_active:
        return {"error": "User profile is private or not found"}
    rank_info = LeaderboardRepository.get_user_rank(db, user.id)
    return rank_info
