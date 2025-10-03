"use client";

import { motion } from "framer-motion";
import { Award, Trophy, Star, Zap, Target, Clock, CheckCircle2, TrendingUp } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  category: "performance" | "quality" | "timeliness" | "collaboration";
}

export function AchievementsBadges() {
  // Mock badge data - in real app, this would come from API
  const badges: Badge[] = [
    {
      id: "1",
      name: "Quality Champion",
      description: "Maintained 90%+ quality score for 3 months",
      icon: "star",
      earned: true,
      earnedDate: "2024-11-15",
      category: "quality",
    },
    {
      id: "2",
      name: "On-Time Finisher",
      description: "Completed 95% of tasks before deadline",
      icon: "clock",
      earned: true,
      earnedDate: "2024-12-01",
      category: "timeliness",
    },
    {
      id: "3",
      name: "Top Performer",
      description: "Ranked in top 10% for overall performance",
      icon: "trophy",
      earned: true,
      earnedDate: "2024-12-10",
      category: "performance",
    },
    {
      id: "4",
      name: "Speed Demon",
      description: "Complete 50 tasks in a month",
      icon: "zap",
      earned: false,
      progress: 78,
      category: "performance",
    },
    {
      id: "5",
      name: "Goal Crusher",
      description: "Achieve all quarterly goals",
      icon: "target",
      earned: false,
      progress: 60,
      category: "performance",
    },
    {
      id: "6",
      name: "Perfect Week",
      description: "100% task completion for a week",
      icon: "check",
      earned: false,
      progress: 85,
      category: "timeliness",
    },
  ];

  const getIcon = (iconName: string, earned: boolean) => {
    const className = `h-8 w-8 ${earned ? "text-[#13FFAA]" : "text-gray-600"}`;
    
    switch (iconName) {
      case "star":
        return <Star className={className} fill={earned ? "#13FFAA" : "none"} />;
      case "trophy":
        return <Trophy className={className} />;
      case "clock":
        return <Clock className={className} />;
      case "zap":
        return <Zap className={className} />;
      case "target":
        return <Target className={className} />;
      case "check":
        return <CheckCircle2 className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  const earnedBadges = badges.filter(b => b.earned);
  const inProgressBadges = badges.filter(b => !b.earned);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="rounded-xl border border-gray-800 bg-gray-900 p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Achievements & Badges</h3>
          <p className="text-sm text-gray-400">
            {earnedBadges.length} earned • {inProgressBadges.length} in progress
          </p>
        </div>
        <Award className="h-6 w-6 text-[#13FFAA]" />
      </div>

      {/* Earned Badges */}
      <div className="mb-6">
        <h4 className="mb-3 text-sm font-semibold text-white">Earned Badges</h4>
        <div className="grid grid-cols-3 gap-3">
          {earnedBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group relative rounded-lg border border-[#13FFAA]/20 bg-[#13FFAA]/5 p-4 text-center hover:border-[#13FFAA]/40 transition-all cursor-pointer"
            >
              <div className="mb-2 flex justify-center">
                {getIcon(badge.icon, badge.earned)}
              </div>
              <h5 className="text-xs font-semibold text-white">{badge.name}</h5>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 group-hover:block z-10">
                <div className="rounded-lg border border-gray-700 bg-gray-800 p-3 shadow-xl w-48">
                  <p className="mb-1 text-xs font-semibold text-white">{badge.name}</p>
                  <p className="mb-2 text-xs text-gray-400">{badge.description}</p>
                  <p className="text-xs text-[#13FFAA]">Earned: {badge.earnedDate}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* In Progress Badges */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-white">In Progress</h4>
        <div className="space-y-3">
          {inProgressBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="rounded-lg border border-gray-800 bg-gray-800/50 p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getIcon(badge.icon, badge.earned)}
                  <div>
                    <h5 className="text-sm font-semibold text-white">{badge.name}</h5>
                    <p className="text-xs text-gray-400">{badge.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">{badge.progress}%</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative">
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${badge.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Leaderboard Rank */}
      <div className="mt-6 rounded-lg border border-gray-800 bg-gradient-to-br from-gray-800 to-gray-900 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#13FFAA] to-[#0ea578]">
              <TrendingUp className="h-6 w-6 text-gray-950" />
            </div>
            <div>
              <h5 className="text-sm font-semibold text-white">Your Rank</h5>
              <p className="text-xs text-gray-400">Department Leaderboard</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#13FFAA]">#7</div>
            <p className="text-xs text-gray-400">of 45</p>
          </div>
        </div>
      </div>

      {/* View All Achievements Link */}
      <div className="mt-6 text-center">
        <button className="text-sm font-semibold text-[#13FFAA] hover:text-[#0ea578] transition-colors">
          View All Achievements →
        </button>
      </div>
    </motion.div>
  );
}
