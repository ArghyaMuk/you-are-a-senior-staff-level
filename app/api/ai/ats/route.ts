import { NextResponse } from "next/server";
import { analyzeATS } from "@/lib/ats-engine";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const report = analyzeATS(body.resume, body.jobDescription ?? body.resume?.jobDescription ?? "");
    return NextResponse.json({ report });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "ATS analysis failed" }, { status: 500 });
  }
}
