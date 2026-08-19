import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

/**
 * GET /api/auth/me
 * Returns the current session user from the JWT cookie.
 */
export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: session.userId,
      phone: session.phone,
      name: session.name,
      role: session.role,
      kycVerified: session.kycVerified,
    },
  });
}
