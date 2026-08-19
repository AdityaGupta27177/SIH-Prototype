"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import type { IAgreement } from "@/models/Agreement";

export default function TenantDashboard() {
  const [agreements, setAgreements] = useState<IAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; phone: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user || data.user.role !== "tenant") {
          router.push("/login");
          return;
        }
        setUser(data.user);
      })
      .catch(() => router.push("/login"));

    fetch("/api/agreements")
      .then((r) => r.json())
      .then((data) => {
        setAgreements(data.agreements || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const statusCounts = {
    pending: agreements.filter((a) => a.status === "PENDING_LANDOWNER_CONSENT").length,
    approved: agreements.filter((a) => a.status === "OWNER_APPROVED").length,
    verified: agreements.filter((a) => a.status === "OFFICIALLY_VERIFIED").length,
    rejected: agreements.filter((a) => a.status === "OWNER_REJECTED").length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-300 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase bg-olive-50 text-olive-900 border border-olive-400 px-2 py-0.5 rounded font-bold">
              CULTIVATOR DESK
            </span>
            <span className="text-xs text-canvas-600 font-medium">Aadhaar e-KYC Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink-900 mt-1">
            Cultivation Overview — {user?.name || "Farmer"}
          </h1>
          <p className="text-xs text-canvas-600 mt-0.5">
            Manage your verified agricultural plots, land agreements, and institutional credentials.
          </p>
        </div>

        <Link
          href="/tenant/agreements/new"
          className="btn-gov-primary text-xs shrink-0"
        >
          + Initiate Plot Verification
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Awaiting Title Consent", count: statusCounts.pending, bg: "border-canvas-300 text-ink-900", icon: "⏳" },
          { label: "Landowner Endorsed", count: statusCounts.approved, bg: "border-canvas-300 text-ink-900", icon: "🖋️" },
          { label: "Verified & On-Chain", count: statusCounts.verified, bg: "border-wheat-600 bg-wheat-50 text-wheat-800", icon: "🛡️" },
          { label: "Objections / Rejections", count: statusCounts.rejected, bg: "border-canvas-300 text-crimson-800", icon: "⚠️" },
        ].map((item) => (
          <div key={item.label} className={`border rounded-lg p-4 bg-white shadow-sm ${item.bg}`}>
            <div className="flex items-center justify-between">
              <span className="text-base">{item.icon}</span>
              <span className="font-mono text-2xl font-bold">{item.count}</span>
            </div>
            <p className="text-xs font-semibold mt-2">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Tenancy Application Records */}
      <div className="doc-card border border-canvas-300 p-6 bg-white shadow-doc">
        <div className="flex items-center justify-between border-b border-canvas-200 pb-4 mb-4">
          <h2 className="font-serif font-bold text-base text-ink-900">
            Registered Cultivation Records
          </h2>
          <span className="font-mono text-xs text-canvas-600 font-medium">
            TOTAL RECORDS: {agreements.length}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-canvas-600 font-mono">
            Loading cadastral holdings from registry...
          </div>
        ) : agreements.length === 0 ? (
          <div className="py-12 text-center">
            <span className="text-2xl block mb-2">📜</span>
            <h3 className="font-serif font-bold text-ink-900 text-sm">No Cultivation Deeds Registered</h3>
            <p className="text-xs text-canvas-600 max-w-sm mx-auto mt-1 mb-5">
              Submit your plot survey number and drop a geotag pin to generate your first Digital Cultivation Credential.
            </p>
            <Link href="/tenant/agreements/new" className="btn-gov-primary text-xs">
              Register New Plot Tenancy →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {agreements.map((agreement) => (
              <div
                key={agreement.dtvnId}
                className="doc-card-interactive p-4 border border-canvas-300 bg-canvas-50"
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
                      <span>{agreement.village}, {agreement.taluka}</span>
                      <span>•</span>
                      <span>Crop: {agreement.cropCategory} ({agreement.leaseTenure})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    {agreement.txHash ? (
                      <a
                        href={`https://amoy.polygonscan.com/tx/${agreement.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gov-secondary text-[11px] py-1 px-2.5 font-bold text-olive-900 border-olive-500"
                      >
                        Proof On-Chain ↗
                      </a>
                    ) : (
                      <span className="text-[11px] text-canvas-600">
                        Created: {new Date(agreement.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {agreement.status === "OWNER_REJECTED" && agreement.rejectionReason && (
                  <div className="mt-3 p-2.5 bg-crimson-50 border border-crimson-600 rounded text-xs text-crimson-800 font-medium">
                    ⚠️ Landowner Stated Objection: &ldquo;{agreement.rejectionReason}&rdquo;
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
