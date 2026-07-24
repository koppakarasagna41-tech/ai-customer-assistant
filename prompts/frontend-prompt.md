# AI Customer Support Assistant — Frontend Development Prompt

## Framework & Tech Stack
- **Framework**: React 19 + Vite 6 + TypeScript 5.8
- **Styling**: Tailwind CSS 4 + Lucide React icons + Motion animations
- **State & Router**: React Router v7 + Custom Context (AuthContext, ThemeContext)
- **HTTP Client**: Axios with Bearer JWT Authorization and automatic Token Refresh Interceptors

## Design Principles & Aesthetics
1. **Modern Glassmorphism & Enterprise Styling**: Vibrant harmonious colors, dark mode support, sleek cards, subtle micro-animations.
2. **Strict Mock Data Ban**: All UI components must consume real APIs via `services/api.ts` connected to `import.meta.env.VITE_API_URL`.
3. **SEO & Accessibility**: Semantic HTML5 tags, screen-reader friendly labels, and page level route suspense loaders.

## Required Features & Pages
- **Authentication**: Login, Registration, Logout, Password Reset (`/login`, `/register`, `/forgot-password`).
- **Protected Console**:
  - `/dashboard`: High-level metrics, active ticket stream, quick admin actions.
  - `/tickets`: Searchable, filterable ticket list with status/priority transition modals and internal commenting.
  - `/analytics`: Real-time operational graphs, AI deflection metrics, CSAT distributions, and CSV/PDF export.
  - `/reports`: Report catalog, schedule manager, and interactive document preview modal.
  - `/kb`: Dynamic Knowledge Base article search, category filtering, and markdown reader.
  - `/chat`: Interactive AI Customer Support Assistant with streaming feedback.
  - `/profile` & `/settings`: User settings and security management.
