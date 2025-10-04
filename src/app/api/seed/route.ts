import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";

export async function POST(request: NextRequest) {
  try {
    // Only allow in development or with a secret key
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    // In production, require a secret key for security
    if (process.env.NODE_ENV === "production" && secret !== process.env.SEED_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Run the seed script
    execSync("npx tsx prisma/seed.ts", {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully"
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({
      error: "Failed to seed database",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
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