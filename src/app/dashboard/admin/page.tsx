"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { api } from "~/trpc/react";
import { DashboardLayout } from "~/components/dashboard";
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
  UserCheck,
  UserX,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Bell,
  FileText,
  HardDrive,
  Wifi,
  WifiOff,
  RefreshCw,
  Archive,
  AlertCircle,
  CheckSquare,
  X,
  MoreHorizontal,
  ChevronDown,
  Calendar,
  TrendingUp,
  Globe,
  Smartphone,
  Laptop,
  Cloud,
  ShieldCheck,
  AlertOctagon,
  Info,
  MessageSquare,
  HelpCircle,
  Wrench,
  Power,
  Pause,
  Play,
  BookOpen,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    roleId: 0,
    departmentId: 0
  });

  // Fetch real data from tRPC - hooks must be called unconditionally at the top
  const { data: systemOverview, isLoading: overviewLoading } = api.admin.getSystemOverview.useQuery();
  const { data: usersData, isLoading: usersLoading } = api.admin.getAllUsers.useQuery({
    page: 1,
    limit: 50,
    search: searchTerm || undefined
  });
  const { data: systemConfig, isLoading: configLoading } = api.admin.getSystemConfig.useQuery();
  const { data: securityData, isLoading: securityLoading } = api.admin.getSecurityOverview.useQuery();
  const { data: dataOverview, isLoading: dataLoading } = api.admin.getDataOverview.useQuery();
  const { data: systemMetrics, isLoading: metricsLoading } = api.admin.getSystemMetrics.useQuery();
  const { data: alerts, isLoading: alertsLoading } = api.admin.getSystemAlerts.useQuery();
  const { data: supportTickets, isLoading: ticketsLoading } = api.admin.getSupportTickets.useQuery();

  // Mutations
  const updateUserStatus = api.admin.updateUserStatus.useMutation();
  const updateUserRole = api.admin.updateUserRole.useMutation();
  const bulkUpdateUsers = api.admin.bulkUpdateUsers.useMutation();
  const createUser = api.admin.createUser.useMutation();

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

  const handleUserStatusChange = async (userId: string, status: "active" | "inactive" | "suspended") => {
    try {
      await updateUserStatus.mutateAsync({ userId, status });
      // Refetch data
      window.location.reload();
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const handleBulkAction = async (action: "activate" | "deactivate" | "suspend") => {
    if (selectedUsers.length === 0) return;

    try {
      await bulkUpdateUsers.mutateAsync({
        userIds: selectedUsers,
        action
      });
      setSelectedUsers([]);
      window.location.reload();
    } catch (error) {
      console.error("Failed to perform bulk action:", error);
    }
  };

  const tabs = [
    { id: "overview", label: "System Overview", icon: Monitor },
    { id: "users", label: "User Management", icon: Users },
    { id: "security", label: "Security & Audit", icon: Shield },
    { id: "config", label: "System Config", icon: Settings },
    { id: "data", label: "Data Management", icon: Database },
    { id: "monitoring", label: "System Monitoring", icon: Activity },
    { id: "alerts", label: "Alerts & Notifications", icon: Bell },
    { id: "support", label: "Support & Help", icon: HelpCircle },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-white">
                  System Administration
                </h1>
                <p className="text-gray-400">
                  Complete system control and monitoring dashboard
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Administrator</p>
                  <p className="font-semibold text-white">{session?.user?.name || "System Admin"}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#13FFAA] to-[#0ea578] flex items-center justify-center">
                  <Shield className="h-6 w-6 text-gray-950" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#13FFAA] text-gray-950"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* System Health Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-gray-800 bg-gray-900 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">System Status</p>
                    <p className="text-2xl font-bold text-green-400">
                      {systemOverview?.systemHealth.serverStatus === "online" ? "Online" : "Offline"}
                    </p>
                  </div>
                  <Server className="h-8 w-8 text-green-400" />
                </div>
                <div className="mt-2">
                  <p className="text-xs text-green-400">
                    {systemOverview?.systemHealth.databaseStatus === "healthy" ? "Database healthy" : "Database issues"}
                  </p>
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
                    <p className="text-2xl font-bold text-white">{systemOverview?.activeUsers || 0}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <div className="mt-2">
                  <p className="text-xs text-blue-400">{systemOverview?.activeSessions || 0} sessions today</p>
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
                    <p className="text-2xl font-bold text-white">{systemOverview?.failedLogins || 0}</p>
                  </div>
                  <Shield className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="mt-2">
                  <p className="text-xs text-yellow-400">Failed login attempts</p>
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
                    <p className="text-sm text-gray-400">Data Sync Status</p>
                    <p className="text-2xl font-bold text-white">
                      {systemOverview?.systemHealth.dataSyncStatus === "synced" ? "Synced" : "Stale"}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-[#13FFAA]" />
                </div>
                <div className="mt-2">
                  <p className="text-xs text-green-400">
                    {systemOverview?.systemHealth.dataSyncStatus === "synced" ? "All systems synced" : "Sync issues detected"}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* System Performance & User Management */}
            <div className="grid gap-6 lg:grid-cols-2">
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
                      <p className="text-2xl font-bold text-white">{systemOverview?.activeUsers || 0}</p>
                      <p className="text-xs text-gray-400">Active Users</p>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-3 text-center">
                      <p className="text-2xl font-bold text-blue-400">{systemOverview?.userStatusStats?.find(s => s.status === 'active')?.count || 0}</p>
                      <p className="text-xs text-gray-400">Total Active</p>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-3 text-center">
                      <p className="text-2xl font-bold text-yellow-400">{systemOverview?.userStatusStats?.find(s => s.status === 'inactive')?.count || 0}</p>
                      <p className="text-xs text-gray-400">Inactive</p>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-3 text-center">
                      <p className="text-2xl font-bold text-red-400">{systemOverview?.userStatusStats?.find(s => s.status === 'suspended')?.count || 0}</p>
                      <p className="text-xs text-gray-400">Suspended</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Role Distribution</span>
                    </div>
                    <div className="space-y-2">
                      {systemOverview?.roleStats.map((stat) => (
                        <div key={stat.role} className="flex justify-between text-sm">
                          <span className="text-gray-400">{stat.role}</span>
                          <span className="text-white">{stat.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Recent Activity */}
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
                {systemOverview?.recentActivity.slice(0, 6).map((activity, index) => (
                  <div key={index} className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <UserPlus className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{activity.actionType}</p>
                        <p className="text-sm text-gray-400">{activity.affectedTable}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">
                      {activity.user ? `${activity.user.firstName} ${activity.user.lastName}` : 'System'} • {new Date(activity.actionTimestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-8">
            {/* User Management Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">User Management</h2>
                <p className="text-gray-400">Manage all system users and their permissions</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateUserModal(true)}
                  className="flex items-center gap-2 rounded-lg bg-[#13FFAA] px-4 py-2 font-semibold text-gray-950 hover:bg-[#0ea578] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add User
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 font-semibold text-white hover:bg-gray-700 transition-colors">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:border-[#13FFAA] focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 transition-colors">
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
                {selectedUsers.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkAction("activate")}
                      className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 transition-colors"
                    >
                      <UserCheck className="h-4 w-4" />
                      Activate ({selectedUsers.length})
                    </button>
                    <button
                      onClick={() => handleBulkAction("suspend")}
                      className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 transition-colors"
                    >
                      <UserX className="h-4 w-4" />
                      Suspend ({selectedUsers.length})
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-800 bg-gray-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          className="rounded border-gray-600 bg-gray-700 text-[#13FFAA] focus:ring-[#13FFAA]"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers(usersData?.users.map(u => u.id) || []);
                            } else {
                              setSelectedUsers([]);
                            }
                          }}
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">User</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Department</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Last Login</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData?.users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers([...selectedUsers, user.id]);
                              } else {
                                setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                              }
                            }}
                            className="rounded border-gray-600 bg-gray-700 text-[#13FFAA] focus:ring-[#13FFAA]"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                              <span className="text-sm font-semibold text-white">
                                {user.firstName[0]}{user.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-white">{user.firstName} {user.lastName}</p>
                              <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            user.role?.roleName === 'Admin' ? 'bg-red-500/10 text-red-400' :
                            user.role?.roleName === 'Manager' ? 'bg-blue-500/10 text-blue-400' :
                            user.role?.roleName === 'HR' ? 'bg-green-500/10 text-green-400' :
                            user.role?.roleName === 'Executive' ? 'bg-purple-500/10 text-purple-400' :
                            'bg-gray-500/10 text-gray-400'
                          }`}>
                            {user.role?.roleName || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400">
                          {user.department?.departmentName || 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            user.status === 'active' ? 'bg-green-500/10 text-green-400' :
                            user.status === 'inactive' ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-red-500/10 text-red-400'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400">
                          {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="rounded p-1 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="rounded p-1 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <div className="relative">
                              <button className="rounded p-1 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {usersData && usersData.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Showing {((usersData.page - 1) * usersData.limit) + 1} to {Math.min(usersData.page * usersData.limit, usersData.total)} of {usersData.total} users
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={usersData.page === 1}
                    className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    disabled={usersData.page === usersData.totalPages}
                    className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Create User Modal */}
            {showCreateUserModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md mx-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Create New User</h3>
                    <button
                      onClick={() => setShowCreateUserModal(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await createUser.mutateAsync(newUserData);
                      setShowCreateUserModal(false);
                      setNewUserData({
                        firstName: "",
                        lastName: "",
                        email: "",
                        roleId: 0,
                        departmentId: 0
                      });
                      window.location.reload();
                    } catch (error) {
                      console.error("Failed to create user:", error);
                    }
                  }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                      <input
                        type="text"
                        value={newUserData.firstName}
                        onChange={(e) => setNewUserData({...newUserData, firstName: e.target.value})}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 px-3 text-white placeholder-gray-400 focus:border-[#13FFAA] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={newUserData.lastName}
                        onChange={(e) => setNewUserData({...newUserData, lastName: e.target.value})}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 px-3 text-white placeholder-gray-400 focus:border-[#13FFAA] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                      <input
                        type="email"
                        value={newUserData.email}
                        onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 px-3 text-white placeholder-gray-400 focus:border-[#13FFAA] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                      <select
                        value={newUserData.roleId}
                        onChange={(e) => setNewUserData({...newUserData, roleId: parseInt(e.target.value)})}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 px-3 text-white focus:border-[#13FFAA] focus:outline-none"
                        required
                      >
                        <option value={0}>Select Role</option>
                        {systemConfig?.roles?.map((role) => (
                          <option key={role.id} value={role.id}>{role.roleName}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Department</label>
                      <select
                        value={newUserData.departmentId}
                        onChange={(e) => setNewUserData({...newUserData, departmentId: parseInt(e.target.value)})}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 px-3 text-white focus:border-[#13FFAA] focus:outline-none"
                      >
                        <option value={0}>Select Department (Optional)</option>
                        {systemConfig?.departments?.map((dept) => (
                          <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowCreateUserModal(false)}
                        className="flex-1 rounded-lg border border-gray-700 bg-gray-800 py-2 font-semibold text-white hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 rounded-lg bg-[#13FFAA] py-2 font-semibold text-gray-950 hover:bg-[#0ea578] transition-colors"
                      >
                        Create User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Security Monitoring */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-gray-800 bg-gray-900 p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Security Monitoring</h2>
                  <Lock className="h-6 w-6 text-[#13FFAA]" />
                </div>

                <div className="space-y-4">
                  {securityData?.recentFailedLogins.map((login, index) => (
                    <div key={index} className="flex items-start gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-white">Failed Login Attempts</p>
                        <p className="text-sm text-gray-400">{login.attempts} failed attempts from IP {login.ip}</p>
                        <p className="text-xs text-yellow-400 mt-1">Last attempt: {login.lastAttempt.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-start gap-3 rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                    <Shield className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-white">Security Scan Completed</p>
                      <p className="text-sm text-gray-400">Automated security scan completed successfully. No vulnerabilities found.</p>
                      <p className="text-xs text-green-400 mt-1">Last scan: 2 hours ago</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Audit Trail */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-gray-800 bg-gray-900 p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Audit Trail</h2>
                  <FileText className="h-6 w-6 text-[#13FFAA]" />
                </div>

                <div className="space-y-3">
                  {securityData?.auditLogs.map((log, index) => (
                    <div key={index} className="rounded-lg border border-gray-800 bg-gray-800/50 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white capitalize">{log.actionType}</p>
                          <p className="text-sm text-gray-400">{log.affectedTable}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            {log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(log.actionTimestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* User Access Logs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-gray-800 bg-gray-900 p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">User Access Logs</h2>
                  <UserCheck className="h-6 w-6 text-[#13FFAA]" />
                </div>

                <div className="space-y-3">
                  {securityData?.userAccessStats?.slice(0, 5).map((user, index) => (
                    <div key={index} className="rounded-lg border border-gray-800 bg-gray-800/50 p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <span className="text-sm font-semibold text-white">
                              {user.firstName?.[0]}{user.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-white">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-gray-400">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Last Login</p>
                          <p className="text-sm text-white">Recent</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === "config" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">System Configuration & Customization</h2>
                <p className="text-gray-400">Configure KPIs, roles, permissions, and system settings</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 rounded-lg bg-[#13FFAA] px-4 py-2 font-semibold text-gray-950 hover:bg-[#0ea578] transition-colors">
                  <Plus className="h-4 w-4" />
                  Add KPI Template
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 font-semibold text-white hover:bg-gray-700 transition-colors">
                  <Settings className="h-4 w-4" />
                  Advanced Settings
                </button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* KPI Configuration */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-gray-800 bg-gray-900 p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">KPI Configuration</h2>
                  <Settings className="h-6 w-6 text-[#13FFAA]" />
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-white">KPI Templates</h3>
                      <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">Active</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Templates</span>
                        <span className="text-white">{systemConfig?.totalKPIs || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Active</span>
                        <span className="text-white">{systemConfig?.activeKPIs || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">By Category</span>
                        <span className="text-white">HQ: 5, Field: 8, Common: 12</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-white">Scoring System</h3>
                      <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-400">Weighted</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Quantitative Weight</span>
                        <span className="text-white">60%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Qualitative Weight</span>
                        <span className="text-white">40%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Score Range</span>
                        <span className="text-white">0-100</span>
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
                        <span className="text-white">{systemConfig?.roles.length || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Permissions</span>
                        <span className="text-white">{systemConfig?.roles.reduce((sum, role) => sum + role.permissions.length, 0) || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Custom Roles</span>
                        <span className="text-white">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* System Branding & UI */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-gray-800 bg-gray-900 p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">System Branding & UI</h2>
                  <Globe className="h-6 w-6 text-[#13FFAA]" />
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-white">Company Branding</h3>
                      <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">Active</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Logo</span>
                        <span className="text-white">Uploaded</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Primary Color</span>
                        <span className="text-white">#13FFAA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Theme</span>
                        <span className="text-white">Dark Professional</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-white">Notifications</h3>
                      <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-400">Configured</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Welcome Message</span>
                        <span className="text-white">Custom</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email Templates</span>
                        <span className="text-white">5 Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Push Notifications</span>
                        <span className="text-white">Enabled</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-white">Task & Workflow</h3>
                      <span className="rounded-full bg-purple-500/10 px-2 py-1 text-xs text-purple-400">Advanced</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Default Priority</span>
                        <span className="text-white">Medium</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Auto-assignment</span>
                        <span className="text-white">Enabled</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">SLA Settings</span>
                        <span className="text-white">24h Response</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Security & Compliance Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-gray-800 bg-gray-900 p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Security & Compliance Settings</h2>
                <Shield className="h-6 w-6 text-[#13FFAA]" />
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Password Policy</h3>
                    <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">Enforced</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Min Length</span>
                      <span className="text-white">8 chars</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Complexity</span>
                      <span className="text-white">Required</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expiration</span>
                      <span className="text-white">90 days</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-white">MFA Settings</h3>
                    <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-400">Optional</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Required For</span>
                      <span className="text-white">Admins</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Methods</span>
                      <span className="text-white">TOTP, SMS</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Grace Period</span>
                      <span className="text-white">7 days</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Session Management</h3>
                    <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">Active</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Timeout</span>
                      <span className="text-white">8 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Concurrent</span>
                      <span className="text-white">3 max</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Force Logout</span>
                      <span className="text-white">Enabled</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Compliance</h3>
                    <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-xs text-yellow-400">Monitoring</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">GDPR</span>
                      <span className="text-white">Compliant</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Audit Logs</span>
                      <span className="text-white">90 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Data Retention</span>
                      <span className="text-white">7 years</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === "data" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Data Management & Integrity</h2>
                <p className="text-gray-400">Monitor data health, backups, imports/exports, and system integrity</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 rounded-lg bg-[#13FFAA] px-4 py-2 font-semibold text-gray-950 hover:bg-[#0ea578] transition-colors">
                  <HardDrive className="h-4 w-4" />
                  Backup Now
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 font-semibold text-white hover:bg-gray-700 transition-colors">
                  <RefreshCw className="h-4 w-4" />
                  Sync Data
                </button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Data Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-gray-800 bg-gray-900 p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Data Overview</h2>
                  <Database className="h-6 w-6 text-[#13FFAA]" />
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Users</span>
                      <span className="text-white">{dataOverview?.userCount || 0}</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Performance Records</span>
                      <span className="text-white">{dataOverview?.performanceCount || 0}</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Goals</span>
                      <span className="text-white">{dataOverview?.goalCount || 0}</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Feedback</span>
                      <span className="text-white">{dataOverview?.feedbackCount || 0}</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Audit Logs</span>
                      <span className="text-white">{dataOverview?.auditCount || 0}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Data Syncing & Backup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-gray-800 bg-gray-900 p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Data Syncing & Backup</h2>
                  <RefreshCw className="h-6 w-6 text-[#13FFAA]" />
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-white">System Sync Status</h3>
                      <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">Synced</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Sync</span>
                        <span className="text-white">2 minutes ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sync Frequency</span>
                        <span className="text-white">Every 5 min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">External Systems</span>
                        <span className="text-white">e-Office, HRMS</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-white">Backup Status</h3>
                      <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">Healthy</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Backup</span>
                        <span className="text-white">{dataOverview?.lastBackup ? new Date(dataOverview.lastBackup).toLocaleString() : 'Never'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Size</span>
                        <span className="text-white">{dataOverview?.dbSize || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Schedule</span>
                        <span className="text-white">Daily 2:00 AM</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full rounded-lg bg-[#13FFAA] py-2 font-semibold text-gray-950 hover:bg-[#0ea578] transition-colors">
                      Start Manual Backup
                    </button>
                    <button className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 font-semibold text-white hover:bg-gray-700 transition-colors">
                      Force Data Sync
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Data Validation & Cleanup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-gray-800 bg-gray-900 p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Data Validation & Cleanup</h2>
                  <CheckSquare className="h-6 w-6 text-[#13FFAA]" />
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-white">Data Integrity</h3>
                      <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">Good</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Orphaned Records</span>
                        <span className="text-white">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Invalid References</span>
                        <span className="text-white">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Validation</span>
                        <span className="text-white">1 hour ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-white">Database Performance</h3>
                      <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-400">Optimized</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Index Usage</span>
                        <span className="text-white">98%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Query Performance</span>
                        <span className="text-white">Good</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Optimization</span>
                        <span className="text-white">2 days ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 font-semibold text-white hover:bg-gray-700 transition-colors">
                      Run Data Validation
                    </button>
                    <button className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 font-semibold text-white hover:bg-gray-700 transition-colors">
                      Optimize Database
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Import/Export Operations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-gray-800 bg-gray-900 p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Import/Export Operations</h2>
                <Upload className="h-6 w-6 text-[#13FFAA]" />
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-white">User Data</h3>
                    <Download className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <button className="w-full rounded px-3 py-2 text-sm bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                      Export CSV
                    </button>
                    <button className="w-full rounded px-3 py-2 text-sm bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                      Export Excel
                    </button>
                    <button className="w-full rounded px-3 py-2 text-sm bg-green-600 text-white hover:bg-green-700 transition-colors">
                      Import from HR
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Performance Data</h3>
                    <Download className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="space-y-2">
                    <button className="w-full rounded px-3 py-2 text-sm bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                      Export CSV
                    </button>
                    <button className="w-full rounded px-3 py-2 text-sm bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                      Export PDF Report
                    </button>
                    <button className="w-full rounded px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                      Bulk Import
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Audit Logs</h3>
                    <Download className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="space-y-2">
                    <button className="w-full rounded px-3 py-2 text-sm bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                      Export CSV
                    </button>
                    <button className="w-full rounded px-3 py-2 text-sm bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                      Export JSON
                    </button>
                    <button className="w-full rounded px-3 py-2 text-sm bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                      Compliance Report
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-white">System Config</h3>
                    <Download className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="space-y-2">
                    <button className="w-full rounded px-3 py-2 text-sm bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                      Export Settings
                    </button>
                    <button className="w-full rounded px-3 py-2 text-sm bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                      Backup Config
                    </button>
                    <button className="w-full rounded px-3 py-2 text-sm bg-orange-600 text-white hover:bg-orange-700 transition-colors">
                      Restore Config
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === "monitoring" && (
          <div className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-gray-800 bg-gray-900 p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">System Metrics</h2>
                  <Monitor className="h-6 w-6 text-[#13FFAA]" />
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4 text-center">
                      <p className="text-2xl font-bold text-white">{systemMetrics?.uptime || "99.9%"}</p>
                      <p className="text-xs text-gray-400">Uptime</p>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4 text-center">
                      <p className="text-2xl font-bold text-blue-400">{systemMetrics?.responseTime || "45ms"}</p>
                      <p className="text-xs text-gray-400">Response Time</p>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4 text-center">
                      <p className="text-2xl font-bold text-yellow-400">{systemMetrics?.cpuUsage || "67%"}</p>
                      <p className="text-xs text-gray-400">CPU Usage</p>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4 text-center">
                      <p className="text-2xl font-bold text-green-400">{systemMetrics?.activeConnections || 247}</p>
                      <p className="text-xs text-gray-400">Active Connections</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Performance Metrics</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Memory Usage</span>
                        <span className="text-white">{systemMetrics?.memoryUsage || "3.2 GB / 8 GB"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Requests/Min</span>
                        <span className="text-white">{systemMetrics?.requestsPerMinute || 1250}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Error Rate</span>
                        <span className="text-white">{systemMetrics?.errorRate || "0.01%"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-gray-800 bg-gray-900 p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Usage Analytics</h2>
                  <BarChart3 className="h-6 w-6 text-[#13FFAA]" />
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-white">Daily Active Users</h3>
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Today</span>
                        <span className="text-white">{systemOverview?.activeUsers || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Yesterday</span>
                        <span className="text-white">{Math.floor((systemOverview?.activeUsers || 0) * 0.9)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">7-Day Average</span>
                        <span className="text-white">{Math.floor((systemOverview?.activeUsers || 0) * 0.95)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-white">Module Usage</h3>
                      <Activity className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Dashboard</span>
                        <span className="text-white">85%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Performance</span>
                        <span className="text-white">72%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Goals</span>
                        <span className="text-white">68%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Reports</span>
                        <span className="text-white">45%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* System Health Charts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-gray-800 bg-gray-900 p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">System Health Trends</h2>
                <TrendingUp className="h-6 w-6 text-[#13FFAA]" />
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="mb-2 text-2xl font-bold text-green-400">98.5%</div>
                  <p className="text-sm text-gray-400">System Availability</p>
                  <div className="mt-2 h-2 rounded-full bg-gray-800">
                    <div className="h-2 w-[98.5%] rounded-full bg-green-400"></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-2xl font-bold text-blue-400">45ms</div>
                  <p className="text-sm text-gray-400">Avg Response Time</p>
                  <div className="mt-2 h-2 rounded-full bg-gray-800">
                    <div className="h-2 w-[85%] rounded-full bg-blue-400"></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-2xl font-bold text-yellow-400">67%</div>
                  <p className="text-sm text-gray-400">CPU Utilization</p>
                  <div className="mt-2 h-2 rounded-full bg-gray-800">
                    <div className="h-2 w-[67%] rounded-full bg-yellow-400"></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-2xl font-bold text-purple-400">3.2GB</div>
                  <p className="text-sm text-gray-400">Memory Usage</p>
                  <div className="mt-2 h-2 rounded-full bg-gray-800">
                    <div className="h-2 w-[40%] rounded-full bg-purple-400"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">System Alerts & Notifications</h2>
                <p className="text-gray-400">Monitor and manage system alerts and notifications</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 rounded-lg bg-[#13FFAA] px-4 py-2 font-semibold text-gray-950 hover:bg-[#0ea578] transition-colors">
                  <Bell className="h-4 w-4" />
                  Create Alert
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 font-semibold text-white hover:bg-gray-700 transition-colors">
                  <Settings className="h-4 w-4" />
                  Alert Settings
                </button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-gray-800 bg-gray-900 p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Active Alerts</h2>
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                </div>

                <div className="space-y-4">
                  {alerts?.filter(a => !a.acknowledged).map((alert, index) => (
                    <div key={index} className={`flex items-start gap-3 rounded-lg border p-4 ${
                      alert.type === 'error' ? 'border-red-500/20 bg-red-500/5' :
                      alert.type === 'warning' ? 'border-yellow-500/20 bg-yellow-500/5' :
                      'border-blue-500/20 bg-blue-500/5'
                    }`}>
                      <div className={`flex-shrink-0 mt-0.5 ${
                        alert.type === 'error' ? 'text-red-500' :
                        alert.type === 'warning' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`}>
                        {alert.type === 'error' ? <XCircle className="h-5 w-5" /> :
                         alert.type === 'warning' ? <AlertTriangle className="h-5 w-5" /> :
                         <Info className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{alert.title}</p>
                        <p className="text-sm text-gray-400">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <button className="rounded px-3 py-1 text-xs bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                        Acknowledge
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-gray-800 bg-gray-900 p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Alert History</h2>
                  <FileText className="h-6 w-6 text-[#13FFAA]" />
                </div>

                <div className="space-y-3">
                  {alerts?.map((alert, index) => (
                    <div key={index} className="rounded-lg border border-gray-800 bg-gray-800/50 p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            alert.type === 'error' ? 'bg-red-500' :
                            alert.type === 'warning' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`}></div>
                          <div>
                            <p className="font-semibold text-white text-sm">{alert.title}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(alert.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          alert.acknowledged ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {alert.acknowledged ? 'Resolved' : 'Active'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === "support" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Support & Troubleshooting</h2>
                <p className="text-gray-400">Manage support tickets and system troubleshooting</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 rounded-lg bg-[#13FFAA] px-4 py-2 font-semibold text-gray-950 hover:bg-[#0ea578] transition-colors">
                  <Plus className="h-4 w-4" />
                  New Ticket
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 font-semibold text-white hover:bg-gray-700 transition-colors">
                  <Download className="h-4 w-4" />
                  Export Tickets
                </button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-gray-800 bg-gray-900 p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Ticket Overview</h2>
                  <HelpCircle className="h-6 w-6 text-[#13FFAA]" />
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-3 text-center">
                      <p className="text-2xl font-bold text-red-400">{supportTickets?.filter(t => t.status === 'open').length || 0}</p>
                      <p className="text-xs text-gray-400">Open</p>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-3 text-center">
                      <p className="text-2xl font-bold text-yellow-400">{supportTickets?.filter(t => t.status === 'in_progress').length || 0}</p>
                      <p className="text-xs text-gray-400">In Progress</p>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-3 text-center">
                      <p className="text-2xl font-bold text-blue-400">{supportTickets?.filter(t => t.status === 'resolved').length || 0}</p>
                      <p className="text-xs text-gray-400">Resolved</p>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-3 text-center">
                      <p className="text-2xl font-bold text-green-400">{supportTickets?.length || 0}</p>
                      <p className="text-xs text-gray-400">Total</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-gray-800 bg-gray-900 p-6 lg:col-span-2"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Recent Tickets</h2>
                  <MessageSquare className="h-6 w-6 text-[#13FFAA]" />
                </div>

                <div className="space-y-3">
                  {supportTickets?.map((ticket, index) => (
                    <div key={index} className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-white">{ticket.title}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              ticket.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                              ticket.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                              'bg-blue-500/10 text-blue-400'
                            }`}>
                              {ticket.priority}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              ticket.status === 'open' ? 'bg-red-500/10 text-red-400' :
                              ticket.status === 'in_progress' ? 'bg-yellow-500/10 text-yellow-400' :
                              'bg-green-500/10 text-green-400'
                            }`}>
                              {ticket.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">Reported by: {ticket.user}</p>
                          <p className="text-xs text-gray-500">
                            Created: {new Date(ticket.created).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="rounded p-1 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="rounded p-1 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* System Documentation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-gray-800 bg-gray-900 p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">System Documentation</h2>
                <FileText className="h-6 w-6 text-[#13FFAA]" />
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                    <h3 className="font-semibold text-white">User Guide</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">Complete user manual and tutorials</p>
                  <button className="text-sm text-[#13FFAA] hover:underline">Download PDF</button>
                </div>

                <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <Wrench className="h-5 w-5 text-yellow-400" />
                    <h3 className="font-semibold text-white">Troubleshooting</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">Common issues and solutions</p>
                  <button className="text-sm text-[#13FFAA] hover:underline">View Guide</button>
                </div>

                <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-400" />
                    <h3 className="font-semibold text-white">Security Guide</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">Security best practices</p>
                  <button className="text-sm text-[#13FFAA] hover:underline">Read More</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === "maintenance" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">System Maintenance</h2>
                <p className="text-gray-400">Manage system updates, maintenance, and optimizations</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 rounded-lg bg-[#13FFAA] px-4 py-2 font-semibold text-gray-950 hover:bg-[#0ea578] transition-colors">
                  <RotateCcw className="h-4 w-4" />
                  Check Updates
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 font-semibold text-white hover:bg-gray-700 transition-colors">
                  <Settings className="h-4 w-4" />
                  Maintenance Settings
                </button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-gray-800 bg-gray-900 p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">System Updates</h2>
                  <RotateCcw className="h-6 w-6 text-[#13FFAA]" />
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-white">Current Version</h3>
                      <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">Up to Date</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Version</span>
                        <span className="text-white">v2.1.4</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Updated</span>
                        <span className="text-white">2024-01-15</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Next Check</span>
                        <span className="text-white">2024-02-15</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-white">Available Updates</h3>
                      <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-400">2 Updates</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded bg-gray-700/50">
                        <div>
                          <p className="font-semibold text-white text-sm">Security Patch v2.1.5</p>
                          <p className="text-xs text-gray-400">Critical security fixes</p>
                        </div>
                        <button className="rounded px-3 py-1 text-xs bg-[#13FFAA] text-gray-950 hover:bg-[#0ea578] transition-colors">
                          Install
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded bg-gray-700/50">
                        <div>
                          <p className="font-semibold text-white text-sm">Performance Update v2.1.6</p>
                          <p className="text-xs text-gray-400">Database optimization improvements</p>
                        </div>
                        <button className="rounded px-3 py-1 text-xs bg-gray-600 text-white hover:bg-gray-500 transition-colors">
                          Schedule
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-gray-800 bg-gray-900 p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Maintenance Tasks</h2>
                  <Wrench className="h-6 w-6 text-[#13FFAA]" />
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-white">Database Optimization</h3>
                      <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">Completed</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Run</span>
                        <span className="text-white">2 hours ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration</span>
                        <span className="text-white">15 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Next Scheduled</span>
                        <span className="text-white">Daily at 2:00 AM</span>
                      </div>
                    </div>
                    <button className="mt-3 w-full rounded px-3 py-2 text-sm bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                      Run Now
                    </button>
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-white">Cache Cleanup</h3>
                      <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-xs text-yellow-400">Scheduled</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Run</span>
                        <span className="text-white">1 day ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cache Size</span>
                        <span className="text-white">2.4 GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Next Scheduled</span>
                        <span className="text-white">Weekly on Sunday</span>
                      </div>
                    </div>
                    <button className="mt-3 w-full rounded px-3 py-2 text-sm bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                      Run Now
                    </button>
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-white">Log Rotation</h3>
                      <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">Automated</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Log Files</span>
                        <span className="text-white">1,247 files</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Size</span>
                        <span className="text-white">45.2 GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Retention</span>
                        <span className="text-white">90 days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Scheduled Maintenance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-gray-800 bg-gray-900 p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Scheduled Maintenance</h2>
                <Calendar className="h-6 w-6 text-[#13FFAA]" />
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Weekly Maintenance</h3>
                    <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-400">Scheduled</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Day</span>
                      <span className="text-white">Sunday</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time</span>
                      <span className="text-white">2:00 AM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration</span>
                      <span className="text-white">2 hours</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">System backup, cache cleanup, and optimization</p>
                </div>

                <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Monthly Maintenance</h3>
                    <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">Active</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date</span>
                      <span className="text-white">1st of month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time</span>
                      <span className="text-white">1:00 AM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration</span>
                      <span className="text-white">4 hours</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Full system audit and performance review</p>
                </div>

                <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Quarterly Maintenance</h3>
                    <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-xs text-yellow-400">Upcoming</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date</span>
                      <span className="text-white">Q1 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration</span>
                      <span className="text-white">8 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <span className="text-white">Planning</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Major version updates and infrastructure review</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
