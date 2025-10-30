"""Public project endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import logging
from app.core.database import get_db
from app.models import Project
from app.schemas import ProjectResponse

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("", response_model=List[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    """Get all projects with 3D positioning data."""
    try:
        projects = db.query(Project).all()
        return projects
    except Exception as e:
        logger.error(f"Error fetching projects: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch projects")

@router.get("/{slug}", response_model=ProjectResponse)
def get_project_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get individual project details by slug."""
    try:
        project = db.query(Project).filter(Project.slug == slug).first()
        if not project:
            raise HTTPException(status_code=404, detail=f"Project with slug '{slug}' not found")
        return project
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching project {slug}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch project")
