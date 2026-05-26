# ResumeForge

A production-ready ATS resume builder SaaS built with Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, Zustand, React Hook Form, Zod, Prisma, and Auth.js.

## What Is Included

- Premium responsive SaaS UI with light and dark mode
- Landing page, dashboard, editor, ATS, templates, preview, and settings routes
- Structured resume editor with autosave, dynamic sections, drag-and-drop ordering, visibility toggles, undo/redo, and version history
- Real ATS scoring engine for contact details, keywords, action verbs, quantified impact, length, formatting, skills, readability, title alignment, and parsing safety
- Job description analyzer with keyword extraction, match percentage, missing skills, and recommendations
- Seven ATS-safe templates: Editorial, Modern, Executive, Minimal, Corporate, Technical, Creative
- PDF, DOCX, TXT, print, and share-link export helpers
- Zustand local persistence for drafts and versions
- Auth.js structure with protected-route middleware switch
- Prisma schema for users, resumes, versions, job descriptions, and ATS reports
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
DATABASE_URL="postgresql://user:password@localhost:5432/resumeforge"
AUTH_SECRET="replace-with-a-secure-secret"
NEXTAUTH_SECRET="replace-with-a-secure-secret"
NEXTAUTH_URL="http://localhost:3000"
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
AUTH_MICROSOFT_ENTRA_ID_ID=""
AUTH_MICROSOFT_ENTRA_ID_SECRET=""
AUTH_MICROSOFT_ENTRA_ID_ISSUER=""
NEXT_PUBLIC_AUTH_MODE="demo"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

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
- `components/`: Product UI, editor, ATS, template, export, and layout components
- `lib/`: ATS engine, JD analyzer, exports, templates, Prisma, utilities
- `store/`: Zustand persisted resume store
- `types/`: Resume, ATS, and auth types
- `prisma/`: Database schema

## Production Notes

Local storage powers the current demo workflow. The Prisma schema and Auth.js adapter are ready for a multi-user backend; move persistence behind server actions or API routes when enabling accounts. Set `NEXT_PUBLIC_AUTH_MODE=required` to enforce the middleware checks for protected app routes.

PDF export uses `pdf-lib`; DOCX export uses `docx`. TXT export is the most ATS-safe format and is generated from the canonical resume JSON.
```markdown
# 🛠️ RésuméForge

<div align="center">

  **The Premium ATS-Optimized Resume Builder SaaS**

  *Craft polished, ATS-safe résumés tailored to specific roles in seconds.*

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

  [Explore Features](#-features) • [Tech Stack](#%EF%B8%8F-tech-stack) • [Getting Started](#-getting-started) • [Architecture](#-project-structure)

</div>

---

## ✨ Features

🎨 **Structured Resume Editor**
* Section-based editing with smooth **drag-and-drop reordering** (`dnd-kit`).
* Live form validation and instant updates.

🤖 **ATS Scoring Engine & JD Analyzer**
* Upload a target job description and watch the engine compute a **match percentage**.
* Instantly surfaces missing keywords, category-level scores, and actionable improvements.

👔 **Premium Multi-Template Engine**
* Toggle layouts instantly on the preview screen.
* Includes *Editorial, Modern, Executive, Minimal, Corporate, Technical,* and *Creative* layouts.

💾 **Multi-Format Semantic Export**
* **PDF:** Generated client-side using canonical text to guarantee it's 100% ATS-safe.
* **DOCX & TXT:** Clean semantic structures designed specifically for parsing algorithms.
* Quick-share flows and native browser print styles included.

👥 **SaaS Readiness Built-In**
* Secure social & credentials authentication via **NextAuth v5**.
* Multi-tier subscriptions (*Free, Pro, Team, Enterprise*) mapped directly at the database layer.
* Automatic snapshot versioning for history tracking and instant rollbacks.
* Flawless **Dark/Light theming** with fluid motion transitions.

---

## 🛠️ Tech Stack

<details open>
<summary><b>📐 Frontend & Framework</b> (Click to collapse)</summary>

| Technology | Purpose |
| :--- | :--- |
| **Next.js 15 (App Router)** | Core Framework & Server-Side Rendering |
| **React 19** | UI Rendering & Concurrent features |
| **Tailwind CSS** | Utility-first styling & theme switching |
| **Framer Motion** | Fluid micro-interactions and transitions |
| **Zustand** | Ultra-fast, lightweight global state management |
| **Radix UI + Lucide** | Accessible unstyled primitives & sharp iconography |

</details>

<details open>
<summary><b>⚙️ Backend, Database & Tooling</b> (Click to collapse)</summary>

| Technology | Purpose |
| :--- | :--- |
| **TypeScript 5** | Strict type safety across the entire stack |
| **PostgreSQL** | Relational data layer for users, resumes, and tiers |
| **Prisma ORM** | Type-safe database client and migration runner |
| **NextAuth v5** | Secure, flexible edge-ready authentication |
| **React Hook Form + Zod** | High-performance form handling & schema validation |
| **pdf-lib & docx** | High-fidelity, client-side document compilers |
| **Sonner** | Clean, non-intrusive toast notifications |

</details>

---

## 📁 Project Structure

```mermaid
graph TD
    A[app/] --> B[dashboard/]
    A --> C[editor/]
    A --> D[ats/]
    A --> E[preview/]
    style A fill:#2d3748,stroke:#38b2ac,stroke-width:2px

```

```
.
├── app/                    # Next.js App Router routes
│   ├── ats/                # ATS analysis engine UI
│   ├── dashboard/          # User dashboard & resume hub
│   ├── editor/             # Interactive multi-step editor
│   ├── login/              # Secure sign-in flows
│   ├── preview/            # Live-updating resume canvas
│   ├── settings/           # Profile & subscription management
│   └── templates/          # Visual layout showcase
├── components/             # Atomic, feature-grouped UI elements
├── hooks/                  # Reusable custom React hooks
├── lib/                    # Core domain logic (ATS formulas, document compilers)
├── prisma/                 # Database models & migration history
├── store/                  # Lightweight Zustand state stores
├── types/                  # Shared domain TypeScript contracts
└── middleware.ts           # Global route guarding & auth rules

```

---

## 🚀 Getting Started

### Prerequisites

* **Node.js:** `18.18+` (Node 20+ strongly recommended)
* **Database:** `PostgreSQL 14+`
* **Package Manager:** `npm` (or your preferred alternative)

### 1. Installation

```bash
git clone [https://github.com/ArghyaMuk/you-are-a-senior-staff-level.git](https://github.com/ArghyaMuk/you-are-a-senior-staff-level.git)
cd you-are-a-senior-staff-level
npm install

```

### 2. Environment Configuration

Duplicate the example environment file and populate it with your local credentials:

```bash
cp .env.example .env

```

> ⚠️ **Security Warning:** Never commit your active `.env` file to version control. Keep production secrets safely locked in your hosting provider's vault.

### 3. Database Initialization

Generate your type-safe database client and execute the local migrations schema:

```bash
npm run prisma:generate
npm run prisma:migrate

```

### 4. Boot Up Development

```bash
npm run dev

```

🎯 Your local instance is now live at **[http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)**!

---

## 💻 Available Scripts

| Script | Command | Action |
| --- | --- | --- |
| **Dev Environment** | `npm run dev` | Spins up local server with hot-reloading |
| **Production Build** | `npm run build` | Compiles an optimized distribution build |
| **Start Server** | `npm run start` | Boots up the production build server |
| **Lint Check** | `npm run lint` | Runs strict ESLint code quality checks |
| **Type Check** | `npm run typecheck` | Evaluates TypeScript compilation safety |
| **Prisma Sync** | `npm run prisma:generate` | Refreshes the local Prisma Client objects |
| **Prisma Migrate** | `npm run prisma:migrate` | Synchronizes DB schema changes safely |

---

## 📤 Intelligent Export Behavior

> [!NOTE]
> RésuméForge processes all documents directly in the client browser, completely eliminating heavy server overhead and ensuring maximum security for personal user details.

* **📄 PDF Export:** Engineered using strict typography grids to generate highly machine-readable text blocks, ensuring absolute ATS compatibility.
* **📝 DOCX Export:** Generates properly tabbed, nested semantic tables optimized specifically for Enterprise ATS parsers.
* **🔤 Raw Text (TXT):** Strips away formatting completely, providing an ultra-lean structure perfect for copypasta fields.
* **🖨️ Native Print:** Ships with custom `@media print` stylesheets to format natural browser print sheets perfectly.

---

## 🛡️ Production & Deployment

For deep architectural implementation details, see the [`DEPLOYMENT.md`](https://www.google.com/search?q=./DEPLOYMENT.md) blueprint.

1. **Host Configuration:** Fully optimized out-of-the-box for **Vercel**.
2. **Database Execution:** Ensure structural migrations (`prisma migrate deploy`) are executed inside an isolated CI/CD step or secure release environment rather than directly inside a serverless runtime context.

---

## 👤 Author

Crafted with care by **[@ArghyaMuk](https://github.com/ArghyaMuk)**.

```

```