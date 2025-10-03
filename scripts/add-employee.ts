/**
 * Add Sample Employee to Database
 * This script adds a sample employee user for testing
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function addEmployee() {
  console.log("👤 Adding sample employee to database...\n");

  try {
    // Get Employee role
    const employeeRole = await prisma.role.findUnique({
      where: { roleName: "Employee" },
    });

    if (!employeeRole) {
      throw new Error("Employee role not found. Please run seed first.");
    }

    // Get Engineering department
    const engineeringDept = await prisma.department.findUnique({
      where: { departmentName: "Engineering" },
    });

    if (!engineeringDept) {
      throw new Error("Engineering department not found. Please run seed first.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("employee123", 10);

    // Create employee user
    const employee = await prisma.user.create({
      data: {
        firstName: "Rajesh",
        lastName: "Kumar",
        email: "rajesh.kumar@karyamitra.gov.in",
        passwordHash: hashedPassword,
        roleId: employeeRole.id,
        departmentId: engineeringDept.id,
        status: "active",
        emailVerified: new Date(),
      },
    });

    console.log("✅ Employee created successfully!\n");
    console.log("📝 Employee Details:");
    console.log("   Name:       ", `${employee.firstName} ${employee.lastName}`);
    console.log("   Email:      ", employee.email);
    console.log("   Password:   ", "employee123");
    console.log("   Role:       ", "Employee");
    console.log("   Department: ", "Engineering");
    console.log("   Status:     ", employee.status);
    console.log("\n⚠️  IMPORTANT: Change the password after first login!");

    // Add employee to Core Development Team
    const team = await prisma.team.findUnique({
      where: { teamName: "Core Development Team" },
    });

    if (team) {
      await prisma.teamMembership.create({
        data: {
          userId: employee.id,
          teamId: team.id,
          status: "active",
        },
      });
      console.log("\n✅ Employee added to Core Development Team");
    }

    // Create a sample goal for the employee
    await prisma.employeeGoal.create({
      data: {
        userId: employee.id,
        goalDescription: "Complete training on performance management system",
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        progressPercentage: 0,
        status: "ongoing",
        priority: "high",
      },
    });
    console.log("✅ Sample goal created for employee");

    console.log("\n🎉 Employee setup complete!");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        console.error("❌ Error: Employee with this email already exists!");
      } else {
        console.error("❌ Error:", error.message);
      }
    } else {
      console.error("❌ Unexpected error:", error);
    }
    process.exit(1);
  }
}

addEmployee()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
