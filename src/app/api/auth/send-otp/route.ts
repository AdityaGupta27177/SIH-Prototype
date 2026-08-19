import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/send-otp
 * Mock OTP sender — always succeeds, no real SMS.
 * In production this would call an SMS gateway.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { phone } = body;

  if (!phone || phone.length < 10) {
    return NextResponse.json(
      { error: "Valid phone number is required" },
      { status: 400 }
    );
  }

  // In production: send real OTP via SMS gateway
  // For prototype: OTP is always 123456
  console.log(`[MOCK SMS] OTP 123456 sent to ${phone}`);

  return NextResponse.json({
    success: true,
    message: "OTP sent successfully (demo: use 123456)",
  });
}
