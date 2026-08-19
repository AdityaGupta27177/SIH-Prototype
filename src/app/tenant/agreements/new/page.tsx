"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { SEED_KHATEDAR_RECORDS } from "@/lib/seed-data";

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] rounded-lg border border-canvas-300 bg-canvas-50 flex items-center justify-center">
      <p className="text-xs font-mono text-canvas-600">Initializing Cadastral Geoportal...</p>
    </div>
  ),
});

const CROP_OPTIONS = [
  "Paddy / Rice (धान)",
  "Wheat (गेहूं)",
  "Sugarcane (गन्ना)",
  "Soybean (सोयाबीन)",
  "Cotton (कपास)",
  "Sorghum / Jowar (ज्वार)",
  "Millet / Bajra (बाजरा)",
  "Maize / Corn (मक्का)",
  "Groundnut (मूंगफली)",
  "Onion & Pulses (प्याज/दलहन)",
  "Horticulture / Mixed (बागवानी)",
];

const TENURE_OPTIONS = [
  "Kharif Season 2026",
  "Rabi Season 2026-27",
  "Annual Lease 2026-27",
  "2-Year Tenure",
  "3-Year Multi-Crop Agreement",
];

const KNOWN_GATS = SEED_KHATEDAR_RECORDS.map((r) => r.gatNumber);

export default function NewAgreementPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ dtvnId: string } | null>(null);
  const router = useRouter();

  const [form, setForm] = useState({
    landownerPhone: "",
    district: "Pune",
    taluka: "Haveli",
    village: "Wadgaon",
    gatNumber: "",
    cropCategory: "",
    leaseTenure: "",
    gpsLat: 0,
    gpsLng: 0,
  });

  const [gatStatus, setGatStatus] = useState<"valid" | "invalid" | "empty">("empty");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user || data.user.role !== "tenant") {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const handleGatChange = (value: string) => {
    const cleanGat = value.trim();
    setForm((prev) => ({ ...prev, gatNumber: value }));
    if (!cleanGat) {
      setGatStatus("empty");
    } else {
      const match = KNOWN_GATS.some((g) => g.toLowerCase() === cleanGat.toLowerCase());
      setGatStatus(match ? "valid" : "invalid");
    }
  };

  const updateForm = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setForm((prev) => ({ ...prev, gpsLat: lat, gpsLng: lng }));
  }, []);

  const cleanPhone = form.landownerPhone.replace(/\D/g, "");
  const isPhoneValid = cleanPhone.length === 10;
  const isGatValid = gatStatus === "valid";

  const canProceed = (currentStep: number) => {
    if (currentStep === 1) {
      return isPhoneValid && isGatValid;
    }
    if (currentStep === 2) {
      return form.cropCategory !== "" && form.leaseTenure !== "";
    }
    if (currentStep === 3) {
      return form.gpsLat !== 0 && form.gpsLng !== 0;
    }
    return false;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/agreements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          landownerPhone: cleanPhone,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess({ dtvnId: data.agreement.dtvnId });
      } else {
        setError(data.error || "Failed to submit verification request");
      }
    } catch {
      setError("Network communication error. Verify database connection.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="doc-card border border-canvas-300 p-8 bg-white text-center security-border shadow-doc-lg">
          <div className="w-12 h-12 rounded-full bg-olive-50 border border-olive-700 text-olive-900 flex items-center justify-center text-xl mx-auto mb-3">
            🛡️
          </div>
          <span className="font-mono text-[10px] uppercase font-bold text-olive-900 bg-olive-50 px-2.5 py-0.5 rounded border border-olive-400">
            APPLICATION RECORDED IN REGISTRY
          </span>
          <h2 className="text-xl font-serif font-bold text-ink-900 mt-3 mb-1">
            Tenancy Deed Initiated
          </h2>
          <p className="text-xs text-canvas-600 max-w-md mx-auto mb-6">
            Your cultivation claim has been registered. The title landowner has been dispatched a formal e-Consent notification.
          </p>

          <div className="bg-canvas-50 border border-canvas-300 rounded-lg p-5 mb-6 text-left space-y-2">
            <div className="flex justify-between items-center border-b border-canvas-200 pb-2">
              <span className="text-xs font-mono font-bold text-canvas-600">OFFICIAL DTVN REFERENCE ID</span>
              <span className="font-mono font-bold text-base text-ink-900">{success.dtvnId}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-canvas-600 block">Survey / Gat / Khasra:</span>
                <strong className="text-ink-900">{form.gatNumber}</strong>
              </div>
              <div>
                <span className="text-canvas-600 block">Landowner Contact:</span>
                <strong className="text-ink-900">+91 {cleanPhone}</strong>
              </div>
            </div>
          </div>

          <div className="p-3 bg-canvas-100 border border-canvas-300 rounded text-xs text-ink-700 text-left mb-6 font-mono">
            📱 <strong>DISPATCHED NOTIFICATION:</strong> Cultivation verification request recorded for Survey/Gat {form.gatNumber}. Review at dtvn.gov.in using Reference: {success.dtvnId}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/tenant/dashboard")}
              className="btn-gov-primary flex-1 py-3"
            >
              Return to Cultivator Desk
            </button>
            <button
              onClick={() => {
                setSuccess(null);
                setStep(1);
                setForm({
                  landownerPhone: "",
                  district: "Pune",
                  taluka: "Haveli",
                  village: "Wadgaon",
                  gatNumber: "",
                  cropCategory: "",
                  leaseTenure: "",
                  gpsLat: 0,
                  gpsLng: 0,
                });
                setGatStatus("empty");
              }}
              className="btn-gov-secondary flex-1 py-3"
            >
              Verify Another Plot
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="border-b border-canvas-300 pb-5 mb-8">
        <span className="font-mono text-[10px] uppercase bg-canvas-200 text-ink-800 border border-canvas-400 px-2 py-0.5 rounded font-bold">
          FORM BCVN-01
        </span>
        <h1 className="text-2xl font-serif font-bold text-ink-900 mt-1">
          New Agricultural Plot Verification
        </h1>
        <p className="text-xs text-canvas-600 mt-0.5">
          AgriStack & State Land Record Cross-Referencing Standard
        </p>
      </div>

      {/* Step Indicator */}
      <div className="grid grid-cols-3 gap-2 mb-8 font-mono text-xs">
        {[
          { num: 1, title: "01 • PLOT IDENTIFIER" },
          { num: 2, title: "02 • CROP DECLARATION" },
          { num: 3, title: "03 • GPS GEOTAG" },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-3 rounded-lg border text-center transition-all ${
              step === s.num
                ? "border-olive-800 bg-olive-800 text-canvas-50 font-bold shadow-sm"
                : step > s.num
                ? "border-olive-600 bg-olive-50 text-olive-900 font-semibold"
                : "border-canvas-300 bg-white text-canvas-600"
            }`}
          >
            {s.title}
          </div>
        ))}
      </div>

      {/* Form Step Card */}
      <div className="doc-card border border-canvas-300 p-6 sm:p-8 bg-white shadow-doc">
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="border-b border-canvas-200 pb-3">
              <h2 className="font-serif font-bold text-base text-ink-900">
                Landowner & Cadastral Plot Details
              </h2>
              <p className="text-xs text-canvas-600">
                Enter the official cadastral survey reference and title landowner contact
              </p>
            </div>

            <div>
              <label className="gov-label">Title Landowner Mobile Number (Exact 10 Digits)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-mono text-xs text-canvas-600 font-bold select-none">
                  +91
                </span>
                <input
                  type="tel"
                  value={form.landownerPhone}
                  onChange={(e) =>
                    updateForm("landownerPhone", e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="9876543210"
                  className={`gov-input pl-12 font-mono text-sm ${
                    form.landownerPhone && !isPhoneValid ? "border-crimson-600" : ""
                  }`}
                  maxLength={10}
                />
              </div>
              {form.landownerPhone && !isPhoneValid && (
                <p className="text-[11px] text-crimson-700 mt-1 font-mono">
                  ⚠️ Must be an exact 10-digit mobile number ({cleanPhone.length}/10 entered)
                </p>
              )}
              <p className="text-[11px] text-canvas-600 mt-1 font-mono">
                Evaluator Seeded: <span className="font-bold text-ink-900">9876543210</span> (Suresh Patil) or <span className="font-bold text-ink-900">9876543211</span> (Meena Jadhav)
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="gov-label">District (जिला)</label>
                <input
                  type="text"
                  value={form.district}
                  onChange={(e) => updateForm("district", e.target.value)}
                  className="gov-input text-xs"
                />
              </div>
              <div>
                <label className="gov-label">Taluka / Tehsil (तहसील)</label>
                <input
                  type="text"
                  value={form.taluka}
                  onChange={(e) => updateForm("taluka", e.target.value)}
                  className="gov-input text-xs"
                />
              </div>
              <div>
                <label className="gov-label">Revenue Village (गाँव)</label>
                <input
                  type="text"
                  value={form.village}
                  onChange={(e) => updateForm("village", e.target.value)}
                  className="gov-input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="gov-label">Survey / Gat / Khasra / Khatauni Number</label>
              <input
                type="text"
                value={form.gatNumber}
                onChange={(e) => handleGatChange(e.target.value)}
                placeholder="e.g. 142/A, 87/B, 203/C, 56/D, 311/E"
                className={`gov-input font-mono uppercase font-bold ${
                  gatStatus === "invalid"
                    ? "border-crimson-600 bg-crimson-50/30"
                    : gatStatus === "valid"
                    ? "border-olive-700 bg-olive-50/20"
                    : ""
                }`}
              />

              {/* Immediate Gat Validation Feedback */}
              {gatStatus === "valid" && (
                <p className="text-[11px] text-olive-900 mt-1.5 font-mono flex items-center gap-1 font-bold">
                  <span>✓</span> Cadastral Gat {form.gatNumber.trim()} identified in active Saza 14 land records.
                </p>
              )}

              {gatStatus === "invalid" && (
                <div className="mt-1.5 p-2 bg-crimson-50 border border-crimson-600 rounded text-[11px] text-crimson-800 font-mono">
                  ⚠️ Survey/Gat &ldquo;{form.gatNumber}&rdquo; is not indexed in this Saza registry. Please select a valid indexed parcel: <strong>142/A, 87/B, 203/C, 56/D, 311/E</strong>.
                </div>
              )}

              <p className="text-[11px] text-canvas-600 mt-1 font-mono">
                Seeded Saza parcels: <strong>142/A, 87/B, 203/C, 56/D, 311/E</strong>
              </p>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="border-b border-canvas-200 pb-3">
              <h2 className="font-serif font-bold text-base text-ink-900">
                Digital Crop Survey (DCS) Declaration
              </h2>
              <p className="text-xs text-canvas-600">
                Specify the agricultural cultivation category and seasonal tenure
              </p>
            </div>

            <div>
              <label className="gov-label">Cultivated Crop Category (फसल श्रेणी)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CROP_OPTIONS.map((crop) => (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => updateForm("cropCategory", crop)}
                    className={`p-3 rounded border text-xs text-left transition-all ${
                      form.cropCategory === crop
                        ? "border-olive-800 bg-olive-50 text-olive-950 font-bold shadow-sm"
                        : "border-canvas-300 bg-white text-ink-700 hover:bg-canvas-50"
                    }`}
                  >
                    {crop}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="gov-label">Tenancy Duration & Agronomic Season (पट्टा अवधि)</label>
              <div className="grid sm:grid-cols-2 gap-2">
                {TENURE_OPTIONS.map((tenure) => (
                  <button
                    key={tenure}
                    type="button"
                    onClick={() => updateForm("leaseTenure", tenure)}
                    className={`p-3 rounded border text-xs text-left transition-all ${
                      form.leaseTenure === tenure
                        ? "border-olive-800 bg-olive-50 text-olive-950 font-bold shadow-sm"
                        : "border-canvas-300 bg-white text-ink-700 hover:bg-canvas-50"
                    }`}
                  >
                    {tenure}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="border-b border-canvas-200 pb-3">
              <h2 className="font-serif font-bold text-base text-ink-900">
                Cadastral Plot GPS Geotag
              </h2>
              <p className="text-xs text-canvas-600">
                Click on the map to anchor your cultivation point within Gat/Survey {form.gatNumber}
              </p>
            </div>
            <MapPicker onLocationSelect={handleLocationSelect} />
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-crimson-50 border border-crimson-600 text-xs text-crimson-800 font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-canvas-200">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              type="button"
              className="btn-gov-secondary"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed(step)}
              type="button"
              className="btn-gov-primary px-6"
            >
              Continue to Step {step + 1} →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !canProceed(3)}
              type="button"
              className="btn-gov-success px-8"
            >
              {loading ? "Registering on Ledger..." : "Submit Verification Deed ✓"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
