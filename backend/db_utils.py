#!/usr/bin/env python3
"""
Database utility functions for Neural Space Portfolio.
Provides convenient functions for database operations during development.
"""

import sys
import os
import argparse
import logging
from sqlalchemy.orm import Session

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, create_tables, drop_tables, check_database_connection
from models import Project, Blog
from seed_database import main as seed_main

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def reset_database():
    """Drop all tables and recreate them."""
    logger.info("Resetting database...")
    
    try:
        drop_tables()
        create_tables()
        logger.info("Database reset completed successfully")
    except Exception as e:
        logger.error(f"Database reset failed: {e}")
        raise

def show_stats():
    """Show database statistics."""
    if not check_database_connection():
        logger.error("Cannot connect to database")
        return
    
    db = SessionLocal()
    try:
        project_count = db.query(Project).count()
        blog_count = db.query(Blog).count()
        
        print(f"\n=== Database Statistics ===")
        print(f"Projects: {project_count}")
        print(f"Blogs: {blog_count}")
        print(f"Total items: {project_count + blog_count}")
        
        if project_count > 0:
            print(f"\n=== Sample Projects ===")
            projects = db.query(Project).limit(3).all()
            for project in projects:
                print(f"- {project.title} ({project.slug})")
                print(f"  Position: ({project.position_x:.1f}, {project.position_y:.1f}, {project.position_z:.1f})")
        
        if blog_count > 0:
            print(f"\n=== Sample Blogs ===")
            blogs = db.query(Blog).limit(3).all()
            for blog in blogs:
                print(f"- {blog.title} ({blog.slug})")
                print(f"  Position: ({blog.position_x:.1f}, {blog.position_y:.1f}, {blog.position_z:.1f})")
        
    except Exception as e:
        logger.error(f"Error getting database stats: {e}")
    finally:
        db.close()

def clear_data():
    """Clear all data from the database."""
    logger.info("Clearing all data from database...")
    
    db = SessionLocal()
    try:
        db.query(Blog).delete()
        db.query(Project).delete()
        db.commit()
        logger.info("All data cleared successfully")
    except Exception as e:
        logger.error(f"Error clearing data: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    """Main CLI function."""
    parser = argparse.ArgumentParser(description="Database utilities for Neural Space Portfolio")
    parser.add_argument(
        "action",
        choices=["reset", "seed", "stats", "clear"],
        help="Action to perform"
    )
    
    args = parser.parse_args()
    
    if args.action == "reset":
        reset_database()
    elif args.action == "seed":
        seed_main()
    elif args.action == "stats":
        show_stats()
    elif args.action == "clear":
        clear_data()

if __name__ == "__main__":
    main()