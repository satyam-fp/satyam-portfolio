"""Admin project management endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import logging
from app.core.database import get_db
from app.models import Project, AdminUser
from app.schemas import ProjectResponseAdmin, ProjectCreateAdmin, ProjectUpdateAdmin
from app.api.dependencies import get_current_admin

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("", response_model=List[ProjectResponseAdmin])
async def get_admin_projects(
    admin_user: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all projects for admin panel (includes all fields). Requires authentication."""
    try:
        projects = db.query(Project).all()
        logger.info(f"Admin {admin_user.username} fetched {len(projects)} projects")
        return projects
    except Exception as e:
        logger.error(f"Error fetching admin projects: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch projects")

@router.post("", response_model=ProjectResponseAdmin, status_code=201)
async def create_admin_project(
    project_data: ProjectCreateAdmin,
    admin_user: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new project. Requires authentication."""
    try:
        existing_project = db.query(Project).filter(Project.slug == project_data.slug).first()
        if existing_project:
            raise HTTPException(
                status_code=409,
                detail=f"Project with slug '{project_data.slug}' already exists"
            )
        
        new_project = Project(
            title=project_data.title,
            slug=project_data.slug,
            description=project_data.description,
            content=project_data.content,
            github_url=project_data.github_url,
            live_demo=project_data.live_demo,
            image_url=project_data.image_url,
            featured=project_data.featured,
            position_x=project_data.position_x,
            position_y=project_data.position_y,
            position_z=project_data.position_z
        )
        
        new_project.set_tech_stack_list(project_data.tech_stack)
        
        db.add(new_project)
        db.commit()
        db.refresh(new_project)
        
        logger.info(f"Admin {admin_user.username} created project: {new_project.slug}")
        return new_project
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating project: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create project")

@router.put("/{project_id}", response_model=ProjectResponseAdmin)
async def update_admin_project(
    project_id: int,
    project_data: ProjectUpdateAdmin,
    admin_user: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update an existing project. Requires authentication."""
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(
                status_code=404,
                detail=f"Project with ID {project_id} not found"
            )
        
        if project_data.slug and project_data.slug != project.slug:
            existing_project = db.query(Project).filter(Project.slug == project_data.slug).first()
            if existing_project:
                raise HTTPException(
                    status_code=409,
                    detail=f"Project with slug '{project_data.slug}' already exists"
                )
        
        update_data = project_data.dict(exclude_unset=True)
        
        if 'tech_stack' in update_data:
            project.set_tech_stack_list(update_data.pop('tech_stack'))
        
        for field, value in update_data.items():
            setattr(project, field, value)
        
        db.commit()
        db.refresh(project)
        
        logger.info(f"Admin {admin_user.username} updated project: {project.slug}")
        return project
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating project {project_id}: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update project")

@router.delete("/{project_id}")
async def delete_admin_project(
    project_id: int,
    admin_user: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a project. Requires authentication."""
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(
                status_code=404,
                detail=f"Project with ID {project_id} not found"
            )
        
        project_slug = project.slug
        db.delete(project)
        db.commit()
        
        logger.info(f"Admin {admin_user.username} deleted project: {project_slug}")
        return {
            "success": True,
            "message": f"Project '{project_slug}' deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting project {project_id}: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete project")
