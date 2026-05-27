"use client";

import { AppShell } from "@/components/layout/app-shell";
import { ResumePreview } from "@/components/templates/resume-preview";
import { TemplateSwitcher } from "@/components/templates/template-switcher";
import { useActiveResume } from "@/hooks/use-active-resume";

export default function TemplatesPage() {
  const { resume } = useActiveResume();

  return (
    <AppShell>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">Templates</h1>
          <p className="mt-2 text-muted-foreground">Switch between ATS-safe layouts with distinct typography and spacing systems.</p>
        </div>
        <TemplateSwitcher />
        <ResumePreview resume={resume} compact />
      </div>
    </AppShell>
  );
}
