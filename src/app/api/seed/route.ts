import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { SEED_USERS } from "@/lib/seed-data";

/**
 * POST /api/seed
 * Seeds the database with demo users. Idempotent.
 */
export async function POST() {
  await connectDB();

  const results = [];

  for (const seedUser of SEED_USERS) {
    const existing = await User.findOne({ phone: seedUser.phone });
    if (!existing) {
      const user = await User.create({
        phone: seedUser.phone,
        name: seedUser.name,
        role: seedUser.role,
        kycVerified: seedUser.kycVerified,
        aadhaarId: seedUser.aadhaarId,
        sazaCode: "sazaCode" in seedUser ? seedUser.sazaCode : undefined,
      });
      results.push({ phone: user.phone, name: user.name, status: "created" });
    } else {
      results.push({
        phone: existing.phone,
        name: existing.name,
        status: "already exists",
      });
    }
  }

  return NextResponse.json({
    success: true,
    message: "Database seeded successfully",
    users: results,
  });
}
