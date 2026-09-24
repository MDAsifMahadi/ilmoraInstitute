import { NextRequest, NextResponse } from "next/server";
import { verifyRequestAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await verifyRequestAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user });
}
