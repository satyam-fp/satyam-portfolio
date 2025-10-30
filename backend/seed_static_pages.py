"""
Seed script for default static pages (home and about).
This script creates default content for the home and about pages.
"""

from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import StaticPage, Base
from datetime import datetime, timezone
import json


def seed_home_page(db: Session):
    """
    Create or update the home page with default content.
    
    Args:
        db: Database session
    """
    # Check if home page already exists
    home_page = db.query(StaticPage).filter(StaticPage.page_key == "home").first()
    
    # Default home page content
    home_content = {
        "hero": {
            "title": "Welcome to Neural Space",
            "subtitle": "ML Engineer & 3D Enthusiast",
            "cta_text": "Explore Projects"
        },
        "sections": [
            {
                "type": "intro",
                "content": "I'm Satyam, a Machine Learning Engineer passionate about creating innovative solutions at the intersection of AI and interactive 3D experiences."
            }
        ]
    }
    
    if home_page:
        print("Home page already exists. Skipping creation.")
        return home_page
    
    # Create new home page
    home_page = StaticPage(
        page_key="home",
        title="Home Page",
        content=json.dumps(home_content),
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    
    db.add(home_page)
    db.commit()
    db.refresh(home_page)
    
    print(f"✓ Home page created successfully (ID: {home_page.id})")
    return home_page


def seed_about_page(db: Session):
    """
    Create or update the about page with default content.
    
    Args:
        db: Database session
    """
    # Check if about page already exists
    about_page = db.query(StaticPage).filter(StaticPage.page_key == "about").first()
    
    # Default about page content
    about_content = {
        "bio": "# About Me\n\nI'm a passionate Machine Learning Engineer with expertise in building intelligent systems and creating immersive 3D experiences. My work combines cutting-edge AI technologies with creative visualization to solve complex problems.\n\n## What I Do\n\nI specialize in developing machine learning models, creating interactive 3D visualizations, and building full-stack applications that bring data to life.",
        "skills": [
            "Python",
            "TensorFlow",
            "PyTorch",
            "Three.js",
            "React",
            "FastAPI",
            "Machine Learning",
            "Deep Learning",
            "Computer Vision",
            "3D Graphics"
        ],
        "experience": [
            {
                "title": "Machine Learning Engineer",
                "company": "Tech Company",
                "period": "2020 - Present",
                "description": "Developing and deploying machine learning models for production systems."
            }
        ],
        "education": [
            {
                "degree": "Bachelor's in Computer Science",
                "institution": "University Name",
                "year": "2020",
                "description": "Focused on Machine Learning and Artificial Intelligence"
            }
        ],
        "certifications": []
    }
    
    if about_page:
        print("About page already exists. Skipping creation.")
        return about_page
    
    # Create new about page
    about_page = StaticPage(
        page_key="about",
        title="About Page",
        content=json.dumps(about_content),
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    
    db.add(about_page)
    db.commit()
    db.refresh(about_page)
    
    print(f"✓ About page created successfully (ID: {about_page.id})")
    return about_page


def main():
    """Main function to seed static pages."""
    print("Seeding static pages...")
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Seed home page
        seed_home_page(db)
        
        # Seed about page
        seed_about_page(db)
        
        print("\n✓ Static pages seeding complete!")
        print("\nCreated pages:")
        print("  - Home (key: 'home')")
        print("  - About (key: 'about')")
        
    except Exception as e:
        print(f"\n✗ Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
