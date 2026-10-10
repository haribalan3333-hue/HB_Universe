from sqlalchemy.orm import Session
from ..models.user import User
from ..schemas.user import UserUpdateRequest

class UserService:
    @staticmethod
    def get_by_id(db: Session, user_id: str):
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def update_user(db: Session, user_id: str, updates: UserUpdateRequest):
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        if updates.display_name:
            user.display_name = updates.display_name
        if updates.avatar:
            user.avatar = updates.avatar
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def delete_user(db: Session, user_id: str):
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            db.delete(user)
            db.commit()
            return True
        return False
