#!/usr/bin/env python3
"""
Database initialization script for Neural Space Portfolio.
This script creates the database tables and can be used for initial setup.
"""

import sys
import os
import logging
from database import create_tables, drop_tables, check_database_connection
from models import Project, Blog

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_database(reset=False):
    """Initialize the database with tables."""
    try:
        # Check database connection
        if not check_database_connection():
            logger.error("Cannot connect to database")
            return False
        
        # Drop tables if reset is requested
        if reset:
            logger.info("Dropping existing tables...")
            drop_tables()
        
        # Create tables
        logger.info("Creating database tables...")
        create_tables()
        
        logger.info("Database initialization completed successfully")
        return True
        
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        return False

def main():
    """Main function to handle command line arguments."""
    reset = "--reset" in sys.argv or "-r" in sys.argv
    
    if reset:
        logger.warning("Reset flag detected. This will drop all existing tables!")
        confirm = input("Are you sure you want to continue? (y/N): ")
        if confirm.lower() != 'y':
            logger.info("Operation cancelled")
            return
    
    success = init_database(reset=reset)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()