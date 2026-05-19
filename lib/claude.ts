import type { AIMessage, ATSReport, ResumeData } from "@/types/resume";

type ClaudeMessage = {
  role: "user" | "assistant";
  content: string;
};

type ClaudeRequest = {
  message?: string;
  messages?: AIMessage[];
  resume?: ResumeData;
  atsReport?: ATSReport;
  instruction?: string;
  stream?: boolean;
};

const anthropicEndpoint = "https://api.anthropic.com/v1/messages";

function buildSystemPrompt(resume?: ResumeData, atsReport?: ATSReport, instruction?: string) {
  const resumeContext = resume ? JSON.stringify(resume).slice(0, 12000) : "{}";
  const atsContext = atsReport ? JSON.stringify(atsReport).slice(0, 8000) : "{}";

  return [
    "You are RésuméForge AI, an expert ATS resume strategist and senior career coach.",
    "Be specific, truthful, concise, and action oriented. Never invent credentials, metrics, companies, or dates.",
    "When rewriting, preserve factual claims and improve clarity, seniority, metrics, and keyword alignment.",
    "Prefer bullets that start with strong action verbs and include scope, method, and measurable outcome.",
    instruction ? `Task instruction: ${instruction}` : "",
    `Active resume JSON: ${resumeContext}`,
    `ATS report JSON: ${atsContext}`
  ]
    .filter(Boolean)
    .join("\n\n");
}

function toClaudeMessages(messages?: AIMessage[], message?: string): ClaudeMessage[] {
  const history = (messages ?? [])
    .filter((item) => item.role === "user" || item.role === "assistant")
    .map((item) => ({ role: item.role, content: item.content }))
    .filter((item) => item.content.trim().length > 0);

  if (message && history[history.length - 1]?.content !== message) {
    history.push({ role: "user", content: message });
  }

  return history.length ? history.slice(-12) : [{ role: "user", content: message ?? "Review my resume." }];
}

function fallbackText(request: ClaudeRequest) {
  const missing = request.atsReport?.missingKeywords?.slice(0, 6).join(", ");
  const score = request.atsReport?.score;
  return [
    score ? `Your current ATS score is ${score}.` : "I reviewed the current resume context.",
    missing ? `The most valuable keyword gaps are: ${missing}.` : "Your keyword coverage is in good shape for the pasted job description.",
    "Highest-impact next steps:",
    "1. Add measurable outcomes to bullets that do not include scope, volume, revenue, time saved, adoption, or quality impact.",
    "2. Mirror exact job-description language only where it is truthful and supported by your experience.",
    "3. Keep formatting simple: standard headings, bullet lists, one-column flow for ATS export, and no text boxes.",
    "4. Rewrite weak bullets as: action verb + owned scope + technical/business method + measured result."
  ].join("\n");
}

function streamFallback(text: string) {
  const encoder = new TextEncoder();
  const words = text.split(/(\s+)/);
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const word of words) {
        controller.enqueue(encoder.encode(word));
        await new Promise((resolve) => setTimeout(resolve, 12));
      }
      controller.close();
    }
  });
}

export async function claudeText(request: ClaudeRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return fallbackText(request);

  const response = await fetch(anthropicEndpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: process.env.CLAUDE_MODEL ?? "claude-3-5-sonnet-latest",
      max_tokens: 1600,
      temperature: 0.3,
      system: buildSystemPrompt(request.resume, request.atsReport, request.instruction),
      messages: toClaudeMessages(request.messages, request.message)
    })
  });

  if (!response.ok) {
    throw new Error(`Claude request failed: ${response.status} ${await response.text()}`);
  }

  const data = (await response.json()) as { content?: Array<{ type: string; text?: string }> };
  return data.content?.filter((part) => part.type === "text").map((part) => part.text ?? "").join("") ?? "";
}

export async function claudeStream(request: ClaudeRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(streamFallback(fallbackText(request)), {
      headers: { "content-type": "text/plain; charset=utf-8" }
    });
  }

  const response = await fetch(anthropicEndpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: process.env.CLAUDE_MODEL ?? "claude-3-5-sonnet-latest",
      max_tokens: 1800,
      temperature: 0.35,
      stream: true,
      system: buildSystemPrompt(request.resume, request.atsReport, request.instruction),
      messages: toClaudeMessages(request.messages, request.message)
    })
  });

  if (!response.ok || !response.body) {
    throw new Error(`Claude stream failed: ${response.status} ${await response.text()}`);
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = response.body.getReader();
  let buffer = "";

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const event = JSON.parse(payload) as { type?: string; delta?: { type?: string; text?: string } };
            if (event.type === "content_block_delta" && event.delta?.type === "text_delta" && event.delta.text) {
              controller.enqueue(encoder.encode(event.delta.text));
              return;
            }
          } catch {
            // Ignore malformed SSE keepalive frames.
          }
        }
      }
    },
    cancel() {
      void reader.cancel();
    }
  });

  return new Response(stream, {
    headers: { "content-type": "text/plain; charset=utf-8" }
  });
}
