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

    const existing = await prisma.course.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "This slug is already in use" },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
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

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const where: Record<string, unknown> = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (searchParams.get("published") === "true") {
      where.isPublished = true;
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      include: {
        category: true,
        _count: { select: { admissions: true } },
      },
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to find courses" },
      { status: 500 }
    );
  }
}
