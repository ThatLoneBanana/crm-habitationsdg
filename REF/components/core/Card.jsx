import React from "react";

/** Crisp bordered container — the dominant surface. Flat at rest (no shadow). */
export function Card({ children, padding = "16px", className = "", style = {}, ...rest }) {
  return (
    <div
      className={`dg-card ${className}`}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        ...style,
      }}
      {...rest}
    >
      {padding ? <div style={{ padding }}>{children}</div> : children}
    </div>
  );
}

/** Header row for a Card — sits on the subtle surface with a hairline below. */
export function CardHeader({ icon = null, title, action = null, className = "", style = {}, ...rest }) {
  return (
    <div
      className={`dg-card__header ${className}`}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
        padding: "10px 14px",
        background: "var(--surface-subtle)",
        borderBottom: "1px solid var(--border)",
        ...style,
      }}
      {...rest}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "var(--text-base)", fontWeight: "var(--fw-semibold)", color: "var(--text-primary)" }}>
        {icon ? <span style={{ display: "inline-flex", fontSize: 15, color: "var(--text-secondary)" }}>{icon}</span> : null}
        {title}
      </span>
      {action ? <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{action}</span> : null}
    </div>
  );
}
