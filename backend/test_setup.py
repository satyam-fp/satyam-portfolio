#!/usr/bin/env python3
"""
Test script to verify the backend setup is working correctly.
"""

import sys
import json
from datetime import datetime
from sqlalchemy.orm import Session
from database import SessionLocal, check_database_connection
from models import Project, Blog
from schemas import ProjectCreate, ProjectResponse, BlogCreate, BlogResponse

def test_database_connection():
    """Test database connection."""
    print("Testing database connection...")
    if check_database_connection():
        print("✅ Database connection successful")
        return True
    else:
        print("❌ Database connection failed")
        return False

def test_models():
    """Test SQLAlchemy models."""
    print("\nTesting SQLAlchemy models...")
    
    try:
        db = SessionLocal()
        
        # Test Project model
        project = Project(
            title="Test Project",
            slug="test-project",
            description="A test project for validation",
            tech_stack=json.dumps(["Python", "FastAPI", "SQLAlchemy"]),
            github_url="https://github.com/test/project",
            position_x=1.0,
            position_y=2.0,
            position_z=3.0
        )
        
        db.add(project)
        db.commit()
        db.refresh(project)
        
        # Test tech_stack methods
        tech_list = project.get_tech_stack_list()
        assert tech_list == ["Python", "FastAPI", "SQLAlchemy"]
        
        # Test Blog model
        blog = Blog(
            title="Test Blog Post",
            slug="test-blog-post",
            content="# Test Blog\n\nThis is a test blog post.",
            summary="A test blog post",
            position_x=4.0,
            position_y=5.0,
            position_z=6.0
        )
        
        db.add(blog)
        db.commit()
        db.refresh(blog)
        
        print("✅ SQLAlchemy models working correctly")
        
        # Clean up test data
        db.delete(project)
        db.delete(blog)
        db.commit()
        db.close()
        
        return True
        
    except Exception as e:
        print(f"❌ SQLAlchemy models test failed: {e}")
        return False

def test_schemas():
    """Test Pydantic schemas."""
    print("\nTesting Pydantic schemas...")
    
    try:
        # Test ProjectCreate
        project_data = {
            "title": "Test Project",
            "slug": "test-project",
            "description": "A test project",
            "tech_stack": ["Python", "FastAPI"],
            "github_url": "https://github.com/test/project",
            "position_x": 1.0,
            "position_y": 2.0,
            "position_z": 3.0
        }
        project_create = ProjectCreate(**project_data)
        
        # Test ProjectResponse with JSON tech_stack
        project_response_data = {
            "id": 1,
            "title": "Test Project",
            "slug": "test-project",
            "description": "A test project",
            "tech_stack": json.dumps(["Python", "FastAPI"]),
            "github_url": "https://github.com/test/project",
            "position_x": 1.0,
            "position_y": 2.0,
            "position_z": 3.0,
            "created_at": datetime.now()
        }
        project_response = ProjectResponse(**project_response_data)
        
        # Verify tech_stack conversion
        assert project_response.tech_stack == ["Python", "FastAPI"]
        
        # Test BlogCreate
        blog_data = {
            "title": "Test Blog",
            "slug": "test-blog",
            "content": "# Test\n\nContent",
            "summary": "Test summary",
            "position_x": 4.0,
            "position_y": 5.0,
            "position_z": 6.0
        }
        blog_create = BlogCreate(**blog_data)
        
        print("✅ Pydantic schemas working correctly")
        return True
        
    except Exception as e:
        print(f"❌ Pydantic schemas test failed: {e}")
        return False

def test_fastapi_import():
    """Test FastAPI app import."""
    print("\nTesting FastAPI app import...")
    
    try:
        from main import app
        assert app.title == "Neural Space Portfolio API"
        print("✅ FastAPI app import successful")
        return True
        
    except Exception as e:
        print(f"❌ FastAPI app import failed: {e}")
        return False

def main():
    """Run all tests."""
    print("🧪 Running backend setup tests...\n")
    
    tests = [
        test_database_connection,
        test_models,
        test_schemas,
        test_fastapi_import
    ]
    
    results = []
    for test in tests:
        results.append(test())
    
    print(f"\n📊 Test Results: {sum(results)}/{len(results)} tests passed")
    
    if all(results):
        print("🎉 All tests passed! Backend setup is complete.")
        return True
    else:
        print("❌ Some tests failed. Please check the errors above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)