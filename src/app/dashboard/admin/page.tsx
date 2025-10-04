"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { api } from "~/trpc/react";
import {
  Server,
  Users,
  Shield,
  Settings,
  Activity,
  AlertTriangle,
  Database,
  Key,
  Monitor,
  UserPlus,
  Lock,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
} from "lucide-react";

export default function AdminDashboard() {
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

  // Role-based access control - Only Admin role can access this dashboard
  if (session?.user?.role && session.user.role !== "Admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="max-w-md rounded-xl border border-red-500/20 bg-red-500/10 p-8 text-center">
          <div className="mb-4 text-6xl">🚫</div>
          <h1 className="mb-2 text-2xl font-bold text-white">Access Denied</h1>
          <p className="mb-4 text-gray-400">
            This dashboard is only accessible to system administrators. Your role is: <span className="font-semibold text-red-400">{session.user.role}</span>
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
              System Administration
            </h1>
            <p className="text-gray-400">
              Complete system control and monitoring dashboard
            </p>
          </motion.div>
        </div>

        {/* System Health Overview */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">System Status</p>
                <p className="text-2xl font-bold text-green-400">Online</p>
              </div>
              <Server className="h-8 w-8 text-green-400" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-green-400">All systems operational</p>
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
                <p className="text-sm text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-white">1,247</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-blue-400">+23 in last hour</p>
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
                <p className="text-sm text-gray-400">Security Alerts</p>
                <p className="text-2xl font-bold text-white">2</p>
              </div>
              <Shield className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-yellow-400">Low priority</p>
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
                <p className="text-sm text-gray-400">System Load</p>
                <p className="text-2xl font-bold text-white">67%</p>
              </div>
              <Activity className="h-8 w-8 text-[#13FFAA]" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-green-400">Within normal range</p>
            </div>
          </motion.div>
        </div>

        {/* System Monitoring & User Management */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">System Performance</h2>
              <Monitor className="h-6 w-6 text-[#13FFAA]" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-semibold text-white">Database</p>
                    <p className="text-sm text-gray-400">PostgreSQL Primary</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400">Healthy</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-semibold text-white">Application Server</p>
                    <p className="text-sm text-gray-400">Node.js Runtime</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400">Operational</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-semibold text-white">Cache Layer</p>
                    <p className="text-sm text-gray-400">Redis Cluster</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400">Degraded</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-semibold text-white">Security Systems</p>
                    <p className="text-sm text-gray-400">Firewall & IDS</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400">Active</span>
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
              <h2 className="text-xl font-bold text-white">User Management</h2>
              <UserPlus className="h-6 w-6 text-[#13FFAA]" />
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-3 text-center">
                  <p className="text-2xl font-bold text-white">1,247</p>
                  <p className="text-xs text-gray-400">Active Users</p>
                </div>
                <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-3 text-center">
                  <p className="text-2xl font-bold text-blue-400">89</p>
                  <p className="text-xs text-gray-400">New This Week</p>
                </div>
                <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-400">12</p>
                  <p className="text-xs text-gray-400">Pending Approval</p>
                </div>
                <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-3 text-center">
                  <p className="text-2xl font-bold text-red-400">3</p>
                  <p className="text-xs text-gray-400">Suspended</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Role Distribution</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Employees</span>
                    <span className="text-white">1,089 (87%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Managers</span>
                    <span className="text-white">98 (8%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">HR Personnel</span>
                    <span className="text-white">45 (4%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Executives</span>
                    <span className="text-white">12 (1%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Administrators</span>
                    <span className="text-white">3 (less than 1%)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Security & Configuration */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Security Monitoring</h2>
              <Lock className="h-6 w-6 text-[#13FFAA]" />
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-white">Failed Login Attempts</p>
                  <p className="text-sm text-gray-400">12 failed attempts from IP 192.168.1.100 in the last hour</p>
                  <p className="text-xs text-yellow-400 mt-1">Low Risk • Monitoring</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                <Shield className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-white">Security Scan Completed</p>
                  <p className="text-sm text-gray-400">Automated security scan completed successfully. No vulnerabilities found.</p>
                  <p className="text-xs text-blue-400 mt-1">Last scan: 2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-white">Password Policy Compliance</p>
                  <p className="text-sm text-gray-400">98.7% of users compliant with password policies. 15 users need updates.</p>
                  <p className="text-xs text-green-400 mt-1">Auto-reminders sent</p>
                </div>
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
              <h2 className="text-xl font-bold text-white">System Configuration</h2>
              <Settings className="h-6 w-6 text-[#13FFAA]" />
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-white">KPI Configuration</h3>
                  <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">Active</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Templates</span>
                    <span className="text-white">24 active</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Last Updated</span>
                    <span className="text-white">2 days ago</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-white">Role Permissions</h3>
                  <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">Synced</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Roles Defined</span>
                    <span className="text-white">5 roles</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Permissions</span>
                    <span className="text-white">47 total</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-white">Data Backup</h3>
                  <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">Healthy</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Last Backup</span>
                    <span className="text-white">4 hours ago</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Backup Size</span>
                    <span className="text-white">2.4 GB</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="rounded-xl border border-gray-800 bg-gray-900 p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent System Activity</h2>
            <BarChart3 className="h-6 w-6 text-[#13FFAA]" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">User Registration</p>
                  <p className="text-sm text-gray-400">New employee onboarded</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">2 minutes ago • Rajesh Kumar</p>
            </div>

            <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">System Update</p>
                  <p className="text-sm text-gray-400">Security patches applied</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">1 hour ago • Automated</p>
            </div>

            <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                  <Key className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Permission Change</p>
                  <p className="text-sm text-gray-400">Manager role updated</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">3 hours ago • System Admin</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <button className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-800/50 p-4 hover:border-[#13FFAA] transition-colors">
              <UserPlus className="h-5 w-5 text-[#13FFAA]" />
              <span className="text-sm font-semibold text-white">Add User</span>
            </button>

            <button className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-800/50 p-4 hover:border-[#13FFAA] transition-colors">
              <Settings className="h-5 w-5 text-[#13FFAA]" />
              <span className="text-sm font-semibold text-white">System Config</span>
            </button>

            <button className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-800/50 p-4 hover:border-[#13FFAA] transition-colors">
              <Shield className="h-5 w-5 text-[#13FFAA]" />
              <span className="text-sm font-semibold text-white">Security Audit</span>
            </button>

            <button className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-800/50 p-4 hover:border-[#13FFAA] transition-colors">
              <Database className="h-5 w-5 text-[#13FFAA]" />
              <span className="text-sm font-semibold text-white">Backup Now</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}