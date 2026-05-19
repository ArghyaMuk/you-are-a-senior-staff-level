"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ResumeScoreGauge({ score, size = "lg" }: { score: number; size?: "sm" | "lg" }) {
  const radius = 56;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;
  const grade = score >= 86 ? "Excellent" : score >= 72 ? "Strong" : score >= 55 ? "Improving" : "Needs work";
  const color = score >= 86 ? "text-emerald-500" : score >= 72 ? "text-teal-500" : score >= 55 ? "text-amber-500" : "text-red-500";

  return (
    <div className={cn("relative inline-flex items-center justify-center", size === "sm" ? "size-32" : "size-48")}>
      <svg viewBox="0 0 140 84" className="h-full w-full overflow-visible" aria-label={`ATS score ${score}`}>
        <path d="M14 70a56 56 0 0 1 112 0" fill="none" stroke="currentColor" strokeWidth="14" className="text-muted" strokeLinecap="round" />
        <motion.path
          d="M14 70a56 56 0 0 1 112 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="14"
          strokeLinecap="round"
          className={color}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
        />
      </svg>
      <div className="absolute top-1/2 flex translate-y-2 flex-col items-center">
        <span className={cn("font-bold tracking-normal", size === "sm" ? "text-2xl" : "text-4xl")}>{score}</span>
        <span className="text-xs font-medium text-muted-foreground">{grade}</span>
      </div>
    </div>
  );
}
