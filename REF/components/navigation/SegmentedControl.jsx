import React from "react";

/**
 * Segmented control — 2–4 short options. Used for Consultation/Édition, the
 * cartes/liste view toggle, and the costing global/projet switch.
 */
export function SegmentedControl({ options = [], value, onChange, size = "md", className = "" }) {
  const h = size === "sm" ? 28 : 32;
  const pad = size === "sm" ? "0 10px" : "0 13px";
  const fs = size === "sm" ? "var(--text-xs)" : "var(--text-sm)";
  return (
    <div className={`dg-seg ${className}`} role="tablist"
      style={{ display: "inline-flex", padding: 3, gap: 2, background: "var(--n-100)", borderRadius: "var(--radius-md)" }}>
      {options.map((o) => {
        const id = typeof o === "string" ? o : o.value;
        const label = typeof o === "string" ? o : o.label;
        const icon = typeof o === "string" ? null : o.icon;
        const active = id === value;
        return (
          <button key={id} role="tab" aria-selected={active} onClick={() => onChange && onChange(id)}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
              height: h, padding: pad, borderRadius: "var(--radius)", border: "none", cursor: "pointer",
              fontFamily: "var(--font-sans)", fontSize: fs, fontWeight: "var(--fw-semibold)", whiteSpace: "nowrap",
              background: active ? "var(--surface)" : "transparent",
              color: active ? "var(--text-primary)" : "var(--text-secondary)",
              boxShadow: active ? "var(--shadow-sm)" : "none",
              transition: "background var(--dur) var(--ease-std), color var(--dur) var(--ease-std)" }}>
            {icon ? <i className={"ti ti-" + icon} style={{ fontSize: 14 }} /> : null}
            {label}
          </button>
        );
      })}
    </div>
  );
}
