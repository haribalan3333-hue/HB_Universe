from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Index
from datetime import datetime
from ..database import Base

class Activity(Base):
    __tablename__ = "activity_feed"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    type = Column(String, nullable=False, index=True)
    entity_id = Column(String, default="")
    metadata_json = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    __table_args__ = (
        Index('ix_activity_user_created', 'user_id', 'created_at'),
    )
