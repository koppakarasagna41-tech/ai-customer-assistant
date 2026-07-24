# System Architecture & Technical Design

## 1. Overview
The Enterprise AI Customer Support Assistant is designed as a resilient, high-throughput full-stack system that combines automated AI query deflection with human-in-the-loop support workflows.

```
+-------------------------------------------------------------------+
|                   React 19 + Vite 6 Frontend                      |
| (Dashboard, Tickets, Analytics, Reports, Knowledge Base, AI Chat) |
+-------------------------------------------------------------------+
                                 | REST API / JSON
                                 v
+-------------------------------------------------------------------+
|                     FastAPI Gateway Layer                        |
|  - Rate Limiting Middleware                                       |
|  - AI Security & Prompt Injection Detector                        |
|  - JWT Bearer Authentication & RBAC                               |
+-------------------------------------------------------------------+
     |                     |                     |
     v                     v                     v
+------------+    +-------------------+    +--------------------+
| SQLite /   |    | Gemini AI Engine  |    | RAG Vector Store   |
| PostgreSQL |    | - Circuit Breaker |    | - Document Indexer |
| (ORM)      |    | - Fallback Mode   |    | - Citation Engine  |
+------------+    +-------------------+    +--------------------+
```

## 2. Core Architectural Pillars

### A. Frontend Architecture
- Built with **React 19**, **TypeScript 5.8**, and **Vite 6**.
- Uses an enterprise service layer (`src/services/api.ts`) wrapping Axios to handle JWT injection, 401 automatic token refreshing, and standard FastAPI `BaseResponse` payload unwrapping.
- Zero mock data in production — all pages interact directly with backend services.

### B. Backend Architecture
- Built with **FastAPI** and **SQLAlchemy 2.0 ORM**.
- Exposes 124 modular API endpoints under `/api/v1`.
- Features database repository patterns (`UserRepository`, `TicketRepository`, `VectorStoreRepository`) with thread-safe locking mechanisms.

### C. AI & Retrieval-Augmented Generation (RAG)
- Powered by **Google Gemini API** (`gemini-2.5-flash` / `text-embedding-004`).
- Implements a **Circuit Breaker** pattern (`gemini_client.py`) that handles API rate limits, downtime, or missing API keys gracefully with offline fallback capabilities.
- Dual-stage retrieval pipeline: Document chunking, vector embedding search, context compression, and citation generation.

### D. Security & Safeguards
- `AISecurityMiddleware`: Filters prompt injection attempts, masks PII (emails, SSNs, credit cards), and detects jailbreak patterns.
- Role-Based Access Control (RBAC): Customer, Support Agent, Supervisor, and System Admin permissions.
