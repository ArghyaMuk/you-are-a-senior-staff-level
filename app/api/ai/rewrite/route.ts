import { NextResponse } from "next/server";
import { analyzeATS } from "@/lib/ats-engine";
import { claudeText } from "@/lib/claude";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resume = body.resume;
    const atsReport = resume ? analyzeATS(resume) : undefined;
    const content = await claudeText({
      message: `Rewrite this ${body.type ?? "resume content"}:\n\n${body.text ?? ""}`,
      resume,
      atsReport,
      instruction: "Return concise rewritten content only, with no invented facts."
    });

    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Rewrite failed" }, { status: 500 });
  }
}
