from pydantic import BaseModel
from typing import Optional

class UserProfile(BaseModel):
    id: str
    username: str
    display_name: str
    email: str
    avatar: str

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    avatar: Optional[str] = None
