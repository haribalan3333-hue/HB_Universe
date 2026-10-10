from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import health, auth, progression, leaderboard, users, achievements, challenges, sync
from .config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HB UNIVERSE API",
    version="12.0.0",
    description="Authoritative Multi-User Cloud Platform & Cross-Device Sync API"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(progression.router)
app.include_router(leaderboard.router)
app.include_router(achievements.router)
app.include_router(challenges.router)
app.include_router(sync.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
