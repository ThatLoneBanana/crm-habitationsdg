import React from "react";

const STYLE_ID = "dg-button-focus-css";
const FOCUS_CSS = `.dg-btn:focus-visible{outline:none;box-shadow:var(--ring-focus);}`;

function useFocusCss() {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID; el.textContent = FOCUS_CSS;
    document.head.appendChild(el);
  }, []);
}

const SIZES = {
  sm: { height: "var(--control-h-sm)", padding: "0 8px", fontSize: "var(--text-xs)" },
  md: { height: "var(--control-h)", padding: "0 11px", fontSize: "var(--text-sm)" },
  lg: { height: "var(--control-h-lg)", padding: "0 16px", fontSize: "var(--text-md)" },
};

// Each variant: resting bg/color/border + hover/active background overrides.
const VARIANTS = {
  primary:   { bg: "var(--accent)", color: "var(--text-on-accent)", border: "transparent", hoverBg: "var(--accent-hover)", activeBg: "var(--accent-press)" },
  secondary: { bg: "var(--n-100)", color: "var(--text-primary)", border: "var(--border)", hoverBg: "var(--n-150)" },
  outline:   { bg: "var(--surface)", color: "var(--text-primary)", border: "var(--border-strong)", hoverBg: "var(--surface-subtle)" },
  ghost:     { bg: "transparent", color: "var(--text-secondary)", border: "transparent", hoverBg: "var(--surface-hover)", hoverColor: "var(--text-primary)" },
  danger:    { bg: "var(--danger-tint)", color: "var(--danger-text)", border: "transparent", hoverBg: "#FBD0D0" },
  success:   { bg: "var(--success)", color: "#fff", border: "transparent", hoverBg: "var(--success-strong)" },
};

/**
 * Primary button. DG red is the single action color — one primary per view.
 * Visual styling is inline (reliable across the compiled bundle); only the
 * focus-ring is delegated to a tiny injected rule.
 */
export function Button({
  variant = "primary",
  size = "md",
  icon = null,
  iconTrailing = null,
  children,
  className = "",
  style = {},
  disabled = false,
  ...rest
}) {
  useFocusCss();
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const v = VARIANTS[variant] || VARIANTS.primary;
  const sz = SIZES[size] || SIZES.md;

  const bg = disabled ? v.bg : (active && v.activeBg ? v.activeBg : (hover && v.hoverBg ? v.hoverBg : v.bg));
  const color = !disabled && hover && v.hoverColor ? v.hoverColor : v.color;

  return (
    <button
      className={`dg-btn dg-btn--${variant} ${className}`}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        fontFamily: "var(--font-sans)", fontWeight: "var(--fw-medium)", whiteSpace: "nowrap",
        WebkitAppearance: "none", appearance: "none",
        border: `1px solid ${v.border}`, borderRadius: "var(--radius-md)",
        background: bg, color,
        cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.5 : 1,
        transform: active && !disabled ? "translateY(1px)" : "none",
        transition: "background var(--dur) var(--ease-std), color var(--dur) var(--ease-std), transform var(--dur-fast) var(--ease-std)",
        ...sz, ...style,
      }}
      {...rest}
    >
      {icon ? <span style={{ display: "inline-flex", fontSize: "1.05em", lineHeight: 0 }}>{icon}</span> : null}
      {children ? <span>{children}</span> : null}
      {iconTrailing ? <span style={{ display: "inline-flex", fontSize: "1.05em", lineHeight: 0 }}>{iconTrailing}</span> : null}
    </button>
  );
}
