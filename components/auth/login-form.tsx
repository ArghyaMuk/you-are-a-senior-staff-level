"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, Loader2, Mail, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthMode = "signin" | "signup";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = useMemo(() => searchParams.get("next") || searchParams.get("callbackUrl") || "/dashboard", [searchParams]);

  async function handleOAuth(provider: "google" | "microsoft") {
    setError(null);
    setPending(provider);
    await signIn(provider, { callbackUrl });
    setPending(null);
  }

  async function handleCredentials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending("credentials");

    if (mode === "signup") {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setError(data?.error ?? "Could not create your account.");
        setPending(null);
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl
    });

    if (result?.error) {
      setError(mode === "signup" ? "Account created, but sign in failed. Try signing in again." : "Invalid email or password.");
      setPending(null);
      return;
    }

    router.push(result?.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md shadow-lift">
      <CardHeader>
        <CardTitle>{mode === "signin" ? "Log in" : "Create account"}</CardTitle>
        <CardDescription>Use Google, Microsoft, or an email and password to access your resume workspace.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3">
          <Button type="button" variant="outline" onClick={() => void handleOAuth("google")} disabled={Boolean(pending)}>
            {pending === "google" ? <Loader2 className="animate-spin" /> : <Chrome />}
            Continue with Google
          </Button>
          <Button type="button" variant="outline" onClick={() => void handleOAuth("microsoft")} disabled={Boolean(pending)}>
            {pending === "microsoft" ? <Loader2 className="animate-spin" /> : <Mail />}
            Continue with Microsoft
          </Button>
        </div>

        <div className="flex items-center gap-3 text-xs uppercase text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          Email
          <div className="h-px flex-1 bg-border" />
        </div>

        <form className="grid gap-4" onSubmit={handleCredentials}>
          {mode === "signup" ? (
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
            </div>
          ) : null}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              minLength={8}
              required
            />
          </div>

          {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p> : null}

          <Button type="submit" disabled={Boolean(pending)}>
            {pending === "credentials" ? <Loader2 className="animate-spin" /> : <ArrowRight />}
            {mode === "signin" ? "Log in with email" : "Create account"}
          </Button>
        </form>

        <Button type="button" variant="ghost" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} disabled={Boolean(pending)}>
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Log in"}
        </Button>
      </CardContent>
    </Card>
  );
}
