import type { ATSCategoryScore, ATSReport, ATSSuggestion, ResumeData, Severity } from "@/types/resume";
import { analyzeJobDescription } from "@/lib/jd-analyzer";
import { clamp, uid } from "@/lib/utils";
import { countWords, normalizeText, resumeToPlainText } from "@/lib/resume-text";

const actionVerbs = [
  "achieved",
  "accelerated",
  "architected",
  "built",
  "created",
  "delivered",
  "designed",
  "drove",
  "enabled",
  "improved",
  "increased",
  "launched",
  "led",
  "managed",
  "optimized",
  "owned",
  "reduced",
  "shipped",
  "scaled",
  "streamlined",
  "transformed"
];

function statusFor(score: number): ATSCategoryScore["status"] {
  if (score >= 86) return "excellent";
  if (score >= 72) return "good";
  if (score >= 50) return "needs-work";
  return "critical";
}

function category(key: string, label: string, score: number, weight: number): ATSCategoryScore {
  return {
    key,
    label,
    score: Math.round(clamp(score, 0, 100)),
    weight,
    status: statusFor(score)
  };
}

function suggestion(categoryName: string, title: string, description: string, severity: Severity, action?: string): ATSSuggestion {
  return {
    id: uid("ats"),
    category: categoryName,
    title,
    description,
    severity,
    action
  };
}

function getBullets(resume: ResumeData) {
  return [
    ...resume.experience.flatMap((item) => item.bullets),
    ...resume.projects.flatMap((item) => item.bullets),
    ...resume.education.flatMap((item) => item.details ?? []),
    ...resume.achievements.map((item) => `${item.label} ${item.metric ?? ""}`)
  ].filter(Boolean);
}

function scoreContact(resume: ResumeData) {
  const fields = [
    resume.personal.fullName,
    resume.personal.email,
    resume.personal.phone,
    resume.personal.location,
    resume.personal.linkedin || resume.personal.website
  ];
  return (fields.filter(Boolean).length / fields.length) * 100;
}

function scoreFormatting(resume: ResumeData) {
  const hiddenCritical = resume.sections.filter((section) => !section.visible && ["experience", "skills", "education"].includes(section.key)).length;
  const hasTables = /<table|columns|text box/i.test(resumeToPlainText(resume));
  const score = 100 - hiddenCritical * 18 - (hasTables ? 24 : 0);
  return clamp(score, 0, 100);
}

function scoreReadability(words: number, bulletCount: number) {
  const lengthScore = words < 300 ? 58 : words <= 850 ? 96 : words <= 1100 ? 82 : 62;
  const bulletScore = bulletCount < 4 ? 55 : bulletCount <= 18 ? 95 : 82;
  return lengthScore * 0.55 + bulletScore * 0.45;
}

function scoreQuantified(bullets: string[]) {
  if (!bullets.length) return 0;
  const quantified = bullets.filter((bullet) => /\d|%|\$|x\b|million|thousand|k\b/i.test(bullet)).length;
  return (quantified / bullets.length) * 100;
}

function scoreActionVerbs(bullets: string[]) {
  if (!bullets.length) return 0;
  const actioned = bullets.filter((bullet) => actionVerbs.some((verb) => bullet.trim().toLowerCase().startsWith(verb))).length;
  return (actioned / bullets.length) * 100;
}

function scoreTitleAlignment(resume: ResumeData, resumeText: string) {
  const target = normalizeText(resume.targetRole);
  if (!target) return 72;
  const words = target.split(" ").filter((word) => word.length > 2);
  if (!words.length) return 72;
  const hits = words.filter((word) => resumeText.includes(word)).length;
  return (hits / words.length) * 100;
}

export function analyzeATS(resume: ResumeData, jobDescription = resume.jobDescription ?? ""): ATSReport {
  const text = resumeToPlainText(resume);
  const normalized = normalizeText(text);
  const words = countWords(text);
  const bullets = getBullets(resume);
  const quantifiedBullets = bullets.filter((bullet) => /\d|%|\$|x\b|million|thousand|k\b/i.test(bullet)).length;
  const actionVerbBullets = bullets.filter((bullet) => actionVerbs.some((verb) => bullet.trim().toLowerCase().startsWith(verb))).length;
  const jdAnalysis = analyzeJobDescription(jobDescription, resume);

  const categories = [
    category("contact", "Contact Info", scoreContact(resume), 10),
    category("keywords", "Keyword Match", jdAnalysis.matchPercentage || 64, 20),
    category("verbs", "Action Verbs", scoreActionVerbs(bullets), 12),
    category("metrics", "Quantified Impact", scoreQuantified(bullets), 14),
    category("length", "Resume Length", scoreReadability(words, bullets.length), 10),
    category("formatting", "ATS Formatting", scoreFormatting(resume), 12),
    category("skills", "Skills Relevance", resume.skills.length >= 2 ? 86 : 58, 10),
    category("alignment", "Title Alignment", scoreTitleAlignment(resume, normalized), 12)
  ];

  const weighted = categories.reduce((sum, item) => sum + item.score * item.weight, 0) / categories.reduce((sum, item) => sum + item.weight, 0);
  const suggestions: ATSSuggestion[] = [];

  if (scoreContact(resume) < 95) {
    suggestions.push(
      suggestion("Contact Info", "Complete contact details", "ATS parsers expect name, email, phone, location, and one professional profile link.", "high")
    );
  }

  if (jdAnalysis.missingSkills.length) {
    suggestions.push(
      suggestion(
        "Keyword Match",
        "Close keyword gaps",
        `Missing high-value terms: ${jdAnalysis.missingSkills.slice(0, 7).join(", ")}.`,
        jdAnalysis.missingSkills.length > 8 ? "high" : "medium",
        "Add truthful evidence in skills, summary, and recent experience."
      )
    );
  }

  if (actionVerbBullets / Math.max(bullets.length, 1) < 0.65) {
    suggestions.push(
      suggestion("Action Verbs", "Start bullets with stronger verbs", "Lead bullets with owned, built, improved, reduced, shipped, or architected.", "medium")
    );
  }

  if (quantifiedBullets / Math.max(bullets.length, 1) < 0.55) {
    suggestions.push(
      suggestion("Quantified Impact", "Add measurable outcomes", "Recruiters scan for scope, business impact, and before/after metrics.", "high")
    );
  }

  if (words < 320) {
    suggestions.push(suggestion("Resume Length", "Add more role evidence", "The resume is likely too thin for a senior role.", "medium"));
  } else if (words > 1050) {
    suggestions.push(suggestion("Resume Length", "Tighten for one to two pages", "Cut lower-signal bullets and keep recent impact strongest.", "medium"));
  }

  if (!resume.summary || resume.summary.length < 140) {
    suggestions.push(suggestion("Summary", "Sharpen the summary", "Use 2 to 3 lines naming role, domain, seniority, and signature results.", "medium"));
  }

  if (resume.sections.some((section) => !section.visible && ["experience", "skills", "education"].includes(section.key))) {
    suggestions.push(
      suggestion("ATS Formatting", "Restore critical sections", "Hidden experience, skills, or education sections reduce parsing confidence.", "high")
    );
  }

  const presentKeywords = jdAnalysis.keywords.filter((keyword) => normalized.includes(keyword)).slice(0, 20);
  const missingKeywords = jdAnalysis.missingSkills;

  return {
    score: Math.round(clamp(weighted, 0, 100)),
    matchPercentage: jdAnalysis.matchPercentage,
    missingKeywords,
    presentKeywords,
    suggestions,
    categories,
    readability: {
      words,
      bullets: bullets.length,
      quantifiedBullets,
      actionVerbBullets,
      estimatedPages: Math.max(1, Math.round(words / 520))
    },
    updatedAt: new Date().toISOString()
  };
}
