"""Blog model."""
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean
from sqlalchemy.sql import func
from app.core.database import Base
import json

class Blog(Base):
    __tablename__ = "blogs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    content = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)
    author = Column(String, default="Satyam", nullable=False)
    tags = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    published = Column(Boolean, default=True, nullable=False)
    published_at = Column(DateTime(timezone=True), nullable=True)
    position_x = Column(Float, nullable=False)
    position_y = Column(Float, nullable=False)
    position_z = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def get_tags_list(self):
        """Convert tags JSON string to list."""
        try:
            return json.loads(self.tags) if self.tags else []
        except json.JSONDecodeError:
            return []
    
    def set_tags_list(self, tags_list):
        """Convert tags list to JSON string."""
        self.tags = json.dumps(tags_list) if tags_list else "[]"
