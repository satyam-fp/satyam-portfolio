from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime
import json

class ProjectBase(BaseModel):
    title: str
    slug: str
    description: str
    tech_stack: List[str]
    github_url: Optional[str] = None
    live_demo: Optional[str] = None
    image_url: Optional[str] = None

class ProjectCreate(ProjectBase):
    position_x: float
    position_y: float
    position_z: float

class ProjectResponse(ProjectBase):
    id: int
    position_x: float
    position_y: float
    position_z: float
    created_at: datetime
    
    class Config:
        from_attributes = True
    
    @validator('tech_stack', pre=True)
    def parse_tech_stack(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return []
        return v if v is not None else []

class BlogBase(BaseModel):
    title: str
    slug: str
    content: str
    summary: Optional[str] = None

class BlogCreate(BlogBase):
    position_x: float
    position_y: float
    position_z: float

class BlogResponse(BlogBase):
    id: int
    position_x: float
    position_y: float
    position_z: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class NeuralDataResponse(BaseModel):
    projects: List[ProjectResponse]
    blogs: List[BlogResponse]

# Admin Authentication Schemas
class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    message: str
    user: Optional[dict] = None

# Admin Project Schemas
class ProjectCreateAdmin(ProjectCreate):
    content: Optional[str] = None  # Markdown content
    featured: bool = False

class ProjectUpdateAdmin(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    github_url: Optional[str] = None
    live_demo: Optional[str] = None
    image_url: Optional[str] = None
    featured: Optional[bool] = None
    position_x: Optional[float] = None
    position_y: Optional[float] = None
    position_z: Optional[float] = None

class ProjectResponseAdmin(ProjectResponse):
    content: Optional[str] = None
    featured: bool = False

# Admin Blog Schemas
class BlogCreateAdmin(BlogCreate):
    published: bool = False
    author: Optional[str] = "Satyam"
    tags: Optional[List[str]] = None
    image_url: Optional[str] = None
    published_at: Optional[datetime] = None

class BlogUpdateAdmin(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    published: Optional[bool] = None
    author: Optional[str] = None
    tags: Optional[List[str]] = None
    image_url: Optional[str] = None
    published_at: Optional[datetime] = None
    position_x: Optional[float] = None
    position_y: Optional[float] = None
    position_z: Optional[float] = None

class BlogResponseAdmin(BlogResponse):
    published: bool = True
    author: Optional[str] = None
    tags: Optional[List[str]] = None
    image_url: Optional[str] = None
    published_at: Optional[datetime] = None
    
    @validator('tags', pre=True)
    def parse_tags(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return []
        return v if v is not None else []

# Admin Static Page Schemas
class StaticPageResponse(BaseModel):
    id: int
    page_key: str
    title: str
    content: dict
    updated_at: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True
    
    @validator('content', pre=True)
    def parse_content(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return {}
        return v if v is not None else {}

class StaticPageUpdate(BaseModel):
    title: str
    content: dict

# Admin Dashboard Schemas
class DashboardStats(BaseModel):
    total_projects: int
    total_blogs: int
    published_blogs: int
    draft_blogs: int
    featured_projects: int