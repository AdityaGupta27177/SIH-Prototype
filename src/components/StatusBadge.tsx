"use client";

import type { AgreementStatus } from "@/models/Agreement";

const statusConfig: Record<
  AgreementStatus,
  { label: string; bg: string; text: string; border: string; icon: string }
> = {
  PENDING_LANDOWNER_CONSENT: {
    label: "AWAITING TITLE CONSENT",
    bg: "bg-canvas-100",
    text: "text-umber-800",
    border: "border-umber-600",
    icon: "⏳",
  },
  OWNER_APPROVED: {
    label: "LANDOWNER SIGNED (PENDING SAZA)",
    bg: "bg-olive-50",
    text: "text-olive-900",
    border: "border-olive-700",
    icon: "🖋️",
  },
  OWNER_REJECTED: {
    label: "OBJECTION RECORDED / REJECTED",
    bg: "bg-crimson-50",
    text: "text-crimson-800",
    border: "border-crimson-600",
    icon: "⚠️",
  },
  OFFICIALLY_VERIFIED: {
    label: "OFFICIALLY VERIFIED & ON-CHAIN",
    bg: "bg-wheat-50",
    text: "text-wheat-800",
    border: "border-wheat-600",
    icon: "🛡️",
  },
};

export default function StatusBadge({ status }: { status: AgreementStatus }) {
  const config = statusConfig[status] || statusConfig.PENDING_LANDOWNER_CONSENT;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border font-mono text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text} ${config.border} shadow-sm`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
