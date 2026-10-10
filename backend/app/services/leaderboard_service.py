from sqlalchemy.orm import Session
from ..models.user import User
from ..models.progression import PlayerProgression

class LeaderboardService:
    @staticmethod
    def get_global_leaderboard(db: Session, limit: int = 50):
        results = db.query(User, PlayerProgression).join(PlayerProgression, User.id == PlayerProgression.user_id).order_by(PlayerProgression.xp.desc()).limit(limit).all()
        
        leaderboard = []
        for idx, (u, p) in enumerate(results, start=1):
            leaderboard.append({
                "rank": idx,
                "username": u.username,
                "display_name": u.display_name,
                "avatar": u.avatar,
                "level": p.level,
                "xp": p.xp,
                "coins": p.coins
            })
        return leaderboard
