# API Documentation & Endpoint Reference

The backend API is served by FastAPI under the base URL prefix `/api/v1`. Full interactive OpenAPI documentation is available at `/docs` and ReDoc at `/redoc`.

## 1. Authentication Endpoints (`/api/v1/auth`)

| Method | Endpoint | Description | Payload / Query |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register a new user | `UserCreate` (email, username, password, role) |
| `POST` | `/api/v1/auth/login` | Authenticate user and issue JWT | `LoginCredentials` (username_or_email, password) |
| `POST` | `/api/v1/auth/refresh` | Refresh access token | `RefreshTokenRequest` (refresh_token) |
| `POST` | `/api/v1/auth/logout` | Invalidate current session | Header: `Authorization: Bearer <token>` |
| `GET` | `/api/v1/auth/me` | Fetch active user profile | Header: `Authorization: Bearer <token>` |

---

## 2. Tickets & Workflow Endpoints (`/api/v1/tickets`)

| Method | Endpoint | Description | Payload / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/tickets` | List & filter support tickets | `status`, `priority`, `category`, `search`, `page`, `limit` |
| `POST` | `/api/v1/tickets/create` | Create a new support ticket | `TicketCreate` (title, description, priority, category) |
| `POST` | `/api/v1/tickets/classify` | AI ticket classification | `TicketCreate` |
| `GET` | `/api/v1/tickets/{ticket_id}` | Fetch ticket details & timeline | Path param: `ticket_id` |
| `PATCH` | `/api/v1/tickets/{ticket_id}` | Update ticket metadata | `TicketUpdate` |
| `DELETE` | `/api/v1/tickets/{ticket_id}` | Delete ticket permanently | Path param: `ticket_id` |
| `GET` | `/api/v1/tickets/{ticket_id}/comments` | Fetch ticket comments | Path param: `ticket_id` |
| `POST` | `/api/v1/tickets/{ticket_id}/comments` | Add comment to ticket | `{ content: string, isInternal: boolean }` |

---

## 3. Analytics & Dashboard Endpoints (`/api/v1/dashboard`, `/api/v1/analytics`)

| Method | Endpoint | Description | Payload / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/dashboard` | Get enterprise dashboard metrics | `days`, `category`, `priority`, `agent_id` |
| `GET` | `/api/v1/analytics/raw` | Raw analytics timeseries | Returns metrics, intent distribution, RAG stats |
| `POST` | `/api/v1/analytics/latency/record` | Developer health monitor telemetry | `latency_ms`, `is_error` |

---

## 4. Knowledge Base & RAG Endpoints (`/api/v1/rag`, `/api/v1/ai-knowledge-base`)

| Method | Endpoint | Description | Payload / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/ai-knowledge-base/` | List knowledge base articles | `category`, `search`, `tag` |
| `POST` | `/api/v1/rag/search` | Stage 1 Vector Similarity Search | `{ query: string, top_k: int }` |
| `POST` | `/api/v1/rag/query` | Stage 2 RAG Q&A Pipeline | `{ query: string, compress: bool }` |
| `POST` | `/api/v1/rag/index` | Index document file | Multipart file upload |
| `POST` | `/api/v1/rag/index/text` | Index plain text snippet | `{ content: string, filename: string }` |
