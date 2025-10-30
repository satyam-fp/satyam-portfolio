"""Initialize database tables."""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import create_tables, engine, Base
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_database(reset=False):
    """Initialize database tables."""
    if reset:
        logger.info("Dropping all tables...")
        Base.metadata.drop_all(bind=engine)
        logger.info("All tables dropped")
    
    logger.info("Creating tables...")
    create_tables()
    logger.info("Database initialized successfully")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Initialize database")
    parser.add_argument("--reset", action="store_true", help="Drop all tables before creating")
    args = parser.parse_args()
    
    init_database(reset=args.reset)
