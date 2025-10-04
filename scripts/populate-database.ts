/**
 * Populate Database with New Structure
 * Clears mock data and users, then adds new employees and roles
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Indian names data
const firstNames = [
  "Aarav", "Vihaan", "Vivaan", "Ananya", "Diya", "Saanvi", "Pari", "Anika", "Navya", "Aadhya",
  "Arjun", "Vikram", "Rohan", "Karan", "Aryan", "Dev", "Ishaan", "Kabir", "Reyansh", "Shaurya",
  "Aisha", "Meera", "Priya", "Kavya", "Sanya", "Riya", "Anaya", "Sara", "Zara", "Maya",
  "Aditya", "Arnav", "Dhruv", "Rudra", "Atharv", "Veer", "Krish", "Sai", "Yash", "Tanay",
  "Kiara", "Nisha", "Pooja", "Ritu", "Sneha", "Tara", "Uma", "Veda", "Yami", "Zoya",
  "Bharat", "Chandan", "Deepak", "Gaurav", "Harsh", "Indra", "Jatin", "Kunal", "Lalit", "Mohan",
  "Naveen", "Om", "Prateek", "Raj", "Sandeep", "Tarun", "Umesh", "Vijay", "Waseem", "Yogesh"
];

const lastNames = [
  "Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patel", "Jain", "Agarwal", "Yadav", "Chauhan",
  "Mishra", "Tiwari", "Pandey", "Dubey", "Trivedi", "Saxena", "Bhatnagar", "Chaturvedi", "Nair", "Iyer",
  "Reddy", "Rao", "Naidu", "Pillai", "Menon", "Kulkarni", "Deshpande", "Joshi", "Bhat", "Hegde",
  "Shetty", "Pai", "Kamath", "Shenoy", "Chandra", "Sinha", "Banerjee", "Mukherjee", "Chatterjee", "Das",
  "Ghosh", "Roy", "Sarkar", "Dutta", "Sen", "Bose", "Mitra", "Guha", "Ray", "Majumdar"
];

function generateIndianName(): { firstName: string; lastName: string } {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]!;
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]!;
  return { firstName, lastName };
}

function generateEmail(firstName: string, lastName: string, role: string, deptIndex?: number, empIndex?: number) {
  const base = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
  let suffix = '';
  if (deptIndex !== undefined && empIndex !== undefined) {
    suffix = `${deptIndex}${empIndex}`;
  } else if (empIndex !== undefined) {
    suffix = `${empIndex}`;
  }
  return `${base}${suffix}@karyamitra.gov.in`;
}

async function clearMockData() {
  console.log("🗑️  Clearing mock data and users...");

  // Delete in order to handle foreign keys
  await prisma.notification.deleteMany();
  await prisma.auditTrail.deleteMany();
  await prisma.promotionDemotion.deleteMany();
  await prisma.employeeTrainingEnrollment.deleteMany();
  await prisma.employeeGoal.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.performance.deleteMany();
  await prisma.teamMembership.deleteMany();
  await prisma.team.deleteMany();
  await prisma.post.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleared all mock data and users");
}

async function updateDepartments() {
  console.log("🏢 Updating departments...");

  const employeeDepartments = [
    { departmentName: "Finance", description: "Financial management and accounting" },
    { departmentName: "Sales", description: "Sales and revenue generation" },
    { departmentName: "Marketing", description: "Marketing and brand management" },
    { departmentName: "Strategy & Planning", description: "Strategic planning and development" },
    { departmentName: "Development", description: "Product development and engineering" },
    { departmentName: "Customer Support", description: "Customer service and support" },
    { departmentName: "Operations", description: "Operational management" },
    { departmentName: "Legal", description: "Legal affairs and compliance" },
    { departmentName: "IT (Information Technology)", description: "Information technology and systems" },
    { departmentName: "Product Management", description: "Product management and strategy" },
    { departmentName: "Business Development", description: "Business development and partnerships" },
    { departmentName: "Supply Chain & Logistics", description: "Supply chain and logistics management" },
    { departmentName: "Quality Assurance (QA)", description: "Quality assurance and testing" },
    { departmentName: "R&D (Research & Development)", description: "Research and development" },
    { departmentName: "Public Relations (PR)", description: "Public relations and communications" },
  ];

  const hrDepartment = { departmentName: "Human Resources", description: "HR and employee management" };
  const executiveDepartment = { departmentName: "Executive Office", description: "Top-level executive management" };

  const allDepartments = [...employeeDepartments, hrDepartment, executiveDepartment];

  const createdDepartments = await Promise.all(
    allDepartments.map((dept) =>
      prisma.department.upsert({
        where: { departmentName: dept.departmentName },
        update: {},
        create: dept,
      })
    )
  );

  console.log(`✅ Created/Updated ${createdDepartments.length} departments`);

  // Separate the departments for easier reference
  const employeeDeptRecords = createdDepartments.slice(0, 15);
  const hrDeptRecord = createdDepartments.find(d => d.departmentName === "Human Resources")!;
  const executiveDeptRecord = createdDepartments.find(d => d.departmentName === "Executive Office")!;

  return {
    allDepartments: createdDepartments,
    employeeDeptRecords,
    hrDeptRecord,
    executiveDeptRecord
  };
}

async function createUsers(deptData: {
  allDepartments: any[];
  employeeDeptRecords: any[];
  hrDeptRecord: any;
  executiveDeptRecord: any;
}) {
  console.log("👥 Creating users...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Get roles
  const employeeRole = await prisma.role.findUnique({ where: { roleName: "Employee" } });
  const managerRole = await prisma.role.findUnique({ where: { roleName: "Manager" } });
  const hrRole = await prisma.role.findUnique({ where: { roleName: "HR" } });
  const executiveRole = await prisma.role.findUnique({ where: { roleName: "Executive" } });
  const adminRole = await prisma.role.findUnique({ where: { roleName: "Admin" } });

  if (!employeeRole || !managerRole || !hrRole || !executiveRole || !adminRole) {
    throw new Error("Required roles not found");
  }

  const { allDepartments, employeeDeptRecords, hrDeptRecord, executiveDeptRecord } = deptData;

  const users = [];

  // Create 150 Employees (10 per department) - only in employee departments
  for (let deptIndex = 0; deptIndex < employeeDeptRecords.length; deptIndex++) {
    const dept = employeeDeptRecords[deptIndex];
    for (let empIndex = 1; empIndex <= 10; empIndex++) {
      const { firstName, lastName } = generateIndianName();
      const email = generateEmail(firstName, lastName, "employee", deptIndex, empIndex);

      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          passwordHash: hashedPassword,
          roleId: employeeRole.id,
          departmentId: dept.id,
          status: "active",
          emailVerified: new Date(),
        },
      });
      users.push(user);
    }
  }
  console.log("✅ Created 150 employees");

  // Create 15 Managers (one per department) - first 15 departments
  const managers = [];
  for (let i = 0; i < employeeDeptRecords.length; i++) {
    const dept = employeeDeptRecords[i];
    const { firstName, lastName } = generateIndianName();
    const email = generateEmail(firstName, lastName, "manager");

    const manager = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword,
        roleId: managerRole.id,
        departmentId: dept.id,
        status: "active",
        emailVerified: new Date(),
      },
    });
    managers.push(manager);

    // Create team for this department
    const team = await prisma.team.create({
      data: {
        teamName: `${dept.departmentName} Team`,
        description: `Team for ${dept.departmentName} department`,
        managerId: manager.id,
      },
    });

    // Add employees to team
    const deptEmployees = users.slice(i * 10, (i + 1) * 10);
    for (const emp of deptEmployees) {
      await prisma.teamMembership.create({
        data: {
          userId: emp.id,
          teamId: team.id,
          status: "active",
        },
      });
    }
  }
  console.log("✅ Created 15 managers and teams");

  // Create 5 HR users
  const hrUsers = [];
  for (let i = 1; i <= 5; i++) {
    const { firstName, lastName } = generateIndianName();
    const email = generateEmail(firstName, lastName, "hr", i);

    const hrUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword,
        roleId: hrRole.id,
        departmentId: hrDeptRecord.id,
        status: "active",
        emailVerified: new Date(),
      },
    });
    hrUsers.push(hrUser);
  }
  console.log("✅ Created 5 HR users");

  // Create 2 Executive users
  const executives = [];
  for (let i = 1; i <= 2; i++) {
    const { firstName, lastName } = generateIndianName();
    const email = generateEmail(firstName, lastName, "executive", i);

    const executive = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword,
        roleId: executiveRole.id,
        departmentId: executiveDeptRecord.id,
        status: "active",
        emailVerified: new Date(),
      },
    });
    executives.push(executive);
  }
  console.log("✅ Created 2 Executive users");

  // Create 1 System Admin
  const { firstName, lastName } = generateIndianName();
  const adminEmail = generateEmail(firstName, lastName, "admin");

  const admin = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email: adminEmail,
      passwordHash: hashedPassword,
      roleId: adminRole.id,
      departmentId: employeeDeptRecords.find(d => d.departmentName === "IT (Information Technology)")!.id,
      status: "active",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Created 1 System Admin");

  return { users, managers, hrUsers, executives, admin };
}

async function main() {
  console.log("🚀 Starting database population...\n");

  try {
    await clearMockData();
    const deptData = await updateDepartments();
    const createdUsers = await createUsers(deptData);

    console.log("\n✨ Database population completed successfully!");
    console.log("\n📊 Summary:");
    console.log("   - Employees: 150");
    console.log("   - Managers: 15");
    console.log("   - HR: 5");
    console.log("   - Executives: 2");
    console.log("   - System Admin: 1");
    console.log("   - Total Users: 173");
    console.log("\n🔑 Default Password: password123");
    console.log("\n⚠️  IMPORTANT: Change passwords after first login!");

  } catch (error) {
    console.error("❌ Error during population:", error);
    process.exit(1);
  }
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