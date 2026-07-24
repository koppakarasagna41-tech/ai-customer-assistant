# Local Development & Setup Guide

Follow this step-by-step guide to set up and run the **AI Customer Support Assistant** monorepo on your local machine.

---

## 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.11 or higher
- **Git**: Installed and configured

---

## 2. Setting Up the Backend

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create Python virtual environment
python -m venv .venv

# 3. Activate virtual environment
# On Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# On macOS/Linux:
source .venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt pytest pytest-asyncio

# 5. Configure environment variables
cp .env.example .env
# Edit .env to set your GEMINI_API_KEY (optional for local testing)

# 6. Initialize local database tables
python -m app.database.create_tables

# 7. Start backend development server
uvicorn app.main:app --reload --port 8000
```

The backend server will start at `http://localhost:8000`. You can test endpoint health at `http://localhost:8000/api/v1/health` or view interactive documentation at `http://localhost:8000/docs`.

---

## 3. Setting Up the Frontend

```bash
# 1. Open a new terminal and navigate to frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Ensure VITE_API_URL is set to http://localhost:8000/api/v1

# 4. Start frontend development server
npm run dev
```

The frontend application will start at `http://localhost:3000` (or `http://localhost:5173`).

---

## 4. Running Tests

### Backend Unit & Integration Tests
```bash
cd backend
python -m pytest
```

### Frontend Typechecking & Production Build
```bash
cd frontend
npm run lint
npm run build
```
