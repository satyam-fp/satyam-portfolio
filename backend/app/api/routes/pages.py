"""Public static page endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging
from app.core.database import get_db
from app.models import StaticPage
from app.schemas import StaticPageResponse

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/{key}", response_model=StaticPageResponse)
def get_page_by_key(key: str, db: Session = Depends(get_db)):
    """Get a specific static page by key (public endpoint)."""
    try:
        page = db.query(StaticPage).filter(StaticPage.page_key == key).first()
        if not page:
            raise HTTPException(
                status_code=404,
                detail=f"Page with key '{key}' not found"
            )
        return page
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching page {key}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch page")
