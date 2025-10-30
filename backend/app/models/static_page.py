"""Static page model."""
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.core.database import Base
import json

class StaticPage(Base):
    __tablename__ = "static_pages"
    
    id = Column(Integer, primary_key=True, index=True)
    page_key = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def get_content_dict(self):
        """Convert content JSON string to dictionary."""
        try:
            return json.loads(self.content) if self.content else {}
        except json.JSONDecodeError:
            return {}
    
    def set_content_dict(self, content_dict):
        """Convert content dictionary to JSON string."""
        self.content = json.dumps(content_dict) if content_dict else "{}"
