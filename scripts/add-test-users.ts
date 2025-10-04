/**
 * Add Test Users Script
 * Creates users with different roles for testing RBAC
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("👥 Adding test users for different roles...");

  const hashedPassword = await bcrypt.hash("test123", 10);

  // Get roles and departments
  const employeeRole = await prisma.role.findFirst({ where: { roleName: "Employee" } });
  const managerRole = await prisma.role.findFirst({ where: { roleName: "Manager" } });
  const hrRole = await prisma.role.findFirst({ where: { roleName: "HR" } });
  const executiveRole = await prisma.role.findFirst({ where: { roleName: "Executive" } });

  const engineeringDept = await prisma.department.findFirst({ where: { departmentName: "Engineering" } });
  const hrDept = await prisma.department.findFirst({ where: { departmentName: "Human Resources" } });
  const adminDept = await prisma.department.findFirst({ where: { departmentName: "Executive Office" } });

  const testUsers = [
    {
      firstName: "John",
      lastName: "Manager",
      email: "manager@karyamitra.gov.in",
      roleId: managerRole?.id,
      departmentId: engineeringDept?.id,
      role: "Manager",
    },
    {
      firstName: "Sarah",
      lastName: "HR",
      email: "hr@karyamitra.gov.in",
      roleId: hrRole?.id,
      departmentId: hrDept?.id,
      role: "HR",
    },
    {
      firstName: "Mike",
      lastName: "Executive",
      email: "executive@karyamitra.gov.in",
      roleId: executiveRole?.id,
      departmentId: adminDept?.id,
      role: "Executive",
    },
  ];

  for (const userData of testUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          passwordHash: hashedPassword,
          roleId: userData.roleId,
          departmentId: userData.departmentId,
          status: "active",
          emailVerified: new Date(),
        },
      });
      console.log(`✅ Created ${userData.role} user: ${userData.email}`);
    } else {
      console.log(`⚠️  ${userData.role} user already exists: ${userData.email}`);
    }
  }

  console.log("\n📝 Test User Credentials:");
  console.log("Manager: manager@karyamitra.gov.in / test123");
  console.log("HR: hr@karyamitra.gov.in / test123");
  console.log("Executive: executive@karyamitra.gov.in / test123");
  console.log("Admin: admin@karyamitra.gov.in / admin123");
  console.log("Employee: rajesh.kumar@karyamitra.gov.in / employee123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });