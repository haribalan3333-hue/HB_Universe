from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Index
from datetime import datetime
from ..database import Base

class MediaHistory(Base):
    __tablename__ = "media_history"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    media_id = Column(String, nullable=False, index=True)
    progress = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    last_played = Column(DateTime, default=datetime.utcnow)
