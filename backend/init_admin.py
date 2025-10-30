"""
Initialization script to set up the admin user.
This script creates the default admin user with username 'satyam' and password 'satyam@123'.
"""

from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import AdminUser, Base
from auth import hash_password
from datetime import datetime, timezone


def init_admin_user(db: Session):
    """
    Create the default admin user if it doesn't exist.
    
    Args:
        db: Database session
    """
    # Check if admin user already exists
    existing_admin = db.query(AdminUser).filter(AdminUser.username == "satyam").first()
    
    if existing_admin:
        print("Admin user 'satyam' already exists. Skipping creation.")
        return existing_admin
    
    # Create new admin user
    admin_user = AdminUser(
        username="satyam",
        password_hash=hash_password("satyam@123"),
        email=None,
        created_at=datetime.now(timezone.utc),
        last_login=None
    )
    
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    
    print(f"✓ Admin user 'satyam' created successfully (ID: {admin_user.id})")
    return admin_user


def main():
    """Main function to initialize admin user."""
    print("Initializing admin user...")
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Initialize admin user
        init_admin_user(db)
        print("\n✓ Admin initialization complete!")
        print("\nAdmin credentials:")
        print("  Username: satyam")
        print("  Password: satyam@123")
        print("\nIMPORTANT: Change the default password in production!")
        
    except Exception as e:
        print(f"\n✗ Error during initialization: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
