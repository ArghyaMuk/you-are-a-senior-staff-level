"use client";

import { ExportToolbar } from "@/components/export/export-toolbar";
import { AppShell } from "@/components/layout/app-shell";
import { ResumePreview } from "@/components/templates/resume-preview";
import { useActiveResume } from "@/hooks/use-active-resume";

export default function PreviewPage() {
  const { resume } = useActiveResume();

  return (
    <AppShell>
      <div className="grid gap-6">
        <ExportToolbar />
        <ResumePreview resume={resume} />
      </div>
    </AppShell>
  );
}
