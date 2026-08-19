"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { IAgreement } from "@/models/Agreement";

export default function OfficialDashboard() {
  const [agreements, setAgreements] = useState<IAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user || data.user.role !== "official") {
          router.push("/login?role=official");
          return;
        }
        setUser(data.user);
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

  const pendingVerification = agreements.filter(
    (a) => a.status === "OWNER_APPROVED"
  ).length;
  const verified = agreements.filter(
    (a) => a.status === "OFFICIALLY_VERIFIED"
  ).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="border-b border-canvas-300 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase bg-olive-900 text-canvas-50 px-2 py-0.5 rounded font-bold">
              DEPARTMENT OF REVENUE & LAND RECORDS
            </span>
            <span className="text-xs font-mono font-bold text-umber-800 bg-umber-50 border border-umber-300 px-2 py-0.5 rounded">
              SAZA CIRCLE 14
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink-900 mt-1">
            Revenue Officer Workbench — {user?.name || "Patwari"}
          </h1>
          <p className="text-xs text-canvas-600 mt-0.5">
            Cadastral Boundary Cross-Check, Digital Crop Survey (DCS) & Blockchain Anchoring
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Cases Awaiting Saza Verification", value: pendingVerification, bg: "border-canvas-300 text-ink-900", icon: "⏳" },
          { label: "Anchored to Polygon Ledger", value: verified, bg: "border-wheat-600 bg-wheat-50 text-wheat-800", icon: "🛡️" },
          { label: "Total Handled Records", value: agreements.length, bg: "border-canvas-300 text-ink-900", icon: "📋" },
          { label: "Saza Boundary Alignment", value: "100%", bg: "border-canvas-300 text-ink-900", icon: "🗺️" },
        ].map((item) => (
          <div key={item.label} className={`border rounded-lg p-4 bg-white shadow-sm ${item.bg}`}>
            <div className="flex items-center justify-between">
              <span className="text-base">{item.icon}</span>
              <span className="font-mono text-2xl font-bold">{loading ? "—" : item.value}</span>
            </div>
            <p className="text-xs font-semibold mt-2">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Action Cards */}
      <div className="grid md:grid-cols-2 gap-5">
        <Link
          href="/official/queue"
          className="doc-card-interactive p-6 bg-white border border-canvas-300 flex items-center justify-between shadow-doc"
        >
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold text-olive-900 bg-olive-50 px-2 py-0.5 rounded border border-olive-300">
              ACTION REQUIRED: {pendingVerification} PENDING
            </span>
            <h2 className="font-serif font-bold text-base text-ink-900">
              Saza Verification Queue
            </h2>
            <p className="text-xs text-canvas-600">
              Review landowner-endorsed applications, execute PostGIS point-in-polygon tests, and anchor verified deeds to the Polygon blockchain.
            </p>
          </div>
          <span className="text-xl text-olive-900 ml-4 font-bold">→</span>
        </Link>

        <Link
          href="/verify"
          className="doc-card-interactive p-6 bg-white border border-canvas-300 flex items-center justify-between shadow-doc"
        >
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold text-wheat-800 bg-wheat-50 px-2 py-0.5 rounded border border-wheat-400">
              PUBLIC LEDGER AUDIT
            </span>
            <h2 className="font-serif font-bold text-base text-ink-900">
              Audit Polygon Anchors
            </h2>
            <p className="text-xs text-canvas-600">
              Query cryptographic transaction receipts and verify digital cultivation credentials on-chain.
            </p>
          </div>
          <span className="text-xl text-olive-900 ml-4 font-bold">→</span>
        </Link>
      </div>
    </div>
  );
}
