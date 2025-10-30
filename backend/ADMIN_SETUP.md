# Admin Panel Setup Guide

This guide explains how to set up the admin panel for the Neural Space Portfolio application.

## Prerequisites

- Python 3.9 or higher
- Virtual environment activated
- All dependencies installed from `requirements.txt`

## Quick Setup

Run the combined setup script to perform all setup steps at once:

```bash
python setup_admin_panel.py
```

This script will:
1. Run the Alembic database migration
2. Create the default admin user
3. Seed the default static pages

## Manual Setup

If you prefer to run each step manually:

### 1. Run Database Migration

```bash
alembic upgrade head
```

This creates the following tables:
- `admin_users` - Admin user accounts
- `admin_sessions` - Session tracking for authentication
- `static_pages` - Content for home and about pages

It also adds new columns to existing tables:
- `projects` table: `content`, `featured`, `updated_at`
- `blogs` table: `author`, `tags`, `image_url`, `published`, `published_at`, `updated_at`

### 2. Initialize Admin User

```bash
python init_admin.py
```

This creates the default admin user:
- **Username**: satyam
- **Password**: satyam@123

⚠️ **IMPORTANT**: Change the default password in production!

### 3. Seed Static Pages

```bash
python seed_static_pages.py
```

This creates default content for:
- Home page (key: 'home')
- About page (key: 'about')

## Verification

To verify the setup was successful:

```python
from database import SessionLocal
from models import AdminUser, StaticPage

db = SessionLocal()

# Check admin user
admin = db.query(AdminUser).first()
print(f"Admin username: {admin.username}")

# Check static pages
pages = db.query(StaticPage).all()
print(f"Pages: {[p.page_key for p in pages]}")

db.close()
```

## Migration Details

### Migration File

- **File**: `alembic/versions/183dd502790b_add_admin_tables_and_update_models.py`
- **Revision ID**: 183dd502790b
- **Previous Revision**: c85ddfee0ca4

### New Tables

#### admin_users
- `id` (INTEGER, PRIMARY KEY)
- `username` (VARCHAR(50), UNIQUE, NOT NULL)
- `password_hash` (VARCHAR(255), NOT NULL)
- `email` (VARCHAR(100), NULLABLE)
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- `last_login` (DATETIME, NULLABLE)

#### admin_sessions
- `id` (INTEGER, PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY to admin_users.id)
- `session_token` (VARCHAR(255), UNIQUE, NOT NULL)
- `expires_at` (DATETIME, NOT NULL)
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

#### static_pages
- `id` (INTEGER, PRIMARY KEY)
- `page_key` (VARCHAR(50), UNIQUE, NOT NULL)
- `title` (VARCHAR(200), NOT NULL)
- `content` (TEXT, NOT NULL) - JSON format
- `updated_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

### Updated Tables

#### projects
- Added `content` (TEXT, NULLABLE) - Detailed markdown content
- Added `featured` (BOOLEAN, DEFAULT 0) - Featured project flag
- Added `updated_at` (DATETIME) - Last update timestamp

#### blogs
- Added `author` (VARCHAR, DEFAULT 'Satyam') - Author name
- Added `tags` (TEXT, NULLABLE) - JSON array of tags
- Added `image_url` (VARCHAR, NULLABLE) - Featured image URL
- Added `published` (BOOLEAN, DEFAULT 1) - Published status
- Added `published_at` (DATETIME, NULLABLE) - Publication date
- Added `updated_at` (DATETIME) - Last update timestamp

## Troubleshooting

### Migration Already Applied

If you see "table already exists" errors, the migration has already been applied. You can check the current migration status:

```bash
alembic current
```

### Admin User Already Exists

If the admin user already exists, the initialization script will skip creation and display a message. This is safe and expected behavior.

### Static Pages Already Exist

If static pages already exist, the seeding script will skip creation. This is safe and expected behavior.

### bcrypt Compatibility Issues

If you encounter bcrypt-related errors, ensure you have bcrypt version 4.x installed:

```bash
pip install 'bcrypt<5.0'
```

The requirements.txt file has been updated to pin bcrypt to version 4.x for compatibility with passlib 1.7.4.

## Security Notes

1. **Change Default Password**: The default admin password (`satyam@123`) should be changed immediately in production.
2. **Session Security**: Sessions expire after 24 hours by default (configurable in `auth.py`).
3. **Password Hashing**: Passwords are hashed using bcrypt with 12 rounds.
4. **Session Tokens**: Session tokens are generated using cryptographically secure random values.

## Next Steps

After setup is complete:

1. Start the backend server:
   ```bash
   python run_dev.py
   ```

2. Access the admin panel at: `http://localhost:8000/admin`

3. Log in with the default credentials:
   - Username: satyam
   - Password: satyam@123

4. **Change the default password** through the admin interface (once implemented).
