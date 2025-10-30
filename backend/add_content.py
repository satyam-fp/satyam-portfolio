"""
Script to add your own projects and blog posts to the database.
"""

from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Project, Blog
import json

def add_project(db: Session, title, slug, description, tech_stack, 
                github_url=None, live_demo=None, image_url=None,
                position_x=0.0, position_y=0.0, position_z=0.0):
    """Add a new project to the database."""
    project = Project(
        title=title,
        slug=slug,
        description=description,
        tech_stack=json.dumps(tech_stack),
        github_url=github_url,
        live_demo=live_demo,
        image_url=image_url,
        position_x=position_x,
        position_y=position_y,
        position_z=position_z
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    print(f"✓ Added project: {title}")
    return project

def add_blog(db: Session, title, slug, content, summary=None,
             position_x=0.0, position_y=0.0, position_z=0.0):
    """Add a new blog post to the database."""
    blog = Blog(
        title=title,
        slug=slug,
        content=content,
        summary=summary,
        position_x=position_x,
        position_y=position_y,
        position_z=position_z
    )
    db.add(blog)
    db.commit()
    db.refresh(blog)
    print(f"✓ Added blog: {title}")
    return blog

if __name__ == "__main__":
    db = SessionLocal()
    
    try:
        # Example: Add your own project
        add_project(
            db,
            title="My Awesome Project",
            slug="my-awesome-project",
            description="This is my project that does amazing things...",
            tech_stack=["Python", "FastAPI", "React", "Three.js"],
            github_url="https://github.com/yourusername/project",
            live_demo="https://myproject.com",
            image_url="/images/my-project.jpg",
            position_x=5.0,
            position_y=3.0,
            position_z=-2.0
        )
        
        # Example: Add your own blog post
        add_blog(
            db,
            title="My First Blog Post",
            slug="my-first-blog-post",
            summary="A brief introduction to my blog...",
            content="""# My First Blog Post

This is the full content of my blog post in **Markdown** format.

## Section 1

You can include:
- Code blocks
- Images
- Links
- And more!

```python
def hello():
    print("Hello, World!")
```
""",
            position_x=-3.0,
            position_y=2.0,
            position_z=4.0
        )
        
        print("\n✓ All content added successfully!")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        db.rollback()
    finally:
        db.close()
