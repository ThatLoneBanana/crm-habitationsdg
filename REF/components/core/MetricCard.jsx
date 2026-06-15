import React from "react";

const TONE = {
  neutral: "var(--text-primary)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger:  "var(--danger)",
  info:    "var(--info)",
};

/**
 * Dashboard KPI tile — label + icon, big tabular figure, supporting sub-line.
 * The figure color carries urgency (danger when alerts exist, etc.).
 */
export function MetricCard({ label, value, sub, icon = null, tone = "neutral", className = "", style = {}, ...rest }) {
  return (
    <div
      className={`dg-metric ${className}`}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: "13px 15px",
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7, fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
        {icon ? <span style={{ display: "inline-flex", fontSize: 14, color: "var(--text-tertiary)" }}>{icon}</span> : null}
        {label}
      </div>
      <div style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--fw-semibold)", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)", color: TONE[tone] || TONE.neutral, fontVariantNumeric: "var(--numeric-tabular)" }}>
        {value}
      </div>
      {sub ? <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", marginTop: 3 }}>{sub}</div> : null}
    </div>
  );
}
