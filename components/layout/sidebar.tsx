"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileText,
  Home,
  Layers,
  LayoutTemplate,
  Plus,
  Settings,
  UserRoundCheck
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useActiveResume } from "@/hooks/use-active-resume";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/resume-store";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/editor", label: "Editor", icon: FileText },
  { href: "/ats", label: "ATS Score", icon: BarChart3 },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/preview", label: "Preview", icon: Layers },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  const { resume, atsReport } = useActiveResume();
  const createResume = useResumeStore((state) => state.createResume);
  const resumes = useResumeStore((state) => state.resumes);
  const setActiveResume = useResumeStore((state) => state.setActiveResume);

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 border-r bg-background/86 p-4 backdrop-blur-xl no-print lg:block">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between">
          <Link href="/" prefetch={false} className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex size-9 items-center justify-center rounded-md bg-foreground text-background">
              <FileText className="size-4" />
            </span>
            RésuméForge
          </Link>
          <ThemeToggle />
        </div>

        <div className="mt-6 rounded-lg border bg-card p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Active draft</p>
              <p className="mt-1 line-clamp-1 text-sm font-semibold">{resume.title}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Create resume"
              onClick={() => {
                createResume();
                toast.success("New resume draft created");
              }}
            >
              <Plus />
            </Button>
          </div>
          <select
            value={resume.id}
            onChange={(event) => setActiveResume(event.target.value)}
            className="mt-3 h-9 w-full rounded-md border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            {resumes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">ATS readiness</span>
              <span className="font-semibold">{atsReport.score}%</span>
            </div>
            <Progress value={atsReport.score} className="mt-2" />
          </div>
        </div>

        <nav className="mt-6 grid gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-muted hover:text-foreground",
                  active && "bg-muted text-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
              <UserRoundCheck className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Pro workspace</p>
              <p className="text-xs text-muted-foreground">Auth ready, local demo mode</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
