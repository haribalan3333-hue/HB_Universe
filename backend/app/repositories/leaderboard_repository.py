from sqlalchemy.orm import Session, desc
from ..models.user import User
from ..models.progression import PlayerProgression

class LeaderboardRepository:
    @staticmethod
    def get_ranked_players(db: Session, page: int = 1, limit: int = 20, time_filter: str = "GLOBAL"):
        offset = (page - 1) * limit
        # Filter public users
        query = db.query(User, PlayerProgression).join(
            PlayerProgression, User.id == PlayerProgression.user_id
        ).filter(
            User.is_active == True,
            User.is_private == False
        ).order_by(
            desc(PlayerProgression.level),
            desc(PlayerProgression.total_xp)
        )

        total_count = query.count()
        results = query.offset(offset).limit(limit).all()

        entries = []
        for idx, (user, prog) in enumerate(results, start=offset + 1):
            entries.append({
                "rank": idx,
                "user_id": user.id,
                "username": user.username,
                "display_name": user.display_name,
                "avatar": user.avatar,
                "level": prog.level,
                "xp": prog.xp,
                "total_xp": prog.total_xp,
                "coins": prog.coins,
                "rank_tier": prog.rank,
                "streak": prog.current_streak
            })

        return entries, total_count

    @staticmethod
    def get_user_rank(db: Session, user_id: str) -> dict | None:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        prog = db.query(PlayerProgression).filter(PlayerProgression.user_id == user_id).first()
        if not prog:
            return None

        # Calculate rank index based on total_xp and level
        higher_count = db.query(PlayerProgression).join(
            User, User.id == PlayerProgression.user_id
        ).filter(
            User.is_active == True,
            (PlayerProgression.level > prog.level) | 
            ((PlayerProgression.level == prog.level) & (PlayerProgression.total_xp > prog.total_xp))
        ).count()

        return {
            "rank": higher_count + 1,
            "user_id": user.id,
            "username": user.username,
            "display_name": user.display_name,
            "avatar": user.avatar,
            "level": prog.level,
            "xp": prog.xp,
            "total_xp": prog.total_xp,
            "coins": prog.coins,
            "rank_tier": prog.rank,
            "streak": prog.current_streak,
            "is_private": user.is_private
        }
