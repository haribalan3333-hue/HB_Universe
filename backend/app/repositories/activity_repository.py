from sqlalchemy.orm import Session
from ..models.activity import Activity
import uuid
import json

class ActivityRepository:
    @staticmethod
    def log_activity(db: Session, user_id: str, activity_type: str, entity_id: str = "", metadata: dict = None) -> Activity:
        act = Activity(
            id=str(uuid.uuid4()),
            user_id=user_id,
            type=activity_type,
            entity_id=entity_id,
            metadata_json=json.dumps(metadata or {})
        )
        db.add(act)
        db.commit()
        db.refresh(act)
        return act

    @staticmethod
    def get_recent(db: Session, user_id: str, limit: int = 20):
        return db.query(Activity).filter(Activity.user_id == user_id).order_by(Activity.created_at.desc()).limit(limit).all()
