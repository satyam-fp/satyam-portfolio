"""Project schemas."""
from pydantic import BaseModel, validator
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

class ProjectCreateAdmin(ProjectBase):
    content: Optional[str] = None
    featured: bool = False
    position_x: float
    position_y: float
    position_z: float

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
