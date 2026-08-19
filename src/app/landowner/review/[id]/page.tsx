"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import type { AgreementStatus } from "@/models/Agreement";

interface AgreementData {
  dtvnId: string;
  tenantPhone: string;
  tenantName: string;
  gatNumber: string;
  district: string;
  taluka: string;
  village: string;
  cropCategory: string;
  leaseTenure: string;
  gpsLat: number;
  gpsLng: number;
  status: string;
  createdAt: string;
}

export default function LandownerReviewPage() {
  const params = useParams();
  const router = useRouter();
  const dtvnId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [agreement, setAgreement] = useState<AgreementData | null>(null);
  const [identityMatch, setIdentityMatch] = useState<boolean | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [actionResult, setActionResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((authData) => {
        if (!authData.user || authData.user.role !== "landowner") {
          router.push("/login?role=landowner");
          return;
        }
      })
      .catch(() => router.push("/login?role=landowner"));

    fetch(`/api/agreements/${dtvnId}`)
      .then((r) => r.json())
      .then((resData) => {
        setData(resData);
        if (resData.agreement) {
          setAgreement(resData.agreement as AgreementData);
          setIdentityMatch(resData.identityMatch ?? true);
        } else {
          setIdentityMatch(resData.identityMatch ?? false);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dtvnId, router]);

  const handleAction = async (action: "approve" | "reject") => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/agreements/${dtvnId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          rejectionReason: action === "reject" ? rejectionReason : undefined,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setActionResult({
          success: true,
          message: result.message,
        });
        if (agreement) {
          setAgreement({
            ...agreement,
            status: result.status,
          });
        }
      } else {
        setActionResult({
          success: false,
          message: result.error || "Action could not be executed",
        });
      }
    } catch {
      setActionResult({ success: false, message: "Network communication error." });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-mono text-canvas-600">
        Verifying landowner identity against State Land Registry (RoR/7/12)...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="doc-card p-8 border border-canvas-300">
          <span className="text-2xl block mb-2">❌</span>
          <h2 className="font-serif font-bold text-base text-ink-900">Record Not Found</h2>
          <p className="text-xs text-canvas-600 mt-1">
            No active tenancy application with Reference {dtvnId} was found.
          </p>
        </div>
      </div>
    );
  }

  // Pre-identity mismatch view
  if (identityMatch === false) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="doc-card border border-crimson-600 p-8 bg-white shadow-doc-lg">
          <div className="flex items-center gap-3 border-b border-canvas-200 pb-4 mb-6">
            <div className="w-9 h-9 rounded bg-crimson-50 text-crimson-800 flex items-center justify-center text-base font-bold border border-crimson-300">
              ⚠️
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-crimson-800">
                Identity-to-Title Verification Failure
              </h2>
              <p className="text-[10px] text-canvas-600 font-mono">
                DPDP & REVENUE COMPLIANCE GUARD ACTIVE
              </p>
            </div>
          </div>

          <div className="p-4 bg-canvas-50 border border-canvas-300 rounded-lg space-y-2 text-xs mb-6">
            <div className="flex justify-between">
              <span className="text-canvas-600 font-medium">Record Reference ID</span>
              <span className="font-mono font-bold text-ink-900">{data.dtvnId as string}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-canvas-600 font-medium">Claimed Survey / Gat / Khasra</span>
              <span className="font-semibold text-ink-900">{data.gatNumber as string}</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-crimson-50 border border-crimson-300 text-xs text-crimson-800 space-y-2">
            <p className="font-bold">Access Prohibited: Khatedar Mismatch</p>
            <p className="leading-relaxed">
              Your verified Aadhaar identity does not match the registered title holder for this parcel in the State Land Registry. Detailed cultivator information, crop plans, and GPS coordinates remain masked to protect landowner privacy.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="border-b border-canvas-300 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <button
            onClick={() => router.push("/landowner/dashboard")}
            className="text-xs font-bold text-olive-900 hover:underline mb-1 inline-block"
          >
            ← Back to Landowner Desk
          </button>
          <h1 className="text-2xl font-serif font-bold text-ink-900">
            Tenancy Deed e-Consent Review
          </h1>
          <p className="text-xs text-canvas-600 font-mono">
            REFERENCE: {dtvnId}
          </p>
        </div>
      </div>

      {/* Identity Passed Badge */}
      <div className="p-4 bg-olive-50 border border-olive-600 rounded-lg mb-6 flex items-center gap-3">
        <span className="text-lg">🛡️</span>
        <div>
          <h3 className="font-serif font-bold text-xs text-olive-900 uppercase tracking-wider">
            Identity-to-Title Cross-Check Confirmed
          </h3>
          <p className="text-[11px] text-olive-800">
            Your authenticated identity matches the 7/12 / RoR Khatedar record for Survey/Gat {agreement?.gatNumber}.
          </p>
        </div>
      </div>

      {/* Agreement Document Card */}
      {agreement && (
        <div className="doc-card border border-canvas-300 p-6 bg-white shadow-doc-lg mb-6 security-border">
          <div className="flex items-center justify-between border-b border-canvas-300 pb-3 mb-4">
            <h2 className="font-serif font-bold text-sm text-ink-900 uppercase tracking-wider">
              Cultivation Agreement Details
            </h2>
            <StatusBadge status={(agreement.status as AgreementStatus) || "PENDING_LANDOWNER_CONSENT"} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-canvas-50 rounded border border-canvas-200">
              <span className="text-canvas-600 block">Cultivator Name (Tenant)</span>
              <strong className="text-ink-900 text-sm mt-0.5 block">{agreement.tenantName}</strong>
              <span className="text-canvas-600 font-mono text-[10px]">Phone: +91 {agreement.tenantPhone}</span>
            </div>

            <div className="p-3 bg-canvas-50 rounded border border-canvas-200">
              <span className="text-canvas-600 block">Cadastral Survey / Gat / Khasra</span>
              <strong className="text-ink-900 text-sm mt-0.5 block">{agreement.gatNumber}</strong>
              <span className="text-canvas-600 text-[10px]">{agreement.village}, {agreement.taluka}</span>
            </div>

            <div className="p-3 bg-canvas-50 rounded border border-canvas-200">
              <span className="text-canvas-600 block">Crop Category</span>
              <strong className="text-ink-900 text-sm mt-0.5 block">{agreement.cropCategory}</strong>
            </div>

            <div className="p-3 bg-canvas-50 rounded border border-canvas-200">
              <span className="text-canvas-600 block">Agreed Lease Tenure</span>
              <strong className="text-ink-900 text-sm mt-0.5 block">{agreement.leaseTenure}</strong>
            </div>

            <div className="p-3 bg-canvas-50 rounded border border-canvas-200 col-span-2 font-mono">
              <span className="text-canvas-600 text-[10px] block">CAPTURED GEOTAG COORDINATES:</span>
              <strong className="text-ink-900 text-xs">
                {agreement.gpsLat.toFixed(6)}° N, {agreement.gpsLng.toFixed(6)}° E
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Statutory Non-Alienation Disclaimer */}
      <div className="p-4 bg-canvas-50 border border-canvas-300 rounded-lg text-xs text-ink-700 space-y-1 mb-6">
        <p className="font-bold text-ink-900 font-serif">⚖️ Statutory Landowner Protection Notice</p>
        <p className="leading-relaxed text-[11px] text-canvas-600">
          Endorsing this digital tenancy registration does <strong>NOT</strong> create any tenancy rights of occupancy, statutory purchase, or alienation over your registered land parcel under state tenancy regulations. It exists strictly to enable the cultivator to access institutional crop insurance (PMFBY), Kisan Credit (KCC), and subsidy benefits.
        </p>
      </div>

      {/* Action Buttons */}
      {agreement?.status === "PENDING_LANDOWNER_CONSENT" && !actionResult && (
        <div className="doc-card border border-canvas-300 p-6 bg-white shadow-doc">
          <h3 className="font-serif font-bold text-xs text-ink-900 uppercase tracking-wider mb-3">
            Administrative Decision
          </h3>

          {!showRejectForm ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleAction("approve")}
                disabled={actionLoading}
                className="btn-gov-success flex-1 py-3 text-xs uppercase font-bold tracking-wider"
              >
                {actionLoading ? "Processing e-Sign..." : "✓ Grant e-Consent (Aadhaar Verified)"}
              </button>
              <button
                onClick={() => setShowRejectForm(true)}
                className="btn-gov-danger flex-1 py-3 text-xs uppercase font-bold tracking-wider"
              >
                ✕ Record Formal Objection / Reject
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="gov-label">Reason for Objection / Rejection</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="State reason (e.g. Boundary dispute, no tenancy arrangement, incorrect Survey/Gat number...)"
                className="gov-input min-h-[90px] text-xs resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction("reject")}
                  disabled={actionLoading || !rejectionReason.trim()}
                  className="btn-gov-danger flex-1 py-2.5 text-xs uppercase font-bold"
                >
                  {actionLoading ? "Recording..." : "Confirm Objection"}
                </button>
                <button
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectionReason("");
                  }}
                  className="btn-gov-secondary flex-1 py-2.5 text-xs uppercase font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {actionResult && (
        <div
          className={`p-4 rounded-lg border text-xs font-bold ${
            actionResult.success
              ? "bg-olive-50 border-olive-600 text-olive-900"
              : "bg-crimson-50 border-crimson-600 text-crimson-800"
          }`}
        >
          {actionResult.message}
        </div>
      )}
    </div>
  );
}
