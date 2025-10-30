# Neural Space Portfolio

An interactive 3D portfolio website for a Machine Learning Engineer, featuring a neural network visualization built with Next.js, React Three Fiber, and FastAPI.

## 🚀 Features

- **Interactive 3D Neural Network**: Explore projects and blogs as nodes in a 3D space
- **Modern Tech Stack**: Next.js 15, React Three Fiber, FastAPI, SQLAlchemy
- **Responsive Design**: Works on desktop and mobile with 2D fallbacks
- **Clean Architecture**: Decoupled frontend and backend with RESTful APIs

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
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   └── lib/            # Utilities
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # FastAPI backend
│   ├── main.py             # FastAPI app
│   ├── models.py           # SQLAlchemy models
│   ├── schemas.py          # Pydantic schemas
│   ├── database.py         # Database configuration
│   └── requirements.txt
└── package.json            # Root package.json
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
python run_dev.py    # Start dev server with auto-reload
pip install -r requirements.txt  # Install dependencies
```

### Running Both Servers
```bash
npm run dev          # Runs both frontend and backend concurrently
```

## 🌐 API Endpoints

- `GET /` - API root
- `GET /health` - Health check
- `GET /api/projects` - List all projects (coming soon)
- `GET /api/blogs` - List all blogs (coming soon)
- `GET /api/neural-data` - Combined data for 3D scene (coming soon)

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

```bash
# Frontend tests
cd frontend
npm test

# Backend tests (to be implemented)
cd backend
pytest
```

## 📝 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```
DATABASE_URL=sqlite:///./neural_space.db
CORS_ORIGINS=http://localhost:3000
DEBUG=True
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.