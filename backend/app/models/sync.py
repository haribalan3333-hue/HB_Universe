from sqlalchemy import Column, String, DateTime, ForeignKey, Text, UniqueConstraint, Index
from datetime import datetime
from ..database import Base

class ProgressionEvent(Base):
    __tablename__ = "progression_events"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    event_id = Column(String, nullable=False, index=True)
    event_type = Column(String, nullable=False)
    entity_id = Column(String, default="")
    metadata_json = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint('user_id', 'event_id', name='uq_user_progression_event'),
        Index('ix_prog_events_user_event', 'user_id', 'event_id'),
    )

class UserCloudSettings(Base):
    __tablename__ = "user_cloud_settings"

    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True, index=True)
    settings_json = Column(Text, default="{}")
    avatar_json = Column(Text, default="{}")
    favorites_json = Column(Text, default="{}")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
