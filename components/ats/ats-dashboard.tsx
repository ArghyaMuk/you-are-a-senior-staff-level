"use client";

import { AlertTriangle, CheckCircle2, CircleDot, FileSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { KeywordGapCard } from "@/components/ats/keyword-gap-card";
import { JDAnalyzer } from "@/components/ats/jd-analyzer";
import { ResumeScoreGauge } from "@/components/ats/resume-score-gauge";
import { useActiveResume } from "@/hooks/use-active-resume";
import { cn } from "@/lib/utils";

function severityVariant(severity: string) {
  if (severity === "high") return "danger";
  if (severity === "medium") return "warning";
  return "secondary";
}

export function ATSDashboard({ showAnalyzer = true }: { showAnalyzer?: boolean }) {
  const { atsReport } = useActiveResume();

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>ATS Score</CardTitle>
            <CardDescription>Real-time scoring across parsing, keywords, impact, and role alignment.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <ResumeScoreGauge score={atsReport.score} />
            <div className="grid w-full grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border bg-background p-3">
                <p className="text-xl font-bold">{atsReport.readability.words}</p>
                <p className="text-xs text-muted-foreground">Words</p>
              </div>
              <div className="rounded-lg border bg-background p-3">
                <p className="text-xl font-bold">{atsReport.readability.quantifiedBullets}</p>
                <p className="text-xs text-muted-foreground">Metric bullets</p>
              </div>
              <div className="rounded-lg border bg-background p-3">
                <p className="text-xl font-bold">{atsReport.matchPercentage}%</p>
                <p className="text-xs text-muted-foreground">JD match</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scoring Breakdown</CardTitle>
            <CardDescription>Weighted categories mirror practical recruiter and ATS heuristics.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {atsReport.categories.map((category) => (
              <div key={category.key} className="grid gap-2 rounded-lg border bg-background p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {category.status === "excellent" ? (
                      <CheckCircle2 className="size-4 text-emerald-500" />
                    ) : category.status === "critical" ? (
                      <AlertTriangle className="size-4 text-red-500" />
                    ) : (
                      <CircleDot className="size-4 text-amber-500" />
                    )}
                    <span className="text-sm font-medium">{category.label}</span>
                  </div>
                  <span className="text-sm font-semibold">{category.score}%</span>
                </div>
                <Progress
                  value={category.score}
                  indicatorClassName={cn(
                    category.score >= 86 && "bg-emerald-500",
                    category.score < 86 && category.score >= 72 && "bg-teal-500",
                    category.score < 72 && category.score >= 50 && "bg-amber-500",
                    category.score < 50 && "bg-red-500"
                  )}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileSearch className="size-5 text-primary" />
              <CardTitle>Improvement Recommendations</CardTitle>
            </div>
            <CardDescription>Severity-ranked fixes generated from your resume structure and target JD.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {atsReport.suggestions.map((item) => (
              <div key={item.id} className="rounded-lg border bg-background p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                    {item.action ? <p className="mt-2 text-sm text-foreground">{item.action}</p> : null}
                  </div>
                  <Badge variant={severityVariant(item.severity)}>{item.severity}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <KeywordGapCard missing={atsReport.missingKeywords} present={atsReport.presentKeywords} />
      </div>

      {showAnalyzer ? <JDAnalyzer /> : null}
    </div>
  );
}
