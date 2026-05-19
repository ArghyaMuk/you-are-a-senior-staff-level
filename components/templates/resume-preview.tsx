import { Mail, MapPin, Phone, Link as LinkIcon } from "lucide-react";
import type { ResumeData, SectionKey } from "@/types/resume";
import { getDensityClass, getTemplate } from "@/lib/templates";
import { cn } from "@/lib/utils";

type ResumePreviewProps = {
  resume: ResumeData;
  compact?: boolean;
  className?: string;
};

function ContactRow({ resume }: { resume: ResumeData }) {
  const contact = [
    { icon: Mail, value: resume.personal.email },
    { icon: Phone, value: resume.personal.phone },
    { icon: MapPin, value: resume.personal.location },
    { icon: LinkIcon, value: resume.personal.linkedin || resume.personal.website || resume.personal.github }
  ].filter((item) => item.value);

  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-neutral-600">
      {contact.map((item) => {
        const Icon = item.icon;
        return (
          <span key={item.value} className="inline-flex items-center gap-1.5">
            <Icon className="size-3" />
            {item.value}
          </span>
        );
      })}
    </div>
  );
}

function SectionTitle({ children, accentClass, templateId }: { children: React.ReactNode; accentClass: string; templateId: string }) {
  return (
    <h2
      className={cn(
        "mb-2 mt-4 text-[11px] font-bold uppercase tracking-[0.14em]",
        accentClass,
        templateId === "editorial" && "border-b border-neutral-300 pb-1 font-serif text-[13px] normal-case tracking-normal",
        templateId === "technical" && "font-mono tracking-[0.08em]"
      )}
    >
      {children}
    </h2>
  );
}

function BulletList({ bullets }: { bullets: string[] }) {
  return (
    <ul className="mt-1 list-disc space-y-1 pl-4">
      {bullets.filter(Boolean).map((bullet, index) => (
        <li key={`${bullet}-${index}`}>{bullet}</li>
      ))}
    </ul>
  );
}

function SectionContent({ sectionKey, resume }: { sectionKey: SectionKey; resume: ResumeData }) {
  if (sectionKey === "summary") {
    return <p className="text-neutral-700">{resume.summary}</p>;
  }

  if (sectionKey === "experience") {
    return (
      <div className="space-y-3">
        {resume.experience.map((item) => (
          <div key={item.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h3 className="text-[13px] font-bold text-neutral-950">{item.role}</h3>
                <p className="text-[12px] font-medium text-neutral-700">
                  {item.company} · {item.location}
                </p>
              </div>
              <p className="text-[11px] text-neutral-500">
                {item.startDate} - {item.current ? "Present" : item.endDate}
              </p>
            </div>
            <BulletList bullets={item.bullets} />
            {item.technologies?.length ? <p className="mt-1 text-[11px] text-neutral-500">{item.technologies.join(" · ")}</p> : null}
          </div>
        ))}
      </div>
    );
  }

  if (sectionKey === "education") {
    return (
      <div className="space-y-2">
        {resume.education.map((item) => (
          <div key={item.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h3 className="text-[13px] font-bold text-neutral-950">{item.school}</h3>
                <p className="text-[12px] text-neutral-700">
                  {item.degree} {item.field}
                </p>
              </div>
              <p className="text-[11px] text-neutral-500">
                {item.startDate} - {item.endDate}
              </p>
            </div>
            {item.details?.length ? <BulletList bullets={item.details} /> : null}
          </div>
        ))}
      </div>
    );
  }

  if (sectionKey === "projects") {
    return (
      <div className="space-y-3">
        {resume.projects.map((item) => (
          <div key={item.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-[13px] font-bold text-neutral-950">{item.name}</h3>
              {item.url ? <span className="text-[11px] text-neutral-500">{item.url}</span> : null}
            </div>
            <p className="text-[12px] text-neutral-700">{item.description}</p>
            <BulletList bullets={item.bullets} />
            {item.technologies?.length ? <p className="mt-1 text-[11px] text-neutral-500">{item.technologies.join(" · ")}</p> : null}
          </div>
        ))}
      </div>
    );
  }

  if (sectionKey === "skills") {
    return (
      <div className="grid gap-2">
        {resume.skills.map((group) => (
          <p key={group.id}>
            <span className="font-bold text-neutral-950">{group.label}: </span>
            <span className="text-neutral-700">{group.skills.join(", ")}</span>
          </p>
        ))}
      </div>
    );
  }

  if (sectionKey === "certifications") {
    return (
      <div className="grid gap-1">
        {resume.certifications.map((item) => (
          <p key={item.id}>
            <span className="font-bold text-neutral-950">{item.name}</span>
            <span className="text-neutral-600"> · {item.issuer}</span>
            <span className="text-neutral-500"> · {item.date}</span>
          </p>
        ))}
      </div>
    );
  }

  if (sectionKey === "achievements") {
    return (
      <ul className="list-disc space-y-1 pl-4">
        {resume.achievements.map((item) => (
          <li key={item.id}>
            {item.label}
            {item.metric ? <span className="font-semibold text-neutral-950"> · {item.metric}</span> : null}
          </li>
        ))}
      </ul>
    );
  }

  return null;
}

export function ResumePreview({ resume, compact = false, className }: ResumePreviewProps) {
  const template = getTemplate(resume.template);
  const sections = [...resume.sections].filter((section) => section.visible).sort((a, b) => a.order - b.order);
  const twoColumn = ["executive", "technical", "creative"].includes(template.id);
  const sideSections = ["skills", "certifications", "achievements"] as SectionKey[];
  const mainSections = twoColumn ? sections.filter((section) => !sideSections.includes(section.key)) : sections;
  const aside = twoColumn ? sections.filter((section) => sideSections.includes(section.key)) : [];

  return (
    <article
      id="resume-preview-paper"
      data-resume-title={resume.title}
      className={cn(
        "resume-paper mx-auto min-h-[1056px] w-full max-w-[816px] rounded-md border border-neutral-200 p-10",
        compact && "min-h-[760px] p-7",
        template.paperClass,
        className
      )}
    >
      <header
        className={cn(
          "border-b border-neutral-200 pb-5",
          template.id === "minimal" && "border-b-0 pb-2",
          template.id === "creative" && "border-l-4 border-orange-500 pl-5"
        )}
      >
        <p className={cn("text-[11px] font-bold uppercase tracking-[0.18em]", template.accentClass)}>{resume.targetRole}</p>
        <h1
          className={cn(
            "mt-2 text-3xl font-bold tracking-normal text-neutral-950",
            compact && "text-2xl",
            template.id === "editorial" && "font-serif text-4xl font-semibold",
            template.id === "technical" && "font-mono text-2xl"
          )}
        >
          {resume.personal.fullName}
        </h1>
        <p className="mt-1 text-sm font-medium text-neutral-700">{resume.personal.headline}</p>
        <ContactRow resume={resume} />
      </header>

      <div className={cn(getDensityClass(template.density), twoColumn && "grid grid-cols-[1fr_210px] gap-8")}>
        <div>
          {mainSections.map((section) => (
            <section key={section.key}>
              <SectionTitle accentClass={template.accentClass} templateId={template.id}>
                {section.title}
              </SectionTitle>
              <SectionContent sectionKey={section.key} resume={resume} />
            </section>
          ))}
        </div>

        {aside.length ? (
          <aside className="border-l border-neutral-200 pl-6">
            {aside.map((section) => (
              <section key={section.key}>
                <SectionTitle accentClass={template.accentClass} templateId={template.id}>
                  {section.title}
                </SectionTitle>
                <SectionContent sectionKey={section.key} resume={resume} />
              </section>
            ))}
          </aside>
        ) : null}
      </div>
    </article>
  );
}
