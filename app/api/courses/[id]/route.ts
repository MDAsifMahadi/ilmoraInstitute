import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequestAuth } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyRequestAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const {
      categoryId,
      title,
      slug,
      tagline,
      shortDescription,
      description,
      badge,
      level,
      icon,
      image,
      outcomes,
      curriculum,
      duration,
      sessionsPerWeek,
      ageRange,
      format,
      price,
      sortOrder,
      isPublished,
    } = body;

    if (!categoryId || !title || !slug) {
      return NextResponse.json(
        { error: "Category, title, and slug are required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.update({
      where: { id },
      data: {
        categoryId,
        title,
        slug,
        tagline: tagline || null,
        shortDescription: shortDescription || null,
        description: description || null,
        badge: badge || null,
        level: level || null,
        icon: icon || null,
        image: image || null,
        outcomes: Array.isArray(outcomes) ? outcomes : [],
        curriculum: Array.isArray(curriculum) ? curriculum : [],
        duration: duration || null,
        sessionsPerWeek: sessionsPerWeek || null,
        ageRange: ageRange || null,
        format: format || null,
        price: price || null,
        sortOrder: sortOrder || 0,
        isPublished: isPublished || false,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyRequestAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const course = await prisma.course.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyRequestAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
