import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequestAuth } from "@/lib/auth";

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
    const { status } = body;

    if (!["CONFIRMED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const admission = await prisma.admission.update({
      where: { id },
      data: { status },
    });

    if (status === "CONFIRMED") {
      await prisma.student.update({
        where: { id: admission.studentId },
        data: { status: "ACTIVE" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating admission:", error);
    return NextResponse.json(
      { error: "Failed to update admission" },
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
    const admission = await prisma.admission.findUnique({ where: { id } });

    if (!admission) {
      return NextResponse.json(
        { error: "Admission not found" },
        { status: 404 }
      );
    }

    await prisma.admission.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting admission:", error);
    return NextResponse.json(
      { error: "Failed to delete admission" },
      { status: 500 }
    );
  }
}