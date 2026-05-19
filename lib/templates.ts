import type { ResumeTemplateId } from "@/types/resume";

export interface ResumeTemplateMeta {
  id: ResumeTemplateId;
  name: string;
  description: string;
  typography: string;
  density: "compact" | "balanced" | "spacious";
  accentClass: string;
  paperClass: string;
}

export const resumeTemplates: ResumeTemplateMeta[] = [
  {
    id: "editorial",
    name: "Editorial",
    description: "Sharp magazine-inspired headings with a refined serif accent.",
    typography: "Serif headings, generous paragraph rhythm",
    density: "spacious",
    accentClass: "text-stone-900",
    paperClass: "font-serif"
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean SaaS executive layout with precise hierarchy.",
    typography: "Neutral sans, medium density",
    density: "balanced",
    accentClass: "text-teal-700",
    paperClass: "font-sans"
  },
  {
    id: "executive",
    name: "Executive",
    description: "Board-ready profile with strong impact framing.",
    typography: "Classic headings, spacious role blocks",
    density: "spacious",
    accentClass: "text-slate-800",
    paperClass: "font-sans"
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "ATS-first structure with restrained styling.",
    typography: "Compact sans, low decoration",
    density: "compact",
    accentClass: "text-neutral-900",
    paperClass: "font-sans"
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Conservative enterprise format for established teams.",
    typography: "Professional sans, clear dividers",
    density: "balanced",
    accentClass: "text-blue-800",
    paperClass: "font-sans"
  },
  {
    id: "technical",
    name: "Technical",
    description: "Engineering-forward template with skill systems.",
    typography: "Mono accents, dense skills",
    density: "compact",
    accentClass: "text-emerald-800",
    paperClass: "font-sans"
  },
  {
    id: "creative",
    name: "Creative",
    description: "Polished portfolio-friendly structure that remains parser safe.",
    typography: "Warm accents, balanced white space",
    density: "balanced",
    accentClass: "text-orange-700",
    paperClass: "font-sans"
  }
];

export function getTemplate(id: ResumeTemplateId) {
  return resumeTemplates.find((template) => template.id === id) ?? resumeTemplates[1];
}

export function getDensityClass(density: ResumeTemplateMeta["density"]) {
  if (density === "compact") return "space-y-3 text-[12px] leading-snug";
  if (density === "spacious") return "space-y-5 text-[13px] leading-relaxed";
  return "space-y-4 text-[12.5px] leading-normal";
}
