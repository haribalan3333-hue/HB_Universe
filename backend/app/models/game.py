from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Index
from datetime import datetime
from ..database import Base

class GameResult(Base):
    __tablename__ = "game_results"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    game_id = Column(String, nullable=False, index=True)
    score = Column(Integer, default=0)
    result = Column(String, default="COMPLETED")
    duration = Column(Integer, default=0)
    xp_earned = Column(Integer, default=0)
    coins_earned = Column(Integer, default=0)
    played_at = Column(DateTime, default=datetime.utcnow, index=True)

    __table_args__ = (
        Index('ix_game_results_user_played', 'user_id', 'played_at'),
    )
