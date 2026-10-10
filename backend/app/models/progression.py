from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Index
from datetime import datetime
from ..database import Base

class PlayerProgression(Base):
    __tablename__ = "player_progression"

    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True, index=True)
    level = Column(Integer, default=1, index=True)
    xp = Column(Integer, default=0, index=True)
    coins = Column(Integer, default=0)
    rank = Column(String, default="ROOKIE")
    current_streak = Column(Integer, default=1)
    longest_streak = Column(Integer, default=1)
    last_activity_date = Column(DateTime, default=datetime.utcnow)
    total_xp = Column(Integer, default=0, index=True)
    total_coins_earned = Column(Integer, default=0)
    total_coins_spent = Column(Integer, default=0)

    __table_args__ = (
        Index('ix_progression_level_total_xp', 'level', 'total_xp'),
    )
