/**
 * List All Users in Database
 * Quick script to view all users with their details
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function listUsers() {
  console.log("👥 Fetching all users from database...\n");

  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
        department: true,
        teamMemberships: {
          where: { status: "active" },
          include: {
            team: true,
          },
        },
        goals: {
          where: { status: "ongoing" },
        },
      },
    });

    if (users.length === 0) {
      console.log("❌ No users found in database.");
      return;
    }

    console.log(`✅ Found ${users.length} user(s):\n`);
    console.log("=".repeat(80));

    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log("   " + "-".repeat(76));
      console.log(`   Email:      ${user.email}`);
      console.log(`   Role:       ${user.role?.roleName || "No role assigned"}`);
      console.log(`   Department: ${user.department?.departmentName || "No department"}`);
      console.log(`   Status:     ${user.status}`);
      
      if (user.teamMemberships.length > 0) {
        console.log(`   Teams:      ${user.teamMemberships.map(tm => tm.team.teamName).join(", ")}`);
      } else {
        console.log(`   Teams:      None`);
      }
      
      if (user.goals.length > 0) {
        console.log(`   Goals:      ${user.goals.length} active goal(s)`);
      }
      
      console.log(`   Created:    ${user.createdAt.toLocaleDateString()}`);
    });

    console.log("\n" + "=".repeat(80));
    console.log(`\n📊 Summary: ${users.length} total user(s)`);
    
    // Count by role
    const roleCounts = users.reduce((acc, user) => {
      const roleName = user.role?.roleName || "No role";
      acc[roleName] = (acc[roleName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log("\n📋 Users by Role:");
    Object.entries(roleCounts).forEach(([role, count]) => {
      console.log(`   ${role}: ${count}`);
    });

  } catch (error) {
    console.error("❌ Error fetching users:", error);
    process.exit(1);
  }
}

listUsers()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
