from fastapi import FastAPI, HTTPException, Depends, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os
import logging
from datetime import datetime
from database import create_tables, check_database_connection, get_db
from models import Project, Blog, AdminUser, AdminSession
from schemas import (
    ProjectResponse, BlogResponse, NeuralDataResponse, 
    LoginRequest, LoginResponse,
    ProjectCreateAdmin, ProjectUpdateAdmin, ProjectResponseAdmin
)
from typing import List
from auth import verify_password, create_session_token, get_session_expiry

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Neural Space Portfolio API",
    description="Backend API for Neural Space Portfolio",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",  # Next.js dev server
    "http://127.0.0.1:3000",
    "https://localhost:3000",
]

# Add production origins from environment variable
if production_origins := os.getenv("ALLOWED_ORIGINS"):
    origins.extend(production_origins.split(","))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    logger.info("Starting Neural Space Portfolio API...")
    
    # Check database connection
    if not check_database_connection():
        logger.error("Failed to connect to database")
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    # Create tables if they don't exist
    try:
        create_tables()
        logger.info("Database initialization completed")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise HTTPException(status_code=500, detail="Database initialization failed")

@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Neural Space Portfolio API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    db_status = check_database_connection()
    return {
        "status": "healthy" if db_status else "unhealthy",
        "database": "connected" if db_status else "disconnected"
    }

# Authentication Helper
async def get_current_admin(
    request: Request,
    db: Session = Depends(get_db)
) -> AdminUser:
    """
    Verify admin session from cookie and return authenticated admin user.
    
    Args:
        request: FastAPI request object to extract cookies
        db: Database session
        
    Returns:
        AdminUser object if session is valid
        
    Raises:
        HTTPException: 401 if session is invalid or expired
    """
    # Extract session token from cookie
    session_token = request.cookies.get("admin_session")
    
    if not session_token:
        logger.warning("No session token found in cookies")
        raise HTTPException(
            status_code=401,
            detail="Not authenticated. Please log in."
        )
    
    # Query session from database
    try:
        session = db.query(AdminSession).filter(
            AdminSession.session_token == session_token
        ).first()
        
        if not session:
            logger.warning(f"Invalid session token: {session_token[:10]}...")
            raise HTTPException(
                status_code=401,
                detail="Invalid session. Please log in again."
            )
        
        # Check if session has expired
        if session.expires_at < datetime.utcnow():
            logger.info(f"Expired session for user_id: {session.user_id}")
            # Delete expired session
            db.delete(session)
            db.commit()
            raise HTTPException(
                status_code=401,
                detail="Session expired. Please log in again."
            )
        
        # Get the admin user
        admin_user = db.query(AdminUser).filter(
            AdminUser.id == session.user_id
        ).first()
        
        if not admin_user:
            logger.error(f"Admin user not found for session user_id: {session.user_id}")
            raise HTTPException(
                status_code=401,
                detail="User not found. Please log in again."
            )
        
        logger.info(f"Authenticated admin user: {admin_user.username}")
        return admin_user
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error verifying session: {e}")
        raise HTTPException(
            status_code=401,
            detail="Authentication failed. Please log in again."
        )

# API Endpoints for Projects
@app.get("/api/projects", response_model=List[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    """Get all projects with 3D positioning data."""
    try:
        projects = db.query(Project).all()
        return projects
    except Exception as e:
        logger.error(f"Error fetching projects: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch projects")

@app.get("/api/projects/{slug}", response_model=ProjectResponse)
def get_project_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get individual project details by slug."""
    try:
        project = db.query(Project).filter(Project.slug == slug).first()
        if not project:
            raise HTTPException(status_code=404, detail=f"Project with slug '{slug}' not found")
        return project
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching project {slug}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch project")

# API Endpoints for Blogs
@app.get("/api/blogs", response_model=List[BlogResponse])
def get_blogs(db: Session = Depends(get_db)):
    """Get all blogs with 3D positioning data."""
    try:
        blogs = db.query(Blog).all()
        return blogs
    except Exception as e:
        logger.error(f"Error fetching blogs: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch blogs")

@app.get("/api/blogs/{slug}", response_model=BlogResponse)
def get_blog_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get individual blog details by slug."""
    try:
        blog = db.query(Blog).filter(Blog.slug == slug).first()
        if not blog:
            raise HTTPException(status_code=404, detail=f"Blog with slug '{slug}' not found")
        return blog
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching blog {slug}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch blog")

# Combined endpoint for 3D scene data
@app.get("/api/neural-data", response_model=NeuralDataResponse)
def get_neural_data(db: Session = Depends(get_db)):
    """Get combined projects and blogs data for 3D neural network scene."""
    try:
        projects = db.query(Project).all()
        blogs = db.query(Blog).all()
        
        return NeuralDataResponse(
            projects=projects,
            blogs=blogs
        )
    except Exception as e:
        logger.error(f"Error fetching neural data: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch neural data")


# Admin Authentication Endpoints
@app.post("/api/admin/login", response_model=LoginResponse)
async def admin_login(
    login_data: LoginRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    """
    Admin login endpoint.
    Verifies credentials, creates session, and sets HTTP-only cookie.
    
    Args:
        login_data: Username and password
        response: FastAPI response object to set cookies
        db: Database session
        
    Returns:
        LoginResponse with success status and user info
    """
    try:
        # Query admin user by username
        admin_user = db.query(AdminUser).filter(
            AdminUser.username == login_data.username
        ).first()
        
        # Check if user exists and password is correct
        if not admin_user or not verify_password(login_data.password, admin_user.password_hash):
            logger.warning(f"Failed login attempt for username: {login_data.username}")
            raise HTTPException(
                status_code=401,
                detail="Invalid username or password"
            )
        
        # Create new session token
        session_token = create_session_token()
        expires_at = get_session_expiry()
        
        # Create session in database
        new_session = AdminSession(
            user_id=admin_user.id,
            session_token=session_token,
            expires_at=expires_at
        )
        db.add(new_session)
        
        # Update last login time
        admin_user.last_login = datetime.utcnow()
        
        db.commit()
        
        # Set HTTP-only cookie with session token
        response.set_cookie(
            key="admin_session",
            value=session_token,
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite="lax",
            max_age=24 * 60 * 60  # 24 hours in seconds
        )
        
        logger.info(f"Successful login for user: {admin_user.username}")
        
        return LoginResponse(
            success=True,
            message="Login successful",
            user={
                "id": admin_user.id,
                "username": admin_user.username,
                "email": admin_user.email
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during login: {e}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Login failed due to server error"
        )


@app.post("/api/admin/logout")
async def admin_logout(
    response: Response,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Admin logout endpoint.
    Deletes the session from database and clears the cookie.
    
    Args:
        response: FastAPI response object to clear cookies
        request: FastAPI request object to extract cookies
        db: Database session
        
    Returns:
        Success message
    """
    try:
        # Extract session token from cookie
        session_token = request.cookies.get("admin_session")
        
        if session_token:
            # Delete session from database
            session = db.query(AdminSession).filter(
                AdminSession.session_token == session_token
            ).first()
            
            if session:
                db.delete(session)
                db.commit()
                logger.info(f"Session deleted for user_id: {session.user_id}")
        
        # Clear the cookie
        response.delete_cookie(
            key="admin_session",
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite="lax"
        )
        
        return {
            "success": True,
            "message": "Logout successful"
        }
        
    except Exception as e:
        logger.error(f"Error during logout: {e}")
        db.rollback()
        # Still clear the cookie even if database operation fails
        response.delete_cookie(key="admin_session")
        return {
            "success": True,
            "message": "Logout successful"
        }


@app.get("/api/admin/verify")
async def verify_admin_session(
    admin_user: AdminUser = Depends(get_current_admin)
):
    """
    Verify admin session endpoint.
    Checks if the current session is valid.
    
    Args:
        admin_user: Authenticated admin user from dependency
        
    Returns:
        User info if session is valid
    """
    return {
        "valid": True,
        "user": {
            "id": admin_user.id,
            "username": admin_user.username,
            "email": admin_user.email
        }
    }


# Admin Project Endpoints
@app.get("/api/admin/projects", response_model=List[ProjectResponseAdmin])
async def get_admin_projects(
    admin_user: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Get all projects for admin panel (includes all fields).
    Requires authentication.
    
    Args:
        admin_user: Authenticated admin user from dependency
        db: Database session
        
    Returns:
        List of all projects with admin fields
    """
    try:
        projects = db.query(Project).all()
        logger.info(f"Admin {admin_user.username} fetched {len(projects)} projects")
        return projects
    except Exception as e:
        logger.error(f"Error fetching admin projects: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch projects")


@app.post("/api/admin/projects", response_model=ProjectResponseAdmin, status_code=201)
async def create_admin_project(
    project_data: ProjectCreateAdmin,
    admin_user: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Create a new project.
    Requires authentication.
    
    Args:
        project_data: Project creation data
        admin_user: Authenticated admin user from dependency
        db: Database session
        
    Returns:
        Created project
    """
    try:
        # Check if slug already exists
        existing_project = db.query(Project).filter(Project.slug == project_data.slug).first()
        if existing_project:
            raise HTTPException(
                status_code=409,
                detail=f"Project with slug '{project_data.slug}' already exists"
            )
        
        # Create new project
        new_project = Project(
            title=project_data.title,
            slug=project_data.slug,
            description=project_data.description,
            content=project_data.content,
            github_url=project_data.github_url,
            live_demo=project_data.live_demo,
            image_url=project_data.image_url,
            featured=project_data.featured,
            position_x=project_data.position_x,
            position_y=project_data.position_y,
            position_z=project_data.position_z
        )
        
        # Set tech_stack as JSON
        new_project.set_tech_stack_list(project_data.tech_stack)
        
        db.add(new_project)
        db.commit()
        db.refresh(new_project)
        
        logger.info(f"Admin {admin_user.username} created project: {new_project.slug}")
        return new_project
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating project: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create project")


@app.put("/api/admin/projects/{project_id}", response_model=ProjectResponseAdmin)
async def update_admin_project(
    project_id: int,
    project_data: ProjectUpdateAdmin,
    admin_user: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Update an existing project.
    Requires authentication.
    
    Args:
        project_id: ID of the project to update
        project_data: Project update data (partial updates allowed)
        admin_user: Authenticated admin user from dependency
        db: Database session
        
    Returns:
        Updated project
    """
    try:
        # Get existing project
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(
                status_code=404,
                detail=f"Project with ID {project_id} not found"
            )
        
        # Check if slug is being changed and if it conflicts
        if project_data.slug and project_data.slug != project.slug:
            existing_project = db.query(Project).filter(Project.slug == project_data.slug).first()
            if existing_project:
                raise HTTPException(
                    status_code=409,
                    detail=f"Project with slug '{project_data.slug}' already exists"
                )
        
        # Update fields if provided
        update_data = project_data.dict(exclude_unset=True)
        
        # Handle tech_stack separately
        if 'tech_stack' in update_data:
            project.set_tech_stack_list(update_data.pop('tech_stack'))
        
        # Update other fields
        for field, value in update_data.items():
            setattr(project, field, value)
        
        db.commit()
        db.refresh(project)
        
        logger.info(f"Admin {admin_user.username} updated project: {project.slug}")
        return project
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating project {project_id}: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update project")


@app.delete("/api/admin/projects/{project_id}")
async def delete_admin_project(
    project_id: int,
    admin_user: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Delete a project.
    Requires authentication.
    
    Args:
        project_id: ID of the project to delete
        admin_user: Authenticated admin user from dependency
        db: Database session
        
    Returns:
        Success message
    """
    try:
        # Get existing project
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(
                status_code=404,
                detail=f"Project with ID {project_id} not found"
            )
        
        project_slug = project.slug
        db.delete(project)
        db.commit()
        
        logger.info(f"Admin {admin_user.username} deleted project: {project_slug}")
        return {
            "success": True,
            "message": f"Project '{project_slug}' deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting project {project_id}: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete project")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)