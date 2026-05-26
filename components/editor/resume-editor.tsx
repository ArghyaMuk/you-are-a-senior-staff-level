"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDownUp, Eye, EyeOff, GripVertical, History, RotateCcw, Save, Undo2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ResumeSectionEditor } from "@/components/editor/resume-section-editor";
import { ResumePreview } from "@/components/templates/resume-preview";
import type { SectionKey } from "@/types/resume";
import { useActiveResume } from "@/hooks/use-active-resume";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/resume-store";

const basicsSchema = z.object({
  title: z.string().min(2, "Add a resume title"),
  targetRole: z.string().min(2, "Add a target role"),
  targetCompany: z.string().optional(),
  personal: z.object({
    fullName: z.string().min(2, "Add your name"),
    headline: z.string().min(4, "Add a headline"),
    email: z.string().email("Use a valid email"),
    phone: z.string().min(6, "Add a phone number"),
    location: z.string().min(2, "Add a location"),
    website: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional()
  })
});

type BasicsForm = z.infer<typeof basicsSchema>;

function SortableSection({
  id,
  title,
  visible,
  onToggle,
  onRename
}: {
  id: SectionKey;
  title: string;
  visible: boolean;
  onToggle: () => void;
  onRename: (title: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("flex items-center gap-2 rounded-md border bg-background p-2", isDragging && "shadow-lift")}
    >
      <button type="button" className="cursor-grab rounded p-1 text-muted-foreground hover:bg-muted" {...attributes} {...listeners} aria-label="Drag section">
        <GripVertical className="size-4" />
      </button>
      <Input value={title} onChange={(event) => onRename(event.target.value)} className="h-8 border-0 bg-transparent shadow-none focus-visible:ring-1" />
      <Switch checked={visible} onCheckedChange={onToggle} aria-label={`Toggle ${title}`} />
      {visible ? <Eye className="size-4 text-muted-foreground" /> : <EyeOff className="size-4 text-muted-foreground" />}
    </div>
  );
}

export function ResumeEditor() {
  const { resume } = useActiveResume();
  const [previewOpen, setPreviewOpen] = useState(false);
  const patchActiveResume = useResumeStore((state) => state.patchActiveResume);
  const patchPersonal = useResumeStore((state) => state.patchPersonal);
  const reorderSections = useResumeStore((state) => state.reorderSections);
  const toggleSectionVisibility = useResumeStore((state) => state.toggleSectionVisibility);
  const renameSection = useResumeStore((state) => state.renameSection);
  const saveVersion = useResumeStore((state) => state.saveVersion);
  const undo = useResumeStore((state) => state.undo);
  const redo = useResumeStore((state) => state.redo);
  const allVersions = useResumeStore((state) => state.versions);
  const restoreVersion = useResumeStore((state) => state.restoreVersion);
  const versions = useMemo(() => allVersions.filter((version) => version.resumeId === resume.id), [allVersions, resume.id]);
  const form = useForm<BasicsForm>({
    resolver: zodResolver(basicsSchema),
    defaultValues: {
      title: resume.title,
      targetRole: resume.targetRole,
      targetCompany: resume.targetCompany ?? "",
      personal: resume.personal
    },
    mode: "onChange"
  });

  useEffect(() => {
    form.reset({
      title: resume.title,
      targetRole: resume.targetRole,
      targetCompany: resume.targetCompany ?? "",
      personal: resume.personal
    });
    // Reset only when switching drafts; resetting on every autosave makes text editing jumpy.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, resume.id]);

  const shortcuts = useMemo(
    () => ({
      "mod+s": () => {
        saveVersion("Manual save");
        toast.success("Version saved");
      },
      "mod+z": () => undo(),
      "mod+shift+z": () => redo()
    }),
    [redo, saveVersion, undo]
  );
  useKeyboardShortcuts(shortcuts);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const orderedSections = [...resume.sections].sort((a, b) => a.order - b.order);
  const visibleSections = orderedSections.filter((section) => section.visible);

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const keys = orderedSections.map((section) => section.key);
    const oldIndex = keys.indexOf(active.id as SectionKey);
    const newIndex = keys.indexOf(over.id as SectionKey);
    reorderSections(arrayMove(keys, oldIndex, newIndex));
  }

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle>Resume Editor</CardTitle>
                <CardDescription>Autosaves locally on every change. Use Cmd/Ctrl+S to save a named version.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setPreviewOpen(true)}>
                  <Eye />
                  Check CV
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    saveVersion("Manual save");
                    toast.success("Version saved");
                  }}
                >
                  <Save />
                  Save version
                </Button>
                <Button type="button" variant="ghost" onClick={undo}>
                  <Undo2 />
                  Undo
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-3">
              <Controller
                control={form.control}
                name="title"
                render={({ field }) => (
                  <div className="grid gap-2">
                    <Label>Draft title</Label>
                    <Input
                      {...field}
                      onChange={(event) => {
                        field.onChange(event);
                        patchActiveResume({ title: event.target.value });
                      }}
                    />
                  </div>
                )}
              />
              <Controller
                control={form.control}
                name="targetRole"
                render={({ field }) => (
                  <div className="grid gap-2">
                    <Label>Target role</Label>
                    <Input
                      {...field}
                      onChange={(event) => {
                        field.onChange(event);
                        patchActiveResume({ targetRole: event.target.value });
                      }}
                    />
                  </div>
                )}
              />
              <Controller
                control={form.control}
                name="targetCompany"
                render={({ field }) => (
                  <div className="grid gap-2">
                    <Label>Target company</Label>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      onChange={(event) => {
                        field.onChange(event);
                        patchActiveResume({ targetCompany: event.target.value });
                      }}
                    />
                  </div>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {(["fullName", "headline", "email", "phone", "location", "website", "linkedin", "github"] as const).map((key) => (
                <Controller
                  key={key}
                  control={form.control}
                  name={`personal.${key}`}
                  render={({ field, fieldState }) => (
                    <div className="grid gap-2">
                      <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        onChange={(event) => {
                          field.onChange(event);
                          patchPersonal({ [key]: event.target.value });
                        }}
                      />
                      {fieldState.error ? <p className="text-xs text-destructive">{fieldState.error.message}</p> : null}
                    </div>
                  )}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {visibleSections.map((section) => (
          <ResumeSectionEditor key={section.key} sectionKey={section.key} title={section.title} />
        ))}
      </div>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ArrowDownUp className="size-5 text-primary" />
              <CardTitle>Sections</CardTitle>
            </div>
            <CardDescription>Drag sections to reorder. Toggle visibility for tailored versions.</CardDescription>
          </CardHeader>
          <CardContent>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={orderedSections.map((section) => section.key)} strategy={verticalListSortingStrategy}>
                <div className="grid gap-2">
                  {orderedSections.map((section) => (
                    <SortableSection
                      key={section.key}
                      id={section.key}
                      title={section.title}
                      visible={section.visible}
                      onToggle={() => toggleSectionVisibility(section.key)}
                      onRename={(title) => renameSection(section.key, title)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="size-5 text-primary" />
              <CardTitle>Version History</CardTitle>
            </div>
            <CardDescription>Restore a snapshot when tailoring for different companies.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {versions.length ? (
              versions.slice(0, 6).map((version) => (
                <button
                  key={version.id}
                  type="button"
                  onClick={() => restoreVersion(version.id)}
                  className="flex items-center justify-between rounded-md border bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                >
                  <span>{version.label}</span>
                  <RotateCcw className="size-4 text-muted-foreground" />
                </button>
              ))
            ) : (
              <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">No saved versions yet.</p>
            )}
          </CardContent>
        </Card>
        </aside>
      </div>

      {previewOpen ? (
        <div className="fixed inset-0 z-50 bg-background/85 p-4 backdrop-blur-sm no-print" role="dialog" aria-modal="true" aria-label="CV preview">
          <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-lg border bg-background shadow-lift">
            <div className="flex items-center justify-between gap-4 border-b px-5 py-3">
              <div>
                <h2 className="text-lg font-semibold">CV Preview</h2>
                <p className="text-sm text-muted-foreground">Review the latest version of your resume, then close to keep editing.</p>
              </div>
              <Button type="button" variant="ghost" size="icon" aria-label="Close CV preview" onClick={() => setPreviewOpen(false)}>
                <X />
              </Button>
            </div>
            <div className="flex-1 overflow-auto bg-muted/50 p-6">
              <ResumePreview resume={resume} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
