"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Target } from "lucide-react";
import { api } from "~/trpc/react";

export function KPITracking() {
  const { data: kpis, isLoading } = api.dashboard.getEmployeeKPIs.useQuery();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-xl border border-gray-800 bg-gray-900 p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">KPI Performance</h3>
            <p className="text-sm text-gray-400">Loading your key metrics...</p>
          </div>
          <Target className="h-6 w-6 text-[#13FFAA]" />
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-[#13FFAA]" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return "from-[#13FFAA] to-[#0ea578]";
    if (percentage >= 80) return "from-blue-500 to-blue-600";
    if (percentage >= 60) return "from-orange-500 to-orange-600";
    return "from-red-500 to-red-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-xl border border-gray-800 bg-gray-900 p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">KPI Performance</h3>
          <p className="text-sm text-gray-400">Real-time tracking of your key metrics</p>
        </div>
        <Target className="h-6 w-6 text-[#13FFAA]" />
      </div>

      <div className="space-y-4">
        {kpis?.map((kpi, index) => {
          const progress = Math.min((kpi.currentValue / (kpi.targetValue || 1)) * 100, 100);

          return (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="rounded-lg border border-gray-800 bg-gray-800/50 p-4"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h4 className="font-semibold text-white">{kpi.kpiName}</h4>
                    <span className="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-300">
                      {kpi.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>Weight: {kpi.weight}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-[#13FFAA]" />
                      Score: {kpi.score.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {kpi.currentValue}
                    <span className="text-sm text-gray-400">{kpi.unit}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Target: {kpi.targetValue}{kpi.unit}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="h-2 overflow-hidden rounded-full bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full bg-gradient-to-r ${getProgressColor(kpi.currentValue, kpi.targetValue || 0)}`}
                  />
                </div>
                <div className="mt-1 flex justify-between text-xs text-gray-400">
                  <span>0</span>
                  <span className="font-semibold text-white">{progress.toFixed(0)}%</span>
                  <span>{kpi.targetValue}{kpi.unit}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View All KPIs Link */}
      <div className="mt-6 text-center">
        <button className="text-sm font-semibold text-[#13FFAA] hover:text-[#0ea578] transition-colors">
          View All KPIs →
        </button>
      </div>
    </motion.div>
  );
}
