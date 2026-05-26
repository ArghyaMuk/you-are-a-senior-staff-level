"use client";

import Link from "next/link";
import { Copy, FileText, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { ResumeScoreGauge } from "@/components/ats/resume-score-gauge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzeATS } from "@/lib/ats-engine";
import { sampleResume } from "@/lib/sample-data";
import { formatDate } from "@/lib/utils";
import { useResumeStore } from "@/store/resume-store";

export default function DashboardPage() {
  const resumes = useResumeStore((state) => state.resumes);
  const activeResumeId = useResumeStore((state) => state.activeResumeId);
  const setActiveResume = useResumeStore((state) => state.setActiveResume);
  const createResume = useResumeStore((state) => state.createResume);
  const duplicateResume = useResumeStore((state) => state.duplicateResume);
  const deleteResume = useResumeStore((state) => state.deleteResume);

  const activeResume = resumes.find((resume) => resume.id === activeResumeId) ?? resumes[0] ?? sampleResume;
  const activeReport = analyzeATS(activeResume);

  return (
    <AppShell>
      <div className="grid gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal">Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Manage drafts, compare readiness, and jump back into focused editing.</p>
          </div>
          <Button
            onClick={() => {
              createResume();
              toast.success("New resume created");
            }}
          >
            <Plus />
            New resume
          </Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Active resume</CardTitle>
              <CardDescription>{activeResume.title}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <ResumeScoreGauge score={activeReport.score} />
              <div className="grid w-full grid-cols-2 gap-3">
                <div className="rounded-lg border bg-background p-3">
                  <p className="text-sm text-muted-foreground">Target</p>
                  <p className="mt-1 text-sm font-semibold">{activeResume.targetRole}</p>
                </div>
                <div className="rounded-lg border bg-background p-3">
                  <p className="text-sm text-muted-foreground">Template</p>
                  <p className="mt-1 text-sm font-semibold capitalize">{activeResume.template}</p>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/editor" prefetch={false}>Continue editing</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {resumes.map((resume) => {
              const report = analyzeATS(resume);
              const active = resume.id === activeResumeId;
              return (
                <Card key={resume.id} className={active ? "border-primary shadow-glow" : ""}>
                  <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                    <button type="button" className="flex min-w-0 flex-1 items-center gap-4 text-left" onClick={() => setActiveResume(resume.id)}>
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <FileText className="size-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">{resume.title}</span>
                          {active ? <Badge variant="success">Active</Badge> : null}
                          <Badge variant={report.score >= 80 ? "success" : "warning"}>{report.score} ATS</Badge>
                        </span>
                        <span className="mt-1 block text-sm text-muted-foreground">
                          {resume.targetRole} · Updated {formatDate(resume.updatedAt)}
                        </span>
                      </span>
                    </button>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" onClick={() => setActiveResume(resume.id)}>
                        <Link href="/preview" prefetch={false}>Preview</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Duplicate resume"
                        onClick={() => {
                          duplicateResume(resume.id);
                          toast.success("Resume duplicated");
                        }}
                      >
                        <Copy />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete resume"
                        onClick={() => {
                          deleteResume(resume.id);
                          toast.success("Resume deleted");
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
