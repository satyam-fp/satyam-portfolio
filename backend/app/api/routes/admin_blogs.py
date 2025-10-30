"""Admin blog management endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import logging
from app.core.database import get_db
from app.models import Blog, AdminUser
from app.schemas import BlogResponseAdmin, BlogCreateAdmin, BlogUpdateAdmin
from app.api.dependencies import get_current_admin

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("", response_model=List[BlogResponseAdmin])
async def get_admin_blogs(
    admin_user: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all blogs for admin panel (includes all fields). Requires authentication."""
    try:
        blogs = db.query(Blog).all()
        logger.info(f"Admin {admin_user.username} fetched {len(blogs)} blogs")
        return blogs
    except Exception as e:
        logger.error(f"Error fetching admin blogs: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch blogs")

@router.post("", response_model=BlogResponseAdmin, status_code=201)
async def create_admin_blog(
    blog_data: BlogCreateAdmin,
    admin_user: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new blog post. Requires authentication."""
    try:
        existing_blog = db.query(Blog).filter(Blog.slug == blog_data.slug).first()
        if existing_blog:
            raise HTTPException(
                status_code=409,
                detail=f"Blog with slug '{blog_data.slug}' already exists"
            )
        
        new_blog = Blog(
            title=blog_data.title,
            slug=blog_data.slug,
            content=blog_data.content,
            summary=blog_data.summary,
            author=blog_data.author,
            image_url=blog_data.image_url,
            published=blog_data.published,
            published_at=blog_data.published_at,
            position_x=blog_data.position_x,
            position_y=blog_data.position_y,
            position_z=blog_data.position_z
        )
        
        if blog_data.tags:
            new_blog.set_tags_list(blog_data.tags)
        
        db.add(new_blog)
        db.commit()
        db.refresh(new_blog)
        
        logger.info(f"Admin {admin_user.username} created blog: {new_blog.slug}")
        return new_blog
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating blog: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create blog")

@router.put("/{blog_id}", response_model=BlogResponseAdmin)
async def update_admin_blog(
    blog_id: int,
    blog_data: BlogUpdateAdmin,
    admin_user: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update an existing blog post. Requires authentication."""
    try:
        blog = db.query(Blog).filter(Blog.id == blog_id).first()
        if not blog:
            raise HTTPException(
                status_code=404,
                detail=f"Blog with ID {blog_id} not found"
            )
        
        if blog_data.slug and blog_data.slug != blog.slug:
            existing_blog = db.query(Blog).filter(Blog.slug == blog_data.slug).first()
            if existing_blog:
                raise HTTPException(
                    status_code=409,
                    detail=f"Blog with slug '{blog_data.slug}' already exists"
                )
        
        update_data = blog_data.dict(exclude_unset=True)
        
        if 'tags' in update_data:
            blog.set_tags_list(update_data.pop('tags'))
        
        for field, value in update_data.items():
            setattr(blog, field, value)
        
        db.commit()
        db.refresh(blog)
        
        logger.info(f"Admin {admin_user.username} updated blog: {blog.slug}")
        return blog
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating blog {blog_id}: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update blog")

@router.delete("/{blog_id}")
async def delete_admin_blog(
    blog_id: int,
    admin_user: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a blog post. Requires authentication."""
    try:
        blog = db.query(Blog).filter(Blog.id == blog_id).first()
        if not blog:
            raise HTTPException(
                status_code=404,
                detail=f"Blog with ID {blog_id} not found"
            )
        
        blog_slug = blog.slug
        db.delete(blog)
        db.commit()
        
        logger.info(f"Admin {admin_user.username} deleted blog: {blog_slug}")
        return {
            "success": True,
            "message": f"Blog '{blog_slug}' deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting blog {blog_id}: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete blog")
