import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequestAuth } from "@/lib/auth";
import ExcelJS from "exceljs";

export async function GET(request: NextRequest) {
  const user = await verifyRequestAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const where: Record<string, unknown> = {
      admissions: {
        some: { status: "CONFIRMED" },
      },
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const students = await prisma.student.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        admissions: {
          where: { status: "CONFIRMED" },
          include: {
            course: { include: { category: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const dateFormat = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Ilmora Institute";
    workbook.created = new Date();
    const sheet = workbook.addWorksheet("Students");

    sheet.columns = [
      { header: "Name", key: "name", width: 28 },
      { header: "Phone", key: "phone", width: 18 },
      { header: "Email", key: "email", width: 28 },
      { header: "Gender", key: "gender", width: 12 },
      { header: "Age", key: "age", width: 8 },
      { header: "Date of Birth", key: "dateOfBirth", width: 16 },
      { header: "Guardian Name", key: "guardianName", width: 24 },
      { header: "Guardian Phone", key: "guardianPhone", width: 18 },
      { header: "Address", key: "address", width: 32 },
      { header: "Country", key: "country", width: 16 },
      { header: "Category", key: "category", width: 22 },
      { header: "Course", key: "course", width: 32 },
      { header: "Status", key: "status", width: 12 },
      { header: "Enrolled", key: "enrolled", width: 18 },
      { header: "Notes", key: "notes", width: 40 },
    ];

    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0E6B3A" },
      };
      cell.alignment = { vertical: "middle" };
      cell.border = {
        bottom: { style: "thin", color: { argb: "FF0A5230" } },
      };
    });
    sheet.views = [{ state: "frozen", ySplit: 1 }];
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: sheet.columnCount },
    };

    for (const student of students) {
      const confirmedCourses = student.admissions.map(
        (a) => a.course?.title || "—"
      );
      const confirmedCategories = [
        ...new Set(
          student.admissions.map(
            (a) => a.course?.category?.name || "—"
          )
        ),
      ];
      const enrolledAt = student.admissions[0]?.createdAt;

      sheet.addRow({
        name: student.name,
        phone: student.phone,
        email: student.email || "",
        gender: student.gender || "",
        age: student.age ?? "",
        dateOfBirth: student.dateOfBirth || "",
        guardianName: student.guardianName || "",
        guardianPhone: student.guardianPhone || "",
        address: student.address || "",
        country: student.country || "",
        category: confirmedCategories.join("; "),
        course: confirmedCourses.join("; "),
        status: student.status,
        enrolled: enrolledAt ? dateFormat.format(enrolledAt) : "",
        notes: student.notes || "",
      });
    }

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      row.alignment = { vertical: "top" };
      row.eachCell((cell) => {
        cell.border = {
          bottom: { style: "hair", color: { argb: "FFE4E6E0" } },
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const date = new Date().toISOString().slice(0, 10);
    const fileName = `students-${date}.xlsx`;

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export students" },
      { status: 500 }
    );
  }
}