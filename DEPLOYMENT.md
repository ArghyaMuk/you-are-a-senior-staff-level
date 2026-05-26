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

- PostgreSQL database for production persistence
- Google and Microsoft OAuth credentials if using social login

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
- `/templates`
- `/preview`
- `/settings`

## Export Behavior

- PDF: client-side ATS-safe export from canonical resume text
- DOCX: semantic document export from canonical resume text
- TXT: ATS-safe plain text export
- Print: browser print flow with print-specific CSS
- Share: local encoded share payload copied to clipboard

## Hardening Checklist

- Replace demo local persistence with authenticated Prisma-backed writes.
- Configure `AUTH_GOOGLE_*` and `AUTH_MICROSOFT_ENTRA_ID_*` before enabling social login in production.
- Store ATS reports and JD analyses server-side for historical comparison.
- Add background export rendering for high-volume team accounts.
