"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  AchievementItem,
  AIMessage,
  CertificationItem,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeData,
  ResumeTemplateId,
  ResumeVersion,
  SectionKey,
  SkillGroup
} from "@/types/resume";
import { defaultSections, sampleResume } from "@/lib/sample-data";
import { uid } from "@/lib/utils";

type CollectionKey = "experience" | "education" | "projects" | "certifications" | "skills" | "achievements";

type ResumeStore = {
  resumes: ResumeData[];
  activeResumeId: string;
  versions: ResumeVersion[];
  aiMessages: Record<string, AIMessage[]>;
  undoStack: ResumeData[];
  redoStack: ResumeData[];
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  getActiveResume: () => ResumeData;
  setActiveResume: (id: string) => void;
  createResume: () => string;
  duplicateResume: (id: string) => string | undefined;
  deleteResume: (id: string) => void;
  patchActiveResume: (patch: Partial<ResumeData>) => void;
  patchPersonal: (patch: Partial<ResumeData["personal"]>) => void;
  setTemplate: (template: ResumeTemplateId) => void;
  setJobDescription: (jobDescription: string) => void;
  reorderSections: (keys: SectionKey[]) => void;
  toggleSectionVisibility: (key: SectionKey) => void;
  renameSection: (key: SectionKey, title: string) => void;
  addCollectionItem: (key: CollectionKey) => void;
  updateCollectionItem: (key: CollectionKey, id: string, patch: Record<string, unknown>) => void;
  removeCollectionItem: (key: CollectionKey, id: string) => void;
  addBullet: (key: "experience" | "projects", id: string) => void;
  updateBullet: (key: "experience" | "projects", id: string, index: number, value: string) => void;
  removeBullet: (key: "experience" | "projects", id: string, index: number) => void;
  saveVersion: (label?: string) => void;
  restoreVersion: (versionId: string) => void;
  undo: () => void;
  redo: () => void;
  appendAIMessage: (resumeId: string, message: AIMessage) => void;
  updateAIMessage: (resumeId: string, messageId: string, patch: Partial<AIMessage>) => void;
  resetDemoData: () => void;
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function freshResume() {
  const now = new Date().toISOString();
  const resume = clone(sampleResume);
  resume.id = uid("resume");
  resume.title = "Untitled Resume";
  resume.targetCompany = "";
  resume.createdAt = now;
  resume.updatedAt = now;
  return resume;
}

function addHistory(state: ResumeStore, active: ResumeData) {
  return {
    undoStack: [...state.undoStack, clone(active)].slice(-30),
    redoStack: []
  };
}

function emptyItem(key: CollectionKey) {
  if (key === "experience") {
    return {
      id: uid("exp"),
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: ["Built "],
      technologies: []
    } satisfies ExperienceItem;
  }

  if (key === "education") {
    return {
      id: uid("edu"),
      school: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      details: []
    } satisfies EducationItem;
  }

  if (key === "projects") {
    return {
      id: uid("project"),
      name: "",
      description: "",
      url: "",
      bullets: ["Delivered "],
      technologies: []
    } satisfies ProjectItem;
  }

  if (key === "certifications") {
    return {
      id: uid("cert"),
      name: "",
      issuer: "",
      date: "",
      credentialUrl: ""
    } satisfies CertificationItem;
  }

  if (key === "skills") {
    return {
      id: uid("skill"),
      label: "New Skill Group",
      skills: []
    } satisfies SkillGroup;
  }

  return {
    id: uid("ach"),
    label: "",
    metric: ""
  } satisfies AchievementItem;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resumes: [sampleResume],
      activeResumeId: sampleResume.id,
      versions: [],
      aiMessages: {
        [sampleResume.id]: [
          {
            id: uid("msg"),
            role: "assistant",
            content:
              "I have your resume context loaded. Paste a job description or ask me to strengthen bullets, rewrite the summary, or close ATS gaps.",
            createdAt: new Date().toISOString()
          }
        ]
      },
      undoStack: [],
      redoStack: [],
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      getActiveResume: () => {
        const state = get();
        return state.resumes.find((resume) => resume.id === state.activeResumeId) ?? state.resumes[0] ?? sampleResume;
      },
      setActiveResume: (id) => set({ activeResumeId: id, undoStack: [], redoStack: [] }),
      createResume: () => {
        const resume = freshResume();
        set((state) => ({
          resumes: [resume, ...state.resumes],
          activeResumeId: resume.id,
          aiMessages: {
            ...state.aiMessages,
            [resume.id]: []
          },
          undoStack: [],
          redoStack: []
        }));
        return resume.id;
      },
      duplicateResume: (id) => {
        const source = get().resumes.find((resume) => resume.id === id);
        if (!source) return undefined;
        const now = new Date().toISOString();
        const duplicate = {
          ...clone(source),
          id: uid("resume"),
          title: `${source.title} Copy`,
          createdAt: now,
          updatedAt: now
        };
        set((state) => ({
          resumes: [duplicate, ...state.resumes],
          activeResumeId: duplicate.id,
          aiMessages: { ...state.aiMessages, [duplicate.id]: [] },
          undoStack: [],
          redoStack: []
        }));
        return duplicate.id;
      },
      deleteResume: (id) =>
        set((state) => {
          const resumes = state.resumes.filter((resume) => resume.id !== id);
          const next = resumes[0] ?? freshResume();
          return {
            resumes: resumes.length ? resumes : [next],
            activeResumeId: state.activeResumeId === id ? next.id : state.activeResumeId,
            versions: state.versions.filter((version) => version.resumeId !== id),
            undoStack: [],
            redoStack: []
          };
        }),
      patchActiveResume: (patch) =>
        set((state) => {
          const active = state.resumes.find((resume) => resume.id === state.activeResumeId);
          if (!active) return state;
          const now = new Date().toISOString();
          return {
            ...addHistory(state, active),
            resumes: state.resumes.map((resume) => (resume.id === active.id ? { ...resume, ...patch, updatedAt: now } : resume))
          };
        }),
      patchPersonal: (patch) =>
        set((state) => {
          const active = state.resumes.find((resume) => resume.id === state.activeResumeId);
          if (!active) return state;
          return {
            ...addHistory(state, active),
            resumes: state.resumes.map((resume) =>
              resume.id === active.id ? { ...resume, personal: { ...resume.personal, ...patch }, updatedAt: new Date().toISOString() } : resume
            )
          };
        }),
      setTemplate: (template) => get().patchActiveResume({ template }),
      setJobDescription: (jobDescription) => get().patchActiveResume({ jobDescription }),
      reorderSections: (keys) =>
        set((state) => {
          const active = state.resumes.find((resume) => resume.id === state.activeResumeId);
          if (!active) return state;
          const sections = keys
            .map((key) => active.sections.find((section) => section.key === key) ?? defaultSections.find((section) => section.key === key)!)
            .map((section, order) => ({ ...section, order }));
          return {
            ...addHistory(state, active),
            resumes: state.resumes.map((resume) => (resume.id === active.id ? { ...resume, sections, updatedAt: new Date().toISOString() } : resume))
          };
        }),
      toggleSectionVisibility: (key) =>
        set((state) => {
          const active = state.resumes.find((resume) => resume.id === state.activeResumeId);
          if (!active) return state;
          return {
            ...addHistory(state, active),
            resumes: state.resumes.map((resume) =>
              resume.id === active.id
                ? {
                    ...resume,
                    sections: resume.sections.map((section) => (section.key === key ? { ...section, visible: !section.visible } : section)),
                    updatedAt: new Date().toISOString()
                  }
                : resume
            )
          };
        }),
      renameSection: (key, title) =>
        set((state) => {
          const active = state.resumes.find((resume) => resume.id === state.activeResumeId);
          if (!active) return state;
          return {
            ...addHistory(state, active),
            resumes: state.resumes.map((resume) =>
              resume.id === active.id
                ? {
                    ...resume,
                    sections: resume.sections.map((section) => (section.key === key ? { ...section, title } : section)),
                    updatedAt: new Date().toISOString()
                  }
                : resume
            )
          };
        }),
      addCollectionItem: (key) =>
        set((state) => {
          const active = state.resumes.find((resume) => resume.id === state.activeResumeId);
          if (!active) return state;
          return {
            ...addHistory(state, active),
            resumes: state.resumes.map((resume) =>
              resume.id === active.id
                ? {
                    ...resume,
                    [key]: [emptyItem(key), ...(resume[key] as unknown[])],
                    updatedAt: new Date().toISOString()
                  }
                : resume
            )
          };
        }),
      updateCollectionItem: (key, id, patch) =>
        set((state) => {
          const active = state.resumes.find((resume) => resume.id === state.activeResumeId);
          if (!active) return state;
          return {
            ...addHistory(state, active),
            resumes: state.resumes.map((resume) =>
              resume.id === active.id
                ? {
                    ...resume,
                    [key]: (resume[key] as Array<{ id: string }>).map((item) => (item.id === id ? { ...item, ...patch } : item)),
                    updatedAt: new Date().toISOString()
                  }
                : resume
            )
          };
        }),
      removeCollectionItem: (key, id) =>
        set((state) => {
          const active = state.resumes.find((resume) => resume.id === state.activeResumeId);
          if (!active) return state;
          return {
            ...addHistory(state, active),
            resumes: state.resumes.map((resume) =>
              resume.id === active.id
                ? {
                    ...resume,
                    [key]: (resume[key] as Array<{ id: string }>).filter((item) => item.id !== id),
                    updatedAt: new Date().toISOString()
                  }
                : resume
            )
          };
        }),
      addBullet: (key, id) =>
        set((state) => {
          const active = state.resumes.find((resume) => resume.id === state.activeResumeId);
          if (!active) return state;
          return {
            ...addHistory(state, active),
            resumes: state.resumes.map((resume) =>
              resume.id === active.id
                ? {
                    ...resume,
                    [key]: resume[key].map((item) => (item.id === id ? { ...item, bullets: [...item.bullets, ""] } : item)),
                    updatedAt: new Date().toISOString()
                  }
                : resume
            )
          };
        }),
      updateBullet: (key, id, index, value) =>
        set((state) => {
          const active = state.resumes.find((resume) => resume.id === state.activeResumeId);
          if (!active) return state;
          return {
            ...addHistory(state, active),
            resumes: state.resumes.map((resume) =>
              resume.id === active.id
                ? {
                    ...resume,
                    [key]: resume[key].map((item) =>
                      item.id === id ? { ...item, bullets: item.bullets.map((bullet, bulletIndex) => (bulletIndex === index ? value : bullet)) } : item
                    ),
                    updatedAt: new Date().toISOString()
                  }
                : resume
            )
          };
        }),
      removeBullet: (key, id, index) =>
        set((state) => {
          const active = state.resumes.find((resume) => resume.id === state.activeResumeId);
          if (!active) return state;
          return {
            ...addHistory(state, active),
            resumes: state.resumes.map((resume) =>
              resume.id === active.id
                ? {
                    ...resume,
                    [key]: resume[key].map((item) =>
                      item.id === id ? { ...item, bullets: item.bullets.filter((_, bulletIndex) => bulletIndex !== index) } : item
                    ),
                    updatedAt: new Date().toISOString()
                  }
                : resume
            )
          };
        }),
      saveVersion: (label) =>
        set((state) => {
          const active = state.resumes.find((resume) => resume.id === state.activeResumeId);
          if (!active) return state;
          const version: ResumeVersion = {
            id: uid("version"),
            resumeId: active.id,
            label: label || `Version ${state.versions.filter((item) => item.resumeId === active.id).length + 1}`,
            snapshot: clone(active),
            createdAt: new Date().toISOString()
          };
          return { versions: [version, ...state.versions].slice(0, 60) };
        }),
      restoreVersion: (versionId) =>
        set((state) => {
          const version = state.versions.find((item) => item.id === versionId);
          if (!version) return state;
          const active = state.resumes.find((resume) => resume.id === version.resumeId);
          return {
            ...(active ? addHistory(state, active) : {}),
            resumes: state.resumes.map((resume) => (resume.id === version.resumeId ? { ...clone(version.snapshot), updatedAt: new Date().toISOString() } : resume)),
            activeResumeId: version.resumeId
          };
        }),
      undo: () =>
        set((state) => {
          const active = state.resumes.find((resume) => resume.id === state.activeResumeId);
          if (!active) return state;
          const index = state.undoStack.map((item) => item.id).lastIndexOf(active.id);
          if (index < 0) return state;
          const previous = state.undoStack[index];
          return {
            resumes: state.resumes.map((resume) => (resume.id === active.id ? clone(previous) : resume)),
            undoStack: state.undoStack.filter((_, itemIndex) => itemIndex !== index),
            redoStack: [...state.redoStack, clone(active)].slice(-30)
          };
        }),
      redo: () =>
        set((state) => {
          const active = state.resumes.find((resume) => resume.id === state.activeResumeId);
          if (!active) return state;
          const index = state.redoStack.map((item) => item.id).lastIndexOf(active.id);
          if (index < 0) return state;
          const next = state.redoStack[index];
          return {
            resumes: state.resumes.map((resume) => (resume.id === active.id ? clone(next) : resume)),
            redoStack: state.redoStack.filter((_, itemIndex) => itemIndex !== index),
            undoStack: [...state.undoStack, clone(active)].slice(-30)
          };
        }),
      appendAIMessage: (resumeId, message) =>
        set((state) => ({
          aiMessages: {
            ...state.aiMessages,
            [resumeId]: [...(state.aiMessages[resumeId] ?? []), message]
          }
        })),
      updateAIMessage: (resumeId, messageId, patch) =>
        set((state) => ({
          aiMessages: {
            ...state.aiMessages,
            [resumeId]: (state.aiMessages[resumeId] ?? []).map((message) => (message.id === messageId ? { ...message, ...patch } : message))
          }
        })),
      resetDemoData: () =>
        set({
          resumes: [sampleResume],
          activeResumeId: sampleResume.id,
          versions: [],
          aiMessages: {},
          undoStack: [],
          redoStack: []
        })
    }),
    {
      name: "resumeforge-ai-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        resumes: state.resumes,
        activeResumeId: state.activeResumeId,
        versions: state.versions,
        aiMessages: state.aiMessages
      }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true)
    }
  )
);
