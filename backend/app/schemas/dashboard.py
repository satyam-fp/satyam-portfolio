"""Dashboard and combined data schemas."""
from pydantic import BaseModel
from typing import List
from .project import ProjectResponse
from .blog import BlogResponse

class DashboardStats(BaseModel):
    total_projects: int
    total_blogs: int
    published_blogs: int
    draft_blogs: int
    featured_projects: int

class NeuralDataResponse(BaseModel):
    projects: List[ProjectResponse]
    blogs: List[BlogResponse]
