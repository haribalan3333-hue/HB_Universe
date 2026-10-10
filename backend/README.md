# 🌌 HB UNIVERSE — BACKEND API (PHASE 12)

Production-ready, authoritative Python FastAPI backend for **HB UNIVERSE**.

## Architecture & Layers
- `models/`: SQLAlchemy models for Users, Progression, Stats, Achievements, Game Results, Challenge Results, Activities, and Cloud Settings.
- `repositories/`: Isolated database query layer.
- `services/`: Progression logic, reward calculation, idempotency enforcement, and sync conflict resolution.
- `routes/`: REST endpoints for Auth, Progression, Sync, Leaderboard, Users, Achievements, and Challenges.
- `alembic/`: Database migration management.

## API Endpoints
- **Health**: `GET /api/health`, `GET /api/health/database`
- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- **Sync**: `GET /api/sync/pull`, `POST /api/sync/push`, `POST /api/sync/events`
- **Progression**: `GET /api/progression/me`, `POST /api/progression/event`, `POST /api/progression/migrate`
- **Leaderboard**: `GET /api/leaderboard?type=GLOBAL&page=1&limit=20`, `GET /api/leaderboard/me`, `GET /api/leaderboard/user/{username}`
- **Users**: `GET /api/users/me`, `PATCH /api/users/me`, `PATCH /api/users/me/privacy`, `GET /api/users/me/export`, `GET /api/users/me/activity`
