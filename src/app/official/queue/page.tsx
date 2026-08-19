"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import type { IAgreement } from "@/models/Agreement";

export default function OfficialQueuePage() {
  const [agreements, setAgreements] = useState<IAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user || data.user.role !== "official") {
          router.push("/login?role=official");
          return;
        }
      })
      .catch(() => router.push("/login?role=official"));

    fetch("/api/agreements")
      .then((r) => r.json())
      .then((data) => {
        setAgreements(data.agreements || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const pendingCases = agreements.filter(
    (a) => a.status === "OWNER_APPROVED"
  );
  const verifiedCases = agreements.filter(
    (a) => a.status === "OFFICIALLY_VERIFIED"
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="border-b border-canvas-300 pb-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase bg-olive-900 text-canvas-50 px-2 py-0.5 rounded font-bold">
              SAZA WORKBENCH
            </span>
            <span className="text-xs font-mono font-bold text-umber-800 bg-umber-50 border border-umber-300 px-2 py-0.5 rounded">
              CIRCLE 14
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-ink-900 mt-1">
            Verification Queue & Case Allocation
          </h1>
          <p className="text-xs text-canvas-600 mt-0.5">
            Applications with Title Landowner e-Consent awaiting Revenue Officer Adjudication
          </p>
        </div>

        <span className="font-mono text-xs font-bold px-3 py-1 bg-canvas-200 border border-canvas-400 text-ink-900 rounded shrink-0">
          {pendingCases.length} Awaiting Verification
        </span>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-mono text-canvas-600">
          Loading Saza work queue...
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pending Cases */}
          <div>
            <h2 className="font-serif font-bold text-sm text-ink-900 mb-3 flex items-center gap-2 uppercase tracking-wider">
              <span>⏳</span>
              <span>Pending Officer Adjudication ({pendingCases.length})</span>
            </h2>

            {pendingCases.length === 0 ? (
              <div className="doc-card p-6 bg-white border border-canvas-300 text-center text-xs text-canvas-600">
                No cases currently pending in this Saza.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingCases.map((agreement) => (
                  <div
                    key={agreement.dtvnId}
                    onClick={() =>
                      router.push(`/official/review/${agreement.dtvnId}`)
                    }
                    className="doc-card-interactive p-4 bg-white border border-canvas-300 hover:border-olive-800 cursor-pointer shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-xs text-ink-900 bg-canvas-200 px-2 py-0.5 rounded border border-canvas-300">
                            {agreement.dtvnId}
                          </span>
                          <StatusBadge status={agreement.status} />
                        </div>
                        <div className="text-xs text-ink-700 flex flex-wrap items-center gap-2 pt-1 font-medium">
                          <span>Survey/Gat/Khasra: <strong className="text-ink-900">{agreement.gatNumber}</strong></span>
                          <span>•</span>
                          <span>Cultivator: <strong>{agreement.tenantName}</strong></span>
                          <span>•</span>
                          <span>Crop: {agreement.cropCategory} ({agreement.leaseTenure})</span>
                          <span>•</span>
                          <span>{agreement.village}, {agreement.taluka}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-xs">
                        <button className="btn-gov-primary text-xs py-2 px-4">
                          Open Spatial Workbench →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verified Cases */}
          {verifiedCases.length > 0 && (
            <div>
              <h2 className="font-serif font-bold text-sm text-ink-900 mb-3 flex items-center gap-2 uppercase tracking-wider">
                <span>🛡️</span>
                <span>Recently Anchored on Polygon Ledger ({verifiedCases.length})</span>
              </h2>

              <div className="space-y-3">
                {verifiedCases.map((agreement) => (
                  <div
                    key={agreement.dtvnId}
                    className="doc-card p-4 bg-canvas-50 border border-canvas-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-xs text-ink-900 bg-canvas-200 px-2 py-0.5 rounded border border-canvas-300">
                            {agreement.dtvnId}
                          </span>
                          <StatusBadge status={agreement.status} />
                        </div>
                        <div className="text-xs text-ink-700 font-medium pt-1">
                          Survey/Gat: <strong>{agreement.gatNumber}</strong> • Cultivator: <strong>{agreement.tenantName}</strong>
                        </div>
                      </div>

                      {agreement.txHash && (
                        <a
                          href={`https://amoy.polygonscan.com/tx/${agreement.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-gov-secondary text-[11px] font-mono font-bold py-1 px-3 text-olive-900 border-olive-500"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Polygon TX ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
