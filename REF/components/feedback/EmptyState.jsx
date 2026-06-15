import React from "react";

/**
 * Empty-state block — icon, title, supporting line, optional action.
 * Used for "aucun projet", "aucune cédule", "aucune dépense", etc.
 */
export function EmptyState({ icon = "inbox", title, message, action, compact = false, style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
      padding: compact ? "28px 20px" : "52px 24px", color: "var(--text-tertiary)", ...style }}>
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: compact ? 40 : 52, height: compact ? 40 : 52, borderRadius: "var(--radius-lg)",
        background: "var(--surface-subtle)", border: "1px solid var(--border)", color: "var(--text-disabled)", marginBottom: 14 }}>
        <i className={"ti ti-" + icon} style={{ fontSize: compact ? 20 : 26 }} />
      </span>
      <div style={{ fontSize: "var(--text-md)", fontWeight: "var(--fw-semibold)", color: "var(--text-secondary)" }}>{title}</div>
      {message ? <div style={{ fontSize: "var(--text-sm)", marginTop: 5, maxWidth: 320, lineHeight: "var(--lh-normal)" }}>{message}</div> : null}
      {action ? <div style={{ marginTop: 16 }}>{action}</div> : null}
    </div>
  );
}
