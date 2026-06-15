import React from "react";

/**
 * Horizontal step indicator for multi-step flows (project creation).
 * Past steps show a check; the current step is red; future steps are muted.
 */
export function Stepper({ steps = [], current = 0, className = "" }) {
  return (
    <div className={`dg-stepper ${className}`} style={{ display: "flex", alignItems: "center", width: "100%" }}>
      {steps.map((s, i) => {
        const label = typeof s === "string" ? s : s.label;
        const done = i < current;
        const active = i === current;
        const dotBg = done ? "var(--success)" : active ? "var(--accent)" : "var(--surface)";
        const dotBorder = done ? "var(--success)" : active ? "var(--accent)" : "var(--border-strong)";
        const dotColor = done || active ? "#fff" : "var(--text-tertiary)";
        return (
          <React.Fragment key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                background: dotBg, border: `1.5px solid ${dotBorder}`, color: dotColor,
                fontSize: "var(--text-xs)", fontWeight: "var(--fw-semibold)",
                transition: "background var(--dur) var(--ease-std)" }}>
                {done ? <i className="ti ti-check" style={{ fontSize: 14 }} /> : i + 1}
              </span>
              <span style={{ fontSize: "var(--text-sm)", fontWeight: active ? "var(--fw-semibold)" : "var(--fw-medium)",
                color: active ? "var(--text-primary)" : done ? "var(--text-secondary)" : "var(--text-tertiary)", whiteSpace: "nowrap" }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 ? (
              <span style={{ flex: 1, height: 1.5, margin: "0 12px", borderRadius: 2,
                background: i < current ? "var(--success)" : "var(--border)" }} />
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
}
