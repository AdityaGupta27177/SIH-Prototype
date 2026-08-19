import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Agreement from "@/models/Agreement";
import { verifyHashOnChain } from "@/lib/blockchain";

/**
 * GET /api/verify?id=DTVN-XXXX or ?txHash=0x...
 * Public blockchain verification endpoint.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dtvnId = searchParams.get("id");
  const txHash = searchParams.get("txHash");

  if (!dtvnId && !txHash) {
    return NextResponse.json(
      { error: "Provide either 'id' (DTVN-ID) or 'txHash' query parameter" },
      { status: 400 }
    );
  }

  await connectDB();

  // Lookup by DTVN-ID
  if (dtvnId) {
    const agreement = await Agreement.findOne({ dtvnId });
    if (!agreement) {
      return NextResponse.json({
        verified: false,
        message: "No agreement found with this DTVN-ID",
      });
    }

    if (agreement.status !== "OFFICIALLY_VERIFIED" || !agreement.txHash) {
      return NextResponse.json({
        verified: false,
        dtvnId: agreement.dtvnId,
        status: agreement.status,
        message: "This agreement has not been officially verified yet",
      });
    }

    // Verify on chain
    const chainResult = await verifyHashOnChain(agreement.txHash);

    return NextResponse.json({
      verified: chainResult.verified,
      dtvnId: agreement.dtvnId,
      gatNumber: agreement.gatNumber,
      village: agreement.village,
      taluka: agreement.taluka,
      district: agreement.district,
      status: agreement.status,
      recordHash: agreement.recordHash,
      txHash: agreement.txHash,
      blockNumber: agreement.blockNumber,
      chainData: chainResult,
    });
  }

  // Lookup by transaction hash
  if (txHash) {
    const agreement = await Agreement.findOne({ txHash });

    const chainResult = await verifyHashOnChain(txHash);

    return NextResponse.json({
      verified: chainResult.verified,
      dtvnId: agreement?.dtvnId || null,
      gatNumber: agreement?.gatNumber || null,
      status: agreement?.status || null,
      recordHash: agreement?.recordHash || null,
      txHash,
      chainData: chainResult,
    });
  }
}
