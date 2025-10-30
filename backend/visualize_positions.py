#!/usr/bin/env python3
"""
Visualize 3D positions of projects and blogs in the neural network layout.
This script shows the spatial distribution of content items.
"""

import sys
import os

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, check_database_connection
from models import Project, Blog

# Optional matplotlib import
try:
    import matplotlib.pyplot as plt
    from mpl_toolkits.mplot3d import Axes3D
    MATPLOTLIB_AVAILABLE = True
except ImportError:
    MATPLOTLIB_AVAILABLE = False

def visualize_3d_positions():
    """Create a 3D visualization of project and blog positions."""
    
    if not MATPLOTLIB_AVAILABLE:
        print("matplotlib not available. Install with: pip install matplotlib")
        return
    
    if not check_database_connection():
        print("Cannot connect to database")
        return
    
    db = SessionLocal()
    try:
        # Get all projects and blogs
        projects = db.query(Project).all()
        blogs = db.query(Blog).all()
        
        if not projects and not blogs:
            print("No data found in database. Run 'python seed_database.py' first.")
            return
        
        # Create 3D plot
        fig = plt.figure(figsize=(12, 8))
        ax = fig.add_subplot(111, projection='3d')
        
        # Plot projects
        if projects:
            project_x = [p.position_x for p in projects]
            project_y = [p.position_y for p in projects]
            project_z = [p.position_z for p in projects]
            
            ax.scatter(project_x, project_y, project_z, 
                      c='blue', marker='o', s=100, alpha=0.7, label='Projects')
            
            # Add project labels
            for p in projects:
                ax.text(p.position_x, p.position_y, p.position_z, 
                       f'  {p.title[:20]}...', fontsize=8)
        
        # Plot blogs
        if blogs:
            blog_x = [b.position_x for b in blogs]
            blog_y = [b.position_y for b in blogs]
            blog_z = [b.position_z for b in blogs]
            
            ax.scatter(blog_x, blog_y, blog_z, 
                      c='red', marker='^', s=100, alpha=0.7, label='Blogs')
            
            # Add blog labels
            for b in blogs:
                ax.text(b.position_x, b.position_y, b.position_z, 
                       f'  {b.title[:20]}...', fontsize=8)
        
        # Customize the plot
        ax.set_xlabel('X Position')
        ax.set_ylabel('Y Position')
        ax.set_zlabel('Z Position')
        ax.set_title('Neural Space Portfolio - 3D Content Layout')
        ax.legend()
        
        # Set equal aspect ratio
        max_range = max(
            max([abs(p.position_x) for p in projects] + [abs(b.position_x) for b in blogs]),
            max([abs(p.position_y) for p in projects] + [abs(b.position_y) for b in blogs]),
            max([abs(p.position_z) for p in projects] + [abs(b.position_z) for b in blogs])
        )
        
        ax.set_xlim([-max_range, max_range])
        ax.set_ylim([-max_range, max_range])
        ax.set_zlim([-max_range, max_range])
        
        # Show statistics
        print(f"\n=== 3D Layout Statistics ===")
        print(f"Projects: {len(projects)}")
        print(f"Blogs: {len(blogs)}")
        print(f"Total items: {len(projects) + len(blogs)}")
        print(f"Coordinate range: ±{max_range:.1f}")
        
        plt.tight_layout()
        plt.show()
        
    except Exception as e:
        print(f"Error creating visualization: {e}")
    finally:
        db.close()

def print_positions():
    """Print all positions in a table format."""
    
    if not check_database_connection():
        print("Cannot connect to database")
        return
    
    db = SessionLocal()
    try:
        projects = db.query(Project).all()
        blogs = db.query(Blog).all()
        
        print("\n=== PROJECT POSITIONS ===")
        print(f"{'Title':<30} {'Slug':<25} {'Position (X, Y, Z)':<20}")
        print("-" * 75)
        
        for p in projects:
            pos_str = f"({p.position_x:.1f}, {p.position_y:.1f}, {p.position_z:.1f})"
            print(f"{p.title[:29]:<30} {p.slug[:24]:<25} {pos_str:<20}")
        
        print("\n=== BLOG POSITIONS ===")
        print(f"{'Title':<30} {'Slug':<25} {'Position (X, Y, Z)':<20}")
        print("-" * 75)
        
        for b in blogs:
            pos_str = f"({b.position_x:.1f}, {b.position_y:.1f}, {b.position_z:.1f})"
            print(f"{b.title[:29]:<30} {b.slug[:24]:<25} {pos_str:<20}")
        
    except Exception as e:
        print(f"Error printing positions: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Visualize 3D positions of portfolio content")
    parser.add_argument(
        "--mode", 
        choices=["plot", "table"], 
        default="table",
        help="Visualization mode: 'plot' for 3D plot, 'table' for text table"
    )
    
    args = parser.parse_args()
    
    if args.mode == "plot":
        try:
            visualize_3d_positions()
        except ImportError:
            print("matplotlib not available. Install with: pip install matplotlib")
            print("Falling back to table mode...")
            print_positions()
    else:
        print_positions()