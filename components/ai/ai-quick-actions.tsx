"use client";

import { FilePenLine, MailPlus, SearchCheck, Sparkles, Target, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { aiQuickActions } from "@/lib/sample-data";

const icons = {
  tailor: Target,
  ats: SearchCheck,
  bullets: Wand2,
  summary: FilePenLine,
  keywords: Sparkles,
  cover: MailPlus
};

export function AIQuickActions({ onSelect, disabled }: { onSelect: (prompt: string) => void; disabled?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {aiQuickActions.map((action) => {
        const Icon = icons[action.id as keyof typeof icons] ?? Sparkles;
        return (
          <Button key={action.id} type="button" size="sm" variant="outline" onClick={() => onSelect(action.prompt)} disabled={disabled}>
            <Icon />
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}
