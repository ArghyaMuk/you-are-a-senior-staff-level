"use client";

import { useMemo } from "react";
import { analyzeATS } from "@/lib/ats-engine";
import { sampleResume } from "@/lib/sample-data";
import { useResumeStore } from "@/store/resume-store";

export function useActiveResume() {
  const resumes = useResumeStore((state) => state.resumes);
  const activeResumeId = useResumeStore((state) => state.activeResumeId);
  const resume = resumes.find((item) => item.id === activeResumeId) ?? resumes[0] ?? sampleResume;
  const atsReport = useMemo(() => analyzeATS(resume), [resume]);

  return { resume, atsReport };
}
