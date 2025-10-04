"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Target,
  CheckSquare,
  TrendingUp,
  Award,
  BookOpen,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Users,
  UserCheck,
  Shield,
  BarChart3,
  Database,
  Activity,
  HelpCircle,
  Wrench,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();

  const getNavigationByRole = (role?: string) => {
    const baseNavigation = [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ];

    switch (role) {
      case "Employee":
        return [
          ...baseNavigation,
          { name: "My KPIs", href: "/dashboard/kpis", icon: TrendingUp },
          { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
          { name: "Goals", href: "/dashboard/goals", icon: Target },
          { name: "Achievements", href: "/dashboard/achievements", icon: Award },
          { name: "Training", href: "/dashboard/training", icon: BookOpen },
        ];
      case "Manager":
        return [
          ...baseNavigation,
          { name: "Team Overview", href: "/dashboard/manager", icon: Users },
          { name: "Performance", href: "/dashboard/manager/performance", icon: TrendingUp },
          { name: "Goals", href: "/dashboard/manager/goals", icon: Target },
          { name: "Reports", href: "/dashboard/manager/reports", icon: BarChart3 },
        ];
      case "HR":
        return [
          ...baseNavigation,
          { name: "Employee Management", href: "/dashboard/hr", icon: Users },
          { name: "Recruitment", href: "/dashboard/hr/recruitment", icon: UserCheck },
          { name: "Training", href: "/dashboard/hr/training", icon: BookOpen },
          { name: "Reports", href: "/dashboard/hr/reports", icon: BarChart3 },
        ];
      case "Executive":
        return [
          ...baseNavigation,
          { name: "Organization Overview", href: "/dashboard/executive", icon: BarChart3 },
          { name: "Strategic Goals", href: "/dashboard/executive/goals", icon: Target },
          { name: "Reports", href: "/dashboard/executive/reports", icon: TrendingUp },
        ];
      case "Admin":
        return [
          { name: "System Overview", href: "/dashboard/admin", icon: LayoutDashboard },
          { name: "User Management", href: "/dashboard/admin", icon: Users },
          { name: "Security & Audit", href: "/dashboard/admin", icon: Shield },
          { name: "System Config", href: "/dashboard/admin", icon: Settings },
          { name: "Data Management", href: "/dashboard/admin", icon: Database },
          { name: "System Monitoring", href: "/dashboard/admin", icon: Activity },
          { name: "Alerts & Notifications", href: "/dashboard/admin", icon: Bell },
          { name: "Support & Help", href: "/dashboard/admin", icon: HelpCircle },
          { name: "Maintenance", href: "/dashboard/admin", icon: Wrench },
        ];
      default:
        return baseNavigation;
    }
  };

  const navigation = getNavigationByRole(session?.user?.role);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-800 bg-gray-900 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-gray-800 px-6">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Image
                src="/logo.png.png"
                alt="Karya Mitra"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-lg font-bold text-white">Karya Mitra</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="border-t border-gray-800 p-3 space-y-1">
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-red-400"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            {/* Notifications */}
            <button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#13FFAA]"></span>
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-800/50 px-3 py-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#13FFAA] to-[#0ea578] flex items-center justify-center text-gray-950 font-semibold">
                {session?.user?.firstName?.[0]}{session?.user?.lastName?.[0]}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">
                  {session?.user?.firstName} {session?.user?.lastName}
                </p>
                <p className="text-xs text-gray-400">{session?.user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
