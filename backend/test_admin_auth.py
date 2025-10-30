"""
Test script for admin authentication endpoints.
Tests login, verify, and logout functionality.
"""

import requests
import sys

BASE_URL = "http://localhost:8000"

def test_login():
    """Test admin login endpoint."""
    print("\n=== Testing Login ===")
    
    # Test with correct credentials
    response = requests.post(
        f"{BASE_URL}/api/admin/login",
        json={"username": "satyam", "password": "satyam@123"}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        print("✓ Login successful")
        # Extract session cookie
        session_cookie = response.cookies.get("admin_session")
        if session_cookie:
            print(f"✓ Session cookie set: {session_cookie[:20]}...")
            return session_cookie
        else:
            print("✗ No session cookie received")
            return None
    else:
        print("✗ Login failed")
        return None


def test_verify(session_cookie):
    """Test admin verify endpoint."""
    print("\n=== Testing Verify ===")
    
    if not session_cookie:
        print("✗ No session cookie available")
        return False
    
    response = requests.get(
        f"{BASE_URL}/api/admin/verify",
        cookies={"admin_session": session_cookie}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        print("✓ Session verified successfully")
        return True
    else:
        print("✗ Session verification failed")
        return False


def test_logout(session_cookie):
    """Test admin logout endpoint."""
    print("\n=== Testing Logout ===")
    
    if not session_cookie:
        print("✗ No session cookie available")
        return False
    
    response = requests.post(
        f"{BASE_URL}/api/admin/logout",
        cookies={"admin_session": session_cookie}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        print("✓ Logout successful")
        return True
    else:
        print("✗ Logout failed")
        return False


def test_verify_after_logout(session_cookie):
    """Test that verify fails after logout."""
    print("\n=== Testing Verify After Logout ===")
    
    response = requests.get(
        f"{BASE_URL}/api/admin/verify",
        cookies={"admin_session": session_cookie}
    )
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 401:
        print("✓ Session correctly invalidated after logout")
        return True
    else:
        print("✗ Session still valid after logout (unexpected)")
        return False


def test_invalid_credentials():
    """Test login with invalid credentials."""
    print("\n=== Testing Invalid Credentials ===")
    
    response = requests.post(
        f"{BASE_URL}/api/admin/login",
        json={"username": "wrong", "password": "wrong"}
    )
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 401:
        print("✓ Invalid credentials correctly rejected")
        return True
    else:
        print("✗ Invalid credentials not rejected properly")
        return False


def main():
    """Run all tests."""
    print("=" * 50)
    print("Admin Authentication Endpoint Tests")
    print("=" * 50)
    
    try:
        # Test invalid credentials first
        test_invalid_credentials()
        
        # Test valid login
        session_cookie = test_login()
        if not session_cookie:
            print("\n✗ Cannot continue tests without valid session")
            sys.exit(1)
        
        # Test verify with valid session
        test_verify(session_cookie)
        
        # Test logout
        test_logout(session_cookie)
        
        # Test verify after logout
        test_verify_after_logout(session_cookie)
        
        print("\n" + "=" * 50)
        print("All tests completed!")
        print("=" * 50)
        
    except requests.exceptions.ConnectionError:
        print("\n✗ Error: Cannot connect to server at", BASE_URL)
        print("Make sure the backend server is running (python backend/main.py)")
        sys.exit(1)
    except Exception as e:
        print(f"\n✗ Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
