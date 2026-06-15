import React from "react";

/**
 * Filterable chip / pill. Used for phase filters on the projects list and the
 * map legend. Shows a leading color dot and an optional count.
 */
export function FilterChip({ label, active = false, dotColor, count, onClick, className = "" }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button className={`dg-chip ${className}`} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: 6,
        height: 28, padding: "0 11px", borderRadius: "var(--radius-full)",
        fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", fontWeight: "var(--fw-medium)", whiteSpace: "nowrap",
        cursor: "pointer",
        border: `1px solid ${active ? "var(--n-900)" : "var(--border)"}`,
        background: active ? "var(--n-900)" : (hover ? "var(--surface-subtle)" : "var(--surface)"),
        color: active ? "#fff" : "var(--text-secondary)",
        transition: "background var(--dur) var(--ease-std), border-color var(--dur) var(--ease-std), color var(--dur) var(--ease-std)" }}>
      {dotColor ? <span style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor, flexShrink: 0 }} /> : null}
      {label}
      {count != null ? <span style={{ fontSize: "var(--text-2xs)", fontWeight: "var(--fw-semibold)", opacity: active ? 0.8 : 0.6, fontVariantNumeric: "tabular-nums" }}>{count}</span> : null}
    </button>
  );
}
