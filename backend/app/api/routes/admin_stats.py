"""Admin dashboard statistics endpoint."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging
from app.core.database import get_db
from app.models import Project, Blog, AdminUser
from app.schemas import DashboardStats
from app.api.dependencies import get_current_admin

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("", response_model=DashboardStats)
async def get_dashboard_stats(
    admin_user: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics for admin panel. Requires authentication."""
    try:
        total_projects = db.query(Project).count()
        featured_projects = db.query(Project).filter(Project.featured == True).count()
        total_blogs = db.query(Blog).count()
        published_blogs = db.query(Blog).filter(Blog.published == True).count()
        draft_blogs = db.query(Blog).filter(Blog.published == False).count()
        
        logger.info(f"Admin {admin_user.username} fetched dashboard stats")
        
        return DashboardStats(
            total_projects=total_projects,
            total_blogs=total_blogs,
            published_blogs=published_blogs,
            draft_blogs=draft_blogs,
            featured_projects=featured_projects
        )
        
    except Exception as e:
        logger.error(f"Error fetching dashboard stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch dashboard statistics")
