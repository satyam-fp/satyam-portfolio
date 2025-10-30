"""
Combined setup script for admin panel.
This script runs the database migration, creates the admin user, and seeds static pages.
"""

import subprocess
import sys
from pathlib import Path


def run_migration():
    """Run Alembic migration to create admin tables."""
    print("=" * 60)
    print("Step 1: Running database migration...")
    print("=" * 60)
    
    try:
        # Run alembic upgrade
        result = subprocess.run(
            ["./venv/bin/alembic", "upgrade", "head"],
            cwd=Path(__file__).parent,
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            print(f"✗ Migration failed: {result.stderr}")
            return False
        
        print(result.stdout)
        print("✓ Migration completed successfully\n")
        return True
        
    except Exception as e:
        print(f"✗ Error running migration: {e}")
        return False


def run_init_admin():
    """Run admin user initialization script."""
    print("=" * 60)
    print("Step 2: Initializing admin user...")
    print("=" * 60)
    
    try:
        # Import and run init_admin
        from init_admin import main as init_admin_main
        init_admin_main()
        print()
        return True
        
    except Exception as e:
        print(f"✗ Error initializing admin user: {e}")
        return False


def run_seed_pages():
    """Run static pages seeding script."""
    print("=" * 60)
    print("Step 3: Seeding static pages...")
    print("=" * 60)
    
    try:
        # Import and run seed_static_pages
        from seed_static_pages import main as seed_pages_main
        seed_pages_main()
        print()
        return True
        
    except Exception as e:
        print(f"✗ Error seeding static pages: {e}")
        return False


def main():
    """Main setup function."""
    print("\n" + "=" * 60)
    print("ADMIN PANEL SETUP")
    print("=" * 60)
    print()
    
    # Step 1: Run migration
    if not run_migration():
        print("\n✗ Setup failed at migration step")
        sys.exit(1)
    
    # Step 2: Initialize admin user
    if not run_init_admin():
        print("\n✗ Setup failed at admin user initialization step")
        sys.exit(1)
    
    # Step 3: Seed static pages
    if not run_seed_pages():
        print("\n✗ Setup failed at static pages seeding step")
        sys.exit(1)
    
    # Success message
    print("=" * 60)
    print("✓ ADMIN PANEL SETUP COMPLETE!")
    print("=" * 60)
    print()
    print("Your admin panel is now ready to use.")
    print()
    print("Admin Login Credentials:")
    print("  Username: satyam")
    print("  Password: satyam@123")
    print()
    print("⚠️  IMPORTANT: Change the default password in production!")
    print()
    print("Next steps:")
    print("  1. Start the backend server: python run_dev.py")
    print("  2. Access the admin panel at: http://localhost:8000/admin")
    print()


if __name__ == "__main__":
    main()
