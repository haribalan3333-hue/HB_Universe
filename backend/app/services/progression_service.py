from sqlalchemy.orm import Session
from ..models.progression import PlayerProgression
from ..models.stats import PlayerStats
from ..models.game import GameResult
from ..models.challenge import ChallengeResult
from ..repositories.sync_repository import SyncRepository
from ..repositories.achievement_repository import AchievementRepository
from ..repositories.activity_repository import ActivityRepository
from datetime import datetime
import uuid

XP_REWARDS = {
    "GAME_COMPLETED": (150, 40),
    "GAME_HIGH_SCORE": (300, 100),
    "MEDIA_COMPLETED": (200, 50),
    "TRACK_PLAYED": (80, 20),
    "AI_INTERACTION": (50, 15),
    "AI_QUIZ_COMPLETED": (250, 75),
    "CHALLENGE_COMPLETED": (400, 120),
    "DAILY_CHALLENGE_COMPLETED": (500, 150),
    "WEEKLY_MISSION_COMPLETED": (1000, 300)
}

class ProgressionService:
    @staticmethod
    def get_progression(db: Session, user_id: str) -> PlayerProgression:
        prog = db.query(PlayerProgression).filter(PlayerProgression.user_id == user_id).first()
        if not prog:
            prog = PlayerProgression(user_id=user_id, level=1, xp=0, coins=0, rank="ROOKIE")
            db.add(prog)
            db.commit()
            db.refresh(prog)
        return prog

    @staticmethod
    def process_event_idempotent(db: Session, user_id: str, event_id: str, event_type: str, entity_id: str = "", score: int = 0, metadata: dict = None):
        # 1. Check idempotency: If event was already processed, return current progression without double-awarding
        if event_id and SyncRepository.is_event_processed(db, user_id, event_id):
            prog = ProgressionService.get_progression(db, user_id)
            return {
                "progression": prog,
                "xpGained": 0,
                "coinsGained": 0,
                "levelUp": False,
                "duplicate": True,
                "message": "Event already processed (idempotent)"
            }, None

        if event_type not in XP_REWARDS:
            return None, f"Unknown progression event type: {event_type}"

        # 2. Compute rewards server-side
        base_xp, base_coins = XP_REWARDS[event_type]
        prog = ProgressionService.get_progression(db, user_id)
        stats = db.query(PlayerStats).filter(PlayerStats.user_id == user_id).first()
        if not stats:
            stats = PlayerStats(user_id=user_id)
            db.add(stats)

        old_level = prog.level
        prog.xp += base_xp
        prog.coins += base_coins
        prog.total_xp += base_xp
        prog.total_coins_earned += base_coins
        prog.last_activity_date = datetime.utcnow()

        # Update stats
        if "GAME" in event_type:
            stats.games_played += 1
            if score > stats.highest_score:
                stats.highest_score = score
            game_record = GameResult(
                id=str(uuid.uuid4()),
                user_id=user_id,
                game_id=entity_id or "game-generic",
                score=score,
                xp_earned=base_xp,
                coins_earned=base_coins
            )
            db.add(game_record)
        elif "CHALLENGE" in event_type or "QUIZ" in event_type:
            stats.challenges_completed += 1
            stats.total_challenge_score += score
            chal_record = ChallengeResult(
                id=str(uuid.uuid4()),
                user_id=user_id,
                challenge_id=entity_id or "challenge-generic",
                score=score,
                xp_earned=base_xp,
                coins_earned=base_coins
            )
            db.add(chal_record)
        elif "MEDIA" in event_type:
            stats.movies_watched += 1
        elif "TRACK" in event_type:
            stats.tracks_played += 1
        elif "AI" in event_type:
            stats.ai_interactions += 1

        # Check level up (1000 XP per level)
        new_level = 1 + (prog.total_xp // 1000)
        level_up = new_level > old_level
        prog.level = new_level

        # Calculate rank tier
        if new_level >= 25:
            prog.rank = "LEGEND"
        elif new_level >= 20:
            prog.rank = "MASTER"
        elif new_level >= 15:
            prog.rank = "ELITE"
        elif new_level >= 10:
            prog.rank = "EXPERT"
        elif new_level >= 5:
            prog.rank = "CHALLENGER"
        else:
            prog.rank = "ROOKIE"

        # Check achievements
        unlocked_achievements = []
        if prog.level >= 5:
            if not AchievementRepository.has_achievement(db, user_id, "ach-expert-navigator"):
                AchievementRepository.unlock(db, user_id, "ach-expert-navigator")
                unlocked_achievements.append("ach-expert-navigator")
        if stats.games_played >= 10:
            if not AchievementRepository.has_achievement(db, user_id, "ach-arcade-master"):
                AchievementRepository.unlock(db, user_id, "ach-arcade-master")
                unlocked_achievements.append("ach-arcade-master")

        # 3. Log event for idempotency and activity feed
        if event_id:
            SyncRepository.record_event(db, user_id, event_id, event_type, entity_id, metadata or {"score": score})
        
        ActivityRepository.log_activity(db, user_id, event_type, entity_id, {"xp": base_xp, "coins": base_coins, "score": score})

        # Atomic commit
        db.commit()
        db.refresh(prog)

        return {
            "progression": prog,
            "xpGained": base_xp,
            "coinsGained": base_coins,
            "levelUp": level_up,
            "newLevel": new_level,
            "newRank": prog.rank,
            "unlockedAchievements": unlocked_achievements,
            "duplicate": False
        }, None
