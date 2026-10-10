from sqlalchemy.orm import Session
from ..models.progression import PlayerProgression

class ProgressionRepository:
    @staticmethod
    def get_by_user_id(db: Session, user_id: str) -> PlayerProgression | None:
        return db.query(PlayerProgression).filter(PlayerProgression.user_id == user_id).first()

    @staticmethod
    def create_or_update(db: Session, prog: PlayerProgression) -> PlayerProgression:
        db.add(prog)
        db.commit()
        db.refresh(prog)
        return prog
