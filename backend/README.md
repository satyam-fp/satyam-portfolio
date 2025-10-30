# Neural Space Portfolio - Backend API

A well-structured FastAPI backend for the Neural Space Portfolio application.

## Project Structure

```
backend/
├── app/
│   ├── api/                    # API routes
│   │   ├── routes/            # Individual route modules
│   │   │   ├── projects.py    # Public project endpoints
│   │   │   ├── blogs.py       # Public blog endpoints
│   │   │   ├── neural_data.py # Combined 3D data endpoint
│   │   │   ├── admin_auth.py  # Admin authentication
│   │   │   ├── admin_projects.py  # Admin project management
│   │   │   ├── admin_blogs.py     # Admin blog management
│   │   │   ├── admin_pages.py     # Admin static pages
│   │   │   └── admin_stats.py     # Admin dashboard stats
│   │   ├── dependencies.py    # Shared dependencies (auth, etc.)
│   │   └── __init__.py        # API router aggregation
│   ├── core/                  # Core configuration
│   │   ├── config.py          # Application settings
│   │   ├── database.py        # Database setup
│   │   └── security.py        # Authentication utilities
│   ├── models/                # SQLAlchemy models
│   │   ├── project.py
│   │   ├── blog.py
│   │   ├── admin.py
│   │   └── static_page.py
│   ├── schemas/               # Pydantic schemas
│   │   ├── project.py
│   │   ├── blog.py
│   │   ├── auth.py
│   │   ├── static_page.py
│   │   └── dashboard.py
│   └── main.py                # FastAPI application
├── scripts/                   # Utility scripts
│   ├── init_db.py            # Initialize database
│   ├── init_admin.py         # Create admin user
│   └── seed_database.py      # Seed sample data
├── tests/                     # Test suite
│   └── test_api.py           # Comprehensive API tests
├── run.py                     # Development server runner
├── requirements.txt           # Python dependencies
└── .env                       # Environment variables
```

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
venv/bin/pip install -r requirements.txt
```

### 3. Initialize Database

```bash
# Create tables
venv/bin/python scripts/init_db.py

# Or reset and recreate
venv/bin/python scripts/init_db.py --reset
```

### 4. Create Admin User

```bash
# Default credentials (admin/admin123)
venv/bin/python scripts/init_admin.py

# Custom credentials
venv/bin/python scripts/init_admin.py --username myuser --password mypass --email user@example.com
```

### 5. Seed Sample Data (Optional)

```bash
venv/bin/python scripts/seed_database.py
```

## Running the Server

### Development Mode

```bash
# Using run.py
venv/bin/python run.py

# Or directly with uvicorn
venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing

### Run All Tests

```bash
# Run tests
venv/bin/python tests/test_api.py

# Setup test data and run tests
venv/bin/python tests/test_api.py --setup
```

### Manual Testing

Use the interactive API docs at http://localhost:8000/docs to test endpoints manually.

## API Endpoints

### Public Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check
- `GET /api/projects` - List all projects
- `GET /api/projects/{slug}` - Get project by slug
- `GET /api/blogs` - List all blogs
- `GET /api/blogs/{slug}` - Get blog by slug
- `GET /api/neural-data` - Get combined data for 3D scene

### Admin Endpoints (Require Authentication)

#### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/verify` - Verify session

#### Projects
- `GET /api/admin/projects` - List all projects (admin view)
- `POST /api/admin/projects` - Create project
- `PUT /api/admin/projects/{id}` - Update project
- `DELETE /api/admin/projects/{id}` - Delete project

#### Blogs
- `GET /api/admin/blogs` - List all blogs (admin view)
- `POST /api/admin/blogs` - Create blog
- `PUT /api/admin/blogs/{id}` - Update blog
- `DELETE /api/admin/blogs/{id}` - Delete blog

#### Static Pages
- `GET /api/admin/pages` - List all pages
- `GET /api/admin/pages/{key}` - Get page by key
- `PUT /api/admin/pages/{key}` - Update page

#### Dashboard
- `GET /api/admin/stats` - Get dashboard statistics

## Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=sqlite:///./neural_space.db
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
SECRET_KEY=your-secret-key-change-in-production
LOG_LEVEL=INFO
```

## Database Migrations

The project uses Alembic for database migrations:

```bash
# Create a new migration
venv/bin/python -m alembic revision --autogenerate -m "description"

# Apply migrations
venv/bin/python -m alembic upgrade head

# Rollback migration
venv/bin/python -m alembic downgrade -1
```

## Development Tips

### Code Organization

- **Models**: Database models with SQLAlchemy ORM
- **Schemas**: Pydantic models for request/response validation
- **Routes**: API endpoints organized by resource
- **Dependencies**: Shared logic like authentication
- **Core**: Configuration and utilities

### Adding New Endpoints

1. Create schema in `app/schemas/`
2. Create model in `app/models/` (if needed)
3. Create route in `app/api/routes/`
4. Register route in `app/api/__init__.py`

### Authentication

Admin endpoints use cookie-based session authentication. The `get_current_admin` dependency handles authentication and returns the authenticated user.

## Troubleshooting

### Database Issues

```bash
# Reset database
venv/bin/python scripts/init_db.py --reset

# Check database connection
venv/bin/python -c "from app.core.database import check_database_connection; print(check_database_connection())"
```

### Import Errors

Make sure you're using the virtual environment:
```bash
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Port Already in Use

Change the port in `run.py` or use:
```bash
venv/bin/uvicorn app.main:app --reload --port 8001
```

## Production Deployment

1. Set `SECRET_KEY` to a secure random value
2. Use PostgreSQL instead of SQLite
3. Set `secure=True` for cookies (requires HTTPS)
4. Configure proper CORS origins
5. Use a production ASGI server (Gunicorn + Uvicorn)

```bash
venv/bin/gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```



cd backend

# Initialize database
venv/bin/python scripts/init_db.py --reset

# Create admin user (username: admin, password: admin123)
venv/bin/python scripts/init_admin.py

# Seed sample data
venv/bin/python scripts/seed_database.py

# Run tests
venv/bin/python tests/test_api.py

# Start server
venv/bin/python run.py
