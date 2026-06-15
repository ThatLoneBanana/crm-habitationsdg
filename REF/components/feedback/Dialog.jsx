import React from "react";

/**
 * Modal dialog with a scrim, header, body and footer. Confirmation variant via
 * `tone` (danger paints the icon + title for destructive actions).
 */
export function Dialog({ open = true, onClose, title, icon, tone = "neutral", children, footer, width = 460 }) {
  if (!open) return null;
  const tint = { neutral: "var(--text-secondary)", danger: "var(--danger)", warning: "var(--warning)", success: "var(--success)" }[tone] || "var(--text-secondary)";
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 900, background: "rgba(31,29,27,0.42)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        backdropFilter: "blur(1.5px)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true"
        style={{ width, maxWidth: "100%", background: "var(--surface)", borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-pop)", overflow: "hidden", border: "1px solid var(--border)" }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "18px 20px 14px" }}>
          {icon ? (
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36,
              borderRadius: "var(--radius-md)", background: tone === "danger" ? "var(--danger-tint)" : "var(--surface-subtle)",
              color: tint, flexShrink: 0 }}>
              <i className={"ti ti-" + icon} style={{ fontSize: 19 }} />
            </span>
          ) : null}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--fw-semibold)", letterSpacing: "var(--ls-snug)", color: "var(--text-primary)" }}>{title}</h2>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginTop: 4, lineHeight: "var(--lh-normal)" }}>{children}</div>
          </div>
          {onClose ? (
            <button onClick={onClose} aria-label="Fermer" style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--text-tertiary)", padding: 2, display: "inline-flex" }}>
              <i className="ti ti-x" style={{ fontSize: 17 }} />
            </button>
          ) : null}
        </div>
        {footer ? (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "12px 20px", background: "var(--surface-subtle)", borderTop: "1px solid var(--border)" }}>
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
