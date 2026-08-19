import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Agreement from "@/models/Agreement";
import { computeSaltedHash, anchorHashOnChain } from "@/lib/blockchain";
import { findKhatedarByGat } from "@/lib/seed-data";

/**
 * POST /api/agreements/[id]/verify
 * Official verification: compute salted hash, anchor on Polygon Amoy, update status.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "official") {
    return NextResponse.json(
      { error: "Only officials can verify agreements" },
      { status: 403 }
    );
  }

  const { id } = params;
  await connectDB();

  const agreement = await Agreement.findOne({ dtvnId: id });
  if (!agreement) {
    return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
  }

  if (agreement.status !== "OWNER_APPROVED") {
    return NextResponse.json(
      { error: "Agreement must be owner-approved before verification" },
      { status: 400 }
    );
  }

  // Compute salted SHA-256 hash of the record
  const recordData = {
    dtvnId: agreement.dtvnId,
    tenantPhone: agreement.tenantPhone,
    tenantName: agreement.tenantName,
    landownerPhone: agreement.landownerPhone,
    gatNumber: agreement.gatNumber,
    district: agreement.district,
    taluka: agreement.taluka,
    village: agreement.village,
    cropCategory: agreement.cropCategory,
    leaseTenure: agreement.leaseTenure,
    gpsLat: agreement.gpsLat,
    gpsLng: agreement.gpsLng,
    verifiedBy: session.name,
    verifiedAt: new Date().toISOString(),
  };

  const { hash, salt } = computeSaltedHash(recordData);

  // Anchor hash on Polygon Amoy
  try {
    const { txHash, blockNumber } = await anchorHashOnChain(hash);

    // Update agreement with blockchain data
    agreement.status = "OFFICIALLY_VERIFIED";
    agreement.recordHash = hash;
    agreement.salt = salt;
    agreement.txHash = txHash;
    agreement.blockNumber = blockNumber;
    await agreement.save();

    const khatedar = findKhatedarByGat(agreement.gatNumber);

    return NextResponse.json({
      success: true,
      verification: {
        dtvnId: agreement.dtvnId,
        status: "OFFICIALLY_VERIFIED",
        recordHash: hash,
        txHash,
        blockNumber,
        verifiedBy: session.name,
        khatedarName: khatedar?.khatedarName,
      },
    });
  } catch (error) {
    console.error("Blockchain anchoring failed:", error);
    return NextResponse.json(
      {
        error: "Blockchain anchoring failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
