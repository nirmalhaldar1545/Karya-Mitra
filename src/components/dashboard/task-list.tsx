"use client";

import { motion } from "framer-motion";
import { CheckSquare, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  status: "Not Started" | "In Progress" | "Completed";
  dueDate: string;
  progress: number;
  category: string;
}

export function TaskList() {
  // Mock task data - in real app, this would come from API
  const tasks: Task[] = [
    {
      id: "1",
      title: "Review and approve budget proposal",
      priority: "High",
      status: "In Progress",
      dueDate: "2024-12-20",
      progress: 65,
      category: "Administrative",
    },
    {
      id: "2",
      title: "Complete quarterly performance report",
      priority: "High",
      status: "In Progress",
      dueDate: "2024-12-22",
      progress: 40,
      category: "Reporting",
    },
    {
      id: "3",
      title: "Attend team meeting and submit notes",
      priority: "Medium",
      status: "Not Started",
      dueDate: "2024-12-21",
      progress: 0,
      category: "Meeting",
    },
    {
      id: "4",
      title: "Update project documentation",
      priority: "Low",
      status: "In Progress",
      dueDate: "2024-12-25",
      progress: 80,
      category: "Documentation",
    },
    {
      id: "5",
      title: "File disposal - Batch A",
      priority: "Medium",
      status: "Completed",
      dueDate: "2024-12-18",
      progress: 100,
      category: "Administrative",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "Medium":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "Low":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-5 w-5 text-[#13FFAA]" />;
      case "In Progress":
        return <Clock className="h-5 w-5 text-blue-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: "Overdue", color: "text-red-400" };
    if (diffDays === 0) return { text: "Due today", color: "text-orange-400" };
    if (diffDays === 1) return { text: "Due tomorrow", color: "text-orange-400" };
    return { text: `${diffDays} days left`, color: "text-gray-400" };
  };

  const activeTasks = tasks.filter(t => t.status !== "Completed");
  const completedTasks = tasks.filter(t => t.status === "Completed");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-xl border border-gray-800 bg-gray-900 p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">My Tasks</h3>
          <p className="text-sm text-gray-400">
            {activeTasks.length} active • {completedTasks.length} completed
          </p>
        </div>
        <CheckSquare className="h-6 w-6 text-[#13FFAA]" />
      </div>

      {/* Task Tabs */}
      <div className="mb-4 flex gap-2 border-b border-gray-800">
        <button className="border-b-2 border-[#13FFAA] px-4 py-2 text-sm font-semibold text-[#13FFAA]">
          Active ({activeTasks.length})
        </button>
        <button className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white">
          Completed ({completedTasks.length})
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {activeTasks.map((task, index) => {
          const daysInfo = getDaysRemaining(task.dueDate);
          
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="rounded-lg border border-gray-800 bg-gray-800/50 p-4 hover:border-gray-700 transition-colors"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(task.status)}
                  <div className="flex-1">
                    <h4 className="mb-1 font-semibold text-white">{task.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className={`rounded-full border px-2 py-0.5 ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400">{task.category}</span>
                      <span className="text-gray-400">•</span>
                      <span className={daysInfo.color}>{daysInfo.text}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">{task.progress}%</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-[#13FFAA] to-[#0ea578]"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View All Tasks Link */}
      <div className="mt-6 text-center">
        <button className="text-sm font-semibold text-[#13FFAA] hover:text-[#0ea578] transition-colors">
          View All Tasks →
        </button>
      </div>
    </motion.div>
  );
}
