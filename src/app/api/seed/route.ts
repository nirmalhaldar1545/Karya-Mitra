import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Only allow in development or with a secret key
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    // In production, require a secret key for security
    if (process.env.NODE_ENV === "production" && secret !== process.env.SEED_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🌱 Starting database seeding...");

    // ============================================================================
    // 1. SEED ROLES
    // ============================================================================
    console.log("📋 Seeding roles...");

    const roles = [
      { roleName: "Employee", description: "Regular employee with basic access" },
      { roleName: "Manager", description: "Team manager with team oversight capabilities" },
      { roleName: "HR", description: "HR personnel with employee management access" },
      { roleName: "Admin", description: "System administrator with full access" },
      { roleName: "Executive", description: "Executive with organization-wide view" },
    ];

    const createdRoles = await Promise.all(
      roles.map((role) =>
        prisma.role.upsert({
          where: { roleName: role.roleName },
          update: {},
          create: role,
        })
      )
    );

    console.log(`✅ Created ${createdRoles.length} roles`);

    // ============================================================================
    // 2. SEED ROLE PERMISSIONS
    // ============================================================================
    console.log("🔐 Seeding role permissions...");

    const permissions = [
      // Employee permissions
      { roleId: 1, permissionName: "view_own_performance" },
      { roleId: 1, permissionName: "view_own_goals" },
      { roleId: 1, permissionName: "edit_own_goals" },
      { roleId: 1, permissionName: "view_own_feedback" },
      { roleId: 1, permissionName: "enroll_training" },

      // Manager permissions (includes all employee permissions)
      { roleId: 2, permissionName: "view_own_performance" },
      { roleId: 2, permissionName: "view_own_goals" },
      { roleId: 2, permissionName: "edit_own_goals" },
      { roleId: 2, permissionName: "view_own_feedback" },
      { roleId: 2, permissionName: "enroll_training" },
      { roleId: 2, permissionName: "view_team_performance" },
      { roleId: 2, permissionName: "edit_team_performance" },
      { roleId: 2, permissionName: "provide_feedback" },
      { roleId: 2, permissionName: "manage_team_goals" },
      { roleId: 2, permissionName: "view_team_members" },

      // HR permissions
      { roleId: 3, permissionName: "view_all_employees" },
      { roleId: 3, permissionName: "edit_employee_data" },
      { roleId: 3, permissionName: "manage_promotions" },
      { roleId: 3, permissionName: "manage_training" },
      { roleId: 3, permissionName: "view_all_performance" },
      { roleId: 3, permissionName: "generate_reports" },
      { roleId: 3, permissionName: "manage_departments" },
      { roleId: 3, permissionName: "manage_teams" },

      // Admin permissions (full access)
      { roleId: 4, permissionName: "full_access" },
      { roleId: 4, permissionName: "manage_users" },
      { roleId: 4, permissionName: "manage_roles" },
      { roleId: 4, permissionName: "manage_permissions" },
      { roleId: 4, permissionName: "view_audit_trail" },
      { roleId: 4, permissionName: "system_configuration" },

      // Executive permissions
      { roleId: 5, permissionName: "view_all_performance" },
      { roleId: 5, permissionName: "view_analytics" },
      { roleId: 5, permissionName: "view_reports" },
      { roleId: 5, permissionName: "view_all_employees" },
      { roleId: 5, permissionName: "strategic_planning" },
    ];

    const createdPermissions = await Promise.all(
      permissions.map((perm) =>
        prisma.rolePermission.upsert({
          where: {
            roleId_permissionName: {
              roleId: perm.roleId,
              permissionName: perm.permissionName,
            },
          },
          update: {},
          create: perm,
        })
      )
    );

    console.log(`✅ Created ${createdPermissions.length} permissions`);

    // ============================================================================
    // 3. SEED DEPARTMENTS
    // ============================================================================
    console.log("🏢 Seeding departments...");

    const departments = [
      { departmentName: "Executive Office", description: "Top-level executive management" },
      { departmentName: "Human Resources", description: "HR and employee management" },
      { departmentName: "Engineering", description: "Technical and engineering staff" },
      { departmentName: "Field Operations", description: "Field-based project execution" },
      { departmentName: "Administration", description: "Administrative and support staff" },
      { departmentName: "Finance", description: "Financial management and accounting" },
      { departmentName: "IT & Systems", description: "Information technology and systems" },
      { departmentName: "Planning & Development", description: "Strategic planning and development" },
    ];

    const createdDepartments = await Promise.all(
      departments.map((dept) =>
        prisma.department.upsert({
          where: { departmentName: dept.departmentName },
          update: {},
          create: dept,
        })
      )
    );

    console.log(`✅ Created ${createdDepartments.length} departments`);

    // ============================================================================
    // 4. SEED KPI TEMPLATES
    // ============================================================================
    console.log("📊 Seeding KPI templates...");

    const kpiTemplates = [
      // HQ Staff KPIs
      {
        kpiName: "File Disposal Rate",
        description: "Percentage of files processed and closed within target time",
        category: "HQ",
        unit: "percentage",
        targetValue: 90.0,
        weight: 1.5,
      },
      {
        kpiName: "Turnaround Time",
        description: "Average time taken to process files and approvals",
        category: "HQ",
        unit: "days",
        targetValue: 3.0,
        weight: 1.2,
      },
      {
        kpiName: "Drafting Quality",
        description: "Quality score of drafted documents and correspondence",
        category: "HQ",
        unit: "score",
        targetValue: 85.0,
        weight: 1.0,
      },
      {
        kpiName: "Correspondence Accuracy",
        description: "Accuracy rate in official correspondence",
        category: "HQ",
        unit: "percentage",
        targetValue: 95.0,
        weight: 1.3,
      },

      // Field Staff KPIs
      {
        kpiName: "DPR Submission Timeliness",
        description: "Percentage of DPRs submitted on or before deadline",
        category: "Field",
        unit: "percentage",
        targetValue: 90.0,
        weight: 1.5,
      },
      {
        kpiName: "Survey Accuracy",
        description: "Accuracy rate of field surveys and measurements",
        category: "Field",
        unit: "percentage",
        targetValue: 95.0,
        weight: 1.8,
      },
      {
        kpiName: "Project Milestone Completion",
        description: "Percentage of project milestones completed on time",
        category: "Field",
        unit: "percentage",
        targetValue: 85.0,
        weight: 2.0,
      },
      {
        kpiName: "Site Inspection Frequency",
        description: "Number of site inspections conducted per month",
        category: "Field",
        unit: "count",
        targetValue: 8.0,
        weight: 1.0,
      },

      // Common KPIs
      {
        kpiName: "Attendance Rate",
        description: "Percentage of working days attended",
        category: "Common",
        unit: "percentage",
        targetValue: 95.0,
        weight: 0.8,
      },
      {
        kpiName: "Training Completion",
        description: "Percentage of assigned training programs completed",
        category: "Common",
        unit: "percentage",
        targetValue: 100.0,
        weight: 0.7,
      },
      {
        kpiName: "Goal Achievement Rate",
        description: "Percentage of personal goals achieved",
        category: "Common",
        unit: "percentage",
        targetValue: 80.0,
        weight: 1.5,
      },
      {
        kpiName: "Teamwork Score",
        description: "Peer and manager rating for teamwork and collaboration",
        category: "Common",
        unit: "score",
        targetValue: 4.0,
        weight: 1.0,
      },
    ];

    const createdKpiTemplates = await Promise.all(
      kpiTemplates.map((kpi) =>
        prisma.kpiTemplate.create({
          data: kpi,
        })
      )
    );

    console.log(`✅ Created ${createdKpiTemplates.length} KPI templates`);

    // ============================================================================
    // 5. CREATE ADMIN USER
    // ============================================================================
    console.log("👤 Creating admin user...");

    const adminRole = createdRoles.find((r) => r.roleName === "Admin");
    const hrDepartment = createdDepartments.find((d) => d.departmentName === "Human Resources");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminUser = await prisma.user.upsert({
      where: { email: "admin@karyamitra.gov.in" },
      update: {},
      create: {
        firstName: "System",
        lastName: "Administrator",
        email: "admin@karyamitra.gov.in",
        passwordHash: hashedPassword,
        roleId: adminRole?.id,
        departmentId: hrDepartment?.id,
        status: "active",
        emailVerified: new Date(),
      },
    });

    console.log(`✅ Created admin user: ${adminUser.email}`);

    // ============================================================================
    // 6. CREATE SAMPLE TEAM
    // ============================================================================
    console.log("👥 Creating sample team...");

    const sampleTeam = await prisma.team.upsert({
      where: { teamName: "Core Development Team" },
      update: {},
      create: {
        teamName: "Core Development Team",
        description: "Primary development and implementation team",
        managerId: adminUser.id,
      },
    });

    console.log(`✅ Created sample team: ${sampleTeam.teamName}`);

    // ============================================================================
    // 7. CREATE TEST USERS
    // ============================================================================
    console.log("👥 Creating test users...");

    const employeeRole = createdRoles.find((r) => r.roleName === "Employee");
    const managerRole = createdRoles.find((r) => r.roleName === "Manager");
    const hrRole = createdRoles.find((r) => r.roleName === "HR");
    const executiveRole = createdRoles.find((r) => r.roleName === "Executive");

    const engineeringDept = createdDepartments.find((d) => d.departmentName === "Engineering");
    const adminDept = createdDepartments.find((d) => d.departmentName === "Executive Office");

    const testPassword = await bcrypt.hash("test123", 10);
    const employeePassword = await bcrypt.hash("employee123", 10);

    const testUsers = [
      {
        firstName: "John",
        lastName: "Manager",
        email: "manager@karyamitra.gov.in",
        roleId: managerRole?.id,
        departmentId: engineeringDept?.id,
      },
      {
        firstName: "Sarah",
        lastName: "HR",
        email: "hr@karyamitra.gov.in",
        roleId: hrRole?.id,
        departmentId: hrDepartment?.id,
      },
      {
        firstName: "Mike",
        lastName: "Executive",
        email: "executive@karyamitra.gov.in",
        roleId: executiveRole?.id,
        departmentId: adminDept?.id,
      },
      {
        firstName: "Rajesh",
        lastName: "Kumar",
        email: "rajesh.kumar@karyamitra.gov.in",
        roleId: employeeRole?.id,
        departmentId: engineeringDept?.id,
      },
    ];

    for (const userData of testUsers) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (!existingUser) {
        const password = userData.email === "rajesh.kumar@karyamitra.gov.in" ? employeePassword : testPassword;
        await prisma.user.create({
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            passwordHash: password,
            roleId: userData.roleId,
            departmentId: userData.departmentId,
            status: "active",
            emailVerified: new Date(),
          },
        });
        console.log(`✅ Created ${userData.email}`);
      } else {
        console.log(`⚠️  ${userData.email} already exists`);
      }
    }

    // ============================================================================
    // COMPLETION
    // ============================================================================
    console.log("\n✨ Database seeding completed successfully!");
    console.log("\n📝 Summary:");
    console.log(`   - Roles: ${createdRoles.length}`);
    console.log(`   - Permissions: ${createdPermissions.length}`);
    console.log(`   - Departments: ${createdDepartments.length}`);
    console.log(`   - KPI Templates: ${createdKpiTemplates.length}`);
    console.log(`   - Users: 5 (1 Admin + 4 Test users)`);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      summary: {
        roles: createdRoles.length,
        permissions: createdPermissions.length,
        departments: createdDepartments.length,
        kpiTemplates: createdKpiTemplates.length,
        users: 5,
      }
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({
      error: "Failed to seed database",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST method to seed database",
    usage: process.env.NODE_ENV === "production"
      ? "POST /api/seed?secret=YOUR_SEED_SECRET"
      : "POST /api/seed"
  });
}