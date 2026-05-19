import { NextResponse } from "next/server";
import { analyzeJobDescription } from "@/lib/jd-analyzer";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const analysis = analyzeJobDescription(body.jobDescription ?? "", body.resume);
    return NextResponse.json({ analysis });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "JD analysis failed" }, { status: 500 });
  }
}
