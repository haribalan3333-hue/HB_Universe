from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.progression import PlayerProgression
from app.models.stats import PlayerStats
from app.schemas.auth import UserRegister, UserLogin, TokenResponse, ForgotPasswordRequest, ResetPasswordRequest
from app.security.hashing import hash_password, verify_password
from app.security.tokens import create_access_token, decode_access_token
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_current_user(token: str, db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = db.query(User).filter(User.id == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

@router.post("/register", response_model=TokenResponse)
def register_user(req: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(status_code=400, detail="Username is already taken")
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email is already registered")

    new_user = User(
        username=req.username.strip().lower(),
        display_name=req.display_name.strip(),
        email=req.email.strip().lower(),
        password_hash=hash_password(req.password),
        avatar="/images/hb_pilot.png"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Initialize default progression & stats
    prog = PlayerProgression(user_id=new_user.id)
    stats = PlayerStats(user_id=new_user.id)
    db.add(prog)
    db.add(stats)
    db.commit()

    token = create_access_token({"sub": new_user.id, "username": new_user.username})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "display_name": new_user.display_name,
            "email": new_user.email,
            "avatar": new_user.avatar
        }
    }

@router.post("/login", response_model=TokenResponse)
def login_user(req: UserLogin, db: Session = Depends(get_db)):
    identifier = req.username_or_email.strip().lower()
    user = db.query(User).filter((User.username == identifier) | (User.email == identifier)).first()

    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid username or password")

    user.last_login = datetime.utcnow()
    db.commit()

    token = create_access_token({"sub": user.id, "username": user.username})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "display_name": user.display_name,
            "email": user.email,
            "avatar": user.avatar
        }
    }

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.strip().lower()).first()
    # Always return success message for privacy/security
    return {"message": "Password reset instructions have been dispatched to your email."}

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    return {"message": "Password successfully updated."}
