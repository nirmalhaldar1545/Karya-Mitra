import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
  // System Admin Overview
  getSystemOverview: protectedProcedure.query(async ({ ctx }) => {
    // Get total users count
    const totalUsers = await ctx.db.user.count();

    // Get active users (not suspended)
    const activeUsers = await ctx.db.user.count({
      where: { status: "active" }
    });

    // Get users by role
    const roleStats = await ctx.db.user.groupBy({
      by: ['roleId'],
      _count: { id: true },
      where: { status: "active" }
    });

    // Get roles for mapping
    const roles = await ctx.db.role.findMany();
    const roleMap = roles.reduce((acc, role) => {
      acc[role.id] = role.roleName;
      return acc;
    }, {} as Record<number, string>);

    // Get recent activity (last 24 hours)
    const recentActivity = await ctx.db.auditTrail.findMany({
      take: 10,
      orderBy: { actionTimestamp: "desc" },
      include: { user: { select: { firstName: true, lastName: true } } }
    });

    // Get real system metrics
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Active sessions (users who logged in recently)
    const activeSessions = await ctx.db.auditTrail.count({
      where: {
        actionType: "login",
        actionTimestamp: { gte: last24Hours }
      }
    });

    // Failed login attempts
    const failedLogins = await ctx.db.auditTrail.count({
      where: {
        actionType: "failed_login",
        actionTimestamp: { gte: last24Hours }
      }
    });

    // Data sync status - check recent audit activity
    const recentAuditCount = await ctx.db.auditTrail.count({
      where: {
        actionTimestamp: { gte: new Date(now.getTime() - 60 * 60 * 1000) } // Last hour
      }
    });

    // System health metrics
    const systemHealth = {
      serverStatus: "online",
      databaseStatus: recentAuditCount > 0 ? "healthy" : "warning",
      uptime: "99.9%",
      responseTime: "45ms",
      dataSyncStatus: recentAuditCount > 0 ? "synced" : "stale"
    };

    // Get user status distribution
    const userStatusStats = await ctx.db.user.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    // Get department distribution
    const departmentStats = await ctx.db.user.groupBy({
      by: ['departmentId'],
      _count: { id: true },
      where: { departmentId: { not: null } }
    });

    const departments = await ctx.db.department.findMany();
    const deptMap = departments.reduce((acc, dept) => {
      acc[dept.id] = dept.departmentName;
      return acc;
    }, {} as Record<number, string>);

    // Get performance metrics
    const totalPerformances = await ctx.db.performance.count();
    const recentPerformances = await ctx.db.performance.count({
      where: {
        createdAt: { gte: last24Hours }
      }
    });

    // Get goal completion stats
    const goalStats = await ctx.db.employeeGoal.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    return {
      totalUsers,
      activeUsers,
      activeSessions,
      failedLogins,
      roleStats: roleStats
        .filter(stat => stat.roleId !== null)
        .map(stat => ({
          role: roleMap[stat.roleId!] || 'Unknown',
          count: stat._count.id
        })),
      userStatusStats: userStatusStats.map(stat => ({
        status: stat.status,
        count: stat._count.id
      })),
      departmentStats: departmentStats.map(stat => ({
        department: deptMap[stat.departmentId!] || 'Unknown',
        count: stat._count.id
      })),
      recentActivity,
      systemHealth,
      performanceMetrics: {
        totalRecords: totalPerformances,
        recentRecords: recentPerformances
      },
      goalStats: goalStats.map(stat => ({
        status: stat.status,
        count: stat._count.id
      }))
    };
  }),

  // User Management
  getAllUsers: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
      search: z.string().optional(),
      role: z.string().optional(),
      department: z.string().optional(),
      status: z.string().optional()
    }))
    .query(async ({ ctx, input }) => {
      const { page, limit, search, role, department, status } = input;
      const skip = (page - 1) * limit;

      const where: {
        OR?: Array<{
          firstName?: { contains: string; mode: 'insensitive' };
          lastName?: { contains: string; mode: 'insensitive' };
          email?: { contains: string; mode: 'insensitive' };
        }>;
        role?: { roleName: string };
        department?: { departmentName: string };
        status?: string;
      } = {};

      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ];
      }

      if (role) {
        where.role = { roleName: role };
      }

      if (department) {
        where.department = { departmentName: department };
      }

      if (status) {
        where.status = status;
      }

      const [users, total] = await Promise.all([
        ctx.db.user.findMany({
          where,
          include: {
            role: true,
            department: true,
            teamMemberships: {
              include: { team: true },
              where: { status: "active" }
            }
          },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" }
        }),
        ctx.db.user.count({ where })
      ]);

      return {
        users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    }),

  // User Actions
  updateUserStatus: protectedProcedure
    .input(z.object({
      userId: z.string(),
      status: z.enum(["active", "inactive", "suspended"])
    }))
    .mutation(async ({ ctx, input }) => {
      const { userId, status } = input;

      await ctx.db.user.update({
        where: { id: userId },
        data: { status }
      });

      // Log the action
      await ctx.db.auditTrail.create({
        data: {
          userId: ctx.session.user.id,
          actionType: "update",
          affectedTable: "users",
          affectedRecordId: parseInt(userId.split('-')[0] || '0'),
          oldValue: undefined,
          newValue: JSON.stringify({ status })
        }
      });

      return { success: true };
    }),

  updateUserRole: protectedProcedure
    .input(z.object({
      userId: z.string(),
      roleId: z.number()
    }))
    .mutation(async ({ ctx, input }) => {
      const { userId, roleId } = input;

      const oldUser = await ctx.db.user.findUnique({
        where: { id: userId },
        include: { role: true }
      });

      await ctx.db.user.update({
        where: { id: userId },
        data: { roleId }
      });

      // Log the action
      await ctx.db.auditTrail.create({
        data: {
          userId: ctx.session.user.id,
          actionType: "update",
          affectedTable: "users",
          affectedRecordId: parseInt(userId.split('-')[0] || '0'),
          oldValue: JSON.stringify({ roleId: oldUser?.roleId }),
          newValue: JSON.stringify({ roleId })
        }
      });

      return { success: true };
    }),

  // System Configuration
  getSystemConfig: protectedProcedure.query(async ({ ctx }) => {
    const roles = await ctx.db.role.findMany({
      include: { permissions: true }
    });

    const departments = await ctx.db.department.findMany();

    const kpiTemplates = await ctx.db.kpiTemplate.findMany({
      orderBy: { createdAt: "desc" }
    });

    return {
      roles,
      departments,
      kpiTemplates,
      totalKPIs: kpiTemplates.length,
      activeKPIs: kpiTemplates.filter(k => k.isActive).length
    };
  }),

  // Security & Audit
  getSecurityOverview: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();

    // Get recent failed login attempts (mock for now)
    const recentFailedLogins = [
      { ip: "192.168.1.100", attempts: 12, lastAttempt: new Date(Date.now() - 3600000) },
      { ip: "10.0.0.50", attempts: 5, lastAttempt: new Date(Date.now() - 7200000) }
    ];

    // Get audit trail
    const auditLogs = await ctx.db.auditTrail.findMany({
      take: 20,
      orderBy: { actionTimestamp: "desc" },
      include: { user: { select: { firstName: true, lastName: true } } }
    });

    // Get user access patterns - recent logins
    const userAccessStats = await ctx.db.auditTrail.findMany({
      where: {
        actionType: "login",
        actionTimestamp: {
          gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { actionTimestamp: "desc" },
      take: 20
    });

    // Get unique users who logged in recently
    const uniqueUsers = userAccessStats.reduce((acc, log) => {
      if (log.user && !acc.find(u => u.id === log.userId)) {
        acc.push({
          id: log.userId!,
          firstName: log.user.firstName,
          lastName: log.user.lastName,
          email: log.user.email,
          lastLogin: log.actionTimestamp
        });
      }
      return acc;
    }, [] as Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      lastLogin: Date;
    }>);

    return {
      recentFailedLogins,
      auditLogs,
      userAccessStats: uniqueUsers,
      securityStatus: "good"
    };
  }),

  // Data Management
  getDataOverview: protectedProcedure.query(async ({ ctx }) => {
    const [
      userCount,
      performanceCount,
      goalCount,
      feedbackCount,
      auditCount
    ] = await Promise.all([
      ctx.db.user.count(),
      ctx.db.performance.count(),
      ctx.db.employeeGoal.count(),
      ctx.db.feedback.count(),
      ctx.db.auditTrail.count()
    ]);

    // Get database size estimate (mock)
    const dbSize = "2.4 GB";

    // Get backup status (mock)
    const lastBackup = new Date(Date.now() - 14400000); // 4 hours ago
    const backupStatus = "healthy";

    return {
      userCount,
      performanceCount,
      goalCount,
      feedbackCount,
      auditCount,
      dbSize,
      lastBackup,
      backupStatus
    };
  }),

  // System Monitoring
  getSystemMetrics: protectedProcedure.query(async ({ ctx }) => {
    // In a real app, these would come from monitoring services
    const metrics = {
      uptime: "99.9%",
      responseTime: "45ms",
      cpuUsage: "67%",
      memoryUsage: "3.2 GB / 8 GB",
      activeConnections: 247,
      requestsPerMinute: 1250,
      errorRate: "0.01%"
    };

    // Get real user activity
    const activeUsers = await ctx.db.user.count({
      where: { status: "active" }
    });

    const recentLogins = await ctx.db.auditTrail.count({
      where: {
        actionType: "login",
        actionTimestamp: {
          gte: new Date(Date.now() - 86400000) // Last 24 hours
        }
      }
    });

    return {
      ...metrics,
      activeUsers,
      recentLogins
    };
  }),

  // Alerts & Notifications
  getSystemAlerts: protectedProcedure.query(async ({ ctx }) => {
    // Mock alerts - in real app would be from monitoring system
    const alerts = [
      {
        id: 1,
        type: "warning",
        title: "High CPU Usage",
        message: "Server CPU usage is at 85% for the last 30 minutes",
        timestamp: new Date(Date.now() - 1800000),
        acknowledged: false
      },
      {
        id: 2,
        type: "info",
        title: "Backup Completed",
        message: "Daily backup completed successfully at 2:00 AM",
        timestamp: new Date(Date.now() - 7200000),
        acknowledged: true
      },
      {
        id: 3,
        type: "error",
        title: "Failed Login Attempts",
        message: "12 failed login attempts detected from IP 192.168.1.100",
        timestamp: new Date(Date.now() - 3600000),
        acknowledged: false
      }
    ];

    return alerts;
  }),

  // Support & Troubleshooting
  getSupportTickets: protectedProcedure.query(async ({ ctx }) => {
    // Mock support tickets - in real app would have a tickets table
    const tickets = [
      {
        id: 1,
        title: "Cannot access performance dashboard",
        user: "Rajesh Kumar",
        status: "open",
        priority: "high",
        created: new Date(Date.now() - 3600000)
      },
      {
        id: 2,
        title: "Password reset not working",
        user: "Priya Sharma",
        status: "in_progress",
        priority: "medium",
        created: new Date(Date.now() - 7200000)
      },
      {
        id: 3,
        title: "KPI calculation error",
        user: "Amit Singh",
        status: "resolved",
        priority: "low",
        created: new Date(Date.now() - 86400000)
      }
    ];

    return tickets;
  }),

  // Bulk Operations
  bulkUpdateUsers: protectedProcedure
    .input(z.object({
      userIds: z.array(z.string()),
      action: z.enum(["activate", "deactivate", "suspend"]),
      newRoleId: z.number().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const { userIds, action, newRoleId } = input;

      const statusMap = {
        activate: "active",
        deactivate: "inactive",
        suspend: "suspended"
      };

      const updateData: {
        status: string;
        roleId?: number;
      } = { status: statusMap[action] };
      if (newRoleId) {
        updateData.roleId = newRoleId;
      }

      await ctx.db.user.updateMany({
        where: { id: { in: userIds } },
        data: updateData
      });

      // Log bulk action
      await ctx.db.auditTrail.create({
        data: {
          userId: ctx.session.user.id,
          actionType: "bulk_update",
          affectedTable: "users",
          oldValue: JSON.stringify({ userIds }),
          newValue: JSON.stringify(updateData)
        }
      });

      return { success: true, updated: userIds.length };
    }),

  // Create new user
  createUser: protectedProcedure
    .input(z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      roleId: z.number(),
      departmentId: z.number().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const { firstName, lastName, email, roleId, departmentId } = input;

      // Check if email already exists
      const existingUser = await ctx.db.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Generate password hash (default password)
      const bcrypt = await import("bcryptjs");
      const hashedPassword = await bcrypt.hash("password123", 10);

      const newUser = await ctx.db.user.create({
        data: {
          firstName,
          lastName,
          email,
          passwordHash: hashedPassword,
          roleId,
          departmentId,
          status: "active",
          emailVerified: new Date()
        }
      });

      // Log the action
      await ctx.db.auditTrail.create({
        data: {
          userId: ctx.session.user.id,
          actionType: "create",
          affectedTable: "users",
          affectedRecordId: newUser.id.length,
          newValue: JSON.stringify({ email, roleId })
        }
      });

      return { success: true, user: newUser };
    })
});