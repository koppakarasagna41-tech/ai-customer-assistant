# Enterprise AI Customer Support Assistant (Monorepo)

A production-ready AI Customer Support Assistant platform built with a high-performance React 19 frontend and a FastAPI backend with RAG vector search, automated ticket classification, sentiment analysis, and Google Gemini LLM integration.

---

## 🏗️ Repository Architecture

```
ai-customer-assistant/
│
├── frontend/                   # React 19 + Vite 6 + TypeScript + Tailwind CSS
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vercel.json
│
├── backend/                    # FastAPI + SQLAlchemy 2.0 + SQLite/PostgreSQL
│   ├── app/
│   ├── alembic/
│   ├── tests/
│   ├── requirements.txt
│   └── render.yaml
│
├── prompts/                    # Development Guidelines & Engineering Prompts
│   ├── frontend-prompt.md
│   └── backend-prompt.md
│
├── docs/                       # Project Documentation
│   ├── architecture.md         # System Architecture & Technical Design
│   ├── api-documentation.md    # 124 REST API Endpoint References
│   ├── deployment-guide.md     # Vercel & Render Deployment Steps
│   └── setup-guide.md          # Local Setup & Testing Instructions
│
├── .github/workflows/          # CI Pipeline (Typecheck, Build, Pytest)
├── docker-compose.yml           # Multi-container Local Deployment
├── README.md
├── LICENSE                     # MIT License
└── .gitignore
```

---

## ✨ Features

- **Dynamic Interactive Support Console**: Dashboards, Ticket Queue Management, Real-Time SLA compliance, Analytics, and Knowledge Base documentation.
- **RAG & Vector Search**: Document chunking, multi-format indexing (PDF, DOCX, TXT), vector similarity search, context compression, and citation grounding.
- **Resilient AI Pipelines**: Powered by **Google Gemini API** (`gemini-2.5-flash`) with built-in circuit breaker resilience, token optimization, and offline fallback mode.
- **Enterprise Security**: JWT Authentication, Role-Based Access Control (RBAC), prompt injection detectors, PII masking, and rate limiting.

---

## 🚀 Quick Start

### 1. Local Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt pytest pytest-asyncio
python -m app.database.create_tables
uvicorn app.main:app --reload --port 8000
```

### 2. Local Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Full details are documented in [`docs/setup-guide.md`](docs/setup-guide.md).

---

## 📚 Documentation
- **System Architecture**: [`docs/architecture.md`](docs/architecture.md)
- **API Endpoint Reference**: [`docs/api-documentation.md`](docs/api-documentation.md)
- **Production Deployment**: [`docs/deployment-guide.md`](docs/deployment-guide.md)
- **Developer Prompts**: [`prompts/frontend-prompt.md`](prompts/frontend-prompt.md) & [`prompts/backend-prompt.md`](prompts/backend-prompt.md)

---

## 📄 License
Distributed under the [MIT License](LICENSE).
