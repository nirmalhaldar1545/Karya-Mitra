"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  Award,
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  PieChart,
  Calendar,
} from "lucide-react";

export default function HRDashboard() {
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

  // Role-based access control - Only HR role can access this dashboard
  if (session?.user?.role && session.user.role !== "HR") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="max-w-md rounded-xl border border-red-500/20 bg-red-500/10 p-8 text-center">
          <div className="mb-4 text-6xl">🚫</div>
          <h1 className="mb-2 text-2xl font-bold text-white">Access Denied</h1>
          <p className="mb-4 text-gray-400">
            This dashboard is only accessible to HR personnel. Your role is: <span className="font-semibold text-red-400">{session.user.role}</span>
          </p>
          <p className="text-sm text-gray-500">
            Please contact your administrator if you believe this is an error.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-block rounded-lg bg-[#13FFAA] px-6 py-2 font-semibold text-gray-950 hover:bg-[#0ea578] transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-6"
          >
            <h1 className="mb-2 text-3xl font-bold text-white">
              Welcome back, {session?.user?.firstName}! 👋
            </h1>
            <p className="text-gray-400">
              Here&apos;s your HR management overview for today
            </p>
          </motion.div>
        </div>

        {/* HR Overview Section */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Employees</p>
                <p className="text-2xl font-bold text-white">156</p>
              </div>
              <Users className="h-8 w-8 text-[#13FFAA]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Open Positions</p>
                <p className="text-2xl font-bold text-white">8</p>
              </div>
              <UserPlus className="h-8 w-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Training Programs</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Retention Rate</p>
                <p className="text-2xl font-bold text-white">94%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </motion.div>
        </div>

        {/* Employee Performance & Engagement */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Performance Distribution</h2>
              <PieChart className="h-6 w-6 text-[#13FFAA]" />
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">High Performers (90-100%)</span>
                  <span className="font-semibold text-white">42 employees (27%)</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                  <div className="h-full w-3/12 bg-gradient-to-r from-[#13FFAA] to-[#0ea578]"></div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">Good Performers (75-89%)</span>
                  <span className="font-semibold text-white">68 employees (44%)</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                  <div className="h-full w-1/2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">Average Performers (60-74%)</span>
                  <span className="font-semibold text-white">32 employees (21%)</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                  <div className="h-full w-1/4 bg-gradient-to-r from-yellow-500 to-orange-600"></div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">Needs Improvement (&lt;60%)</span>
                  <span className="font-semibold text-white">14 employees (8%)</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                  <div className="h-full w-1/12 bg-gradient-to-r from-red-500 to-red-600"></div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Engagement & Satisfaction</h2>
              <BarChart3 className="h-6 w-6 text-[#13FFAA]" />
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">Overall Satisfaction</span>
                  <span className="font-semibold text-white">4.2/5.0</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                  <div className="h-full w-5/6 bg-gradient-to-r from-[#13FFAA] to-[#0ea578]"></div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">Work-Life Balance</span>
                  <span className="font-semibold text-white">3.8/5.0</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                  <div className="h-full w-4/5 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">Career Development</span>
                  <span className="font-semibold text-white">4.0/5.0</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                  <div className="h-full w-4/5 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">Management Support</span>
                  <span className="font-semibold text-white">3.9/5.0</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                  <div className="h-full w-4/5 bg-gradient-to-r from-orange-500 to-red-600"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recruitment & Training */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Recruitment Pipeline</h2>
              <UserPlus className="h-6 w-6 text-[#13FFAA]" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-semibold text-white">Senior Engineer Position</p>
                    <p className="text-sm text-gray-400">15 applications • 3 interviews scheduled</p>
                  </div>
                </div>
                <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-400">In Progress</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-semibold text-white">Project Manager Position</p>
                    <p className="text-sm text-gray-400">Offer extended to candidate</p>
                  </div>
                </div>
                <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">Offer Made</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-semibold text-white">Data Analyst Position</p>
                    <p className="text-sm text-gray-400">8 applications • Screening in progress</p>
                  </div>
                </div>
                <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-xs text-yellow-400">Screening</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Training Programs</h2>
              <GraduationCap className="h-6 w-6 text-[#13FFAA]" />
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-white">Leadership Development</h3>
                  <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">Active</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Enrolled</span>
                    <span className="text-white">24 employees</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Completion Rate</span>
                    <span className="text-white">78%</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-white">Technical Skills Update</h3>
                  <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-400">Active</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Enrolled</span>
                    <span className="text-white">45 employees</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Completion Rate</span>
                    <span className="text-white">65%</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-white">Compliance Training</h3>
                  <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-xs text-yellow-400">Mandatory</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Required</span>
                    <span className="text-white">All employees</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Completion Rate</span>
                    <span className="text-white">92%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Employee Recognition & Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="rounded-xl border border-gray-800 bg-gray-900 p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent Activity & Alerts</h2>
            <AlertTriangle className="h-6 w-6 text-[#13FFAA]" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-[#13FFAA]/20 bg-[#13FFAA]/5 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#13FFAA] to-[#0ea578] flex items-center justify-center">
                  <Award className="h-5 w-5 text-gray-950" />
                </div>
                <div>
                  <p className="font-semibold text-white">Employee of the Quarter</p>
                  <p className="text-sm text-gray-400">Sarah Johnson - Engineering</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">Outstanding performance in project delivery and team leadership.</p>
            </div>

            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Performance Alert</p>
                  <p className="text-sm text-gray-400">3 employees need attention</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">Employees with declining performance trends requiring intervention.</p>
            </div>

            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Upcoming Reviews</p>
                  <p className="text-sm text-gray-400">12 performance reviews due</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">Quarterly performance reviews scheduled for next week.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}