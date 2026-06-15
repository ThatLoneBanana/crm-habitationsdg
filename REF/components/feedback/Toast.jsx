import React from "react";

const TONE = {
  neutral: { bar: "var(--n-400)", icon: "info-circle", color: "var(--text-primary)" },
  success: { bar: "var(--success)", icon: "circle-check", color: "var(--success-text)" },
  warning: { bar: "var(--warning)", icon: "alert-triangle", color: "var(--warning-text)" },
  danger:  { bar: "var(--danger)", icon: "alert-circle", color: "var(--danger-text)" },
  info:    { bar: "var(--info)", icon: "info-circle", color: "var(--info-text)" },
};

/** A single toast notification. Compose several inside `ToastStack`. */
export function Toast({ tone = "neutral", title, message, onClose, action, icon }) {
  const t = TONE[tone] || TONE.neutral;
  return (
    <div role="status" style={{
      display: "flex", alignItems: "flex-start", gap: 10, width: 340,
      background: "var(--surface)", border: "1px solid var(--border)", borderLeft: `3px solid ${t.bar}`,
      borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", padding: "11px 12px",
    }}>
      <i className={"ti ti-" + (icon || t.icon)} style={{ fontSize: 18, color: t.bar, marginTop: 1, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {title ? <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--fw-semibold)", color: "var(--text-primary)" }}>{title}</div> : null}
        {message ? <div style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", marginTop: 2 }}>{message}</div> : null}
        {action ? <div style={{ marginTop: 8 }}>{action}</div> : null}
      </div>
      {onClose ? (
        <button onClick={onClose} aria-label="Fermer" style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--text-tertiary)", padding: 2, display: "inline-flex", flexShrink: 0 }}>
          <i className="ti ti-x" style={{ fontSize: 15 }} />
        </button>
      ) : null}
    </div>
  );
}

/** Fixed bottom-right stack for toasts. */
export function ToastStack({ children, position = "bottom-right" }) {
  const pos = {
    "bottom-right": { bottom: 20, right: 20, alignItems: "flex-end" },
    "bottom-left": { bottom: 20, left: 20, alignItems: "flex-start" },
    "top-right": { top: 20, right: 20, alignItems: "flex-end" },
  }[position] || { bottom: 20, right: 20, alignItems: "flex-end" };
  return (
    <div style={{ position: "fixed", zIndex: 1000, display: "flex", flexDirection: "column", gap: 10, ...pos }}>
      {children}
    </div>
  );
}
