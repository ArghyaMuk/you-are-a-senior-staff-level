"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { Bot, CornerDownLeft, Loader2, Sparkles, User } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { AIQuickActions } from "@/components/ai/ai-quick-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { analyzeATS } from "@/lib/ats-engine";
import { uid } from "@/lib/utils";
import { useActiveResume } from "@/hooks/use-active-resume";
import { useResumeStore } from "@/store/resume-store";

const starterPrompts = [
  "Which three bullets should I fix first?",
  "Make my summary more senior without exaggerating.",
  "What keywords am I missing for this job description?"
];

export function AIAgentPanel({ compact = false }: { compact?: boolean }) {
  const { resume } = useActiveResume();
  const aiMessages = useResumeStore((state) => state.aiMessages);
  const appendAIMessage = useResumeStore((state) => state.appendAIMessage);
  const updateAIMessage = useResumeStore((state) => state.updateAIMessage);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const atsReport = useMemo(() => analyzeATS(resume), [resume]);
  const messages = useMemo(() => aiMessages[resume.id] ?? [], [aiMessages, resume.id]);

  async function sendMessage(content = input) {
    const trimmed = content.trim();
    if (!trimmed || isStreaming) return;

    const userMessage = {
      id: uid("msg"),
      role: "user" as const,
      content: trimmed,
      createdAt: new Date().toISOString()
    };
    const assistantId = uid("msg");

    appendAIMessage(resume.id, userMessage);
    appendAIMessage(resume.id, {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
      pending: true
    });
    setInput("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          messages: [...messages, userMessage].slice(-10),
          resume,
          atsReport
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      if (!response.body) {
        const data = (await response.json()) as { content: string };
        updateAIMessage(resume.id, assistantId, { content: data.content, pending: false });
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let contentBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        contentBuffer += decoder.decode(value, { stream: true });
        updateAIMessage(resume.id, assistantId, { content: contentBuffer, pending: false });
      }

      updateAIMessage(resume.id, assistantId, { pending: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "AI request failed";
      updateAIMessage(resume.id, assistantId, {
        content: "I could not reach the AI service. Check your Anthropic API key or try again in demo mode.",
        pending: false
      });
      toast.error(message);
    } finally {
      setIsStreaming(false);
      textAreaRef.current?.focus();
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void sendMessage();
  }

  return (
    <Card className="flex min-h-[640px] flex-col overflow-hidden">
      <CardHeader className="border-b bg-card/80">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Sparkles className="size-4" />
              </span>
              <div>
                <CardTitle>AI Resume Coach</CardTitle>
                <CardDescription>Claude Sonnet-powered coaching with resume JSON and ATS context.</CardDescription>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">{resume.targetRole || "Target role unset"}</Badge>
            <Badge variant={atsReport.score >= 80 ? "success" : "warning"}>{atsReport.score} ATS</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 p-4">
        <AIQuickActions onSelect={(prompt) => void sendMessage(prompt)} disabled={isStreaming} />

        <div className="flex-1 space-y-4 overflow-y-auto rounded-lg border bg-background p-4">
          {messages.length === 0 ? (
            <div className="flex h-full min-h-[260px] flex-col items-center justify-center text-center">
              <Bot className="size-10 text-primary" />
              <h3 className="mt-3 text-base font-semibold">Ask for a high-signal edit</h3>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {starterPrompts.map((prompt) => (
                  <Button key={prompt} variant="outline" size="sm" onClick={() => void sendMessage(prompt)}>
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={message.role === "user" ? "ml-auto max-w-[82%]" : "mr-auto max-w-[86%]"}
              >
                <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                  {message.role === "user" ? <User className="size-3" /> : <Bot className="size-3" />}
                  {message.role === "user" ? "You" : "RésuméForge AI"}
                  {message.pending ? <Loader2 className="size-3 animate-spin" /> : null}
                </div>
                <div
                  className={
                    message.role === "user"
                      ? "rounded-lg bg-primary px-4 py-3 text-sm text-primary-foreground"
                      : "rounded-lg border bg-card px-4 py-3 text-sm leading-6"
                  }
                >
                  {message.content || "Thinking..."}
                </div>
              </motion.div>
            ))
          )}
        </div>

        <form onSubmit={onSubmit} className="rounded-lg border bg-background p-2">
          <Textarea
            ref={textAreaRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                void sendMessage();
              }
            }}
            className="min-h-[88px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
            placeholder="Ask for a rewrite, keyword gap, cover letter, ATS fix, or career coaching..."
          />
          <div className="flex items-center justify-between gap-3 px-2 pb-2">
            <span className="text-xs text-muted-foreground">{compact ? "Context-aware AI" : "Uses active resume, JD, template, and ATS report."}</span>
            <Button type="submit" disabled={isStreaming || !input.trim()}>
              {isStreaming ? <Loader2 className="animate-spin" /> : <CornerDownLeft />}
              Send
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
