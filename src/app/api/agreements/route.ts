import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Agreement from "@/models/Agreement";
import crypto from "crypto";

/**
 * Generate a cryptographically random, non-sequential DTVN-ID.
 * Format: DTVN-XXXXXXXX (8 random hex chars)
 */
function generateDtvnId(): string {
  const randomPart = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `DTVN-${randomPart}`;
}

/**
 * POST /api/agreements
 * Create a new tenancy agreement (tenant only).
 */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "tenant") {
    return NextResponse.json(
      { error: "Only tenants can create agreements" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const {
    landownerPhone,
    gatNumber,
    district,
    taluka,
    village,
    cropCategory,
    leaseTenure,
    gpsLat,
    gpsLng,
  } = body;

  // Validate required fields
  if (
    !landownerPhone ||
    !gatNumber ||
    !district ||
    !taluka ||
    !village ||
    !cropCategory ||
    !leaseTenure ||
    gpsLat === undefined ||
    gpsLng === undefined
  ) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  await connectDB();

  // Generate unique DTVN-ID
  let dtvnId: string;
  let exists = true;
  do {
    dtvnId = generateDtvnId();
    exists = !!(await Agreement.findOne({ dtvnId }));
  } while (exists);

  const cleanLandownerPhone = landownerPhone.replace(/\D/g, "").slice(-10);
  const cleanTenantPhone = session.phone.replace(/\D/g, "").slice(-10);

  const agreement = await Agreement.create({
    dtvnId,
    tenantPhone: cleanTenantPhone,
    tenantName: session.name,
    landownerPhone: cleanLandownerPhone,
    gatNumber: gatNumber.trim(),
    district,
    taluka,
    village,
    cropCategory,
    leaseTenure,
    gpsLat,
    gpsLng,
    status: "PENDING_LANDOWNER_CONSENT",
    rejectionCount: 0,
  });

  return NextResponse.json({
    success: true,
    agreement: {
      dtvnId: agreement.dtvnId,
      status: agreement.status,
      gatNumber: agreement.gatNumber,
      createdAt: agreement.createdAt,
    },
  });
}

/**
 * GET /api/agreements
 * List agreements for the current user (filtered by role).
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  let filter: Record<string, unknown> = {};
  const userPhone = session.phone.replace(/\D/g, "").slice(-10);

  switch (session.role) {
    case "tenant":
      filter = { tenantPhone: userPhone };
      break;
    case "landowner":
      filter = { landownerPhone: userPhone };
      break;
    case "official":
      filter = {
        status: { $in: ["OWNER_APPROVED", "OFFICIALLY_VERIFIED"] },
      };
      break;
  }

  const agreements = await Agreement.find(filter).sort({ createdAt: -1 });

  return NextResponse.json({ agreements });
}
