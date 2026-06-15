import React from "react";

const STYLE_ID = "dg-input-focus-css";
const FOCUS_CSS = `
.dg-input:focus{outline:none;border-color:var(--accent)!important;box-shadow:var(--ring-focus);}
.dg-input--invalid:focus{box-shadow:0 0 0 3px rgba(220,38,38,.18);}
.dg-input::placeholder{color:var(--text-tertiary);}`;

function useFocusCss() {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID; el.textContent = FOCUS_CSS;
    document.head.appendChild(el);
  }, []);
}

/** Text input with optional label, leading icon, and hint / error states. */
export function Input({ label, icon = null, hint, error, invalid = false, className = "", id, style = {}, ...rest }) {
  useFocusCss();
  const [hover, setHover] = React.useState(false);
  const inputId = id || (label ? `dg-${String(label).replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const isInvalid = invalid || !!error;
  return (
    <label style={{ display: "inline-flex", flexDirection: "column", gap: 5, width: "100%" }} htmlFor={inputId}>
      {label ? <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--fw-medium)", color: "var(--text-secondary)" }}>{label}</span> : null}
      <span style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {icon ? <span style={{ position: "absolute", left: 9, display: "inline-flex", color: "var(--text-tertiary)", fontSize: 15, pointerEvents: "none" }}>{icon}</span> : null}
        <input
          id={inputId}
          className={`dg-input ${isInvalid ? "dg-input--invalid" : ""} ${className}`}
          aria-invalid={isInvalid || undefined}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            width: "100%", fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--text-primary)",
            background: "var(--surface)", WebkitAppearance: "none", appearance: "none",
            border: `1px solid ${isInvalid ? "var(--danger)" : (hover ? "var(--n-300)" : "var(--border)")}`,
            borderRadius: "var(--radius-md)", height: "var(--control-h-md)",
            padding: icon ? "0 10px 0 30px" : "0 10px",
            ...style,
          }}
          {...rest}
        />
      </span>
      {error ? <span style={{ fontSize: "var(--text-xs)", color: "var(--danger-text)" }}>{error}</span>
        : hint ? <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>{hint}</span> : null}
    </label>
  );
}
