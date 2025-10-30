"""Blog schemas."""
from pydantic import BaseModel, validator
from typing import List, Optional
from datetime import datetime
import json

class BlogBase(BaseModel):
    title: str
    slug: str
    content: str
    summary: Optional[str] = None

class BlogResponse(BlogBase):
    id: int
    position_x: float
    position_y: float
    position_z: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class BlogCreateAdmin(BlogBase):
    published: bool = False
    author: Optional[str] = "Satyam"
    tags: Optional[List[str]] = None
    image_url: Optional[str] = None
    published_at: Optional[datetime] = None
    position_x: float
    position_y: float
    position_z: float

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
