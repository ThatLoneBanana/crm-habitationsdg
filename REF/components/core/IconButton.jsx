import React from "react";

const STYLE_ID = "dg-iconbtn-focus-css";
const FOCUS_CSS = `.dg-iconbtn:focus-visible{outline:none;box-shadow:var(--ring-focus);}`;

function useFocusCss() {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID; el.textContent = FOCUS_CSS;
    document.head.appendChild(el);
  }, []);
}

const SIZES = { sm: { box: 24, font: 14 }, md: { box: 28, font: 16 }, lg: { box: 32, font: 18 } };
const VARIANTS = {
  ghost:   { bg: "transparent", color: "var(--text-secondary)", border: "transparent", hoverBg: "var(--surface-hover)", hoverColor: "var(--text-primary)" },
  outline: { bg: "var(--surface)", color: "var(--text-secondary)", border: "var(--border)", hoverBg: "var(--surface-subtle)", hoverColor: "var(--text-primary)" },
  danger:  { bg: "transparent", color: "var(--text-secondary)", border: "transparent", hoverBg: "var(--danger-tint)", hoverColor: "var(--danger-text)" },
};

/** Square icon-only button — toolbar actions, row affordances. Inline-styled. */
export function IconButton({ variant = "ghost", size = "md", label, children, className = "", style = {}, disabled = false, ...rest }) {
  useFocusCss();
  const [hover, setHover] = React.useState(false);
  const v = VARIANTS[variant] || VARIANTS.ghost;
  const sz = SIZES[size] || SIZES.md;
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      className={`dg-iconbtn ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: sz.box, height: sz.box, fontSize: sz.font,
        WebkitAppearance: "none", appearance: "none",
        border: `1px solid ${v.border}`, borderRadius: "var(--radius)",
        background: !disabled && hover ? v.hoverBg : v.bg,
        color: !disabled && hover ? v.hoverColor : v.color,
        cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.45 : 1,
        transition: "background var(--dur) var(--ease-std), color var(--dur) var(--ease-std)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
