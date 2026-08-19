"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import type { IAgreement } from "@/models/Agreement";

export default function LandownerDashboard() {
  const [agreements, setAgreements] = useState<IAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; phone: string } | null>(null);
  const [reviewId, setReviewId] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user || data.user.role !== "landowner") {
          router.push("/login?role=landowner");
          return;
        }
        setUser(data.user);
      })
      .catch(() => router.push("/login?role=landowner"));

    fetch("/api/agreements")
      .then((r) => r.json())
      .then((data) => {
        setAgreements(data.agreements || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="border-b border-canvas-300 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase bg-umber-50 text-umber-800 border border-umber-400 px-2 py-0.5 rounded font-bold">
              LANDOWNER REGISTRY DESK
            </span>
            <span className="text-xs text-canvas-600 font-medium">State RoR / 7/12 Matched</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink-900 mt-1">
            Land Title & Tenancy Consent Desk
          </h1>
          <p className="text-xs text-canvas-600 mt-0.5">
            Logged in as: <strong className="text-ink-900">{user?.name}</strong> (+91 {user?.phone})
          </p>
        </div>
      </div>

      {/* Direct DTVN Query */}
      <div className="doc-card border border-canvas-300 p-6 bg-white shadow-doc mb-8">
        <label className="gov-label">Direct Application Consent Review (From SMS Reference)</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={reviewId}
            onChange={(e) => setReviewId(e.target.value.toUpperCase())}
            placeholder="ENTER DTVN REFERENCE ID (E.G. DTVN-8E4B19A2)"
            className="gov-input font-mono uppercase text-xs font-bold tracking-wider flex-1"
            onKeyDown={(e) =>
              e.key === "Enter" &&
              reviewId &&
              router.push(`/landowner/review/${reviewId}`)
            }
          />
          <button
            onClick={() =>
              reviewId && router.push(`/landowner/review/${reviewId}`)
            }
            disabled={!reviewId.trim()}
            className="btn-gov-primary px-8 whitespace-nowrap"
          >
            Review Deed →
          </button>
        </div>
      </div>

      {/* Pending Consent Queue */}
      <div className="doc-card border border-canvas-300 p-6 bg-white shadow-doc">
        <div className="flex items-center justify-between border-b border-canvas-200 pb-4 mb-4">
          <h2 className="font-serif font-bold text-base text-ink-900">
            Pending Tenancy Requests on Your Title
          </h2>
          <span className="font-mono text-xs text-canvas-600">
            {agreements.length} RECORD(S)
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-canvas-600">
            Querying land records matching your phone...
          </div>
        ) : agreements.length === 0 ? (
          <div className="py-12 text-center">
            <span className="text-2xl block mb-2">🏡</span>
            <h3 className="font-serif font-bold text-ink-900 text-sm">No Pending Consent Requests</h3>
            <p className="text-xs text-canvas-600 max-w-sm mx-auto mt-1">
              When a verified cultivator submits an agreement referencing your cadastral parcel, it will appear here for e-Sign approval.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {agreements.map((agreement) => (
              <div
                key={agreement.dtvnId}
                onClick={() =>
                  router.push(`/landowner/review/${agreement.dtvnId}`)
                }
                className="doc-card-interactive p-4 border border-canvas-300 bg-canvas-50 cursor-pointer"
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
                      <span>Applicant Cultivator: <strong>{agreement.tenantName}</strong></span>
                      <span>•</span>
                      <span>Crop: {agreement.cropCategory}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="btn-gov-primary text-[10px] font-bold py-1.5 px-3">
                      Open Review Desk →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
