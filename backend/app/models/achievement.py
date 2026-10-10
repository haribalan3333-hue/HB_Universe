from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, UniqueConstraint, Index
from datetime import datetime
from ..database import Base

class AchievementDefinition(Base):
    __tablename__ = "achievement_definitions"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, default="GENERAL")
    rarity = Column(String, default="COMMON")
    xp_reward = Column(Integer, default=100)
    coin_reward = Column(Integer, default=50)

class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    achievement_id = Column(String, nullable=False, index=True)
    unlocked_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint('user_id', 'achievement_id', name='uq_user_achievement'),
        Index('ix_user_achievements_user_ach', 'user_id', 'achievement_id'),
    )
