import type { JDAnalysis, ResumeData } from "@/types/resume";
import { normalizeText, resumeToPlainText, tokenize } from "@/lib/resume-text";

const stopWords = new Set([
  "and",
  "the",
  "with",
  "for",
  "you",
  "our",
  "are",
  "will",
  "that",
  "this",
  "from",
  "your",
  "have",
  "has",
  "into",
  "can",
  "using",
  "work",
  "team",
  "teams",
  "role",
  "candidate",
  "experience",
  "years",
  "strong",
  "preferred",
  "ideal",
  "needed"
]);

const knownHardSkills = [
  "react",
  "next.js",
  "typescript",
  "javascript",
  "node.js",
  "python",
  "java",
  "graphql",
  "rest",
  "postgres",
  "mysql",
  "mongodb",
  "aws",
  "gcp",
  "azure",
  "vercel",
  "docker",
  "kubernetes",
  "ci/cd",
  "analytics",
  "experimentation",
  "observability",
  "llm",
  "ai",
  "rag",
  "api",
  "apis",
  "saas",
  "tailwind",
  "prisma",
  "figma",
  "design systems"
];

const knownSoftSkills = [
  "mentorship",
  "leadership",
  "communication",
  "collaboration",
  "ownership",
  "strategy",
  "roadmapping",
  "cross-functional",
  "stakeholder",
  "customer"
];

const senioritySignals = ["senior", "staff", "principal", "lead", "architect", "manager", "mentor", "strategy", "ownership"];

function extractPhrases(text: string) {
  const normalized = normalizeText(text);
  const words = tokenize(text).filter((word) => !stopWords.has(word) && word.length > 2);
  const counts = new Map<string, number>();

  for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1);

  for (const skill of knownHardSkills.concat(knownSoftSkills)) {
    if (normalized.includes(skill)) counts.set(skill, (counts.get(skill) ?? 0) + 3);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 28)
    .map(([word]) => word);
}

export function analyzeJobDescription(jobDescription: string, resume?: ResumeData): JDAnalysis {
  const jd = normalizeText(jobDescription);
  const keywords = extractPhrases(jobDescription);
  const hardSkills = knownHardSkills.filter((skill) => jd.includes(skill)).slice(0, 16);
  const softSkills = knownSoftSkills.filter((skill) => jd.includes(skill)).slice(0, 12);
  const seniority = senioritySignals.filter((signal) => jd.includes(signal));
  const responsibilities = jobDescription
    .split(/\n|\.|;/)
    .map((line) => line.trim())
    .filter((line) => line.length > 48)
    .slice(0, 5);

  const resumeText = resume ? normalizeText(resumeToPlainText(resume)) : "";
  const missingSkills = resume ? keywords.filter((keyword) => !resumeText.includes(keyword)).slice(0, 14) : [];
  const present = resume ? keywords.filter((keyword) => resumeText.includes(keyword)) : [];
  const matchPercentage = keywords.length ? Math.round((present.length / keywords.length) * 100) : 0;

  const recommendations: string[] = [];
  if (missingSkills.length) recommendations.push(`Add evidence for ${missingSkills.slice(0, 5).join(", ")} where truthful.`);
  if (hardSkills.length > present.length) recommendations.push("Mirror important technical language from the job description in skills and recent experience.");
  if (seniority.length) recommendations.push("Show seniority through scope, ownership, architecture decisions, mentoring, and measurable outcomes.");
  if (!responsibilities.length) recommendations.push("Paste a fuller job description for better keyword and responsibility extraction.");

  return {
    keywords,
    hardSkills,
    softSkills,
    senioritySignals: seniority,
    responsibilities,
    missingSkills,
    matchPercentage,
    recommendations
  };
}
