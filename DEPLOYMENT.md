# Deployment Guide

## Vercel

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Set the framework preset to Next.js.
4. Add environment variables from `.env.example`.
5. Use the default commands:

```bash
npm install
npm run build
```

The included `vercel.json` sets the framework, build command, install command, and demo auth mode.

## Required Services

- Anthropic API key for Claude Sonnet-powered AI routes
- PostgreSQL database for production persistence
- GitHub OAuth credentials if using the included Auth.js provider

## Database Setup

```bash
npm run prisma:generate
npm run prisma:migrate
```

For Vercel, run migrations from CI or a controlled release shell against your production database. Do not run ad hoc destructive migrations from serverless functions.

## Authentication Modes

`NEXT_PUBLIC_AUTH_MODE=demo` keeps routes open for local demos.

`NEXT_PUBLIC_AUTH_MODE=required` enables middleware checks for:

- `/dashboard`
- `/editor`
- `/ats`
- `/ai-agent`
- `/templates`
- `/preview`
- `/settings`

## AI Routes

- `POST /api/ai/chat`: Streaming Claude Sonnet coaching response
- `POST /api/ai/rewrite`: Rewrite bullets, summaries, and resume content
- `POST /api/ai/ats`: Server-side ATS report generation
- `POST /api/ai/jd-analysis`: Job description extraction and match analysis

## Export Behavior

- PDF: client-side ATS-safe export from canonical resume text
- DOCX: semantic document export from canonical resume text
- TXT: ATS-safe plain text export
- Print: browser print flow with print-specific CSS
- Share: local encoded share payload copied to clipboard

## Hardening Checklist

- Replace demo local persistence with authenticated Prisma-backed writes.
- Add billing and usage enforcement for AI calls.
- Add request rate limiting and prompt logging controls.
- Store ATS reports and JD analyses server-side for historical comparison.
- Add background export rendering for high-volume team accounts.
