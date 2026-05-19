"use client";

import { Check, LayoutTemplate } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useActiveResume } from "@/hooks/use-active-resume";
import { resumeTemplates } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/resume-store";

export function TemplateSwitcher() {
  const { resume } = useActiveResume();
  const setTemplate = useResumeStore((state) => state.setTemplate);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {resumeTemplates.map((template, index) => {
        const active = resume.template === template.id;
        return (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <Card className={cn("overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lift", active && "border-primary shadow-glow")}>
              <div className="h-32 border-b bg-gradient-to-br from-background via-muted to-background p-4">
                <div className="h-full rounded-md bg-white p-3 shadow-sm">
                  <div className={cn("h-3 w-24 rounded-sm bg-neutral-900", template.id === "technical" && "font-mono")} />
                  <div className="mt-3 h-1.5 w-32 rounded-sm bg-neutral-300" />
                  <div className="mt-5 grid gap-1.5">
                    <div className={cn("h-1.5 rounded-sm bg-neutral-800", template.accentClass.replace("text-", "bg-"))} />
                    <div className="h-1.5 w-10/12 rounded-sm bg-neutral-200" />
                    <div className="h-1.5 w-9/12 rounded-sm bg-neutral-200" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                  {active ? <Badge variant="success">Active</Badge> : null}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-muted-foreground">
                    <p>{template.typography}</p>
                    <p className="capitalize">{template.density} spacing</p>
                  </div>
                  <Button size="sm" variant={active ? "default" : "outline"} onClick={() => setTemplate(template.id)}>
                    {active ? <Check /> : <LayoutTemplate />}
                    {active ? "Selected" : "Use"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
