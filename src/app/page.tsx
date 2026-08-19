"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import type { AgreementStatus } from "@/models/Agreement";

export default function LandingPage() {
  const [trackId, setTrackId] = useState("");
  const [trackResult, setTrackResult] = useState<Record<string, unknown> | null>(null);
  const [trackError, setTrackError] = useState("");
  const [trackLoading, setTrackLoading] = useState(false);

  const handleTrack = async () => {
    if (!trackId.trim()) return;
    setTrackLoading(true);
    setTrackError("");
    setTrackResult(null);

    try {
      const res = await fetch(`/api/agreements/${trackId.trim()}`);
      const data = await res.json();
      if (data.error) {
        setTrackError(data.error);
      } else {
        setTrackResult(data);
      }
    } catch {
      setTrackError("Unable to query registry ledger. Please check network connectivity.");
    } finally {
      setTrackLoading(false);
    }
  };

  const nationalMetrics = [
    { label: "Verified Tenancy Deeds", value: "1,247", icon: "📜" },
    { label: "Cadastral Parcels Mapped", value: "3,840 Ha", icon: "🗺️" },
    { label: "Participating Revenue Circles", value: "48 Sazas", icon: "🏛️" },
    { label: "On-Chain Ledger Proofs", value: "100%", icon: "⛓️" },
  ];

  return (
    <div className="w-full">
      {/* Hero Section — Same Layout & Split */}
      <section className="bg-canvas-50 border-b border-canvas-300 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Top National Pillar Badge */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-olive-50 border border-olive-200 text-olive-900 font-mono text-[11px] font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-olive-700" />
              AgriStack & State Land Record Cross-Referencing Standard
            </span>
            <span className="text-xs text-canvas-600 font-medium">
              National Digital Public Infrastructure (DPI)
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Column — Text & CTAs */}
            <div className="lg:col-span-7 space-y-5">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink-900 tracking-tight leading-[1.15]">
                Digital Tenancy <br />
                <span className="text-olive-800 underline decoration-olive-600 decoration-3 underline-offset-4">
                  Verification Network
                </span>
              </h1>

              <p className="text-sm text-ink-700 leading-relaxed font-sans max-w-xl">
                Transforming informal oral agricultural tenancy into legally robust, tamper-evident digital records. 
                Integrating state land records (<span className="font-semibold text-ink-900">RoR / 7/12 / Khasra / Patta</span>), 
                cadastral spatial boundary verification, and immutable cryptographic anchoring on the public Polygon ledger.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/login" className="btn-gov-primary text-xs px-6 py-3 shadow-sm">
                  <span>🌾 Citizen Gateway</span>
                  <span className="text-canvas-300 font-normal ml-1">(Tenant & Landowner)</span>
                </Link>
                <Link href="/login?role=official" className="btn-gov-secondary text-xs px-6 py-3">
                  <span>🏛️ Revenue Official Portal</span>
                </Link>
              </div>
            </div>

            {/* Right Column — Blank Specimen Template (Hero Privacy Guard: ZERO Personal Data Pre-Auth) */}
            <div className="lg:col-span-5">
              <div className="doc-card p-5 border border-canvas-300 bg-white security-border shadow-tactile">
                <div className="flex items-center justify-between border-b border-canvas-200 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-olive-900 text-canvas-50 flex items-center justify-center font-serif text-[11px] font-bold">
                      IN
                    </div>
                    <div>
                      <p className="font-serif font-bold text-xs text-ink-900 uppercase tracking-wider">Digital Cultivation Credential</p>
                      <p className="font-mono text-[10px] text-canvas-600">Template Specimen • Blank Instrument Format</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-canvas-100 text-ink-700 border border-canvas-300 px-2 py-0.5 rounded">
                    SAMPLE PREVIEW
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-canvas-200">
                    <span className="text-canvas-600 font-medium">Record Identifier</span>
                    <span className="font-mono font-bold text-ink-900 tracking-wider">DTVN-••••••••</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-canvas-200">
                    <span className="text-canvas-600 font-medium">Cadastral Survey / Gat / Khasra</span>
                    <span className="font-mono text-ink-500 font-medium">—</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-canvas-200">
                    <span className="text-canvas-600 font-medium">Verified Cultivator</span>
                    <span className="font-mono text-ink-500 font-medium">—</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-canvas-200">
                    <span className="text-canvas-600 font-medium">Title Khatedar / Landowner</span>
                    <span className="font-mono text-ink-500 font-medium">—</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-canvas-600 font-medium">Proof Anchoring</span>
                    <span className="font-mono text-[11px] text-wheat-700 font-bold">Polygon Ledger Anchor</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-dashed border-canvas-300 text-[11px] text-canvas-600 flex items-center justify-between">
                  <span>Zero-PII Cryptographic Guarantee</span>
                  <span className="font-mono text-ink-900 font-bold text-[10px]">DPDP COMPLIANT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Registry Counters — Visual Noise Cleaned Up (Redundant Status Pills Removed) */}
      <section className="bg-canvas-100 border-b border-canvas-300 py-6 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {nationalMetrics.map((item) => (
            <div key={item.label} className="bg-white border border-canvas-300 rounded-lg p-4 shadow-sm">
              <div className="text-lg mb-1">{item.icon}</div>
              <p className="text-2xl font-bold font-serif text-ink-900">{item.value}</p>
              <p className="text-xs text-canvas-600 font-medium mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DTVN Document Tracking Registry Query — Same Placement */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <div className="doc-card border border-canvas-300 p-6 sm:p-8 bg-white shadow-doc">
          <div className="border-b border-canvas-200 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-serif font-bold text-ink-900">
                National Tenancy Deed & Application Tracker
              </h2>
              <p className="text-xs text-canvas-600 mt-0.5">
                Query any DTVN Reference ID across participating state land registry circles
              </p>
            </div>
            <span className="text-[10px] font-mono bg-canvas-100 text-ink-700 px-2 py-0.5 rounded border border-canvas-300 font-bold self-start">
              PUBLIC REGISTRY QUERY
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={trackId}
              onChange={(e) => setTrackId(e.target.value.toUpperCase())}
              placeholder="ENTER REFERENCE ID (E.G. DTVN-XXXXXXXX)"
              className="gov-input flex-1 font-mono uppercase text-xs font-bold tracking-wider"
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
            />
            <button
              onClick={handleTrack}
              disabled={trackLoading || !trackId.trim()}
              className="btn-gov-primary px-6 whitespace-nowrap"
            >
              {trackLoading ? "Querying Ledger..." : "🔍 Search Ledger"}
            </button>
          </div>

          {trackError && (
            <div className="mt-4 p-3 rounded-lg bg-crimson-50 border border-crimson-600 text-xs text-crimson-800 font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>{trackError}</span>
            </div>
          )}

          {trackResult && (
            <div className="mt-6 border border-canvas-300 rounded-lg bg-canvas-50 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-canvas-200 pb-2">
                <span className="text-[11px] font-bold uppercase font-mono text-canvas-600">DTVN Registry Reference</span>
                <span className="font-mono font-bold text-sm text-ink-900">
                  {((trackResult.dtvnId as string) || (trackResult.agreement && ((trackResult.agreement as Record<string, unknown>).dtvnId as string))) || trackId}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-canvas-600 block">Cadastral Survey / Gat / Khasra</span>
                  <span className="font-bold text-ink-900 text-sm">
                    {((trackResult.gatNumber as string) || (trackResult.agreement && ((trackResult.agreement as Record<string, unknown>).gatNumber as string)))}
                  </span>
                </div>
                <div>
                  <span className="text-canvas-600 block">Current Registry Status</span>
                  <div className="mt-1">
                    <StatusBadge
                      status={
                        ((trackResult.status as AgreementStatus) ||
                          (trackResult.agreement &&
                            ((trackResult.agreement as Record<string, unknown>).status as AgreementStatus))) ||
                        "PENDING_LANDOWNER_CONSENT"
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-canvas-200 text-xs text-canvas-600 flex justify-between items-center">
                <span>Direct Access: Log in as Title Landowner to review consent request.</span>
                <Link
                  href="/login?role=landowner"
                  className="text-olive-900 font-bold hover:underline"
                >
                  Landowner Portal →
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tri-Gateway Architecture Explainer — Same Structure & Placement */}
      <section className="py-12 px-4 bg-canvas-50 border-t border-canvas-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl font-serif font-bold text-ink-900">
              National Verification Workflow
            </h2>
            <p className="text-xs text-canvas-600 mt-1 max-w-lg mx-auto">
              How DTVN bridges state revenue departments, verified cultivators, and title landowners
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="doc-card p-6 border-t-2 border-t-olive-800 bg-white shadow-sm">
              <div className="font-mono text-[10px] font-bold text-olive-800 uppercase tracking-wider mb-2">STAGE 01 • CULTIVATOR</div>
              <h3 className="font-serif font-bold text-sm text-ink-900 mb-2">Spatial Parcel Declaration</h3>
              <p className="text-xs text-ink-700 leading-relaxed">
                Tenant farmer initiates application with plot Survey/Gat/Khasra identification, crop calendar, and geotagged field coordinates. Generates non-guessable DTVN ID.
              </p>
            </div>

            <div className="doc-card p-6 border-t-2 border-t-umber-700 bg-white shadow-sm">
              <div className="font-mono text-[10px] font-bold text-umber-700 uppercase tracking-wider mb-2">STAGE 02 • TITLE HOLDER</div>
              <h3 className="font-serif font-bold text-sm text-ink-900 mb-2">Identity-to-Title Consent</h3>
              <p className="text-xs text-ink-700 leading-relaxed">
                Landowner matches Aadhaar identity to official State Land Registry (RoR/7/12/Khatauni). Grants e-Consent with clear statutory non-alienation indemnity.
              </p>
            </div>

            <div className="doc-card p-6 border-t-2 border-t-wheat-600 bg-white shadow-sm">
              <div className="font-mono text-[10px] font-bold text-wheat-700 uppercase tracking-wider mb-2">STAGE 03 • REVENUE OFFICIAL</div>
              <h3 className="font-serif font-bold text-sm text-ink-900 mb-2">PostGIS & Ledger Anchor</h3>
              <p className="text-xs text-ink-700 leading-relaxed">
                Patwari verifies cadastral point-in-polygon compliance. Computes salted SHA-256 hash and anchors the credential on Polygon Amoy.
              </p>
            </div>
          </div>

          {/* Demo Data Seeder */}
          <div className="mt-12 text-center pt-6 border-t border-canvas-200">
            <button
              onClick={async () => {
                const res = await fetch("/api/seed", { method: "POST" });
                const data = await res.json();
                alert(
                  data.success
                    ? `Registry seeded with ${data.users.length} standard demo personas.`
                    : "Seeding failed"
                );
              }}
              className="btn-gov-secondary text-xs px-4 py-2"
            >
              🌱 Initialize Demonstration Records & Personas
            </button>
            <p className="text-[11px] text-canvas-600 mt-1">
              Seeds pre-configured test profiles (Ramesh Kumar, Suresh Patil, Officer Vijay Kadam)
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
