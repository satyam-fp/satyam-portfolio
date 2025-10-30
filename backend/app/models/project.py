"""Project model."""
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean
from sqlalchemy.sql import func
from app.core.database import Base
import json

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    content = Column(Text, nullable=True)
    tech_stack = Column(Text, nullable=False)
    github_url = Column(String, nullable=True)
    live_demo = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    featured = Column(Boolean, default=False, nullable=False)
    position_x = Column(Float, nullable=False)
    position_y = Column(Float, nullable=False)
    position_z = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def get_tech_stack_list(self):
        """Convert tech_stack JSON string to list."""
        try:
            return json.loads(self.tech_stack) if self.tech_stack else []
        except json.JSONDecodeError:
            return []
    
    def set_tech_stack_list(self, tech_list):
        """Convert tech_stack list to JSON string."""
        self.tech_stack = json.dumps(tech_list) if tech_list else "[]"
