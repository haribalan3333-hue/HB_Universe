from sqlalchemy import Column, String, Boolean, DateTime, Index
from datetime import datetime
from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    display_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    avatar = Column(String, default="🚀")
    is_active = Column(Boolean, default=True)
    email_verified = Column(Boolean, default=False)
    is_private = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index('ix_users_username_email', 'username', 'email'),
    )
