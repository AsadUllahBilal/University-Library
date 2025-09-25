import { headers } from "next/headers";
import { NextResponse } from "next/server";
import ratelimit from "@/lib/ratelimit";

export async function POST(req: Request) {
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json();
  return NextResponse.json({ ok: true, body });
}
