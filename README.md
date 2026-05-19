# RésuméForge AI

A production-ready AI-powered ATS resume builder SaaS built with Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, Zustand, React Hook Form, Zod, Prisma, Auth.js, and Claude Sonnet-compatible API routes.

## What Is Included

- Premium responsive SaaS UI with light and dark mode
- Landing page, dashboard, editor, ATS, AI agent, templates, preview, and settings routes
- Structured resume editor with autosave, dynamic sections, drag-and-drop ordering, visibility toggles, undo/redo, and version history
- Real ATS scoring engine for contact details, keywords, action verbs, quantified impact, length, formatting, skills, readability, title alignment, and parsing safety
- Job description analyzer with keyword extraction, match percentage, missing skills, and recommendations
- Claude Sonnet API layer with streaming chat, rewrite, ATS, and JD analysis routes
- Seven ATS-safe templates: Editorial, Modern, Executive, Minimal, Corporate, Technical, Creative
- PDF, DOCX, TXT, print, and share-link export helpers
- Zustand local persistence for drafts, versions, and AI conversations
- Auth.js structure with protected-route middleware switch
- Prisma schema for users, resumes, versions, AI conversations, job descriptions, and ATS reports
- Vercel deployment configuration

## Getting Started

```bash
npm install
npm run prisma:generate
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
ANTHROPIC_API_KEY="your-anthropic-key"
CLAUDE_MODEL="claude-3-5-sonnet-latest"
DATABASE_URL="postgresql://user:password@localhost:5432/resumeforge"
NEXTAUTH_SECRET="replace-with-a-secure-secret"
NEXTAUTH_URL="http://localhost:3000"
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
NEXT_PUBLIC_AUTH_MODE="demo"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Without `ANTHROPIC_API_KEY`, the AI routes return a local coaching fallback so the product remains demoable.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm run prisma:generate
npm run prisma:migrate
```

## Architecture

- `app/`: App Router pages and API routes
- `components/`: Product UI, editor, ATS, AI, template, export, and layout components
- `lib/`: ATS engine, JD analyzer, Claude client, exports, templates, Prisma, utilities
- `store/`: Zustand persisted resume store
- `types/`: Resume, ATS, AI, and auth types
- `prisma/`: Database schema

## Production Notes

Local storage powers the current demo workflow. The Prisma schema and Auth.js adapter are ready for a multi-user backend; move persistence behind server actions or API routes when enabling accounts. Set `NEXT_PUBLIC_AUTH_MODE=required` to enforce the middleware checks for protected app routes.

PDF export uses `pdf-lib`; DOCX export uses `docx`. TXT export is the most ATS-safe format and is generated from the canonical resume JSON.
