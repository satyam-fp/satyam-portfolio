#!/usr/bin/env python3
"""
Database seeding script for Neural Space Portfolio.
Populates the database with sample projects and blog posts for development and testing.
"""

import sys
import os
import json
import logging
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

# Add the backend directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, create_tables, check_database_connection
from models import Project, Blog
from seed_data import create_sample_data

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def clear_existing_data(db: Session):
    """Clear existing data from the database."""
    try:
        # Delete all existing records
        db.query(Blog).delete()
        db.query(Project).delete()
        db.commit()
        logger.info("Cleared existing data from database")
    except Exception as e:
        logger.error(f"Error clearing existing data: {e}")
        db.rollback()
        raise

def seed_projects(db: Session, projects_data: list):
    """Seed the database with project data."""
    logger.info(f"Seeding {len(projects_data)} projects...")
    
    created_count = 0
    for project_data in projects_data:
        try:
            # Convert tech_stack list to JSON string for storage
            tech_stack_json = json.dumps(project_data["tech_stack"])
            
            project = Project(
                title=project_data["title"],
                slug=project_data["slug"],
                description=project_data["description"],
                tech_stack=tech_stack_json,
                github_url=project_data.get("github_url"),
                live_demo=project_data.get("live_demo"),
                image_url=project_data.get("image_url"),
                position_x=project_data["position_x"],
                position_y=project_data["position_y"],
                position_z=project_data["position_z"]
            )
            
            db.add(project)
            created_count += 1
            logger.info(f"Added project: {project.title}")
            
        except Exception as e:
            logger.error(f"Error adding project {project_data['title']}: {e}")
            continue
    
    try:
        db.commit()
        logger.info(f"Successfully seeded {created_count} projects")
    except IntegrityError as e:
        logger.error(f"Database integrity error while seeding projects: {e}")
        db.rollback()
        raise
    except Exception as e:
        logger.error(f"Unexpected error while seeding projects: {e}")
        db.rollback()
        raise

def seed_blogs(db: Session, blogs_data: list):
    """Seed the database with blog data."""
    logger.info(f"Seeding {len(blogs_data)} blogs...")
    
    created_count = 0
    for blog_data in blogs_data:
        try:
            blog = Blog(
                title=blog_data["title"],
                slug=blog_data["slug"],
                content=blog_data["content"],
                summary=blog_data.get("summary"),
                position_x=blog_data["position_x"],
                position_y=blog_data["position_y"],
                position_z=blog_data["position_z"]
            )
            
            db.add(blog)
            created_count += 1
            logger.info(f"Added blog: {blog.title}")
            
        except Exception as e:
            logger.error(f"Error adding blog {blog_data['title']}: {e}")
            continue
    
    try:
        db.commit()
        logger.info(f"Successfully seeded {created_count} blogs")
    except IntegrityError as e:
        logger.error(f"Database integrity error while seeding blogs: {e}")
        db.rollback()
        raise
    except Exception as e:
        logger.error(f"Unexpected error while seeding blogs: {e}")
        db.rollback()
        raise

def verify_seeded_data(db: Session):
    """Verify that the data was seeded correctly."""
    try:
        project_count = db.query(Project).count()
        blog_count = db.query(Blog).count()
        
        logger.info(f"Verification: {project_count} projects and {blog_count} blogs in database")
        
        # Check a sample project
        sample_project = db.query(Project).first()
        if sample_project:
            logger.info(f"Sample project: {sample_project.title} at position ({sample_project.position_x:.2f}, {sample_project.position_y:.2f}, {sample_project.position_z:.2f})")
            
            # Verify tech_stack parsing
            tech_stack = sample_project.get_tech_stack_list()
            logger.info(f"Tech stack: {tech_stack}")
        
        # Check a sample blog
        sample_blog = db.query(Blog).first()
        if sample_blog:
            logger.info(f"Sample blog: {sample_blog.title} at position ({sample_blog.position_x:.2f}, {sample_blog.position_y:.2f}, {sample_blog.position_z:.2f})")
            logger.info(f"Content length: {len(sample_blog.content)} characters")
        
        return project_count, blog_count
        
    except Exception as e:
        logger.error(f"Error during verification: {e}")
        raise

def main():
    """Main seeding function."""
    logger.info("Starting database seeding process...")
    
    # Check database connection
    if not check_database_connection():
        logger.error("Cannot connect to database. Exiting.")
        sys.exit(1)
    
    # Create tables if they don't exist
    try:
        create_tables()
        logger.info("Database tables ready")
    except Exception as e:
        logger.error(f"Failed to create database tables: {e}")
        sys.exit(1)
    
    # Generate sample data
    try:
        projects_data, blogs_data = create_sample_data()
        logger.info(f"Generated {len(projects_data)} projects and {len(blogs_data)} blogs")
    except Exception as e:
        logger.error(f"Failed to generate sample data: {e}")
        sys.exit(1)
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Clear existing data (optional - comment out if you want to keep existing data)
        clear_existing_data(db)
        
        # Seed projects
        seed_projects(db, projects_data)
        
        # Seed blogs
        seed_blogs(db, blogs_data)
        
        # Verify the seeded data
        project_count, blog_count = verify_seeded_data(db)
        
        logger.info(f"Database seeding completed successfully!")
        logger.info(f"Total: {project_count} projects, {blog_count} blogs")
        
    except Exception as e:
        logger.error(f"Database seeding failed: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    main()