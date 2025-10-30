# Neural Space Portfolio - Backend API

FastAPI backend for the Neural Space Portfolio website, providing RESTful endpoints for managing projects and blog posts with 3D positioning data.

## Features

- **FastAPI Framework**: High-performance Python web framework with automatic OpenAPI documentation
- **SQLAlchemy ORM**: Database abstraction layer with SQLite for simplicity
- **Pydantic Validation**: Request/response validation and serialization
- **Alembic Migrations**: Database schema versioning and migration management
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **3D Positioning**: Store and manage 3D coordinates for neural network visualization

## Project Structure

```
backend/
├── alembic/                 # Database migration files
│   ├── versions/           # Migration scripts
│   ├── env.py             # Alembic environment configuration
│   └── script.py.mako     # Migration template
├── alembic.ini             # Alembic configuration
├── database.py             # Database connection and utilities
├── init_db.py             # Database initialization script
├── main.py                # FastAPI application entry point
├── models.py              # SQLAlchemy database models
├── requirements.txt       # Python dependencies
├── run_dev.py            # Development server runner
├── schemas.py            # Pydantic request/response schemas
└── test_setup.py         # Setup validation tests
```

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Initialize Database

```bash
python init_db.py
```

### 3. Run Development Server

```bash
python run_dev.py
```

The API will be available at:
- **API Base**: http://localhost:8000
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Database Models

### Project Model
- `id`: Primary key
- `title`: Project title
- `slug`: URL-friendly identifier (unique)
- `description`: Project description
- `tech_stack`: JSON array of technologies used
- `github_url`: GitHub repository URL (optional)
- `live_demo`: Live demo URL (optional)
- `image_url`: Project image URL (optional)
- `position_x`, `position_y`, `position_z`: 3D coordinates for neural network
- `created_at`: Timestamp

### Blog Model
- `id`: Primary key
- `title`: Blog post title
- `slug`: URL-friendly identifier (unique)
- `content`: Markdown content
- `summary`: Optional summary text
- `position_x`, `position_y`, `position_z`: 3D coordinates for neural network
- `created_at`: Timestamp

## API Endpoints

### Health Check
- `GET /`: API information
- `GET /health`: Health status with database connection check

### Future Endpoints (Task 3)
- `GET /api/projects`: List all projects
- `GET /api/projects/{slug}`: Get project by slug
- `GET /api/blogs`: List all blog posts
- `GET /api/blogs/{slug}`: Get blog post by slug
- `GET /api/neural-data`: Combined data for 3D visualization

## Database Management

### Initialize Database
```bash
python init_db.py
```

### Reset Database (drops all tables)
```bash
python init_db.py --reset
```

### Seed Database with Sample Data
```bash
python seed_database.py
```

### Database Utilities
```bash
# Show database statistics
python db_utils.py stats

# Reset database (drop and recreate tables)
python db_utils.py reset

# Seed with sample data
python db_utils.py seed

# Clear all data
python db_utils.py clear
```

### Create Migration
```bash
python -m alembic revision --autogenerate -m "Description of changes"
```

### Apply Migrations
```bash
python -m alembic upgrade head
```

### Migration History
```bash
python -m alembic history
```

## Testing

Run the setup validation tests:
```bash
python test_setup.py
```

This will verify:
- Database connection
- SQLAlchemy models
- Pydantic schemas
- FastAPI app initialization

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=sqlite:///./neural_space.db

# Server Configuration
HOST=0.0.0.0
PORT=8000

# CORS (comma-separated list for production)
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

## Development Notes

### Tech Stack Handling
- Tech stacks are stored as JSON strings in the database
- Pydantic schemas automatically convert between JSON strings and Python lists
- Use `get_tech_stack_list()` and `set_tech_stack_list()` methods on Project model

### 3D Positioning
- All content items (projects and blogs) have 3D coordinates
- Coordinates are used by the frontend for neural network visualization
- Position values should be within reasonable bounds for the 3D scene

### Database Migrations
- Always create migrations for schema changes using Alembic
- Test migrations on a copy of production data before applying
- Keep migration messages descriptive and clear

## Production Deployment

### Environment Setup
1. Set `DATABASE_URL` to production database
2. Configure `ALLOWED_ORIGINS` for your frontend domain
3. Set appropriate `HOST` and `PORT` values
4. Use a production WSGI server like Gunicorn

### Example Production Command
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Sample Data

The backend includes comprehensive sample data for development and testing:

### Projects (6 samples)
- Neural Mesh Reconstruction
- Real-time Style Transfer for 3D Scenes  
- Volumetric Human Pose Estimation
- NeRF Scene Optimization
- 3D Object Detection Pipeline
- Generative 3D Asset Creation

### Blog Posts (4 samples)
- Getting Started with Neural Radiance Fields
- Optimizing 3D Deep Learning Pipelines
- Building Production-Ready 3D ML Systems
- The Future of 3D AI: Trends and Predictions

All sample data includes:
- Realistic ML/3D AI content and descriptions
- Proper tech stacks and project links
- 3D positioning for neural network visualization
- Full Markdown content for blog posts

## Requirements Satisfied

This implementation satisfies the following requirements from the specification:

- **Requirement 2.1**: Sample project data with realistic ML/3D AI content and tech stacks
- **Requirement 3.1**: Sample blog posts in Markdown format with technical content
- **Requirement 5.4**: SQLAlchemy models with 3D positioning for Project and Blog entities
- **Requirement 5.5**: Pydantic schemas for request/response validation
- **Requirement 6.3**: Clean setup instructions and modular code structure
- **Requirement 6.4**: Database migration utilities and development tools

## Next Steps

The next task will implement the actual API endpoints that use these models and schemas to provide data to the frontend application.