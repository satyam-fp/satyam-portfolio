"""Static page schemas."""
from pydantic import BaseModel, validator
from datetime import datetime
import json

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
