from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..database import get_db

router = APIRouter(prefix="/api/health", tags=["health"])

@router.get("")
def health_check():
    return {
        "status": "ok",
        "service": "HB UNIVERSE API",
        "version": "12.0.0",
        "phase": 12
    }

@router.get("/database")
def database_health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "ok",
            "database": "connected",
            "engine": db.bind.dialect.name
        }
    except Exception as err:
        return {
            "status": "error",
            "database": "disconnected",
            "message": str(err)
        }
