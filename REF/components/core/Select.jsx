import React from "react";

const STYLE_ID = "dg-select-focus-css";
const FOCUS_CSS = `.dg-select:focus{outline:none;border-color:var(--accent)!important;box-shadow:var(--ring-focus);}`;

function useFocusCss() {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID; el.textContent = FOCUS_CSS;
    document.head.appendChild(el);
  }, []);
}

/** Native select, styled inline to match the field system. Pass `options` or children. */
export function Select({ label, options = null, size = "md", className = "", id, children, disabled = false, style = {}, ...rest }) {
  useFocusCss();
  const [hover, setHover] = React.useState(false);
  const selId = id || (label ? `dg-sel-${String(label).replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const sm = size === "sm";
  return (
    <label style={{ display: "inline-flex", flexDirection: "column", gap: 5, width: "100%" }} htmlFor={selId}>
      {label ? <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--fw-medium)", color: "var(--text-secondary)" }}>{label}</span> : null}
      <span style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <select
          id={selId}
          className={`dg-select ${className}`}
          disabled={disabled}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            width: "100%", fontFamily: "var(--font-sans)", fontSize: sm ? "var(--text-xs)" : "var(--text-sm)",
            color: disabled ? "var(--text-disabled)" : "var(--text-primary)",
            background: disabled ? "var(--surface-subtle)" : "var(--surface)",
            WebkitAppearance: "none", appearance: "none",
            border: `1px solid ${hover && !disabled ? "var(--n-300)" : "var(--border)"}`,
            borderRadius: "var(--radius-md)", height: sm ? "var(--control-h)" : "var(--control-h-md)",
            padding: "0 28px 0 10px", cursor: disabled ? "not-allowed" : "pointer",
            ...style,
          }}
          {...rest}
        >
          {options
            ? options.map((o) => {
                const val = typeof o === "string" ? o : o.value;
                const lab = typeof o === "string" ? o : o.label;
                return <option key={val} value={val}>{lab}</option>;
              })
            : children}
        </select>
        <span style={{ position: "absolute", right: 9, pointerEvents: "none", color: "var(--text-tertiary)", display: "inline-flex" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </span>
      </span>
    </label>
  );
}
