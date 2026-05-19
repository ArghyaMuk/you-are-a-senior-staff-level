"use client";

import { AIAgentPanel } from "@/components/ai/ai-agent-panel";
import { AppShell } from "@/components/layout/app-shell";

export default function AIAgentPage() {
  return (
    <AppShell>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">AI Agent</h1>
          <p className="mt-2 text-muted-foreground">A contextual resume coach for bullets, summaries, cover letters, keywords, and career positioning.</p>
        </div>
        <AIAgentPanel />
      </div>
    </AppShell>
  );
}
