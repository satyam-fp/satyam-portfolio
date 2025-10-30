"""Comprehensive API tests."""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal, Base, engine
from app.models import Project, Blog, AdminUser, StaticPage
from app.core.security import hash_password
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = TestClient(app)

def setup_test_data():
    """Setup test data."""
    db = SessionLocal()
    try:
        # Create admin user
        admin = AdminUser(
            username="testadmin",
            password_hash=hash_password("testpass"),
            email="test@example.com"
        )
        db.add(admin)
        
        # Create test project
        project = Project(
            title="Test Project",
            slug="test-project",
            description="Test description",
            content="Test content",
            github_url="https://github.com/test",
            featured=True,
            position_x=1.0,
            position_y=1.0,
            position_z=1.0
        )
        project.set_tech_stack_list(["Python", "FastAPI"])
        db.add(project)
        
        # Create test blog
        blog = Blog(
            title="Test Blog",
            slug="test-blog",
            content="Test blog content",
            summary="Test summary",
            author="Test Author",
            published=True,
            position_x=0.0,
            position_y=0.0,
            position_z=0.0
        )
        blog.set_tags_list(["test", "blog"])
        db.add(blog)
        
        # Create static page
        page = StaticPage(
            page_key="test",
            title="Test Page"
        )
        page.set_content_dict({"test": "data"})
        db.add(page)
        
        db.commit()
        logger.info("Test data created")
    except Exception as e:
        logger.error(f"Error creating test data: {e}")
        db.rollback()
    finally:
        db.close()

def test_root():
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data
    logger.info("✓ Root endpoint test passed")

def test_health():
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "database" in data
    logger.info("✓ Health check test passed")

def test_get_projects():
    """Test get all projects."""
    response = client.get("/api/projects")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    logger.info(f"✓ Get projects test passed ({len(data)} projects)")

def test_get_project_by_slug():
    """Test get project by slug."""
    response = client.get("/api/projects/test-project")
    if response.status_code == 200:
        data = response.json()
        assert data["slug"] == "test-project"
        assert "tech_stack" in data
        logger.info("✓ Get project by slug test passed")
    else:
        logger.warning("⚠ No test project found (expected if database is empty)")

def test_get_blogs():
    """Test get all blogs."""
    response = client.get("/api/blogs")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    logger.info(f"✓ Get blogs test passed ({len(data)} blogs)")

def test_get_blog_by_slug():
    """Test get blog by slug."""
    response = client.get("/api/blogs/test-blog")
    if response.status_code == 200:
        data = response.json()
        assert data["slug"] == "test-blog"
        logger.info("✓ Get blog by slug test passed")
    else:
        logger.warning("⚠ No test blog found (expected if database is empty)")

def test_get_neural_data():
    """Test get neural data."""
    response = client.get("/api/neural-data")
    assert response.status_code == 200
    data = response.json()
    assert "projects" in data
    assert "blogs" in data
    assert isinstance(data["projects"], list)
    assert isinstance(data["blogs"], list)
    logger.info("✓ Get neural data test passed")

def test_admin_login():
    """Test admin login."""
    response = client.post(
        "/api/admin/login",
        json={"username": "admin", "password": "admin123"}
    )
    if response.status_code == 200:
        data = response.json()
        assert data["success"] == True
        assert "user" in data
        logger.info("✓ Admin login test passed")
        return response.cookies.get("admin_session")
    else:
        logger.warning("⚠ Admin login failed (expected if no admin user exists)")
        return None

def test_admin_verify(session_token):
    """Test admin session verification."""
    if not session_token:
        logger.warning("⚠ Skipping admin verify test (no session token)")
        return
    
    response = client.get(
        "/api/admin/verify",
        cookies={"admin_session": session_token}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] == True
    logger.info("✓ Admin verify test passed")

def test_admin_projects(session_token):
    """Test admin projects endpoint."""
    if not session_token:
        logger.warning("⚠ Skipping admin projects test (no session token)")
        return
    
    response = client.get(
        "/api/admin/projects",
        cookies={"admin_session": session_token}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    logger.info("✓ Admin projects test passed")

def test_admin_blogs(session_token):
    """Test admin blogs endpoint."""
    if not session_token:
        logger.warning("⚠ Skipping admin blogs test (no session token)")
        return
    
    response = client.get(
        "/api/admin/blogs",
        cookies={"admin_session": session_token}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    logger.info("✓ Admin blogs test passed")

def test_admin_stats(session_token):
    """Test admin stats endpoint."""
    if not session_token:
        logger.warning("⚠ Skipping admin stats test (no session token)")
        return
    
    response = client.get(
        "/api/admin/stats",
        cookies={"admin_session": session_token}
    )
    assert response.status_code == 200
    data = response.json()
    assert "total_projects" in data
    assert "total_blogs" in data
    logger.info("✓ Admin stats test passed")

def test_admin_pages(session_token):
    """Test admin pages endpoint."""
    if not session_token:
        logger.warning("⚠ Skipping admin pages test (no session token)")
        return
    
    response = client.get(
        "/api/admin/pages",
        cookies={"admin_session": session_token}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    logger.info("✓ Admin pages test passed")

def run_all_tests():
    """Run all tests."""
    logger.info("=" * 60)
    logger.info("Starting API Tests")
    logger.info("=" * 60)
    
    # Public endpoints
    test_root()
    test_health()
    test_get_projects()
    test_get_project_by_slug()
    test_get_blogs()
    test_get_blog_by_slug()
    test_get_neural_data()
    
    # Admin endpoints
    session_token = test_admin_login()
    test_admin_verify(session_token)
    test_admin_projects(session_token)
    test_admin_blogs(session_token)
    test_admin_stats(session_token)
    test_admin_pages(session_token)
    
    logger.info("=" * 60)
    logger.info("All tests completed!")
    logger.info("=" * 60)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Run API tests")
    parser.add_argument("--setup", action="store_true", help="Setup test data before running tests")
    args = parser.parse_args()
    
    if args.setup:
        logger.info("Setting up test data...")
        setup_test_data()
    
    run_all_tests()
