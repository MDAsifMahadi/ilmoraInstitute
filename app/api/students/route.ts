import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequestAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const user = await verifyRequestAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      dateOfBirth,
      age,
      gender,
      guardianName,
      guardianPhone,
      address,
      country,
      notes,
      categoryId,
      courseId,
      preferredTime,
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const student = await prisma.student.create({
      data: {
        name,
        phone,
        email: email || null,
        dateOfBirth: dateOfBirth || null,
        age: age || null,
        gender: gender || null,
        guardianName: guardianName || null,
        guardianPhone: guardianPhone || null,
        address: address || null,
        country: country || null,
        notes: notes || null,
        status: "ACTIVE",
      },
    });

    // Create a confirmed admission so the student appears as enrolled
    await prisma.admission.create({
      data: {
        studentId: student.id,
        categoryId: categoryId || null,
        courseId: courseId || null,
        preferredTime: preferredTime || null,
        status: "CONFIRMED",
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}
