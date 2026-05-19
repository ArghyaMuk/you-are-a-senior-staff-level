"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SectionKey } from "@/types/resume";
import { useActiveResume } from "@/hooks/use-active-resume";
import { useResumeStore } from "@/store/resume-store";

function Field({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function CommaField({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}) {
  return (
    <Field
      label={label}
      value={value.join(", ")}
      placeholder={placeholder}
      onChange={(next) =>
        onChange(
          next
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      }
    />
  );
}

function BulletEditor({
  bullets,
  onAdd,
  onChange,
  onRemove
}: {
  bullets: string[];
  onAdd: () => void;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label>Impact bullets</Label>
        <Button type="button" size="sm" variant="outline" onClick={onAdd}>
          <Plus />
          Bullet
        </Button>
      </div>
      {bullets.map((bullet, index) => (
        <div key={index} className="flex gap-2">
          <Textarea value={bullet} onChange={(event) => onChange(index, event.target.value)} className="min-h-[72px]" />
          <Button type="button" variant="ghost" size="icon" aria-label="Remove bullet" onClick={() => onRemove(index)}>
            <Trash2 />
          </Button>
        </div>
      ))}
    </div>
  );
}

export function ResumeSectionEditor({ sectionKey, title }: { sectionKey: SectionKey; title: string }) {
  const { resume } = useActiveResume();
  const patchActiveResume = useResumeStore((state) => state.patchActiveResume);
  const addCollectionItem = useResumeStore((state) => state.addCollectionItem);
  const updateCollectionItem = useResumeStore((state) => state.updateCollectionItem);
  const removeCollectionItem = useResumeStore((state) => state.removeCollectionItem);
  const addBullet = useResumeStore((state) => state.addBullet);
  const updateBullet = useResumeStore((state) => state.updateBullet);
  const removeBullet = useResumeStore((state) => state.removeBullet);

  if (sectionKey === "summary") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={resume.summary}
            onChange={(event) => patchActiveResume({ summary: event.target.value })}
            className="min-h-[150px]"
            placeholder="2 to 3 lines that name role, domain, seniority, and measurable proof."
          />
        </CardContent>
      </Card>
    );
  }

  if (sectionKey === "experience") {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button type="button" size="sm" onClick={() => addCollectionItem("experience")}>
            <Plus />
            Experience
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4">
          {resume.experience.map((item) => (
            <div key={item.id} className="grid gap-4 rounded-lg border bg-background p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Role" value={item.role} onChange={(value) => updateCollectionItem("experience", item.id, { role: value })} />
                <Field label="Company" value={item.company} onChange={(value) => updateCollectionItem("experience", item.id, { company: value })} />
                <Field label="Location" value={item.location} onChange={(value) => updateCollectionItem("experience", item.id, { location: value })} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Start" value={item.startDate} onChange={(value) => updateCollectionItem("experience", item.id, { startDate: value })} />
                  <Field label="End" value={item.endDate} onChange={(value) => updateCollectionItem("experience", item.id, { endDate: value })} />
                </div>
              </div>
              <CommaField
                label="Technologies"
                value={item.technologies ?? []}
                onChange={(value) => updateCollectionItem("experience", item.id, { technologies: value })}
                placeholder="Next.js, TypeScript, Postgres"
              />
              <BulletEditor
                bullets={item.bullets}
                onAdd={() => addBullet("experience", item.id)}
                onChange={(index, value) => updateBullet("experience", item.id, index, value)}
                onRemove={(index) => removeBullet("experience", item.id, index)}
              />
              <div className="flex justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => removeCollectionItem("experience", item.id)}>
                  <Trash2 />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (sectionKey === "projects") {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button type="button" size="sm" onClick={() => addCollectionItem("projects")}>
            <Plus />
            Project
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4">
          {resume.projects.map((item) => (
            <div key={item.id} className="grid gap-4 rounded-lg border bg-background p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Project name" value={item.name} onChange={(value) => updateCollectionItem("projects", item.id, { name: value })} />
                <Field label="URL" value={item.url ?? ""} onChange={(value) => updateCollectionItem("projects", item.id, { url: value })} />
              </div>
              <Field label="Description" value={item.description} onChange={(value) => updateCollectionItem("projects", item.id, { description: value })} />
              <CommaField
                label="Technologies"
                value={item.technologies ?? []}
                onChange={(value) => updateCollectionItem("projects", item.id, { technologies: value })}
              />
              <BulletEditor
                bullets={item.bullets}
                onAdd={() => addBullet("projects", item.id)}
                onChange={(index, value) => updateBullet("projects", item.id, index, value)}
                onRemove={(index) => removeBullet("projects", item.id, index)}
              />
              <div className="flex justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => removeCollectionItem("projects", item.id)}>
                  <Trash2 />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (sectionKey === "education") {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button type="button" size="sm" onClick={() => addCollectionItem("education")}>
            <Plus />
            Education
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4">
          {resume.education.map((item) => (
            <div key={item.id} className="grid gap-4 rounded-lg border bg-background p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="School" value={item.school} onChange={(value) => updateCollectionItem("education", item.id, { school: value })} />
                <Field label="Degree" value={item.degree} onChange={(value) => updateCollectionItem("education", item.id, { degree: value })} />
                <Field label="Field" value={item.field} onChange={(value) => updateCollectionItem("education", item.id, { field: value })} />
                <Field label="Location" value={item.location ?? ""} onChange={(value) => updateCollectionItem("education", item.id, { location: value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Start" value={item.startDate} onChange={(value) => updateCollectionItem("education", item.id, { startDate: value })} />
                <Field label="End" value={item.endDate} onChange={(value) => updateCollectionItem("education", item.id, { endDate: value })} />
              </div>
              <CommaField label="Details" value={item.details ?? []} onChange={(value) => updateCollectionItem("education", item.id, { details: value })} />
              <div className="flex justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => removeCollectionItem("education", item.id)}>
                  <Trash2 />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (sectionKey === "skills") {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button type="button" size="sm" onClick={() => addCollectionItem("skills")}>
            <Plus />
            Skill group
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4">
          {resume.skills.map((item) => (
            <div key={item.id} className="grid gap-4 rounded-lg border bg-background p-4">
              <Field label="Group label" value={item.label} onChange={(value) => updateCollectionItem("skills", item.id, { label: value })} />
              <CommaField label="Skills" value={item.skills} onChange={(value) => updateCollectionItem("skills", item.id, { skills: value })} />
              <div className="flex justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => removeCollectionItem("skills", item.id)}>
                  <Trash2 />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (sectionKey === "certifications") {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button type="button" size="sm" onClick={() => addCollectionItem("certifications")}>
            <Plus />
            Certification
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4">
          {resume.certifications.map((item) => (
            <div key={item.id} className="grid gap-4 rounded-lg border bg-background p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Name" value={item.name} onChange={(value) => updateCollectionItem("certifications", item.id, { name: value })} />
                <Field label="Issuer" value={item.issuer} onChange={(value) => updateCollectionItem("certifications", item.id, { issuer: value })} />
                <Field label="Date" value={item.date} onChange={(value) => updateCollectionItem("certifications", item.id, { date: value })} />
                <Field
                  label="Credential URL"
                  value={item.credentialUrl ?? ""}
                  onChange={(value) => updateCollectionItem("certifications", item.id, { credentialUrl: value })}
                />
              </div>
              <div className="flex justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => removeCollectionItem("certifications", item.id)}>
                  <Trash2 />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button type="button" size="sm" onClick={() => addCollectionItem("achievements")}>
          <Plus />
          Achievement
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        {resume.achievements.map((item) => (
          <div key={item.id} className="grid gap-4 rounded-lg border bg-background p-4">
            <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
              <Field label="Achievement" value={item.label} onChange={(value) => updateCollectionItem("achievements", item.id, { label: value })} />
              <Field label="Metric" value={item.metric ?? ""} onChange={(value) => updateCollectionItem("achievements", item.id, { metric: value })} />
              <div className="flex items-end">
                <Button type="button" variant="ghost" size="icon" aria-label="Remove achievement" onClick={() => removeCollectionItem("achievements", item.id)}>
                  <Trash2 />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
