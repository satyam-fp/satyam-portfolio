"""Create admin user."""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models import AdminUser
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_admin_user(username="admin", password="admin123", email="admin@example.com"):
    """Create an admin user."""
    db = SessionLocal()
    try:
        existing_user = db.query(AdminUser).filter(AdminUser.username == username).first()
        if existing_user:
            logger.warning(f"Admin user '{username}' already exists")
            return
        
        admin_user = AdminUser(
            username=username,
            password_hash=hash_password(password),
            email=email
        )
        db.add(admin_user)
        db.commit()
        logger.info(f"Admin user '{username}' created successfully")
        logger.info(f"Username: {username}")
        logger.info(f"Password: {password}")
        
    except Exception as e:
        logger.error(f"Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Create admin user")
    parser.add_argument("--username", default="admin", help="Admin username")
    parser.add_argument("--password", default="admin123", help="Admin password")
    parser.add_argument("--email", default="admin@example.com", help="Admin email")
    args = parser.parse_args()
    
    create_admin_user(args.username, args.password, args.email)
