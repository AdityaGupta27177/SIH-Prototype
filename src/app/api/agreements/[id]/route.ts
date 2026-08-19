import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Agreement from "@/models/Agreement";
import { verifyKhatedarIdentity, findKhatedarByGat } from "@/lib/seed-data";

/**
 * GET /api/agreements/[id]
 * Get agreement by DTVN-ID with progressive disclosure based on role.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  await connectDB();

  const agreement = await Agreement.findOne({ dtvnId: id });
  if (!agreement) {
    return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
  }

  const session = await getSession();

  // Public / unauthenticated: only confirm existence + Gat number
  if (!session) {
    return NextResponse.json({
      exists: true,
      gatNumber: agreement.gatNumber,
      status: agreement.status,
      dtvnId: agreement.dtvnId,
    });
  }

  // Tenant: full access to their own agreements
  if (session.role === "tenant" && session.phone === agreement.tenantPhone) {
    return NextResponse.json({ agreement });
  }

  // Landowner: progressive disclosure
  if (session.role === "landowner") {
    // Check identity-to-title binding
    const { matched } = verifyKhatedarIdentity(
      agreement.gatNumber,
      session.phone
    );

    if (!matched) {
      // Show only that an application exists, no details
      return NextResponse.json({
        exists: true,
        gatNumber: agreement.gatNumber,
        status: agreement.status,
        dtvnId: agreement.dtvnId,
        identityMatch: false,
        message:
          "Your identity does not match the khatedar record for this Gat number.",
      });
    }

    // Identity matched — full disclosure
    return NextResponse.json({
      agreement,
      identityMatch: true,
    });
  }

  // Official: full access
  if (session.role === "official") {
    const khatedar = findKhatedarByGat(agreement.gatNumber);
    return NextResponse.json({
      agreement,
      khatedarRecord: khatedar,
    });
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
}

/**
 * PATCH /api/agreements/[id]
 * Update agreement status (landowner approve/reject).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const body = await request.json();
  const { action, rejectionReason } = body;

  await connectDB();

  const agreement = await Agreement.findOne({ dtvnId: id });
  if (!agreement) {
    return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
  }

  // Landowner actions: approve / reject
  if (session.role === "landowner") {
    // Verify identity-to-title binding
    const { matched } = verifyKhatedarIdentity(
      agreement.gatNumber,
      session.phone
    );
    if (!matched) {
      return NextResponse.json(
        { error: "Identity does not match khatedar record" },
        { status: 403 }
      );
    }

    if (agreement.status !== "PENDING_LANDOWNER_CONSENT") {
      return NextResponse.json(
        { error: "Agreement is not in a reviewable state" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      agreement.status = "OWNER_APPROVED";
      await agreement.save();
      return NextResponse.json({
        success: true,
        status: agreement.status,
        message: "Agreement approved. Queued for Patwari verification.",
      });
    }

    if (action === "reject") {
      agreement.status = "OWNER_REJECTED";
      agreement.rejectionReason = rejectionReason || "No reason provided";
      agreement.rejectionCount += 1;
      await agreement.save();
      return NextResponse.json({
        success: true,
        status: agreement.status,
        rejectionCount: agreement.rejectionCount,
        message: "Agreement rejected. Tenant will be notified.",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
}
