"use client";

import { useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import type { AgreementStatus } from "@/models/Agreement";

export default function VerifyPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const isHash = input.startsWith("0x");
      const query = isHash ? `txHash=${input.trim()}` : `id=${input.trim()}`;
      const res = await fetch(`/api/verify?${query}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError("Ledger query communication failure. Verify RPC connectivity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header Band */}
      <div className="border-b border-canvas-300 pb-6 mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-olive-50 border border-olive-300 text-olive-900 rounded font-mono text-[11px] font-bold uppercase tracking-wider mb-2">
          <span>⛓️</span> Public Proof-of-Tenancy Ledger
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink-900">
          Blockchain Deed & Credential Verification
        </h1>
        <p className="text-xs text-canvas-600 mt-1 max-w-2xl">
          Directly audit agricultural tenancy deeds anchored on Polygon Amoy. Verify cryptographic authenticity without revealing private personal data.
        </p>
      </div>

      {/* Query Bar */}
      <div className="doc-card p-6 bg-white border border-canvas-300 shadow-doc mb-8">
        <label className="gov-label">Enter DTVN Reference ID or Transaction Hash</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="DTVN-XXXXXXXX or 0x..."
            className="gov-input font-mono text-sm tracking-wide flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleVerify()}
          />
          <button
            onClick={handleVerify}
            disabled={loading || !input.trim()}
            className="btn-gov-primary px-8 whitespace-nowrap"
          >
            {loading ? "Querying Ledger..." : "Audit Record 🔍"}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-crimson-50 border border-crimson-600 text-xs text-crimson-800 font-medium">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Audit Outcome Card */}
      {result && (
        <div className="space-y-6">
          {/* Status Ribbon */}
          <div
            className={`p-4 rounded-lg border flex items-center justify-between ${
              result.verified
                ? "bg-wheat-50 border-wheat-600 text-wheat-800"
                : "bg-canvas-100 border-canvas-400 text-ink-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{result.verified ? "🛡️" : "⚠️"}</span>
              <div>
                <h3 className="font-serif font-bold text-xs uppercase tracking-wider">
                  {result.verified ? "ON-CHAIN PROOF VERIFIED" : "RECORD PENDING OFFICIAL VALIDATION"}
                </h3>
                <p className="text-xs opacity-80">
                  {result.verified
                    ? "Cryptographic SHA-256 payload matches Polygon ledger state."
                    : (result.message as string) || "This application is undergoing revenue department review."}
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold px-2.5 py-1 bg-white rounded border border-current">
              {result.verified ? "STATUS: VALID" : "UNVERIFIED"}
            </span>
          </div>

          {/* Authentic Digital Cultivation Credential Card */}
          {result.verified && (
            <div className="doc-card border border-canvas-300 p-6 bg-white security-border shadow-doc-lg">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-canvas-300 pb-4 mb-5 gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded bg-olive-900 text-canvas-50 flex items-center justify-center font-serif text-sm font-bold border border-olive-700">
                    IN
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-sm text-ink-900 uppercase tracking-wider">
                      Digital Cultivation Credential (DCC)
                    </h2>
                    <p className="text-[11px] font-mono text-canvas-600">
                      National Agricultural Registry • Verified Tenancy Instrument
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <span className="text-canvas-600 block text-[10px]">RECORD REF:</span>
                  <span className="font-bold text-ink-900">{result.dtvnId as string}</span>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-canvas-50 border border-canvas-200 rounded">
                  <span className="text-canvas-600 block font-medium">Cadastral Parcel Identification</span>
                  <span className="font-bold text-ink-900 text-sm mt-0.5 block">
                    Survey / Gat / Khasra No. {result.gatNumber as string}
                  </span>
                  <span className="text-[11px] text-canvas-600 block mt-0.5">
                    {result.village as string}, {result.taluka as string}, {result.district as string}
                  </span>
                </div>

                <div className="p-3 bg-canvas-50 border border-canvas-200 rounded">
                  <span className="text-canvas-600 block font-medium">Regulatory Tenancy Status</span>
                  <div className="mt-1">
                    <StatusBadge status={(result.status as AgreementStatus) || "OFFICIALLY_VERIFIED"} />
                  </div>
                  <span className="text-[10px] text-canvas-600 block mt-1">
                    State Land Registry (RoR/7/12/Patta) Cross-Verified
                  </span>
                </div>

                <div className="p-3 bg-canvas-50 border border-canvas-200 rounded sm:col-span-2 space-y-1.5 font-mono">
                  <div>
                    <span className="text-canvas-600 text-[10px] block font-bold">SALTED RECORD SHA-256 HASH:</span>
                    <span className="text-[11px] text-ink-900 font-bold break-all">{result.recordHash as string}</span>
                  </div>
                  {result.txHash && (
                    <div>
                      <span className="text-canvas-600 text-[10px] block font-bold">POLYGON TRANSACTION HASH:</span>
                      <a
                        href={`https://amoy.polygonscan.com/tx/${result.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-olive-900 font-bold underline hover:text-olive-700 break-all"
                      >
                        {result.txHash as string} ↗
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Legal Non-Alienation Disclaimer */}
              <div className="mt-5 pt-4 border-t border-dashed border-canvas-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] text-canvas-600">
                <p>
                  <strong>Statutory Guarantee:</strong> This credential certifies seasonal cultivation rights only. It does not confer title, ownership, or land alienation rights.
                </p>
                <span className="font-mono text-[10px] font-bold bg-canvas-100 text-ink-800 px-2 py-1 rounded border border-canvas-300 shrink-0">
                  AgriStack Compliant
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
