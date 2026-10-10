from sqlalchemy.orm import Session
from ..models.user import User
from ..models.progression import PlayerProgression
from ..models.stats import PlayerStats
from ..security.hashing import hash_password, verify_password
from ..security.tokens import create_access_token
from ..schemas.auth import RegisterRequest, LoginRequest
import uuid

class AuthService:
    @staticmethod
    def register(db: Session, req: RegisterRequest):
        existing_user = db.query(User).filter((User.email == req.email) | (User.username == req.username)).first()
        if existing_user:
            return None, "Username or Email already registered"
        
        user_id = str(uuid.uuid4())
        hashed = hash_password(req.password)
        
        user = User(
            id=user_id,
            username=req.username,
            display_name=req.display_name or req.username,
            email=req.email,
            password_hash=hashed,
            avatar=req.avatar or "🚀",
            is_active=True
        )
        db.add(user)
        
        prog = PlayerProgression(
            user_id=user_id,
            level=1,
            xp=0,
            coins=0,
            rank="ROOKIE",
            current_streak=1,
            longest_streak=1,
            total_xp=0,
            total_coins_earned=0,
            total_coins_spent=0
        )
        db.add(prog)
        
        stats = PlayerStats(user_id=user_id)
        db.add(stats)
        
        db.commit()
        db.refresh(user)
        
        token = create_access_token(data={"sub": user.id, "username": user.username})
        return {"user": user, "token": token}, None

    @staticmethod
    def login(db: Session, req: LoginRequest):
        user = db.query(User).filter((User.email == req.email_or_username) | (User.username == req.email_or_username)).first()
        if not user or not verify_password(req.password, user.password_hash):
            return None, "Invalid credentials"
        
        token = create_access_token(data={"sub": user.id, "username": user.username})
        return {"user": user, "token": token}, None
