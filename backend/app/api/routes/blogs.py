"""Public blog endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import logging
from app.core.database import get_db
from app.models import Blog
from app.schemas import BlogResponse

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("", response_model=List[BlogResponse])
def get_blogs(db: Session = Depends(get_db)):
    """Get all blogs with 3D positioning data."""
    try:
        blogs = db.query(Blog).all()
        return blogs
    except Exception as e:
        logger.error(f"Error fetching blogs: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch blogs")

@router.get("/{slug}", response_model=BlogResponse)
def get_blog_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get individual blog details by slug."""
    try:
        blog = db.query(Blog).filter(Blog.slug == slug).first()
        if not blog:
            raise HTTPException(status_code=404, detail=f"Blog with slug '{slug}' not found")
        return blog
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching blog {slug}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch blog")
