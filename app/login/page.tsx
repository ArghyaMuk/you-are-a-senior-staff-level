import Link from "next/link";
import { Suspense } from "react";
import { FileText } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_440px]">
          <div className="hidden lg:block">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold">
              <span className="flex size-9 items-center justify-center rounded-md bg-foreground text-background">
                <FileText className="size-4" />
              </span>
              ResumeForge
            </Link>
            <h1 className="mt-8 max-w-xl text-5xl font-semibold tracking-normal">Access your resume workspace securely.</h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Sign in to manage drafts, versions, ATS checks, templates, and exports from one focused account.
            </p>
          </div>
          <Suspense fallback={<div className="h-[520px] w-full max-w-md rounded-lg border bg-card shadow-lift" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
