"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Chrome, FileText, LogOut, Mail } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LogoutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      setIsLoggedOut(true);
    } catch {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isLoggedOut) {
      const timeout = setTimeout(() => router.push("/"), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isLoggedOut, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg bg-foreground text-background">
            <FileText className="size-5" />
          </div>
          <CardTitle className="text-2xl">
            {isLoggedOut ? "You've been signed out" : "Sign out"}
          </CardTitle>
          <CardDescription>
            {isLoggedOut
              ? "Redirecting you to the dashboard..."
              : "Sign out from your account and connected providers."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {isLoggedOut ? (
            <Button asChild variant="outline">
              <Link href="/">Go to home</Link>
            </Button>
          ) : (
            <>
              <Button onClick={handleLogout} disabled={isLoading} className="w-full">
                <LogOut className="mr-2 size-4" />
                {isLoading ? "Signing out..." : "Sign out"}
              </Button>

              <div className="flex items-center gap-3 text-xs uppercase text-muted-foreground">
                <div className="h-px flex-1 bg-border" />
                Or sign out from
                <div className="h-px flex-1 bg-border" />
              </div>

              <Button
                variant="outline"
                className="w-full"
                disabled={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  await signOut({ callbackUrl: "https://accounts.google.com/Logout" });
                }}
              >
                <Chrome className="mr-2 size-4" />
                Sign out from Google
              </Button>

              <Button
                variant="outline"
                className="w-full"
                disabled={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  await signOut({ callbackUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/logout" });
                }}
              >
                <Mail className="mr-2 size-4" />
                Sign out from Microsoft
              </Button>

              <Button asChild variant="ghost" className="w-full">
                <Link href="/dashboard">Cancel</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
