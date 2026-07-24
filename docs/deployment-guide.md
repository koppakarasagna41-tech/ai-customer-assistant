# Production Deployment Guide

This guide outlines deployment procedures for hosting the **Frontend on Vercel** and the **Backend on Render**.

---

## 1. Frontend Deployment (Vercel)

### Configuration
The repository includes a `frontend/vercel.json` file:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Steps
1. Connect your GitHub account to **Vercel**.
2. Select the `ai-customer-assistant` monorepo repository.
3. Configure project settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set Environment Variables:
   - `VITE_API_URL`: `https://your-backend-service.onrender.com/api/v1`
5. Click **Deploy**.

---

## 2. Backend Deployment (Render)

### Configuration
The repository includes a `backend/render.yaml` configuration file:
```yaml
services:
  - type: web
    name: enterprise-ai-support-backend
    env: python
    rootDir: backend
    buildCommand: "./scripts/build.sh"
    startCommand: "gunicorn -k uvicorn.workers.UvicornWorker -c gunicorn.conf.py app.main:app"
    healthCheckPath: /api/v1/health
```

### Steps
1. Connect your GitHub account to **Render**.
2. Create a new **Blueprint Service** pointing to `ai-customer-assistant`.
3. Render automatically detects `render.yaml`.
4. Configure required secrets in the Render Dashboard:
   - `GEMINI_API_KEY`: Key from Google AI Studio.
   - `DATABASE_URL`: PostgreSQL URL (e.g. Supabase or Render Postgres).
   - `JWT_SECRET`: Random 64-character secret key.
   - `FRONTEND_URL`: Your Vercel application URL (e.g. `https://your-app.vercel.app`).
5. Deploy Web Service and Managed Redis.
