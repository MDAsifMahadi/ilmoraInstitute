import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      guardianName,
      guardianPhone,
      studentName,
      studentAge,
      gender,
      course,
      preferredTime,
      address,
      additional,
    } = body;

    // Validate required fields
    if (!guardianName || !guardianPhone || !studentName || !studentAge) {
      return NextResponse.json(
        { error: "Guardian name, phone, student name, and age are required" },
        { status: 400 }
      );
    }

    // Find the course by slug
    let courseId: string | null = null;
    let categoryId: string | null = null;

    if (course && course !== "undecided") {
      const courseRecord = await prisma.course.findUnique({
        where: { slug: course },
        select: { id: true, categoryId: true },
      });

      if (courseRecord) {
        courseId = courseRecord.id;
        categoryId = courseRecord.categoryId;
      }
    }

    // Create student
    const student = await prisma.student.create({
      data: {
        name: studentName,
        phone: guardianPhone,
        age: parseInt(studentAge),
        gender: gender || null,
        guardianName,
        guardianPhone,
        address: address || null,
        notes: additional || null,
        status: "ACTIVE",
      },
    });

    // Create admission
    await prisma.admission.create({
      data: {
        studentId: student.id,
        categoryId,
        courseId,
        preferredTime: preferredTime || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admission submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admission:", error);
    return NextResponse.json(
      { error: "Failed to submit admission. Please try again." },
      { status: 500 }
    );
  }
}
