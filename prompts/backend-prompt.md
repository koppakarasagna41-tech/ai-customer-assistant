# AI Customer Support Assistant — Backend Development Prompt

## Framework & Architecture
- **Framework**: FastAPI 0.100+ + Uvicorn/Gunicorn + SQLAlchemy 2.0 ORM + Alembic
- **Database**: PostgreSQL (Supabase compatibility) / SQLite for local testing
- **Authentication**: PyJWT + Passlib (bcrypt password hashing) with Role-Based Access Control (RBAC)
- **AI & RAG Engine**: Google Gemini API (`google-genai` SDK / `gemini_client.py`) with circuit breaker resilience and offline fallback mode

## Core API Domains & Endpoints
1. **Authentication (`/api/v1/auth`)**: Register, Login, Refresh Token, Logout, Current User Profile (`/auth/me`).
2. **Support Tickets (`/api/v1/tickets`)**: Ticket CRUD, priority prediction, automatic classification, comments, status transitions, timeline tracking.
3. **Analytics & Dashboard (`/api/v1/dashboard`, `/api/v1/analytics`)**: Real-time KPI summaries, token usage analytics, intent/sentiment trends.
4. **Reports (`/api/v1/reports`)**: Custom PDF/CSV report generation, automated schedule management.
5. **AI Knowledge Base & RAG (`/api/v1/ai-knowledge-base`, `/api/v1/rag`)**: Multi-format document indexing (PDF, DOCX, TXT), vector similarity search, citation-grounded RAG query answering.
6. **Chat & Agent Assistance (`/api/v1/chat`, `/api/v1/agents`)**: Conversation memory, attachment uploads, sentiment analysis.

## Security & Reliability
- Enterprise CORS middleware with dynamic origin whitelist.
- Rate limiting middleware (`slowapi` / custom windowing).
- AISecurityMiddleware: Prompt injection detection, PII masking, and jailbreak prevention.
