import React from "react";

const STYLE_ID = "dg-tabs-focus-css";
const FOCUS_CSS = `.dg-tab:focus-visible{outline:none;box-shadow:var(--ring-focus);border-radius:var(--radius-sm);}`;

function useFocusCss() {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID; el.textContent = FOCUS_CSS;
    document.head.appendChild(el);
  }, []);
}

function Tab({ label, count, active, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      role="tab"
      aria-selected={active}
      className="dg-tab"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: "var(--font-sans)", fontSize: "var(--text-base)",
        fontWeight: active ? "var(--fw-semibold)" : "var(--fw-medium)",
        color: active || hover ? "var(--text-primary)" : "var(--text-secondary)",
        background: "transparent", border: "none", cursor: "pointer",
        WebkitAppearance: "none", appearance: "none",
        padding: "9px 12px", marginBottom: -1,
        borderBottom: `2px solid ${active ? "var(--accent)" : "transparent"}`,
        transition: "color var(--dur) var(--ease-std)",
      }}
    >
      {label}
      {count != null ? (
        <span style={{
          fontSize: "var(--text-2xs)", fontWeight: "var(--fw-semibold)", padding: "1px 6px",
          borderRadius: "var(--radius-full)",
          background: active ? "var(--accent-tint)" : "var(--n-100)",
          color: active ? "var(--dg-red-700)" : "var(--text-tertiary)",
        }}>{count}</span>
      ) : null}
    </button>
  );
}

/**
 * Underlined tab bar — the project page nav (Cédule · Extras · …).
 * Active tab gets a red underline. Inline-styled for reliable rendering.
 */
export function Tabs({ tabs = [], value, onChange, className = "", ...rest }) {
  useFocusCss();
  return (
    <div className={`dg-tabs ${className}`} role="tablist" style={{ display: "flex", alignItems: "stretch", gap: 2, borderBottom: "1px solid var(--border)" }} {...rest}>
      {tabs.map((t) => {
        const id = typeof t === "string" ? t : t.id;
        const label = typeof t === "string" ? t : t.label;
        const count = typeof t === "string" ? undefined : t.count;
        return <Tab key={id} label={label} count={count} active={id === value} onClick={() => onChange && onChange(id)} />;
      })}
    </div>
  );
}
