"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { api } from "~/trpc/react";
import {
  Users,
  TrendingUp,
  Target,
  Calendar,
  AlertTriangle,
  Award,
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  UserCheck,
  PieChart,
} from "lucide-react";

export default function ManagerDashboard() {
  const { data: session, status } = useSession();
  const { data: overview, isLoading: overviewLoading } = api.dashboard.getManagerOverview.useQuery();
  const { data: teamPerformance, isLoading: teamLoading } = api.dashboard.getTeamPerformance.useQuery();

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

  // Role-based access control - Only Manager role can access this dashboard
  if (session?.user?.role && session.user.role !== "Manager") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="max-w-md rounded-xl border border-red-500/20 bg-red-500/10 p-8 text-center">
          <div className="mb-4 text-6xl">🚫</div>
          <h1 className="mb-2 text-2xl font-bold text-white">Access Denied</h1>
          <p className="mb-4 text-gray-400">
            This dashboard is only accessible to managers. Your role is: <span className="font-semibold text-red-400">{session.user.role}</span>
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
              Here&apos;s your management overview for today
            </p>
          </motion.div>
        </div>

        {/* Manager Overview Section */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Team Members</p>
                <p className="text-2xl font-bold text-white">
                  {overviewLoading ? "..." : overview?.teamMembers || 0}
                </p>
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
                <p className="text-sm text-gray-400">Avg Performance</p>
                <p className="text-2xl font-bold text-white">
                  {overviewLoading ? "..." : `${overview?.avgPerformance || 0}%`}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
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
                <p className="text-sm text-gray-400">Teams Managed</p>
                <p className="text-2xl font-bold text-white">
                  {overviewLoading ? "..." : overview?.teams?.length || 0}
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
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
                <p className="text-sm text-gray-400">Active Goals</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </motion.div>
        </div>

        {/* Team Performance Overview */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Team Performance Overview</h2>
              <BarChart3 className="h-6 w-6 text-[#13FFAA]" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teamLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="h-4 bg-gray-700 rounded mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ))
              ) : (
                teamPerformance?.map((team, index) => {
                  const getScoreColor = (score: number) => {
                    if (score >= 85) return "bg-green-500/10 text-green-400";
                    if (score >= 70) return "bg-yellow-500/10 text-yellow-400";
                    return "bg-red-500/10 text-red-400";
                  };

                  return (
                    <div key={team.teamName} className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-semibold text-white">{team.teamName}</h3>
                        <span className={`rounded-full px-2 py-1 text-xs ${getScoreColor(team.avgScore)}`}>
                          {team.avgScore}%
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Members</span>
                          <span className="text-white">{team.memberCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Avg Performance</span>
                          <span className="text-white">{team.avgScore}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>

        {/* Task & Project Management */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Upcoming Deadlines</h2>
              <Calendar className="h-6 w-6 text-[#13FFAA]" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-semibold text-white">DPR Submission - Site A</p>
                    <p className="text-sm text-gray-400">Due in 2 days</p>
                  </div>
                </div>
                <span className="rounded-full bg-red-500/10 px-2 py-1 text-xs text-red-400">High</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-semibold text-white">Monthly Report Review</p>
                    <p className="text-sm text-gray-400">Due in 5 days</p>
                  </div>
                </div>
                <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-xs text-yellow-400">Medium</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-semibold text-white">Team Performance Review</p>
                    <p className="text-sm text-gray-400">Due in 12 days</p>
                  </div>
                </div>
                <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">Low</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Performance Insights</h2>
              <PieChart className="h-6 w-6 text-[#13FFAA]" />
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">High Performers</span>
                  <span className="font-semibold text-white">6 members (50%)</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                  <div className="h-full w-1/2 bg-gradient-to-r from-[#13FFAA] to-[#0ea578]"></div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">Average Performers</span>
                  <span className="font-semibold text-white">4 members (33%)</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                  <div className="h-full w-1/3 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">Needs Improvement</span>
                  <span className="font-semibold text-white">2 members (17%)</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                  <div className="h-full w-1/6 bg-gradient-to-r from-red-500 to-red-600"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recognition & Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-xl border border-gray-800 bg-gray-900 p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Employee Recognition</h2>
            <Award className="h-6 w-6 text-[#13FFAA]" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-[#13FFAA]/20 bg-[#13FFAA]/5 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#13FFAA] to-[#0ea578] flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-gray-950" />
                </div>
                <div>
                  <p className="font-semibold text-white">Rajesh Kumar</p>
                  <p className="text-sm text-gray-400">Employee of the Month</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">Outstanding performance in project delivery and team collaboration.</p>
            </div>

            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Priya Sharma</p>
                  <p className="text-sm text-gray-400">Quality Excellence</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">Consistently maintained 95%+ accuracy in all submissions.</p>
            </div>

            <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Amit Singh</p>
                  <p className="text-sm text-gray-400">Goal Achiever</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">Successfully completed all quarterly objectives ahead of schedule.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}