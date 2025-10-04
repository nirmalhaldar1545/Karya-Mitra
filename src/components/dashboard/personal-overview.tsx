"use client";

import { motion } from "framer-motion";
import { Briefcase, Building2, MapPin, TrendingUp } from "lucide-react";
import { api } from "~/trpc/react";

interface PersonalOverviewProps {
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    department?: string;
  };
}

export function PersonalOverview({ user }: PersonalOverviewProps) {
  const { data: overview, isLoading } = api.dashboard.getEmployeeOverview.useQuery();

  const performanceScore = overview?.performanceScore || 0;
  const scoreColor = performanceScore >= 80 ? "#13FFAA" : performanceScore >= 60 ? "#FFA500" : "#FF4444";

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-4"></div>
              <div className="h-20 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl border border-gray-800 bg-gray-900 p-6"
      >
        <div className="mb-4 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#13FFAA] to-[#0ea578] flex items-center justify-center text-2xl font-bold text-gray-950">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-300">
            <Briefcase className="h-4 w-4 text-[#13FFAA]" />
            <span className="text-sm">{user?.role || "Employee"}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Building2 className="h-4 w-4 text-[#13FFAA]" />
            <span className="text-sm">{user?.department || "Department"}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <MapPin className="h-4 w-4 text-[#13FFAA]" />
            <span className="text-sm">New Delhi, India</span>
          </div>
        </div>
      </motion.div>

      {/* Performance Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-xl border border-gray-800 bg-gray-900 p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Performance Score</h3>
          <TrendingUp className="h-5 w-5 text-[#13FFAA]" />
        </div>

        <div className="relative mb-4">
          <div className="flex items-center justify-center">
            <div className="relative h-32 w-32">
              <svg className="h-32 w-32 -rotate-90 transform">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-800"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={scoreColor}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - performanceScore / 100)}`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{performanceScore}</div>
                  <div className="text-xs text-gray-400">/ 100</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Target:</span>
            <span className="font-semibold text-white">85</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Status:</span>
            <span className="font-semibold text-[#13FFAA]">Above Target</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-xl border border-gray-800 bg-gray-900 p-6"
      >
        <h3 className="mb-4 text-lg font-semibold text-white">Quick Stats</h3>
        
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-gray-400">Active Goals</span>
              <span className="font-semibold text-white">{overview?.goals?.filter(g => g.status === 'ongoing').length || 0}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full bg-gradient-to-r from-[#13FFAA] to-[#0ea578]"
                style={{ width: `${Math.min((overview?.goals?.filter(g => g.status === 'completed').length || 0) / (overview?.goals?.length || 1) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-gray-400">Goals Completed</span>
              <span className="font-semibold text-white">{overview?.goals?.filter(g => g.status === 'completed').length || 0}/{overview?.goals?.length || 0}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                style={{ width: `${(overview?.goals?.filter(g => g.status === 'completed').length || 0) / (overview?.goals?.length || 1) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-gray-400">Recent Feedback</span>
              <span className="font-semibold text-white">{overview?.feedbacks?.length || 0}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-600"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
