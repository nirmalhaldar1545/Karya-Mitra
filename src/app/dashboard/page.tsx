"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  DashboardLayout,
  PersonalOverview,
  KPITracking,
  TaskList,
  PerformanceInsights,
  GoalTracking,
  AchievementsBadges,
} from "~/components/dashboard";

export default function EmployeeDashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#13FFAA] border-t-transparent"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  // Role-based routing - Redirect users to their appropriate dashboard
  if (session?.user?.role) {
    const role = session.user.role;
    if (role === "Manager") {
      redirect("/dashboard/manager");
    } else if (role === "HR") {
      redirect("/dashboard/hr");
    } else if (role === "Executive") {
      redirect("/dashboard/executive");
    } else if (role === "Admin") {
      redirect("/dashboard/admin");
    } else if (role !== "Employee") {
      // Unknown role - show access denied
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-950">
          <div className="max-w-md rounded-xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <div className="mb-4 text-6xl">🚫</div>
            <h1 className="mb-2 text-2xl font-bold text-white">Access Denied</h1>
            <p className="mb-4 text-gray-400">
              Unknown role: <span className="font-semibold text-red-400">{role}</span>
            </p>
            <p className="text-sm text-gray-500">
              Please contact your administrator if you believe this is an error.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-block rounded-lg bg-[#13FFAA] px-6 py-2 font-semibold text-gray-950 hover:bg-[#0ea578] transition-colors"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-6">
          <h1 className="mb-2 text-3xl font-bold text-white">
            Welcome back, {session?.user?.firstName}! 👋
          </h1>
          <p className="text-gray-400">
            Here&apos;s your performance overview for today
          </p>
        </div>

        {/* Personal Overview Section */}
        <PersonalOverview user={session?.user} />

        {/* KPI Tracking & Performance Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <KPITracking />
          <PerformanceInsights />
        </div>

        {/* Task List */}
        <TaskList />

        {/* Goals and Achievements */}
        <div className="grid gap-6 lg:grid-cols-2">
          <GoalTracking />
          <AchievementsBadges />
        </div>
      </div>
    </DashboardLayout>
  );
}
