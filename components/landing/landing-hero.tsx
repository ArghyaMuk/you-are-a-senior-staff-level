"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, FileText, Layers, Lock, SearchCheck, Wand2 } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzeATS } from "@/lib/ats-engine";
import { useResumeStore } from "@/store/resume-store";

const features = [
  { icon: FileText, title: "Structured resume builder", text: "Edit every section with typed data, smart defaults, autosave, and version history." },
  { icon: BarChart3, title: "Real ATS scoring", text: "Checks parsing, keywords, action verbs, quantified impact, readability, and role alignment." },
  { icon: SearchCheck, title: "Guided resume review", text: "Spot keyword gaps, structure issues, and practical fixes before you export." },
  { icon: Layers, title: "ATS-safe templates", text: "Seven ATS-safe templates with distinct typography, spacing, and print behavior." },
  { icon: Wand2, title: "Smart optimization", text: "Extract missing skills, strengthen bullets, and build company-specific resume variants." },
  { icon: Lock, title: "Enterprise-ready base", text: "Auth-ready, Prisma-ready, Vercel-ready architecture with local persistence today." }
];

const testimonials = [
  "It felt less like filling forms and more like having a senior recruiter sitting beside me.",
  "The ATS report caught the exact keyword gaps our candidates kept missing.",
  "The templates look polished while staying parser safe."
];

function ResumeMockup() {
  return (
    <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[1fr_300px]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-lg border bg-white p-6 text-neutral-950 shadow-lift"
      >
        <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
          <div>
            <div className="h-4 w-40 rounded-sm bg-neutral-950" />
            <div className="mt-3 h-2 w-64 rounded-sm bg-neutral-300" />
            <div className="mt-2 h-2 w-52 rounded-sm bg-neutral-200" />
          </div>
          <Badge variant="success">ATS 92</Badge>
        </div>
        <div className="mt-5 grid gap-4">
          {["Experience", "Skills", "Projects"].map((section, index) => (
            <div key={section}>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-teal-600" />
                <div className="h-2 w-28 rounded-sm bg-neutral-900" />
              </div>
              <div className="grid gap-2 pl-4">
                <div className="h-2 w-full rounded-sm bg-neutral-200" />
                <div className="h-2 w-11/12 rounded-sm bg-neutral-200" />
                <div className="h-2 w-8/12 rounded-sm bg-neutral-200" />
              </div>
              {index === 0 ? <div className="mt-3 h-2 w-36 rounded-sm bg-amber-400" /> : null}
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        className="rounded-lg border bg-card p-4 shadow-lift"
      >
        <div className="flex items-center gap-2">
          <SearchCheck className="size-4 text-primary" />
          <p className="text-sm font-semibold">Review notes</p>
        </div>
        <div className="mt-4 space-y-3 text-sm">
          <div className="rounded-lg bg-muted p-3">Your strongest missing keyword is observability. Add it to the platform bullet with production proof.</div>
          <div className="rounded-lg bg-primary p-3 text-primary-foreground">ATS score improved to 92.</div>
          <div className="rounded-lg border bg-background p-3">Owned a workflow platform processing 2.4M monthly requests with 99.95% uptime.</div>
        </div>
      </motion.div>
    </div>
  );
}

function AnimatedScoreBar({ label, value, delay }: { label: string; value: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-30px" });
  const [displayValue, setDisplayValue] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let animationId: number;
    let timeout: ReturnType<typeof setTimeout>;

    function runCycle() {
      const duration = 1200;
      const pauseAtTop = 2000;
      const pauseAtBottom = 400;
      const startTime = performance.now();

      function animateUp(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(eased * value));
        setBarWidth(eased * value);
        if (progress < 1) {
          animationId = requestAnimationFrame(animateUp);
        } else {
          timeout = setTimeout(() => {
            const downStart = performance.now();
            function animateDown(currentTime: number) {
              const elapsed = currentTime - downStart;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setDisplayValue(Math.round((1 - eased) * value));
              setBarWidth((1 - eased) * value);
              if (progress < 1) {
                animationId = requestAnimationFrame(animateDown);
              } else {
                timeout = setTimeout(runCycle, pauseAtBottom);
              }
            }
            animationId = requestAnimationFrame(animateDown);
          }, pauseAtTop);
        }
      }

      animationId = requestAnimationFrame(animateUp);
    }

    timeout = setTimeout(runCycle, delay * 1000);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(timeout);
    };
  }, [isInView, value, delay]);

  return (
    <div ref={ref}>
      <div className="mb-2 flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-semibold tabular-nums">{displayValue}%</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-primary"
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  );
}

export function LandingHero() {
  const resumes = useResumeStore((state) => state.resumes);
  const activeResumeId = useResumeStore((state) => state.activeResumeId);
  const hydrated = useResumeStore((state) => state.hydrated);

  const activeResume = resumes.find((r) => r.id === activeResumeId) ?? resumes[0];
  const hasResume = hydrated && activeResume && (activeResume.title || activeResume.personal.fullName || activeResume.targetRole);

  const atsReport = useMemo(() => {
    if (!hasResume || !activeResume) return null;
    return analyzeATS(activeResume);
  }, [hasResume, activeResume]);

  // Pick 4 key categories to display
  const scoreItems = useMemo(() => {
    if (!atsReport) {
      return [
        ["Keyword match", 88],
        ["Quantified impact", 76],
        ["Parsing safety", 96],
        ["Role alignment", 83]
      ] as [string, number][];
    }
    const categoryMap: Record<string, string> = {
      keywords: "Keyword match",
      metrics: "Quantified impact",
      formatting: "Parsing safety",
      alignment: "Role alignment"
    };
    const keys = ["keywords", "metrics", "formatting", "alignment"];
    return keys.map((key) => {
      const cat = atsReport.categories.find((c) => c.key === key);
      return [categoryMap[key], cat?.score ?? 0] as [string, number];
    });
  }, [atsReport]);

  return (
    <div>
      <section className="relative overflow-hidden px-4 py-20 sm:py-24">
        <div className="absolute inset-0 -z-10 animate-soft-pulse bg-[linear-gradient(120deg,rgba(20,184,166,0.13),transparent_34%,rgba(245,158,11,0.12)_70%,transparent)]" />
        <div className="container text-center">
          <Badge variant="secondary">ATS resume builder</Badge>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-5 max-w-4xl text-5xl font-semibold tracking-normal sm:text-6xl"
          >
            RésuméForge
          </motion.h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Build, score, tailor, and export ATS-safe resumes with practical keyword and readability guidance.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/login" prefetch={false}>
                Start building
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-12">
            <ResumeMockup />
          </div>
        </div>
      </section>

      <section className="border-y bg-background/70 px-4 py-16">
        <div className="container grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full transition-shadow hover:shadow-lift">
                  <CardHeader>
                    <motion.div
                      className="mb-2 flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="size-5" />
                    </motion.div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.text}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="container grid gap-6 lg:grid-cols-[360px_1fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{hasResume ? "Your ATS Score" : "ATS score demo"}</CardTitle>
                <CardDescription>
                  {hasResume
                    ? `Live scoring for "${activeResume!.title || "your resume"}".`
                    : "Practical checks that feel closer to a real resume screen than a vanity score."}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {scoreItems.map(([label, value], index) => (
                  <AnimatedScoreBar key={label} label={label} value={value} delay={index * 0.2} />
                ))}
              </CardContent>
            </Card>
          </motion.div>
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((quote, index) => (
              <motion.div
                key={quote}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.15 }}
                whileHover={{ scale: 1.03, y: -4 }}
              >
                <Card className="h-full transition-shadow hover:shadow-lift">
                  <CardContent className="p-5">
                    <motion.div
                      initial={{ rotate: -10, scale: 0 }}
                      whileInView={{ rotate: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", delay: 0.3 + index * 0.15 }}
                    >
                      <CheckCircle2 className="mb-4 size-5 text-primary" />
                    </motion.div>
                    <p className="text-sm leading-6 text-muted-foreground">&quot;{quote}&quot;</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
