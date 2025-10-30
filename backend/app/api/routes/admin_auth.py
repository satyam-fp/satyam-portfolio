"""Admin authentication endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session
from datetime import datetime
import logging
from app.core.database import get_db
from app.core.security import verify_password, create_session_token, get_session_expiry
from app.models import AdminUser, AdminSession
from app.schemas import LoginRequest, LoginResponse
from app.api.dependencies import get_current_admin

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/login", response_model=LoginResponse)
async def admin_login(
    login_data: LoginRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    """Admin login endpoint. Verifies credentials, creates session, and sets HTTP-only cookie."""
    try:
        admin_user = db.query(AdminUser).filter(
            AdminUser.username == login_data.username
        ).first()
        
        if not admin_user or not verify_password(login_data.password, admin_user.password_hash):
            logger.warning(f"Failed login attempt for username: {login_data.username}")
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        session_token = create_session_token()
        expires_at = get_session_expiry()
        
        new_session = AdminSession(
            user_id=admin_user.id,
            session_token=session_token,
            expires_at=expires_at
        )
        db.add(new_session)
        
        admin_user.last_login = datetime.utcnow()
        db.commit()
        
        response.set_cookie(
            key="admin_session",
            value=session_token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=24 * 60 * 60
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
        raise HTTPException(status_code=500, detail="Login failed due to server error")

@router.post("/logout")
async def admin_logout(
    response: Response,
    request: Request,
    db: Session = Depends(get_db)
):
    """Admin logout endpoint. Deletes the session from database and clears the cookie."""
    try:
        session_token = request.cookies.get("admin_session")
        
        if session_token:
            session = db.query(AdminSession).filter(
                AdminSession.session_token == session_token
            ).first()
            
            if session:
                db.delete(session)
                db.commit()
                logger.info(f"Session deleted for user_id: {session.user_id}")
        
        response.delete_cookie(
            key="admin_session",
            httponly=True,
            secure=False,
            samesite="lax"
        )
        
        return {"success": True, "message": "Logout successful"}
        
    except Exception as e:
        logger.error(f"Error during logout: {e}")
        db.rollback()
        response.delete_cookie(key="admin_session")
        return {"success": True, "message": "Logout successful"}

@router.get("/verify")
async def verify_admin_session(admin_user: AdminUser = Depends(get_current_admin)):
    """Verify admin session endpoint. Checks if the current session is valid."""
    return {
        "valid": True,
        "user": {
            "id": admin_user.id,
            "username": admin_user.username,
            "email": admin_user.email
        }
    }
