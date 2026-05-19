"use client";

import { useMemo } from "react";
import { ClipboardCheck, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { analyzeJobDescription } from "@/lib/jd-analyzer";
import { useActiveResume } from "@/hooks/use-active-resume";
import { useResumeStore } from "@/store/resume-store";

export function JDAnalyzer() {
  const { resume } = useActiveResume();
  const setJobDescription = useResumeStore((state) => state.setJobDescription);
  const analysis = useMemo(() => analyzeJobDescription(resume.jobDescription ?? "", resume), [resume]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Job Description Analyzer</CardTitle>
            <CardDescription>Paste a role description to extract keywords, missing skills, and optimization moves.</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(resume.jobDescription ?? "");
              toast.success("Job description copied");
            }}
          >
            <ClipboardCheck />
            Copy
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Textarea
          value={resume.jobDescription ?? ""}
          onChange={(event) => setJobDescription(event.target.value)}
          className="min-h-[280px] resize-y"
          placeholder="Paste the target job description here..."
        />
        <div className="space-y-5">
          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Match percentage</span>
              <span className="text-2xl font-bold">{analysis.matchPercentage}%</span>
            </div>
            <Progress value={analysis.matchPercentage} className="mt-3" />
          </div>
          <div className="rounded-lg border bg-background p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Search className="size-4 text-primary" />
              Extracted keywords
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {analysis.keywords.slice(0, 18).map((keyword) => (
                <span key={keyword} className="rounded-full border bg-muted px-2.5 py-1">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <h4 className="text-sm font-semibold">Optimization recommendations</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {analysis.recommendations.map((recommendation) => (
                <li key={recommendation}>• {recommendation}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
