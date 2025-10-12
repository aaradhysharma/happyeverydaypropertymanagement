# Happy Everyday Property Management - Setup Guide

Version: **0.0.1**

## 🚀 Quick Setup Guide

### Step 1: Clone Repository (After creating on GitHub)

```bash
# The repository is already initialized locally
# To push to GitHub:
# 1. Create a new repository on GitHub named "happyeverydaypropertymanagement"
# 2. Update the remote URL:
git remote set-url origin https://github.com/YOUR_USERNAME/happyeverydaypropertymanagement.git
# 3. Push:
git push -u origin main
```

### Step 2: Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright for web scraping
playwright install

# Setup environment variables
cp .env.example .env
# Edit .env and add:
# - DATABASE_URL (PostgreSQL connection)
# - OPENAI_API_KEY
# - ANTHROPIC_API_KEY
# - SECRET_KEY

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser for Django admin
python manage.py createsuperuser

# Start FastAPI server
python main.py
```

Backend will run on: **http://localhost:8000**

### Step 3: Start Background Workers (Separate Terminals)

```bash
# Terminal 2: Celery Worker
cd backend
celery -A celery_app worker --loglevel=info

# Terminal 3: Celery Beat (Scheduled Tasks)
cd backend
celery -A celery_app beat --loglevel=info
```

### Step 4: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
```

Frontend will run on: **http://localhost:3000**

### Step 5: Docker Setup (Alternative)

```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔑 Required API Keys

### OpenAI GPT-4V (Property Inspection)
1. Visit: https://platform.openai.com/api-keys
2. Create API key
3. Add to `.env`: `OPENAI_API_KEY=sk-...`

### Anthropic Claude (Market Analysis)
1. Visit: https://console.anthropic.com/
2. Create API key
3. Add to `.env`: `ANTHROPIC_API_KEY=sk-ant-...`

## 📊 Database Setup

### PostgreSQL

```bash
# Install PostgreSQL 15+
# Create database
createdb happyeveryday

# Or use Docker
docker run -d \
  --name postgres-happyeveryday \
  -e POSTGRES_DB=happyeveryday \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15-alpine
```

### Redis

```bash
# Install Redis 7+
# Or use Docker
docker run -d \
  --name redis-happyeveryday \
  -p 6379:6379 \
  redis:7-alpine
```

## 🌐 Deployment

### Deploy Frontend to Vercel

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# - NEXT_PUBLIC_API_URL: Your backend API URL
# - NEXT_PUBLIC_VERSION: 0.0.1
```

### Deploy Backend to Railway

1. Create account at railway.app
2. Create new project
3. Add PostgreSQL service
4. Add Redis service
5. Connect GitHub repository
6. Set environment variables:
   - `DATABASE_URL` (auto-provided)
   - `REDIS_URL` (auto-provided)
   - `OPENAI_API_KEY`
   - `ANTHROPIC_API_KEY`
   - `SECRET_KEY`
   - `ALLOWED_HOSTS`
7. Deploy!

## 🧪 Testing the Application

### 1. Access the Application
- **Home Page**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Inspections**: http://localhost:3000/inspections
- **Providers**: http://localhost:3000/providers

### 2. API Documentation
- **Interactive API Docs**: http://localhost:8000/docs
- **Django Admin**: http://localhost:8000/admin

### 3. Test API Endpoints

```bash
# Health check
curl http://localhost:8000/health

# Get dashboard analytics
curl http://localhost:8000/api/analytics/dashboard

# Get occupancy rate
curl http://localhost:8000/api/analytics/occupancy
```

## 📝 Initial Data

### Create Sample Data (Django Admin)

1. Go to http://localhost:8000/admin
2. Login with superuser credentials
3. Add sample data:
   - Properties (at least 2-3)
   - Tenants (5-10)
   - Financial Records (monthly income/expenses)
   - Service Providers (5+)
   - Maintenance Requests (10+)

### Or Use Django Shell

```python
python manage.py shell

from core.models import Property, Tenant, ServiceProvider
from django.contrib.auth.models import User

# Create sample property
user = User.objects.first()
property = Property.objects.create(
    name="Sunset Apartments",
    address="123 Main St",
    city="San Francisco",
    state="CA",
    zip_code="94102",
    property_type="residential",
    total_units=50,
    manager=user,
    status="active"
)

# Add more sample data...
```

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Find process
lsof -i :8000  # Mac/Linux
netstat -ano | findstr :8000  # Windows

# Kill process and restart
```

**Database connection error:**
```bash
# Check PostgreSQL is running
psql -U user -d happyeveryday

# Verify DATABASE_URL in .env
```

**Import errors:**
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend Issues

**Port 3000 already in use:**
```bash
# Change port in package.json
"dev": "next dev -p 3001"
```

**API connection error:**
- Check backend is running on port 8000
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check CORS settings in `backend/main.py`

## 📈 Version Updates

Current version: **0.0.1**

To increment version:

1. Update `backend/__init__.py`: `__version__ = "0.0.2"`
2. Update `frontend/package.json`: `"version": "0.0.2"`
3. Update `frontend/next.config.js`: `NEXT_PUBLIC_VERSION: '0.0.2'`
4. Update README.md
5. Commit: `git commit -m "Bump version to 0.0.2"`
6. Tag: `git tag v0.0.2`
7. Push: `git push origin main --tags`

Version increments by **0.0.1** for each release.

## 🎯 Next Steps

1. ✅ Create GitHub repository and push code
2. ✅ Set up local development environment
3. ✅ Add sample data for testing
4. Deploy to production (Vercel + Railway)
5. Configure domain names
6. Set up monitoring (Sentry, Uptime Robot)
7. Configure backup strategy
8. Set up CI/CD pipeline

## 📞 Support

For issues or questions:
- Check documentation: README.md
- Review API docs: http://localhost:8000/docs
- Contact: info@happyeveryday.com

---

**Happy Everyday Property Management** v0.0.1 🚀

