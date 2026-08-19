import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "DTVN — Digital Tenancy Verification Network | National AgriStack Layer",
  description:
    "National Digital Public Infrastructure (DPI) for cultivator-plot verification, Digital Crop Surveys, State Land Registries, and immutable Polygon ledger anchoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-canvas-100 text-ink-900">
      <body className="antialiased flex flex-col min-h-screen">
        {/* National Top Micro-Header */}
        <div className="bg-olive-950 text-canvas-100 text-[11px] font-medium py-1.5 px-4 border-b border-olive-800 flex justify-between items-center select-none">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-wheat-500" />
            <span className="font-semibold tracking-wider uppercase font-mono text-[10px] text-canvas-50">
              NATIONAL AGRICULTURAL PUBLIC INFRASTRUCTURE
            </span>
            <span className="text-olive-600 hidden sm:inline">•</span>
            <span className="text-canvas-300 hidden sm:inline text-[11px]">
              AgriStack & State Land Record Cross-Referencing Standard (DCS Layer)
            </span>
          </div>
        </div>

        <Navbar />
        <main className="flex-1 w-full">{children}</main>

        {/* Tactile Formal Footer */}
        <footer className="border-t border-canvas-300 bg-canvas-50 mt-16 py-8 text-xs text-ink-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded bg-olive-900 text-canvas-50 flex items-center justify-center font-serif font-bold text-xs border border-olive-700">
                IN
              </div>
              <div>
                <p className="font-bold text-ink-900 font-serif">Digital Tenancy Verification Network (DTVN)</p>
                <p className="text-canvas-600 text-[11px]">National AgriStack Architecture • Zero-PII Cryptographic Anchoring</p>
              </div>
            </div>
            <div className="text-center sm:text-right font-mono text-[11px] text-canvas-600">
              <p>State-Agnostic Standard: RoR • 7/12 • Khasra • Patta • Jamabandi</p>
              <p>Proof Ledger: Polygon Proof-of-Authority Network</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
