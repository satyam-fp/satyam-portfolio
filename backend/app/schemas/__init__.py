"""Pydantic schemas."""
from .project import ProjectResponse, ProjectCreateAdmin, ProjectUpdateAdmin, ProjectResponseAdmin
from .blog import BlogResponse, BlogCreateAdmin, BlogUpdateAdmin, BlogResponseAdmin
from .auth import LoginRequest, LoginResponse
from .static_page import StaticPageResponse, StaticPageUpdate
from .dashboard import DashboardStats, NeuralDataResponse

__all__ = [
    "ProjectResponse", "ProjectCreateAdmin", "ProjectUpdateAdmin", "ProjectResponseAdmin",
    "BlogResponse", "BlogCreateAdmin", "BlogUpdateAdmin", "BlogResponseAdmin",
    "LoginRequest", "LoginResponse",
    "StaticPageResponse", "StaticPageUpdate",
    "DashboardStats", "NeuralDataResponse"
]
