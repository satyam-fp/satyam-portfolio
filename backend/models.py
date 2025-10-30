from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
import json

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    content = Column(Text, nullable=True)  # Detailed markdown content for admin
    tech_stack = Column(Text, nullable=False)  # JSON string
    github_url = Column(String, nullable=True)
    live_demo = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    featured = Column(Boolean, default=False, nullable=False)  # Featured project flag
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

class Blog(Base):
    __tablename__ = "blogs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    content = Column(Text, nullable=False)  # Markdown content
    summary = Column(Text, nullable=True)
    author = Column(String, default="Satyam", nullable=False)
    tags = Column(Text, nullable=True)  # JSON array
    image_url = Column(String, nullable=True)
    published = Column(Boolean, default=True, nullable=False)  # Published status
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


class AdminUser(Base):
    """Admin user model for authentication"""
    __tablename__ = "admin_users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    email = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Relationship to sessions
    sessions = relationship("AdminSession", back_populates="user", cascade="all, delete-orphan")


class AdminSession(Base):
    """Session tracking for admin users"""
    __tablename__ = "admin_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("admin_users.id", ondelete="CASCADE"), nullable=False)
    session_token = Column(String(255), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship to user
    user = relationship("AdminUser", back_populates="sessions")


class StaticPage(Base):
    """Static page content storage"""
    __tablename__ = "static_pages"
    
    id = Column(Integer, primary_key=True, index=True)
    page_key = Column(String(50), unique=True, index=True, nullable=False)  # e.g., 'home', 'about'
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)  # JSON format for flexible content
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
