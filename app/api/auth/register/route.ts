import { NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Add your name").max(80, "Name is too long"),
  email: z.string().trim().email("Use a valid email").max(120, "Email is too long"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password is too long")
});

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid registration details" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    return NextResponse.json({ error: "An account already exists for this email." }, { status: 409 });
  }

  const { hash, salt } = hashPassword(parsed.data.password);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash: hash,
      passwordSalt: salt,
      tier: "free"
    }
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
