export type ResumeTemplateId = "editorial" | "modern" | "executive" | "minimal" | "corporate" | "technical" | "creative";

export type SectionKey =
  | "summary"
  | "experience"
  | "education"
  | "projects"
  | "certifications"
  | "skills"
  | "achievements";

export type Severity = "low" | "medium" | "high";

export interface PersonalInfo {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
  technologies?: string[];
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate: string;
  details?: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  url?: string;
  bullets: string[];
  technologies?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  skills: string[];
}

export interface AchievementItem {
  id: string;
  label: string;
  metric?: string;
}

export interface SectionConfig {
  key: SectionKey;
  title: string;
  visible: boolean;
  order: number;
}

export interface ResumeData {
  id: string;
  title: string;
  targetRole: string;
  targetCompany?: string;
  jobDescription?: string;
  template: ResumeTemplateId;
  personal: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  skills: SkillGroup[];
  achievements: AchievementItem[];
  sections: SectionConfig[];
  createdAt: string;
  updatedAt: string;
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  label: string;
  snapshot: ResumeData;
  createdAt: string;
}

export interface ATSSuggestion {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  category: string;
  action?: string;
}

export interface ATSCategoryScore {
  key: string;
  label: string;
  score: number;
  weight: number;
  status: "excellent" | "good" | "needs-work" | "critical";
}

export interface ATSReport {
  score: number;
  matchPercentage: number;
  missingKeywords: string[];
  presentKeywords: string[];
  suggestions: ATSSuggestion[];
  categories: ATSCategoryScore[];
  readability: {
    words: number;
    bullets: number;
    quantifiedBullets: number;
    actionVerbBullets: number;
    estimatedPages: number;
  };
  updatedAt: string;
}

export interface JDAnalysis {
  keywords: string[];
  hardSkills: string[];
  softSkills: string[];
  senioritySignals: string[];
  responsibilities: string[];
  missingSkills: string[];
  matchPercentage: number;
  recommendations: string[];
}
