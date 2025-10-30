#!/usr/bin/env python3
"""
Test script to add sample data and test API endpoints.
"""

import sys
import os

# Change to backend directory to ensure correct database path
backend_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(backend_dir)
sys.path.append(backend_dir)

from database import SessionLocal
from models import Project, Blog
import json

def add_sample_data():
    """Add sample projects and blogs to test the API endpoints."""
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(Project).delete()
        db.query(Blog).delete()
        
        # Sample projects
        projects = [
            Project(
                title="3D Object Detection with YOLO",
                slug="3d-object-detection-yolo",
                description="Advanced 3D object detection system using YOLO architecture for autonomous vehicles",
                tech_stack=json.dumps(["Python", "PyTorch", "OpenCV", "CUDA"]),
                github_url="https://github.com/example/3d-yolo",
                live_demo="https://demo.example.com/3d-yolo",
                image_url="/images/3d-yolo.jpg",
                position_x=2.5,
                position_y=1.0,
                position_z=0.0
            ),
            Project(
                title="Neural Style Transfer for 3D Models",
                slug="neural-style-transfer-3d",
                description="Real-time neural style transfer applied to 3D meshes and point clouds",
                tech_stack=json.dumps(["Python", "TensorFlow", "Blender", "Three.js"]),
                github_url="https://github.com/example/3d-style-transfer",
                image_url="/images/style-transfer.jpg",
                position_x=-1.5,
                position_y=2.0,
                position_z=1.5
            ),
            Project(
                title="AI-Powered 3D Scene Reconstruction",
                slug="ai-3d-scene-reconstruction",
                description="Multi-view stereo reconstruction enhanced with deep learning for improved accuracy",
                tech_stack=json.dumps(["Python", "PyTorch", "Open3D", "COLMAP"]),
                github_url="https://github.com/example/ai-reconstruction",
                live_demo="https://demo.example.com/reconstruction",
                position_x=0.0,
                position_y=-1.5,
                position_z=2.0
            )
        ]
        
        # Sample blogs
        blogs = [
            Blog(
                title="Getting Started with 3D Deep Learning",
                slug="getting-started-3d-deep-learning",
                content="# Getting Started with 3D Deep Learning\n\nThis post covers the fundamentals of applying deep learning to 3D data...",
                summary="An introduction to 3D deep learning concepts and applications",
                position_x=-2.0,
                position_y=0.5,
                position_z=-1.0
            ),
            Blog(
                title="Point Cloud Processing with Neural Networks",
                slug="point-cloud-processing-neural-networks",
                content="# Point Cloud Processing with Neural Networks\n\nPoint clouds are a fundamental 3D data representation...",
                summary="Exploring neural network architectures for point cloud data",
                position_x=1.0,
                position_y=-2.0,
                position_z=0.5
            ),
            Blog(
                title="The Future of AI in 3D Graphics",
                slug="future-ai-3d-graphics",
                content="# The Future of AI in 3D Graphics\n\nArtificial Intelligence is revolutionizing 3D graphics...",
                summary="Predictions and trends for AI applications in 3D graphics",
                position_x=0.5,
                position_y=1.5,
                position_z=-2.0
            )
        ]
        
        # Add to database
        for project in projects:
            db.add(project)
        
        for blog in blogs:
            db.add(blog)
        
        db.commit()
        print("Sample data added successfully!")
        
        # Test queries
        print(f"Projects in database: {db.query(Project).count()}")
        print(f"Blogs in database: {db.query(Blog).count()}")
        
    except Exception as e:
        print(f"Error adding sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_sample_data()