import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { signJwt, getSessionCookieName } from "@/lib/auth";
import User from "@/models/User";

const HARDCODED_OTP = "123456";

/**
 * POST /api/auth/verify-otp
 * Verify the OTP (hardcoded 123456), upsert user, issue JWT session cookie.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { phone, otp, role, name } = body;

  if (!phone || !otp || !role) {
    return NextResponse.json(
      { error: "phone, otp, and role are required" },
      { status: 400 }
    );
  }

  if (otp !== HARDCODED_OTP) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
  }

  if (!["tenant", "landowner", "official"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  await connectDB();

  // Upsert user — create if doesn't exist, update role if does
  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({
      phone,
      name: name || `User ${phone.slice(-4)}`,
      role,
      kycVerified: true, // Auto-mark KYC as verified for demo
    });
  } else {
    // Update role if logging in as a different role
    user.role = role;
    user.kycVerified = true;
    if (name) user.name = name;
    await user.save();
  }

  // Issue JWT
  const token = await signJwt({
    userId: user._id.toString(),
    phone: user.phone,
    role: user.role,
    name: user.name,
    kycVerified: user.kycVerified,
  });

  const response = NextResponse.json({
    success: true,
    user: {
      id: user._id,
      phone: user.phone,
      name: user.name,
      role: user.role,
      kycVerified: user.kycVerified,
    },
  });

  // Set httpOnly cookie
  response.cookies.set(getSessionCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  return response;
}
