import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  // Get employee performance overview
  getEmployeeOverview: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Get user performance data
    const performances = await ctx.db.performance.findMany({
      where: { userId },
      orderBy: { scoreDate: "desc" },
      take: 12, // Last 12 months
    });

    // Get user goals
    const goals = await ctx.db.employeeGoal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Get user feedback
    const feedbacks = await ctx.db.feedback.findMany({
      where: { userId },
      orderBy: { feedbackDate: "desc" },
      take: 5,
    });

    // Calculate performance score (average of recent performances)
    const performanceScore = performances.length > 0
      ? Math.round(performances.reduce((sum, p) => sum + p.score, 0) / performances.length)
      : 0;

    return {
      performanceScore,
      performances,
      goals,
      feedbacks,
    };
  }),

  // Get employee KPIs
  getEmployeeKPIs: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const user = await ctx.db.user.findUnique({
      where: { id: userId },
      include: { role: true, department: true },
    });

    if (!user) throw new Error("User not found");

    // Get KPIs based on role and department
    const kpis = await ctx.db.kpiTemplate.findMany({
      where: {
        OR: [
          { category: user.role?.roleName },
          { category: user.department?.departmentName },
          { category: "Common" },
        ],
      },
    });

    // Get actual performance data for these KPIs
    const performances = await ctx.db.performance.findMany({
      where: {
        userId,
        kpiName: { in: kpis.map(k => k.kpiName) },
      },
      orderBy: { scoreDate: "desc" },
    });

    return kpis.map(kpi => {
      const performance = performances.find(p => p.kpiName === kpi.kpiName);
      return {
        ...kpi,
        currentValue: performance?.actualValue || 0,
        score: performance?.score || 0,
      };
    });
  }),

  // Get employee tasks/goals
  getEmployeeGoals: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const goals = await ctx.db.employeeGoal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return goals;
  }),

  // Get employee achievements/badges
  getEmployeeAchievements: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Mock achievements for now - in real app, this would be based on performance milestones
    const achievements = [
      { name: "First Month Complete", description: "Completed first month in the system", earned: true, date: "2024-01-15" },
      { name: "Goal Achiever", description: "Achieved 3 personal goals", earned: true, date: "2024-02-20" },
      { name: "Team Player", description: "Received positive feedback from team", earned: true, date: "2024-03-10" },
      { name: "Quality Champion", description: "Maintained quality score above 90%", earned: false, progress: 85 },
      { name: "On-Time Finisher", description: "Completed all tasks on time for 3 months", earned: false, progress: 60 },
    ];

    return achievements;
  }),

  // Manager-specific procedures
  getManagerOverview: protectedProcedure.query(async ({ ctx }) => {
    const managerId = ctx.session.user.id;

    // Get teams managed by this manager
    const teams = await ctx.db.team.findMany({
      where: { managerId },
      include: {
        teamMemberships: {
          include: { user: true },
          where: { status: "active" },
        },
      },
    });

    // Get all team members
    const teamMembers = teams.flatMap(team =>
      team.teamMemberships.map(tm => tm.user)
    );

    // Get performance data for team members
    const performances = await ctx.db.performance.findMany({
      where: {
        userId: { in: teamMembers.map(m => m.id) },
      },
      orderBy: { scoreDate: "desc" },
    });

    // Calculate team performance metrics
    const avgPerformance = performances.length > 0
      ? Math.round(performances.reduce((sum, p) => sum + p.score, 0) / performances.length)
      : 0;

    return {
      teams,
      teamMembers: teamMembers.length,
      avgPerformance,
      performances,
    };
  }),

  getManagerKPIs: protectedProcedure.query(async ({ ctx }) => {
    const managerId = ctx.session.user.id;

    // Get department KPIs for manager's department
    const manager = await ctx.db.user.findUnique({
      where: { id: managerId },
      include: { department: true },
    });

    if (!manager?.department) return [];

    const kpis = await ctx.db.kpiTemplate.findMany({
      where: {
        OR: [
          { category: manager.department.departmentName },
          { category: "Common" },
        ],
      },
    });

    return kpis;
  }),

  getTeamPerformance: protectedProcedure.query(async ({ ctx }) => {
    const managerId = ctx.session.user.id;

    const teams = await ctx.db.team.findMany({
      where: { managerId },
      include: {
        teamMemberships: {
          include: { user: true },
          where: { status: "active" },
        },
      },
    });

    const teamPerformance = await Promise.all(
      teams.map(async (team) => {
        const memberIds = team.teamMemberships.map(tm => tm.user.id);
        const performances = await ctx.db.performance.findMany({
          where: { userId: { in: memberIds } },
          orderBy: { scoreDate: "desc" },
          take: 10,
        });

        const avgScore = performances.length > 0
          ? Math.round(performances.reduce((sum, p) => sum + p.score, 0) / performances.length)
          : 0;

        return {
          teamName: team.teamName,
          memberCount: team.teamMemberships.length,
          avgScore,
          performances,
        };
      })
    );

    return teamPerformance;
  }),
});