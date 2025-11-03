# Neural Space Portfolio

An interactive 3D portfolio website for a Machine Learning Engineer, featuring a neural network visualization built with Next.js, React Three Fiber, and FastAPI.

## 🚀 Features

- **Interactive 3D Neural Network**: Explore projects and blogs as nodes in a 3D space using React Three Fiber
- **Admin Panel**: Full-featured content management system for projects, blogs, and static pages
- **Modern Tech Stack**: Next.js 15, React Three Fiber, FastAPI, SQLAlchemy
- **Responsive Design**: Works on desktop and mobile with 2D fallbacks
- **Clean Architecture**: Decoupled frontend and backend with RESTful APIs
- **Authentication**: Secure cookie-based admin authentication

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Git

## 🛠️ Quick Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd neural-space-portfolio
   npm run setup
   ```

2. **Set up environment variables:**
   ```bash
   # Copy environment files
   cp frontend/.env.example frontend/.env.local
   cp backend/.env.example backend/.env
   ```

3. **Start development servers:**
   ```bash
   npm run dev
   ```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 📁 Project Structure

```
neural-space-portfolio/
├── frontend/                    # Next.js frontend
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── page.tsx        # Home with 3D scene
│   │   │   ├── about/          # About page
│   │   │   ├── blog/           # Blog listing & detail
│   │   │   ├── projects/       # Projects listing & detail
│   │   │   └── admin/          # Admin panel pages
│   │   ├── components/
│   │   │   ├── 3d/            # 3D visualization components
│   │   │   ├── ui/            # Reusable UI components
│   │   │   └── navigation.tsx # Navigation component
│   │   ├── lib/               # API client & utilities
│   │   └── types/             # TypeScript types
│   └── package.json
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   └── routes/        # Endpoint handlers
│   │   ├── core/              # Core configuration
│   │   ├── models/            # SQLAlchemy models
│   │   └── schemas/           # Pydantic schemas
│   ├── scripts/               # Database utilities
│   ├── alembic/               # Database migrations
│   ├── run.py                 # Dev server entry point
│   └── requirements.txt
├── test-integration.sh         # Integration test suite
└── package.json               # Root package.json
```

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd backend
venv/bin/python run.py              # Start dev server with auto-reload
venv/bin/pip install -r requirements.txt  # Install dependencies

# Database management
venv/bin/python scripts/init_db.py         # Initialize database
venv/bin/python scripts/init_admin.py      # Create admin user
venv/bin/python scripts/seed_database.py   # Seed sample data
```

### Running Both Servers
```bash
npm run dev          # Runs both frontend and backend concurrently
```

## 🌐 API Endpoints

### Public Endpoints
- `GET /api/projects` - List all projects
- `GET /api/projects/{slug}` - Get project by slug
- `GET /api/blogs` - List all published blogs
- `GET /api/blogs/{slug}` - Get blog by slug
- `GET /api/neural-data` - Combined data for 3D scene

### Admin Endpoints (Authentication Required)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/verify` - Verify authentication
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/projects` - Manage projects (CRUD)
- `GET /api/admin/blogs` - Manage blogs (CRUD)
- `GET /api/admin/pages` - Manage static pages (CRUD)

## 🚀 Deployment

### Frontend (Vercel)
The frontend is configured for easy Vercel deployment:
```bash
cd frontend
npm run build
```

### Backend (Render/Fly.io)
The backend includes configuration for cloud deployment with environment variables.

## 🧪 Testing

Run the integration test suite:
```bash
./test-integration.sh
```

This tests:
- Backend API endpoints
- Frontend page rendering
- Dynamic routes
- Admin authentication
- Frontend-backend integration

## 📝 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```
DATABASE_URL=sqlite:///./neural_space.db
ALLOWED_ORIGINS=http://localhost:3000
DEBUG=True
SECRET_KEY=your-secret-key-here
```

## 🔐 Admin Access

Default admin credentials (change after first login):
- Username: `admin`
- Password: `admin123`

Access the admin panel at: http://localhost:3000/admin/login

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.