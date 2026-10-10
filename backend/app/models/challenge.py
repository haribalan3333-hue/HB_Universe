from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Index
from datetime import datetime
from ..database import Base

class ChallengeResult(Base):
    __tablename__ = "challenge_results"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    challenge_id = Column(String, nullable=False, index=True)
    score = Column(Integer, default=0)
    accuracy = Column(Float, default=100.0)
    time = Column(Integer, default=0)
    xp_earned = Column(Integer, default=0)
    coins_earned = Column(Integer, default=0)
    completed_at = Column(DateTime, default=datetime.utcnow, index=True)

    __table_args__ = (
        Index('ix_challenge_results_user_completed', 'user_id', 'completed_at'),
    )
