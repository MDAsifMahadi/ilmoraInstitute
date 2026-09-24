import { prisma } from "@/lib/prisma";
import {
  Users,
  UserPlus,
  CalendarDays,
  Calendar,
  BookOpen,
  FolderOpen,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import StudentGrowthChart from "@/components/admin/StudentGrowthChart";
import RecentStudentsTable from "@/components/admin/RecentStudentsTable";

export const metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const now = new Date();

  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const enrolledWhere = { status: "CONFIRMED" as const };

  const [
    totalStudents,
    newToday,
    newThisWeek,
    newThisMonth,
    totalCategories,
    totalCourses,
    pendingAdmissions,
    recentStudents,
    growthData,
  ] = await Promise.all([
    prisma.student.count({
      where: { admissions: { some: enrolledWhere } },
    }),
    prisma.admission.count({
      where: { ...enrolledWhere, createdAt: { gte: todayStart } },
    }),
    prisma.admission.count({
      where: { ...enrolledWhere, createdAt: { gte: weekStart } },
    }),
    prisma.admission.count({
      where: { ...enrolledWhere, createdAt: { gte: monthStart } },
    }),
    prisma.category.count(),
    prisma.course.count(),
    prisma.admission.count({ where: { status: "PENDING" } }),
    prisma.student.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      where: { admissions: { some: { status: "CONFIRMED" } } },
      include: {
admissions: {
        where: { status: "CONFIRMED" },
        include: {
          course: {
            include: { category: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      },
    }),
    // Get growth data for the last 30 days
    (async () => {
      const result: { date: string; count: number }[] = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dayStart = new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate()
        );
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const count = await prisma.admission.count({
          where: {
            status: "CONFIRMED",
            createdAt: {
              gte: dayStart,
              lt: dayEnd,
            },
          },
        });

        result.push({
          date: `${dayStart.getMonth() + 1}/${dayStart.getDate()}`,
          count,
        });
      }
      return result;
    })(),
  ]);

  const stats = [
    {
      label: "Total Students",
      value: totalStudents,
      icon: <Users size={20} />,
      color: "bg-primary-mist text-primary",
    },
    {
      label: "New Today",
      value: newToday,
      icon: <UserPlus size={20} />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "This Week",
      value: newThisWeek,
      icon: <CalendarDays size={20} />,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "This Month",
      value: newThisMonth,
      icon: <Calendar size={20} />,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Categories",
      value: totalCategories,
      icon: <FolderOpen size={20} />,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Courses",
      value: totalCourses,
      icon: <BookOpen size={20} />,
      color: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink">Dashboard</h1>
          <p className="mt-0.5 text-sm text-grey">
            Ilmora Institute — Overview
          </p>
        </div>
        <div className="hidden rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-grey sm:inline-flex">
          {new Date(now).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-line bg-white p-3.5 sm:p-4"
          >
            <div className="flex items-center justify-between">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg sm:h-9 sm:w-9 ${stat.color}`}
              >
                {stat.icon}
              </span>
            </div>
            <p className="mt-2.5 text-xl font-bold text-ink sm:text-2xl">
              {stat.value}
            </p>
            <p className="mt-0.5 truncate text-xs text-grey">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Pending Admissions Banner */}
      {pendingAdmissions > 0 && (
        <Link
          href="/admin/students/requests"
          className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm transition-colors hover:bg-amber-100/60 sm:px-4"
        >
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <TrendingUp size={16} />
          </span>
          <span className="min-w-0 text-amber-800">
            <strong>{pendingAdmissions}</strong> student admissions{" "}
            <span className="hidden sm:inline">pending approval</span>
          </span>
        </Link>
      )}

      {/* Charts & Recent */}
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        {/* Student Growth Chart */}
        <div className="min-w-0 rounded-xl border border-line bg-white p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-ink">Student Growth</h2>
            <p className="mt-0.5 text-xs text-grey">
              New enrollments in the last 30 days
            </p>
          </div>
          <StudentGrowthChart data={growthData} />
        </div>

        {/* Recent Students */}
        <div className="min-w-0 rounded-xl border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-5">
            <div>
              <h2 className="text-sm font-bold text-ink">Recent Students</h2>
              <p className="mt-0.5 text-xs text-grey">
                Latest enrolled students
              </p>
            </div>
            <Link
              href="/admin/students"
              className="text-xs font-medium text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <RecentStudentsTable students={recentStudents} />
        </div>
      </div>
    </div>
  );
}
