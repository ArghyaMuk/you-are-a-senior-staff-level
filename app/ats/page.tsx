"use client";

import { ATSDashboard } from "@/components/ats/ats-dashboard";
import { AppShell } from "@/components/layout/app-shell";

export default function ATSPage() {
  return (
    <AppShell>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">ATS Intelligence</h1>
          <p className="mt-2 text-muted-foreground">Analyze parsing compatibility, job match, keywords, and improvement priority.</p>
        </div>
        <ATSDashboard />
      </div>
    </AppShell>
  );
}
