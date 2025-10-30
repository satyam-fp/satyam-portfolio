"""API dependencies."""
from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session
from datetime import datetime
import logging
from app.core.database import get_db
from app.models import AdminUser, AdminSession

logger = logging.getLogger(__name__)

async def get_current_admin(
    request: Request,
    db: Session = Depends(get_db)
) -> AdminUser:
    """Verify admin session from cookie and return authenticated admin user."""
    session_token = request.cookies.get("admin_session")
    
    if not session_token:
        logger.warning("No session token found in cookies")
        raise HTTPException(status_code=401, detail="Not authenticated. Please log in.")
    
    try:
        session = db.query(AdminSession).filter(
            AdminSession.session_token == session_token
        ).first()
        
        if not session:
            logger.warning(f"Invalid session token: {session_token[:10]}...")
            raise HTTPException(status_code=401, detail="Invalid session. Please log in again.")
        
        if session.expires_at < datetime.utcnow():
            logger.info(f"Expired session for user_id: {session.user_id}")
            db.delete(session)
            db.commit()
            raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
        
        admin_user = db.query(AdminUser).filter(AdminUser.id == session.user_id).first()
        
        if not admin_user:
            logger.error(f"Admin user not found for session user_id: {session.user_id}")
            raise HTTPException(status_code=401, detail="User not found. Please log in again.")
        
        logger.info(f"Authenticated admin user: {admin_user.username}")
        return admin_user
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error verifying session: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed. Please log in again.")
