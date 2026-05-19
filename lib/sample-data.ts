import type { AIQuickAction, ResumeData, SectionConfig } from "@/types/resume";
import { uid } from "@/lib/utils";

export const defaultSections: SectionConfig[] = [
  { key: "summary", title: "Professional Summary", visible: true, order: 0 },
  { key: "experience", title: "Experience", visible: true, order: 1 },
  { key: "skills", title: "Skills", visible: true, order: 2 },
  { key: "projects", title: "Selected Projects", visible: true, order: 3 },
  { key: "education", title: "Education", visible: true, order: 4 },
  { key: "certifications", title: "Certifications", visible: true, order: 5 },
  { key: "achievements", title: "Achievements", visible: true, order: 6 }
];

export const demoJobDescription = `Senior Product Engineer needed to build AI workflow products using React, Next.js, TypeScript, Node.js, analytics, APIs, and cloud deployment. The ideal candidate has shipped SaaS products, improves conversion and activation, partners with design, mentors engineers, owns architecture, and uses data to prioritize user outcomes. Experience with AI agents, LLM APIs, ATS-safe document generation, observability, and experimentation is preferred.`;

export const sampleResume: ResumeData = {
  id: "resume_primary",
  title: "Senior Product Engineer Resume",
  targetRole: "Senior Product Engineer",
  targetCompany: "Linear",
  jobDescription: demoJobDescription,
  template: "modern",
  personal: {
    fullName: "Avery Stone",
    headline: "Senior Product Engineer | AI Workflow Platforms",
    email: "avery.stone@example.com",
    phone: "+1 415 555 0184",
    location: "San Francisco, CA",
    website: "https://averystone.dev",
    linkedin: "https://linkedin.com/in/averystone",
    github: "https://github.com/averystone"
  },
  summary:
    "Senior full-stack product engineer with 8+ years building high-retention SaaS workflow products. Strong track record shipping AI-assisted experiences, improving activation funnels, and partnering with design, data, and GTM teams to turn ambiguous customer needs into measurable business outcomes.",
  experience: [
    {
      id: uid("exp"),
      company: "Northstar Labs",
      role: "Senior Product Engineer",
      location: "Remote",
      startDate: "2021",
      endDate: "Present",
      current: true,
      technologies: ["Next.js", "TypeScript", "Postgres", "LLM APIs", "Vercel"],
      bullets: [
        "Led the rebuild of an AI workflow editor used by 42K monthly active users, reducing task completion time by 31% and increasing paid activation by 18%.",
        "Architected a streaming AI assistant with contextual retrieval, audit logging, and usage controls that processed 2.4M monthly requests with 99.95% uptime.",
        "Partnered with design and data teams to run 14 experiments across onboarding, increasing trial-to-paid conversion from 8.7% to 12.9%.",
        "Mentored six engineers through design reviews, RFCs, and production readiness rituals across frontend and platform surfaces."
      ]
    },
    {
      id: uid("exp"),
      company: "BrightDesk",
      role: "Full-Stack Engineer",
      location: "New York, NY",
      startDate: "2018",
      endDate: "2021",
      current: false,
      technologies: ["React", "Node.js", "GraphQL", "AWS", "Analytics"],
      bullets: [
        "Built a customer health dashboard adopted by 220+ account teams, surfacing renewal risk signals and improving forecast accuracy by 24%.",
        "Reduced page load time by 46% through route-level code splitting, query caching, and critical path rendering improvements.",
        "Created a reusable experimentation framework that helped product teams ship 35 controlled tests in two quarters."
      ]
    }
  ],
  education: [
    {
      id: uid("edu"),
      school: "University of Michigan",
      degree: "B.S.",
      field: "Computer Science",
      location: "Ann Arbor, MI",
      startDate: "2012",
      endDate: "2016",
      details: ["Human-computer interaction concentration", "Teaching assistant for data structures"]
    }
  ],
  projects: [
    {
      id: uid("project"),
      name: "SignalDraft",
      description: "AI writing workflow for product teams.",
      url: "https://signaldraft.example.com",
      technologies: ["Next.js", "RAG", "OpenTelemetry"],
      bullets: [
        "Designed a block-based editor with citation-aware AI suggestions and team review flows.",
        "Implemented trace dashboards that cut debugging time for LLM latency issues by 38%."
      ]
    }
  ],
  certifications: [
    {
      id: uid("cert"),
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023"
    }
  ],
  skills: [
    {
      id: uid("skill"),
      label: "Product Engineering",
      skills: ["React", "Next.js", "TypeScript", "Node.js", "API Design", "Design Systems"]
    },
    {
      id: uid("skill"),
      label: "AI & Data",
      skills: ["LLM APIs", "Prompt Engineering", "Analytics", "Experimentation", "Observability"]
    },
    {
      id: uid("skill"),
      label: "Leadership",
      skills: ["Technical Strategy", "Mentorship", "Roadmapping", "Cross-functional Delivery"]
    }
  ],
  achievements: [
    {
      id: uid("ach"),
      label: "Improved activation funnels across three SaaS products",
      metric: "+18% paid activation"
    },
    {
      id: uid("ach"),
      label: "Owned uptime and quality standards for AI workflow platform",
      metric: "99.95% uptime"
    }
  ],
  sections: defaultSections,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const aiQuickActions: AIQuickAction[] = [
  {
    id: "tailor",
    label: "Tailor to JD",
    prompt: "Tailor this resume for the pasted job description. Prioritize role alignment, missing keywords, and truthful repositioning."
  },
  {
    id: "ats",
    label: "Improve ATS",
    prompt: "Review my resume for ATS compatibility and give the highest-impact fixes first."
  },
  {
    id: "bullets",
    label: "Strengthen Bullets",
    prompt: "Rewrite my weakest experience bullets using action verbs, scope, metrics, and business impact."
  },
  {
    id: "summary",
    label: "Rewrite Summary",
    prompt: "Rewrite my professional summary to be concise, senior, specific, and aligned to my target role."
  },
  {
    id: "keywords",
    label: "Find Missing Keywords",
    prompt: "Compare my resume with the job description and list missing keywords with suggestions for where to add them."
  },
  {
    id: "cover",
    label: "Generate Cover Letter",
    prompt: "Generate a concise, role-specific cover letter that uses my resume evidence without sounding generic."
  }
];
