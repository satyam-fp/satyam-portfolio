"""
Test script for admin project endpoints.
Tests CRUD operations for projects through the admin API.
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_admin_projects():
    """Test admin project CRUD operations."""
    
    print("=" * 60)
    print("Testing Admin Project Endpoints")
    print("=" * 60)
    
    # Step 1: Login
    print("\n1. Testing login...")
    login_response = requests.post(
        f"{BASE_URL}/api/admin/login",
        json={"username": "satyam", "password": "satyam@123"}
    )
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(f"Response: {login_response.text}")
        return
    
    print("✅ Login successful")
    cookies = login_response.cookies
    
    # Step 2: Get all projects
    print("\n2. Testing GET /api/admin/projects...")
    get_response = requests.get(
        f"{BASE_URL}/api/admin/projects",
        cookies=cookies
    )
    
    if get_response.status_code != 200:
        print(f"❌ Get projects failed: {get_response.status_code}")
        print(f"Response: {get_response.text}")
        return
    
    projects = get_response.json()
    print(f"✅ Retrieved {len(projects)} projects")
    
    # Step 3: Create a new project
    print("\n3. Testing POST /api/admin/projects...")
    new_project = {
        "title": "Test Project",
        "slug": "test-project-admin",
        "description": "A test project created via admin API",
        "content": "# Test Project\n\nThis is detailed content.",
        "tech_stack": ["Python", "FastAPI", "SQLAlchemy"],
        "github_url": "https://github.com/test/project",
        "live_demo": "https://test-project.com",
        "image_url": "https://example.com/image.jpg",
        "featured": True,
        "position_x": 5.0,
        "position_y": 3.0,
        "position_z": 2.0
    }
    
    create_response = requests.post(
        f"{BASE_URL}/api/admin/projects",
        json=new_project,
        cookies=cookies
    )
    
    if create_response.status_code != 201:
        print(f"❌ Create project failed: {create_response.status_code}")
        print(f"Response: {create_response.text}")
        return
    
    created_project = create_response.json()
    project_id = created_project["id"]
    print(f"✅ Created project with ID: {project_id}")
    print(f"   Title: {created_project['title']}")
    print(f"   Featured: {created_project['featured']}")
    
    # Step 4: Update the project
    print("\n4. Testing PUT /api/admin/projects/{id}...")
    update_data = {
        "title": "Updated Test Project",
        "description": "Updated description",
        "featured": False
    }
    
    update_response = requests.put(
        f"{BASE_URL}/api/admin/projects/{project_id}",
        json=update_data,
        cookies=cookies
    )
    
    if update_response.status_code != 200:
        print(f"❌ Update project failed: {update_response.status_code}")
        print(f"Response: {update_response.text}")
        return
    
    updated_project = update_response.json()
    print(f"✅ Updated project")
    print(f"   New title: {updated_project['title']}")
    print(f"   Featured: {updated_project['featured']}")
    
    # Step 5: Delete the project
    print("\n5. Testing DELETE /api/admin/projects/{id}...")
    delete_response = requests.delete(
        f"{BASE_URL}/api/admin/projects/{project_id}",
        cookies=cookies
    )
    
    if delete_response.status_code != 200:
        print(f"❌ Delete project failed: {delete_response.status_code}")
        print(f"Response: {delete_response.text}")
        return
    
    delete_result = delete_response.json()
    print(f"✅ Deleted project: {delete_result['message']}")
    
    # Step 6: Verify deletion
    print("\n6. Verifying deletion...")
    verify_response = requests.get(
        f"{BASE_URL}/api/admin/projects",
        cookies=cookies
    )
    
    if verify_response.status_code == 200:
        projects_after = verify_response.json()
        deleted = not any(p["id"] == project_id for p in projects_after)
        if deleted:
            print(f"✅ Project successfully deleted (not in list)")
        else:
            print(f"❌ Project still exists in list")
    
    # Step 7: Test authentication requirement
    print("\n7. Testing authentication requirement...")
    no_auth_response = requests.get(f"{BASE_URL}/api/admin/projects")
    
    if no_auth_response.status_code == 401:
        print("✅ Endpoints properly require authentication")
    else:
        print(f"❌ Expected 401, got {no_auth_response.status_code}")
    
    # Step 8: Test duplicate slug validation
    print("\n8. Testing duplicate slug validation...")
    duplicate_project = {
        "title": "Another Project",
        "slug": "test-project-admin",  # Same slug
        "description": "Test duplicate",
        "tech_stack": ["Python"],
        "position_x": 1.0,
        "position_y": 1.0,
        "position_z": 1.0
    }
    
    # First create the project
    create1 = requests.post(
        f"{BASE_URL}/api/admin/projects",
        json=duplicate_project,
        cookies=cookies
    )
    
    if create1.status_code == 201:
        # Try to create duplicate
        create2 = requests.post(
            f"{BASE_URL}/api/admin/projects",
            json=duplicate_project,
            cookies=cookies
        )
        
        if create2.status_code == 409:
            print("✅ Duplicate slug properly rejected")
        else:
            print(f"❌ Expected 409, got {create2.status_code}")
        
        # Clean up
        requests.delete(
            f"{BASE_URL}/api/admin/projects/{create1.json()['id']}",
            cookies=cookies
        )
    
    print("\n" + "=" * 60)
    print("All tests completed!")
    print("=" * 60)


if __name__ == "__main__":
    try:
        test_admin_projects()
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure the backend is running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
