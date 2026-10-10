from sqlalchemy import Column, String, Integer, ForeignKey
from ..database import Base

class PlayerStats(Base):
    __tablename__ = "player_stats"

    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True, index=True)
    games_played = Column(Integer, default=0)
    games_won = Column(Integer, default=0)
    movies_watched = Column(Integer, default=0)
    tracks_played = Column(Integer, default=0)
    ai_interactions = Column(Integer, default=0)
    challenges_completed = Column(Integer, default=0)
    quiz_correct_answers = Column(Integer, default=0)
    total_challenge_score = Column(Integer, default=0)
    highest_score = Column(Integer, default=0)
    days_active = Column(Integer, default=1)
