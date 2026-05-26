"use client";

import { ATSDashboard } from "@/components/ats/ats-dashboard";
import { ExportToolbar } from "@/components/export/export-toolbar";
import { ResumeEditor } from "@/components/editor/resume-editor";
import { AppShell } from "@/components/layout/app-shell";
import { ResumePreview } from "@/components/templates/resume-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActiveResume } from "@/hooks/use-active-resume";

export default function EditorPage() {
  const { resume } = useActiveResume();

  return (
    <AppShell>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">Editor</h1>
          <p className="mt-2 text-muted-foreground">Create, tailor, score, and export from one focused workspace.</p>
        </div>
        <Tabs defaultValue="editor">
          <TabsList className="flex h-auto w-full flex-wrap justify-start">
            <TabsTrigger value="editor">Resume Editor</TabsTrigger>
            <TabsTrigger value="ats">ATS Score</TabsTrigger>
            <TabsTrigger value="preview">Preview & Export</TabsTrigger>
          </TabsList>
          <TabsContent value="editor">
            <ResumeEditor />
          </TabsContent>
          <TabsContent value="ats">
            <ATSDashboard />
          </TabsContent>
          <TabsContent value="preview">
            <div className="grid gap-6">
              <ExportToolbar />
              <ResumePreview resume={resume} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
