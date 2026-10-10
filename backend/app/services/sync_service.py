from sqlalchemy.orm import Session
from ..repositories.user_repository import UserRepository
from ..repositories.progression_repository import ProgressionRepository
from ..repositories.achievement_repository import AchievementRepository
from ..repositories.activity_repository import ActivityRepository
from ..repositories.sync_repository import SyncRepository
from ..models.stats import PlayerStats
import json

class SyncService:
    @staticmethod
    def pull_full_state(db: Session, user_id: str) -> dict:
        user = UserRepository.get_by_id(db, user_id)
        prog = ProgressionRepository.get_by_user_id(db, user_id)
        stats = db.query(PlayerStats).filter(PlayerStats.user_id == user_id).first()
        achievements = AchievementRepository.get_user_achievements(db, user_id)
        cloud_settings = SyncRepository.get_cloud_settings(db, user_id)
        activities = ActivityRepository.get_recent(db, user_id, limit=10)

        return {
            "user": {
                "id": user.id,
                "username": user.username,
                "display_name": user.display_name,
                "avatar": user.avatar,
                "is_private": user.is_private
            } if user else None,
            "progression": {
                "level": prog.level,
                "xp": prog.xp,
                "coins": prog.coins,
                "rank": prog.rank,
                "currentStreak": prog.current_streak,
                "longestStreak": prog.longest_streak,
                "totalXp": prog.total_xp
            } if prog else None,
            "stats": {
                "gamesPlayed": stats.games_played if stats else 0,
                "gamesWon": stats.games_won if stats else 0,
                "moviesWatched": stats.movies_watched if stats else 0,
                "tracksPlayed": stats.tracks_played if stats else 0,
                "aiInteractions": stats.ai_interactions if stats else 0,
                "challengesCompleted": stats.challenges_completed if stats else 0
            },
            "achievements": [a.achievement_id for a in achievements],
            "settings": json.loads(cloud_settings.settings_json) if cloud_settings and cloud_settings.settings_json else {},
            "avatarCustomization": json.loads(cloud_settings.avatar_json) if cloud_settings and cloud_settings.avatar_json else {},
            "favorites": json.loads(cloud_settings.favorites_json) if cloud_settings and cloud_settings.favorites_json else {},
            "recentActivities": [
                {
                    "id": a.id,
                    "type": a.type,
                    "entityId": a.entity_id,
                    "metadata": json.loads(a.metadata_json) if a.metadata_json else {},
                    "createdAt": a.created_at.isoformat() if a.created_at else ""
                } for a in activities
            ],
            "serverTime": ""
        }

    @staticmethod
    def push_client_settings(db: Session, user_id: str, settings: dict, avatar: dict = None, favorites: dict = None):
        return SyncRepository.save_cloud_settings(db, user_id, settings, avatar, favorites)
