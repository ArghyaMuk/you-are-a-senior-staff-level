import { NextResponse } from "next/server";
import { claudeStream } from "@/lib/claude";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return await claudeStream({
      message: body.message,
      messages: body.messages,
      resume: body.resume,
      atsReport: body.atsReport,
      instruction:
        "Answer as a resume coaching agent. If asked to rewrite, provide polished alternatives. If asked to diagnose, prioritize fixes by impact."
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "AI chat failed" }, { status: 500 });
  }
}
