import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "ইমেইল এবং পাসওয়ার্ড উভয়ই প্রয়োজন" },
        { status: 400 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    // First-run bootstrap: if no admin user exists yet, create one
    // using the ADMIN_EMAIL / ADMIN_PASSWORD env vars so the panel
    // is usable immediately after deployment.
    if (!user) {
      const userCount = await prisma.user.count();
      if (
        userCount === 0 &&
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
      ) {
        const hashedPassword = await bcrypt.hash(password, 12);
        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            name: "Admin",
            role: "admin",
          },
        });
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "ইমেইল বা পাসওয়ার্ড ভুল" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "ইমেইল বা পাসওয়ার্ড ভুল" },
        { status: 401 }
      );
    }

    const token = await createToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "লগইনে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}