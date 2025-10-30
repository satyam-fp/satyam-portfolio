"""Neural data endpoint for 3D scene."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging
from app.core.database import get_db
from app.models import Project, Blog
from app.schemas import NeuralDataResponse

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("", response_model=NeuralDataResponse)
def get_neural_data(db: Session = Depends(get_db)):
    """Get combined projects and blogs data for 3D neural network scene."""
    try:
        projects = db.query(Project).all()
        blogs = db.query(Blog).all()
        
        return NeuralDataResponse(projects=projects, blogs=blogs)
    except Exception as e:
        logger.error(f"Error fetching neural data: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch neural data")
