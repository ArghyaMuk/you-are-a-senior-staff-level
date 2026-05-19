import type { ResumeData } from "@/types/resume";

export function resumeToPlainText(resume: ResumeData) {
  const lines: string[] = [];
  const personal = resume.personal;

  lines.push(personal.fullName);
  lines.push(personal.headline);
  lines.push([personal.email, personal.phone, personal.location, personal.linkedin, personal.website, personal.github].filter(Boolean).join(" | "));
  lines.push("");
  lines.push("SUMMARY");
  lines.push(resume.summary);

  for (const section of [...resume.sections].filter((item) => item.visible).sort((a, b) => a.order - b.order)) {
    if (section.key === "summary") continue;
    lines.push("");
    lines.push(section.title.toUpperCase());

    if (section.key === "experience") {
      for (const item of resume.experience) {
        lines.push(`${item.role}, ${item.company} | ${item.location} | ${item.startDate} - ${item.current ? "Present" : item.endDate}`);
        for (const bullet of item.bullets.filter(Boolean)) lines.push(`- ${bullet}`);
      }
    }

    if (section.key === "education") {
      for (const item of resume.education) {
        lines.push(`${item.degree} ${item.field}, ${item.school} | ${item.location ?? ""} | ${item.startDate} - ${item.endDate}`);
        for (const detail of item.details ?? []) lines.push(`- ${detail}`);
      }
    }

    if (section.key === "projects") {
      for (const item of resume.projects) {
        lines.push(`${item.name}${item.url ? ` | ${item.url}` : ""}`);
        lines.push(item.description);
        for (const bullet of item.bullets.filter(Boolean)) lines.push(`- ${bullet}`);
      }
    }

    if (section.key === "certifications") {
      for (const item of resume.certifications) {
        lines.push(`${item.name}, ${item.issuer} | ${item.date}`);
      }
    }

    if (section.key === "skills") {
      for (const group of resume.skills) {
        lines.push(`${group.label}: ${group.skills.join(", ")}`);
      }
    }

    if (section.key === "achievements") {
      for (const item of resume.achievements) {
        lines.push(`- ${item.label}${item.metric ? ` (${item.metric})` : ""}`);
      }
    }
  }

  return lines.filter((line, index, arr) => line.trim() || arr[index - 1]?.trim()).join("\n").trim();
}

export function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(text: string) {
  return normalizeText(text)
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length > 1);
}

export function countWords(text: string) {
  return tokenize(text).length;
}

export function uniqueWords(text: string) {
  return Array.from(new Set(tokenize(text)));
}
