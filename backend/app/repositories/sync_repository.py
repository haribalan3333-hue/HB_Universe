from sqlalchemy.orm import Session
from ..models.sync import ProgressionEvent, UserCloudSettings
import uuid
import json

class SyncRepository:
    @staticmethod
    def is_event_processed(db: Session, user_id: str, event_id: str) -> bool:
        return db.query(ProgressionEvent).filter(
            ProgressionEvent.user_id == user_id,
            ProgressionEvent.event_id == event_id
        ).first() is not None

    @staticmethod
    def record_event(db: Session, user_id: str, event_id: str, event_type: str, entity_id: str, metadata: dict) -> ProgressionEvent:
        event = ProgressionEvent(
            id=str(uuid.uuid4()),
            user_id=user_id,
            event_id=event_id,
            event_type=event_type,
            entity_id=entity_id,
            metadata_json=json.dumps(metadata or {})
        )
        db.add(event)
        db.commit()
        db.refresh(event)
        return event

    @staticmethod
    def get_cloud_settings(db: Session, user_id: str) -> UserCloudSettings | None:
        return db.query(UserCloudSettings).filter(UserCloudSettings.user_id == user_id).first()

    @staticmethod
    def save_cloud_settings(db: Session, user_id: str, settings: dict = None, avatar: dict = None, favorites: dict = None) -> UserCloudSettings:
        cloud = db.query(UserCloudSettings).filter(UserCloudSettings.user_id == user_id).first()
        if not cloud:
            cloud = UserCloudSettings(
                user_id=user_id,
                settings_json=json.dumps(settings or {}),
                avatar_json=json.dumps(avatar or {}),
                favorites_json=json.dumps(favorites or {})
            )
            db.add(cloud)
        else:
            if settings is not None:
                cloud.settings_json = json.dumps(settings)
            if avatar is not None:
                cloud.avatar_json = json.dumps(avatar)
            if favorites is not None:
                cloud.favorites_json = json.dumps(favorites)
        db.commit()
        db.refresh(cloud)
        return cloud
