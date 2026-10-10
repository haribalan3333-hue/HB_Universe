from sqlalchemy.orm import Session
from ..models.achievement import AchievementDefinition, UserAchievement
import uuid

class AchievementRepository:
    @staticmethod
    def get_user_achievements(db: Session, user_id: str):
        return db.query(UserAchievement).filter(UserAchievement.user_id == user_id).all()

    @staticmethod
    def has_achievement(db: Session, user_id: str, achievement_id: str) -> bool:
        return db.query(UserAchievement).filter(
            UserAchievement.user_id == user_id,
            UserAchievement.achievement_id == achievement_id
        ).first() is not None

    @staticmethod
    def unlock(db: Session, user_id: str, achievement_id: str) -> UserAchievement | None:
        if AchievementRepository.has_achievement(db, user_id, achievement_id):
            return None
        ach = UserAchievement(id=str(uuid.uuid4()), user_id=user_id, achievement_id=achievement_id)
        db.add(ach)
        db.commit()
        db.refresh(ach)
        return ach
