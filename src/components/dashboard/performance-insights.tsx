"use client";

import { motion } from "framer-motion";
import { LineChart, MessageSquare, ThumbsUp, AlertTriangle } from "lucide-react";

interface Feedback {
  id: string;
  from: string;
  type: "Manager" | "Peer" | "Self" | "HR";
  message: string;
  sentiment: "positive" | "neutral" | "negative";
  date: string;
}

export function PerformanceInsights() {
  // Mock feedback data - in real app, this would come from API
  const recentFeedback: Feedback[] = [
    {
      id: "1",
      from: "Sarah Johnson",
      type: "Manager",
      message: "Excellent work on the quarterly report. Your attention to detail is commendable!",
      sentiment: "positive",
      date: "2024-12-18",
    },
    {
      id: "2",
      from: "Team Lead",
      type: "Manager",
      message: "Please ensure timely submission of daily reports to maintain workflow efficiency.",
      sentiment: "neutral",
      date: "2024-12-17",
    },
    {
      id: "3",
      from: "Rajesh Kumar",
      type: "Peer",
      message: "Great collaboration on the project! Your insights were very helpful.",
      sentiment: "positive",
      date: "2024-12-16",
    },
  ];

  // Mock performance trend data
  const performanceTrend = [
    { month: "Jul", score: 78 },
    { month: "Aug", score: 82 },
    { month: "Sep", score: 85 },
    { month: "Oct", score: 83 },
    { month: "Nov", score: 87 },
    { month: "Dec", score: 87 },
  ];

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-[#13FFAA]" />;
      case "negative":
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return <MessageSquare className="h-4 w-4 text-blue-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "border-[#13FFAA]/20 bg-[#13FFAA]/5";
      case "negative":
        return "border-red-500/20 bg-red-500/5";
      default:
        return "border-blue-500/20 bg-blue-500/5";
    }
  };

  const maxScore = Math.max(...performanceTrend.map(d => d.score));
  const minScore = Math.min(...performanceTrend.map(d => d.score));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-xl border border-gray-800 bg-gray-900 p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Performance Insights</h3>
          <p className="text-sm text-gray-400">Trends and feedback</p>
        </div>
        <LineChart className="h-6 w-6 text-[#13FFAA]" />
      </div>

      {/* Performance Trend Chart */}
      <div className="mb-6 rounded-lg border border-gray-800 bg-gray-800/50 p-4">
        <h4 className="mb-4 text-sm font-semibold text-white">6-Month Performance Trend</h4>
        
        <div className="relative h-32">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 flex h-full flex-col justify-between text-xs text-gray-400">
            <span>{maxScore}</span>
            <span>{Math.round((maxScore + minScore) / 2)}</span>
            <span>{minScore}</span>
          </div>

          {/* Chart area */}
          <div className="ml-8 h-full">
            <svg className="h-full w-full" viewBox="0 0 300 100" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="0" x2="300" y2="0" stroke="currentColor" strokeWidth="0.5" className="text-gray-700" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-gray-700" />
              <line x1="0" y1="100" x2="300" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-gray-700" />

              {/* Performance line */}
              <motion.polyline
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                points={performanceTrend.map((d, i) => {
                  const x = (i / (performanceTrend.length - 1)) * 300;
                  const y = 100 - ((d.score - minScore) / (maxScore - minScore)) * 100;
                  return `${x},${y}`;
                }).join(" ")}
                fill="none"
                stroke="#13FFAA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {performanceTrend.map((d, i) => {
                const x = (i / (performanceTrend.length - 1)) * 300;
                const y = 100 - ((d.score - minScore) / (maxScore - minScore)) * 100;
                return (
                  <motion.circle
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#13FFAA"
                  />
                );
              })}
            </svg>

            {/* X-axis labels */}
            <div className="mt-2 flex justify-between text-xs text-gray-400">
              {performanceTrend.map((d, i) => (
                <span key={i}>{d.month}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Feedback */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-white">Recent Feedback</h4>
        <div className="space-y-3">
          {recentFeedback.map((feedback, index) => (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`rounded-lg border p-3 ${getSentimentColor(feedback.sentiment)}`}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getSentimentIcon(feedback.sentiment)}
                  <span className="text-sm font-semibold text-white">{feedback.from}</span>
                  <span className="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-300">
                    {feedback.type}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{feedback.date}</span>
              </div>
              <p className="text-sm text-gray-300">{feedback.message}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* View All Feedback Link */}
      <div className="mt-4 text-center">
        <button className="text-sm font-semibold text-[#13FFAA] hover:text-[#0ea578] transition-colors">
          View All Feedback →
        </button>
      </div>
    </motion.div>
  );
}
