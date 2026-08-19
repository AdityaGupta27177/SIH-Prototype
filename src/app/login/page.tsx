"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Role = "tenant" | "landowner" | "official";

const DEMO_ACCOUNTS: Record<Role, { phone: string; name: string; label: string; badge: string }> = {
  tenant: { phone: "9988776655", name: "Ramesh Kumar", label: "Tenant Cultivator", badge: "Aadhaar e-KYC" },
  landowner: { phone: "9876543210", name: "Suresh Patil", label: "Title Landowner", badge: "Khatedar RoR" },
  official: { phone: "9000000001", name: "Vijay Kadam", label: "Revenue Officer", badge: "Saza 14 Officer" },
};

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("tenant");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam && ["tenant", "landowner", "official"].includes(roleParam)) {
      setRole(roleParam as Role);
    }
  }, [searchParams]);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("otp");
      } else {
        setError(data.error || "Failed to issue verification code");
      }
    } catch {
      setError("Network communication error. Verify database connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the verification code");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, role, name: name || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        const redirectMap: Record<Role, string> = {
          tenant: "/tenant/dashboard",
          landowner: "/landowner/dashboard",
          official: "/official/dashboard",
        };
        router.push(redirectMap[role]);
      } else {
        setError(data.error || "Authentication failed. Invalid code.");
      }
    } catch {
      setError("Network communication error during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoRole: Role) => {
    const demo = DEMO_ACCOUNTS[demoRole];
    setRole(demoRole);
    setPhone(demo.phone);
    setName(demo.name);
    setOtp("123456");
    setStep("otp");
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="doc-card border border-canvas-300 overflow-hidden shadow-doc-lg bg-white">
          <div className="doc-header-band flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-olive-950 text-canvas-50 flex items-center justify-center font-serif text-[10px] font-bold border border-wheat-600">
                IN
              </div>
              <div>
                <h1 className="text-sm font-serif font-bold text-canvas-50 tracking-wide">
                  Citizen & Department Access
                </h1>
                <p className="text-[10px] text-canvas-300 font-mono">DTVN • NATIONAL VERIFICATION GATEWAY</p>
              </div>
            </div>
            <span className="text-[9px] font-mono bg-olive-950 text-wheat-500 px-2 py-0.5 rounded border border-wheat-600 font-bold">
              e-Gov Auth
            </span>
          </div>

          <div className="p-6 sm:p-8 bg-white">
            {/* Role Selection Tabs */}
            <div className="mb-6">
              <label className="gov-label">SELECT ACCESS GATEWAY</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "tenant", label: "Farmer", icon: "🌾", desc: "Cultivator" },
                  { value: "landowner", label: "Landowner", icon: "🏡", desc: "Title Holder" },
                  { value: "official", label: "Official", icon: "🏛️", desc: "Revenue / Saza" },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      setRole(item.value as Role);
                      setError("");
                    }}
                    type="button"
                    className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs transition-all ${
                      role === item.value
                        ? "border-olive-800 bg-olive-50 text-olive-950 font-bold shadow-sm"
                        : "border-canvas-300 bg-white text-ink-700 hover:bg-canvas-50"
                    }`}
                  >
                    <span className="text-base mb-0.5">{item.icon}</span>
                    <span className="font-semibold">{item.label}</span>
                    <span className="text-[9px] text-canvas-600 font-normal">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 1: Phone */}
            {step === "phone" && (
              <div className="space-y-4">
                <div>
                  <label className="gov-label">Aadhaar-Linked Mobile Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-mono text-xs text-canvas-600 font-bold select-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="98765 43210"
                      className="gov-input pl-12 font-mono text-sm tracking-wider"
                      maxLength={10}
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="gov-label">Full Legal Name (Optional for Existing Profiles)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="gov-input text-sm"
                  />
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={loading || phone.length < 10}
                  className="btn-gov-primary w-full py-3"
                >
                  {loading ? "Generating OTP..." : "Get OTP Verification Code →"}
                </button>
              </div>
            )}

            {/* Step 2: OTP */}
            {step === "otp" && (
              <div className="space-y-4">
                <div className="bg-canvas-50 border border-canvas-300 rounded-lg p-3 text-xs text-ink-700 flex justify-between items-center">
                  <div>
                    <span className="text-canvas-600 block text-[10px]">OTP Sent To:</span>
                    <span className="font-mono font-bold text-ink-900">+91 {phone}</span>
                  </div>
                  <button
                    onClick={() => {
                      setStep("phone");
                      setOtp("");
                      setError("");
                    }}
                    className="text-olive-900 font-semibold text-[11px] underline hover:text-olive-700"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label className="gov-label">Enter 6-Digit One-Time Password</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    className="gov-input text-center text-xl tracking-[0.4em] font-mono font-bold py-3 text-ink-900"
                    maxLength={6}
                    autoFocus
                  />
                  <p className="text-[11px] text-canvas-600 mt-1 font-mono text-center">
                    DEMO OTP: <span className="font-bold text-olive-900">123456</span>
                  </p>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length < 6}
                  className="btn-gov-primary w-full py-3"
                >
                  {loading ? "Validating Credentials..." : "Authenticate & Proceed →"}
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-crimson-50 border border-crimson-600 text-xs text-crimson-800 font-medium">
                ⚠️ {error}
              </div>
            )}

            {/* Quick Demo Personas Selector */}
            <div className="mt-8 pt-5 border-t border-canvas-200">
              <p className="text-[10px] font-bold uppercase tracking-wider text-canvas-600 mb-2.5 text-center font-mono">
                Evaluator Instant Personas (SIH Demo)
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(DEMO_ACCOUNTS) as [Role, typeof DEMO_ACCOUNTS.tenant][]).map(
                  ([demoRole, demo]) => (
                    <button
                      key={demoRole}
                      onClick={() => fillDemoAccount(demoRole)}
                      type="button"
                      className="p-2 rounded border border-canvas-300 bg-canvas-50 hover:bg-canvas-100 text-left transition-all"
                    >
                      <div className="text-[11px] font-bold text-ink-900 leading-tight truncate">
                        {demo.name}
                      </div>
                      <div className="text-[9px] text-canvas-600 font-mono mt-0.5 truncate">
                        {demo.badge}
                      </div>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
