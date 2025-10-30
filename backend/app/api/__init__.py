"""API routers."""
from fastapi import APIRouter
from .routes import projects, blogs, neural_data, admin_auth, admin_projects, admin_blogs, admin_pages, admin_stats

api_router = APIRouter()

# Public routes
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(blogs.router, prefix="/blogs", tags=["blogs"])
api_router.include_router(neural_data.router, prefix="/neural-data", tags=["neural-data"])

# Admin routes
api_router.include_router(admin_auth.router, prefix="/admin", tags=["admin-auth"])
api_router.include_router(admin_projects.router, prefix="/admin/projects", tags=["admin-projects"])
api_router.include_router(admin_blogs.router, prefix="/admin/blogs", tags=["admin-blogs"])
api_router.include_router(admin_pages.router, prefix="/admin/pages", tags=["admin-pages"])
api_router.include_router(admin_stats.router, prefix="/admin/stats", tags=["admin-stats"])
