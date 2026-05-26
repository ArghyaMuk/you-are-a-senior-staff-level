"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, FileText, Layers, Lock, SearchCheck, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const features = [
  { icon: FileText, title: "Structured resume builder", text: "Edit every section with typed data, smart defaults, autosave, and version history." },
  { icon: BarChart3, title: "Real ATS scoring", text: "Checks parsing, keywords, action verbs, quantified impact, readability, and role alignment." },
  { icon: SearchCheck, title: "Guided resume review", text: "Spot keyword gaps, structure issues, and practical fixes before you export." },
  { icon: Layers, title: "Premium templates", text: "Seven ATS-safe templates with distinct typography, spacing, and print behavior." },
  { icon: Wand2, title: "Smart optimization", text: "Extract missing skills, strengthen bullets, and build company-specific resume variants." },
  { icon: Lock, title: "Enterprise-ready base", text: "Auth-ready, Prisma-ready, Vercel-ready architecture with local persistence today." }
];

const testimonials = [
  "It felt less like filling forms and more like having a senior recruiter sitting beside me.",
  "The ATS report caught the exact keyword gaps our candidates kept missing.",
  "The templates finally look premium while staying parser safe."
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

export function LandingHero() {
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
            Build, score, tailor, and export premium ATS-safe resumes with practical keyword and readability guidance.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="premium">
              <Link href="/editor" prefetch={false}>
                Start building
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard" prefetch={false}>Open dashboard</Link>
            </Button>
          </div>
          <div className="mt-12">
            <ResumeMockup />
          </div>
        </div>
      </section>

      <section className="border-y bg-background/70 px-4 py-16">
        <div className="container grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="transition-all hover:-translate-y-0.5 hover:shadow-lift">
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.text}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="container grid gap-6 lg:grid-cols-[360px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>ATS score demo</CardTitle>
              <CardDescription>Practical checks that feel closer to a real resume screen than a vanity score.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {[
                ["Keyword match", 88],
                ["Quantified impact", 76],
                ["Parsing safety", 96],
                ["Role alignment", 83]
              ].map(([label, value]) => (
                <div key={label as string}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{label}</span>
                    <span className="font-semibold">{value}%</span>
                  </div>
                  <Progress value={value as number} />
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((quote) => (
              <Card key={quote}>
                <CardContent className="p-5">
                  <CheckCircle2 className="mb-4 size-5 text-primary" />
                  <p className="text-sm leading-6 text-muted-foreground">&quot;{quote}&quot;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="container grid gap-4 md:grid-cols-3">
          {[
            ["Starter", "$0", "Local drafts, ATS score, TXT export"],
            ["Pro", "$16", "PDF/DOCX export, version history, advanced ATS guidance"],
            ["Team", "$49", "Shared templates, admin controls, usage reporting"]
          ].map(([name, price, detail]) => (
            <Card key={name} className={name === "Pro" ? "border-primary shadow-glow" : ""}>
              <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>{detail}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{price}</p>
                <Button className="mt-5 w-full" variant={name === "Pro" ? "default" : "outline"} asChild>
                  <Link href="/editor" prefetch={false}>Choose {name}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
