"use client";

import { motion } from "framer-motion";
import { Target, Calendar, TrendingUp, Plus } from "lucide-react";
import { api } from "~/trpc/react";

export function GoalTracking() {
  const { data: goals, isLoading } = api.dashboard.getEmployeeGoals.useQuery();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="rounded-xl border border-gray-800 bg-gray-900 p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">My Goals</h3>
            <p className="text-sm text-gray-400">Loading goals...</p>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-lg border border-gray-800 bg-gray-800/50 p-4">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-2 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-[#13FFAA] bg-[#13FFAA]/10 border-[#13FFAA]/20";
      case "at-risk":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      default:
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-orange-400";
      default:
        return "text-blue-400";
    }
  };

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="rounded-xl border border-gray-800 bg-gray-900 p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">My Goals</h3>
          <p className="text-sm text-gray-400">{goals?.length || 0} active goals</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-[#13FFAA] px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-[#0ea578] transition-colors">
          <Plus className="h-4 w-4" />
          New Goal
        </button>
      </div>

      <div className="space-y-4">
        {goals?.map((goal, index) => {
          const daysRemaining = getDaysRemaining(goal.targetDate.toISOString().split('T')[0] || '');

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="rounded-lg border border-gray-800 bg-gray-800/50 p-4 hover:border-gray-700 transition-colors"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Target className={`h-4 w-4 ${getPriorityColor(goal.priority || 'medium')}`} />
                    <h4 className="font-semibold text-white">{goal.goalDescription}</h4>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={`rounded-full border px-2 py-0.5 ${getStatusColor(goal.status)}`}>
                      {goal.status === "ongoing" ? "In Progress" : goal.status === "completed" ? "Completed" : "At Risk"}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <Calendar className="h-3 w-3" />
                      {daysRemaining > 0 ? `${daysRemaining} days left` : "Overdue"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{Math.round(goal.progressPercentage)}%</div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <TrendingUp className="h-3 w-3" />
                    On track
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="h-2 overflow-hidden rounded-full bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progressPercentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-[#13FFAA] to-[#0ea578]"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View All Goals Link */}
      <div className="mt-6 text-center">
        <button className="text-sm font-semibold text-[#13FFAA] hover:text-[#0ea578] transition-colors">
          View All Goals →
        </button>
      </div>
    </motion.div>
  );
}
