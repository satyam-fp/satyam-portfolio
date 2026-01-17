"""Seed database with sample data."""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import SessionLocal
from app.models import Project, Blog, StaticPage
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_projects(db):
    """Seed sample projects."""
    projects = [
        {
            "title": "Neural Network Visualizer",
            "slug": "neural-network-visualizer",
            "description": "Interactive 3D visualization of neural networks",
            "content": "# Neural Network Visualizer\n\nA comprehensive tool for visualizing neural networks in 3D space.",
            "tech_stack": ["Python", "TensorFlow", "Three.js"],
            "github_url": "https://github.com/example/neural-viz",
            "featured": True,
            "position_x": 2.0,
            "position_y": 1.5,
            "position_z": 0.0
        },
        {
            "title": "ML Pipeline Automation",
            "slug": "ml-pipeline-automation",
            "description": "Automated machine learning pipeline for data processing",
            "content": "# ML Pipeline Automation\n\nStreamline your ML workflows with automated pipelines.",
            "tech_stack": ["Python", "Scikit-learn", "Docker"],
            "github_url": "https://github.com/example/ml-pipeline",
            "featured": False,
            "position_x": -2.0,
            "position_y": 1.0,
            "position_z": 1.5
        }
    ]
    
    for proj_data in projects:
        existing = db.query(Project).filter(Project.slug == proj_data["slug"]).first()
        if not existing:
            project = Project(**proj_data)
            project.set_tech_stack_list(proj_data["tech_stack"])
            db.add(project)
    
    db.commit()
    logger.info(f"Seeded {len(projects)} projects")

def seed_blogs(db):
    """Seed sample blogs."""
    blogs = [
        {
            "title": "Getting Started with 3D Visualization",
            "slug": "getting-started-3d-visualization",
            "content": "# Getting Started\n\nLearn the basics of 3D visualization with Three.js.",
            "summary": "Introduction to 3D visualization techniques",
            "author": "Satyam",
            "tags": ["3D", "Three.js", "Tutorial"],
            "published": True,
            "published_at": datetime.utcnow(),
            "position_x": 0.0,
            "position_y": -1.5,
            "position_z": 2.0
        },
        {
            "title": "Machine Learning Best Practices",
            "slug": "ml-best-practices",
            "content": "# ML Best Practices\n\nEssential practices for ML projects.",
            "summary": "Best practices for machine learning projects",
            "author": "Satyam",
            "tags": ["ML", "Best Practices"],
            "published": True,
            "published_at": datetime.utcnow(),
            "position_x": 1.5,
            "position_y": -1.0,
            "position_z": -1.5
        }
    ]
    
    for blog_data in blogs:
        existing = db.query(Blog).filter(Blog.slug == blog_data["slug"]).first()
        if not existing:
            tags = blog_data.pop("tags")
            blog = Blog(**blog_data)
            blog.set_tags_list(tags)
            db.add(blog)
    
    db.commit()
    logger.info(f"Seeded {len(blogs)} blogs")

def seed_static_pages(db):
    """Seed static pages."""
    pages = [
        {
            "page_key": "home",
            "title": "Home Page",
            "content": {
                "hero": {
                    "title": "Neural Space",
                    "tagline": "Explore an interactive neural network representing my journey in Machine Learning and AI",
                    "cta_text": "Explore Projects"
                },
                "sections": [
                    {
                        "type": "intro",
                        "content": "I'm a German, a Machine Learning Engineer passionate about creating innovative solutions at the intersection of AI and interactive 3D experiences."
                    }
                ]
            }
        },
        {
            "page_key": "about",
            "title": "About Page",
            "content": {
                "hero": {
                    "title": "About Me",
                    "subtitle": "Machine Learning Engineer specializing in AI for 3D applications with 3 years of development experience"
                },
                "bio": {
                    "paragraphs": [
                        "I'm a passionate Machine Learning Engineer with a focus on the intersection of AI and 3D graphics. Over the past 3 years, I've been developing cutting-edge solutions that bridge the gap between traditional computer graphics and modern deep learning techniques.",
                        "My expertise spans from 3D computer vision and neural rendering to real-time graphics optimization. I enjoy tackling complex problems that require both theoretical understanding and practical implementation skills.",
                        "When I'm not coding, you can find me exploring the latest research papers, contributing to open-source projects, or experimenting with new 3D visualization techniques."
                    ]
                },
                "skills": {
                    "Machine Learning": ["PyTorch", "TensorFlow", "Computer Vision", "Deep Learning", "Neural Networks"],
                    "3D Graphics": ["Three.js", "WebGL", "OpenGL", "Point Clouds", "Neural Rendering"],
                    "Development": ["Python", "JavaScript", "TypeScript", "React", "Next.js", "CUDA"]
                },
                "stats": [
                    {"value": "3+", "label": "Years Experience", "sublabel": "ML Engineering"},
                    {"value": "15+", "label": "Projects Completed", "sublabel": "AI & 3D Applications"},
                    {"value": "5+", "label": "Research Papers", "sublabel": "Published & Cited"}
                ],
                "contact": {
                    "title": "Let's Connect",
                    "description": "Interested in collaborating on AI and 3D projects? Let's discuss how we can work together.",
                    "links": [
                        {"type": "github", "url": "https://github.com"},
                        {"type": "linkedin", "url": "https://linkedin.com"},
                        {"type": "email", "url": "mailto:contact@neuralspace.dev"}
                    ]
                }
            }
        }
    ]
    
    for page_data in pages:
        existing = db.query(StaticPage).filter(StaticPage.page_key == page_data["page_key"]).first()
        if not existing:
            page = StaticPage(
                page_key=page_data["page_key"],
                title=page_data["title"]
            )
            page.set_content_dict(page_data["content"])
            db.add(page)
    
    db.commit()
    logger.info(f"Seeded {len(pages)} static pages")

def seed_all():
    """Seed all data."""
    db = SessionLocal()
    try:
        seed_projects(db)
        seed_blogs(db)
        seed_static_pages(db)
        logger.info("Database seeding completed successfully")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_all()
