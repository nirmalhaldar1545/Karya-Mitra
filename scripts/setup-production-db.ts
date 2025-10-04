/**
 * Production Database Setup Script
 * This script runs database migrations and seeds the database for production deployments
 */

import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function setupProductionDatabase() {
  console.log("🚀 Setting up production database...");

  try {
    // Step 1: Run database migrations
    console.log("📦 Running database migrations...");
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
    console.log("✅ Migrations completed");

    // Step 2: Generate Prisma client
    console.log("🔧 Generating Prisma client...");
    execSync("npx prisma generate", { stdio: "inherit" });
    console.log("✅ Prisma client generated");

    // Step 3: Check if database is already seeded
    const userCount = await prisma.user.count();
    console.log(`📊 Found ${userCount} users in database`);

    if (userCount === 0) {
      console.log("🌱 Database appears empty, running seed script...");

      // Run the seed script
      execSync("npm run db:seed", { stdio: "inherit" });
      console.log("✅ Database seeded successfully");
    } else {
      console.log("ℹ️  Database already contains data, skipping seed");
    }

    // Step 4: Handle any data migrations
    await handleDataMigrations();

    console.log("🎉 Production database setup completed successfully!");

  } catch (error) {
    console.error("❌ Error during production database setup:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function handleDataMigrations() {
  console.log("🔄 Checking for data migrations...");

  // This function can be extended to handle specific data migrations
  // For now, it ensures essential data exists

  // Example: Ensure admin user exists
  const adminExists = await prisma.user.findUnique({
    where: { email: "admin@karyamitra.gov.in" }
  });

  if (!adminExists) {
    console.log("Creating admin user...");
    const adminRole = await prisma.role.findFirst({ where: { roleName: "Admin" } });
    const hrDept = await prisma.department.findFirst({ where: { departmentName: "Human Resources" } });

    if (adminRole && hrDept) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await prisma.user.create({
        data: {
          firstName: "System",
          lastName: "Administrator",
          email: "admin@karyamitra.gov.in",
          passwordHash: hashedPassword,
          roleId: adminRole.id,
          departmentId: hrDept.id,
          status: "active",
          emailVerified: new Date(),
        },
      });
      console.log("✅ Admin user created");
    }
  }

  // Add any other essential data migrations here
  // This is where you would add logic for new users, updated data, etc.
}

setupProductionDatabase()
  .then(() => {
    console.log("✅ Production setup complete");
  })
  .catch((error) => {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  });