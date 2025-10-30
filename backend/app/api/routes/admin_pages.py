"""Admin static page management endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import logging
from app.core.database import get_db
from app.models import StaticPage, AdminUser
from app.schemas import StaticPageResponse, StaticPageUpdate
from app.api.dependencies import get_current_admin

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("", response_model=List[StaticPageResponse])
async def get_admin_pages(
    admin_user: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all static pages for admin panel. Requires authentication."""
    try:
        pages = db.query(StaticPage).all()
        logger.info(f"Admin {admin_user.username} fetched {len(pages)} static pages")
        return pages
    except Exception as e:
        logger.error(f"Error fetching admin pages: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch pages")

@router.get("/{key}", response_model=StaticPageResponse)
async def get_admin_page_by_key(
    key: str,
    admin_user: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get a specific static page by key. Requires authentication."""
    try:
        page = db.query(StaticPage).filter(StaticPage.page_key == key).first()
        if not page:
            raise HTTPException(
                status_code=404,
                detail=f"Page with key '{key}' not found"
            )
        
        logger.info(f"Admin {admin_user.username} fetched page: {key}")
        return page
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching page {key}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch page")

@router.put("/{key}", response_model=StaticPageResponse)
async def update_admin_page(
    key: str,
    page_data: StaticPageUpdate,
    admin_user: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update a static page's content. Requires authentication."""
    try:
        page = db.query(StaticPage).filter(StaticPage.page_key == key).first()
        if not page:
            raise HTTPException(
                status_code=404,
                detail=f"Page with key '{key}' not found"
            )
        
        page.title = page_data.title
        page.set_content_dict(page_data.content)
        
        db.commit()
        db.refresh(page)
        
        logger.info(f"Admin {admin_user.username} updated page: {key}")
        return page
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating page {key}: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update page")
