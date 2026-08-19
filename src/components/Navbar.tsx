"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  phone: string;
  name: string;
  role: "tenant" | "landowner" | "official";
  kycVerified: boolean;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  const roleBadges: Record<string, { label: string; bg: string; text: string; border: string }> = {
    tenant: { label: "Farmer / Tenant", bg: "bg-olive-50", text: "text-olive-900", border: "border-olive-600" },
    landowner: { label: "Title Landowner", bg: "bg-umber-50", text: "text-umber-800", border: "border-umber-600" },
    official: { label: "Revenue Officer", bg: "bg-canvas-100", text: "text-ink-900", border: "border-canvas-400" },
  };

  const navLinks: Record<string, { href: string; label: string }[]> = {
    tenant: [
      { href: "/tenant/dashboard", label: "My Holdings" },
      { href: "/tenant/agreements/new", label: "New Verification" },
    ],
    landowner: [
      { href: "/landowner/dashboard", label: "Land Registry Desk" },
    ],
    official: [
      { href: "/official/dashboard", label: "Saza Console" },
      { href: "/official/queue", label: "Verification Queue" },
    ],
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-canvas-300 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & National Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-olive-900 text-canvas-50 font-serif font-bold text-sm border border-olive-700 shadow-sm">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold font-serif text-ink-900 tracking-tight">DTVN</span>
                <span className="text-[9px] uppercase font-mono font-bold bg-canvas-200 text-ink-700 px-1.5 py-0.5 rounded">
                  AgriStack DPI
                </span>
              </div>
              <p className="text-[10px] text-canvas-600 font-medium leading-none">Digital Tenancy Verification Network</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks[user.role]?.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                    pathname === link.href
                      ? "bg-olive-800 text-canvas-50 shadow-sm"
                      : "text-ink-700 hover:text-ink-900 hover:bg-canvas-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/verify"
                className={`px-3.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                  pathname === "/verify"
                    ? "bg-olive-800 text-canvas-50 shadow-sm"
                    : "text-ink-700 hover:text-ink-900 hover:bg-canvas-100"
                }`}
              >
                Public Audit
              </Link>
            </nav>
          )}

          {/* Right Side / Auth & Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <span
                  className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase border ${
                    roleBadges[user.role]?.bg
                  } ${roleBadges[user.role]?.text} ${roleBadges[user.role]?.border}`}
                >
                  {roleBadges[user.role]?.label}
                </span>
                <span className="text-xs font-semibold text-ink-900 hidden md:inline">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 rounded text-xs font-semibold text-ink-700 hover:text-crimson-700 hover:bg-canvas-100 border border-canvas-300 transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/verify"
                  className="hidden sm:inline-flex px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-ink-700 hover:bg-canvas-100 border border-canvas-300 transition-all"
                >
                  🔍 Verify Hash
                </Link>
                <Link
                  href="/login"
                  className="btn-gov-primary text-xs"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-ink-700 hover:text-ink-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-canvas-200 py-3 space-y-1">
            {user ? (
              <>
                {navLinks[user.role]?.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 rounded text-sm font-semibold text-ink-900 hover:bg-canvas-100"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/verify"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded text-sm font-semibold text-ink-900 hover:bg-canvas-100"
                >
                  Public Ledger Audit
                </Link>
              </>
            ) : (
              <Link
                href="/verify"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded text-sm font-semibold text-ink-900 hover:bg-canvas-100"
              >
                Public Ledger Audit
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
