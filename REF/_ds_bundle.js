/* @ds-bundle: {"format":3,"namespace":"HabitationsDGDesignSystem_408490","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"CardHeader","sourcePath":"components/core/Card.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"MetricCard","sourcePath":"components/core/MetricCard.jsx"},{"name":"PhaseBadge","sourcePath":"components/core/PhaseBadge.jsx"},{"name":"PHASE_COLORS","sourcePath":"components/core/PhaseBadge.jsx"},{"name":"ProgressBar","sourcePath":"components/core/ProgressBar.jsx"},{"name":"Select","sourcePath":"components/core/Select.jsx"},{"name":"StatusDot","sourcePath":"components/core/StatusDot.jsx"},{"name":"Tabs","sourcePath":"components/core/Tabs.jsx"},{"name":"Toggle","sourcePath":"components/core/Toggle.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"Skeleton","sourcePath":"components/feedback/Skeleton.jsx"},{"name":"SkeletonRow","sourcePath":"components/feedback/Skeleton.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"ToastStack","sourcePath":"components/feedback/Toast.jsx"},{"name":"FilterChip","sourcePath":"components/navigation/FilterChip.jsx"},{"name":"SegmentedControl","sourcePath":"components/navigation/SegmentedControl.jsx"},{"name":"Stepper","sourcePath":"components/navigation/Stepper.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"6cf767a0c2e6","components/core/Badge.jsx":"67a760301ea0","components/core/Button.jsx":"e4464a79a874","components/core/Card.jsx":"af968c5522a0","components/core/IconButton.jsx":"0ea10f2f7e31","components/core/Input.jsx":"2dc1a8de2ca7","components/core/MetricCard.jsx":"f92f9adfdcd6","components/core/PhaseBadge.jsx":"7829a374a673","components/core/ProgressBar.jsx":"99d7526222b4","components/core/Select.jsx":"4aed781c33fd","components/core/StatusDot.jsx":"7039d130cf10","components/core/Tabs.jsx":"2b5289bb64af","components/core/Toggle.jsx":"fabcd0ab12a5","components/feedback/Dialog.jsx":"07a868e28854","components/feedback/EmptyState.jsx":"53cf82c2bb55","components/feedback/Skeleton.jsx":"84dab965bbfe","components/feedback/Toast.jsx":"df31d1306bbf","components/navigation/FilterChip.jsx":"420f51a7947c","components/navigation/SegmentedControl.jsx":"f49d9c2591b3","components/navigation/Stepper.jsx":"c0c5208f4c39","ui_kits/crm/AppShell.jsx":"20cfc8ab389e","ui_kits/crm/Carte.jsx":"93b02fe855b5","ui_kits/crm/CeduleEditor.jsx":"a21a1c6388a5","ui_kits/crm/ClientsFournisseurs.jsx":"9c1663a627cc","ui_kits/crm/Costing.jsx":"a4d7aed63d7c","ui_kits/crm/Dashboard.jsx":"c525a4bf14f0","ui_kits/crm/FeuillesTemps.jsx":"ecf3e9d7909a","ui_kits/crm/GanttView.jsx":"398ee6f39650","ui_kits/crm/GcrTab.jsx":"e8ab4092ecdd","ui_kits/crm/MobileViews.jsx":"f9ac7a73f2b1","ui_kits/crm/Parametres.jsx":"6ee6c2d6a17a","ui_kits/crm/ProjectPage.jsx":"2bdfcb48997e","ui_kits/crm/ProjetCreate.jsx":"d5a18a92516a","ui_kits/crm/ProjetsList.jsx":"0d87bb38d2e8","ui_kits/crm/States.jsx":"81072c9a2ac5","ui_kits/crm/VueClient.jsx":"39ec1fc71cc3","ui_kits/crm/data-ext.js":"a20a8a0c0fbd","ui_kits/crm/data.js":"83e454ff2974"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.HabitationsDGDesignSystem_408490 = window.HabitationsDGDesignSystem_408490 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const PALETTE = ["#1D9E75", "#378ADD", "#7F77DD", "#EF9F27", "#C0563B", "#5F8F3A"];
function hashColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = h * 31 + str.charCodeAt(i) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
}
const SIZES = {
  sm: 24,
  md: 32,
  lg: 40
};

/** Initials avatar with a deterministic color from the name. */
function Avatar({
  name = "",
  size = "md",
  color = null,
  className = "",
  style = {},
  ...rest
}) {
  const px = typeof size === "number" ? size : SIZES[size] || SIZES.md;
  const parts = name.trim().split(/\s+/);
  const initials = ((parts[0]?.[0] || "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "?";
  const bg = color || hashColor(name || "?");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `dg-avatar ${className}`,
    title: name || undefined,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: px,
      height: px,
      borderRadius: "50%",
      background: bg,
      color: "#fff",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: Math.round(px * 0.4),
      letterSpacing: ".01em",
      flex: "0 0 auto",
      ...style
    }
  }, rest), initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "dg-badge-css";
const CSS = `
.dg-badge{
  display:inline-flex;align-items:center;gap:4px;
  font-family:var(--font-sans);font-size:var(--text-2xs);font-weight:var(--fw-semibold);
  line-height:1;letter-spacing:.01em;white-space:nowrap;
  padding:3px 7px;border-radius:var(--radius);border:1px solid transparent;
}
.dg-badge--pill{border-radius:var(--radius-full);}
.dg-badge__dot{width:5px;height:5px;border-radius:50%;background:currentColor;flex:0 0 auto;}
.dg-badge--neutral{background:var(--n-100);color:var(--text-secondary);}
.dg-badge--accent{background:var(--accent-tint);color:var(--dg-red-700);}
.dg-badge--success{background:var(--success-tint);color:var(--success-text);}
.dg-badge--warning{background:var(--warning-tint);color:var(--warning-text);}
.dg-badge--danger{background:var(--danger-tint);color:var(--danger-text);}
.dg-badge--info{background:var(--info-tint);color:var(--info-text);}
.dg-badge--outline{background:var(--surface);color:var(--text-secondary);border-color:var(--border);}
`;
function useInjected(id, css) {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }, [id, css]);
}

/** Small status / category label. */
function Badge({
  tone = "neutral",
  pill = false,
  dot = false,
  children,
  className = "",
  ...rest
}) {
  useInjected(STYLE_ID, CSS);
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `dg-badge dg-badge--${tone} ${pill ? "dg-badge--pill" : ""} ${className}`
  }, rest), dot ? /*#__PURE__*/React.createElement("span", {
    className: "dg-badge__dot"
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "dg-button-focus-css";
const FOCUS_CSS = `.dg-btn:focus-visible{outline:none;box-shadow:var(--ring-focus);}`;
function useFocusCss() {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = FOCUS_CSS;
    document.head.appendChild(el);
  }, []);
}
const SIZES = {
  sm: {
    height: "var(--control-h-sm)",
    padding: "0 8px",
    fontSize: "var(--text-xs)"
  },
  md: {
    height: "var(--control-h)",
    padding: "0 11px",
    fontSize: "var(--text-sm)"
  },
  lg: {
    height: "var(--control-h-lg)",
    padding: "0 16px",
    fontSize: "var(--text-md)"
  }
};

// Each variant: resting bg/color/border + hover/active background overrides.
const VARIANTS = {
  primary: {
    bg: "var(--accent)",
    color: "var(--text-on-accent)",
    border: "transparent",
    hoverBg: "var(--accent-hover)",
    activeBg: "var(--accent-press)"
  },
  secondary: {
    bg: "var(--n-100)",
    color: "var(--text-primary)",
    border: "var(--border)",
    hoverBg: "var(--n-150)"
  },
  outline: {
    bg: "var(--surface)",
    color: "var(--text-primary)",
    border: "var(--border-strong)",
    hoverBg: "var(--surface-subtle)"
  },
  ghost: {
    bg: "transparent",
    color: "var(--text-secondary)",
    border: "transparent",
    hoverBg: "var(--surface-hover)",
    hoverColor: "var(--text-primary)"
  },
  danger: {
    bg: "var(--danger-tint)",
    color: "var(--danger-text)",
    border: "transparent",
    hoverBg: "#FBD0D0"
  },
  success: {
    bg: "var(--success)",
    color: "#fff",
    border: "transparent",
    hoverBg: "var(--success-strong)"
  }
};

/**
 * Primary button. DG red is the single action color — one primary per view.
 * Visual styling is inline (reliable across the compiled bundle); only the
 * focus-ring is delegated to a tiny injected rule.
 */
function Button({
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
  const bg = disabled ? v.bg : active && v.activeBg ? v.activeBg : hover && v.hoverBg ? v.hoverBg : v.bg;
  const color = !disabled && hover && v.hoverColor ? v.hoverColor : v.color;
  return /*#__PURE__*/React.createElement("button", _extends({
    className: `dg-btn dg-btn--${variant} ${className}`,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-medium)",
      whiteSpace: "nowrap",
      WebkitAppearance: "none",
      appearance: "none",
      border: `1px solid ${v.border}`,
      borderRadius: "var(--radius-md)",
      background: bg,
      color,
      cursor: disabled ? "default" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transform: active && !disabled ? "translateY(1px)" : "none",
      transition: "background var(--dur) var(--ease-std), color var(--dur) var(--ease-std), transform var(--dur-fast) var(--ease-std)",
      ...sz,
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      fontSize: "1.05em",
      lineHeight: 0
    }
  }, icon) : null, children ? /*#__PURE__*/React.createElement("span", null, children) : null, iconTrailing ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      fontSize: "1.05em",
      lineHeight: 0
    }
  }, iconTrailing) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Crisp bordered container — the dominant surface. Flat at rest (no shadow). */
function Card({
  children,
  padding = "16px",
  className = "",
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `dg-card ${className}`,
    style: {
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      ...style
    }
  }, rest), padding ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding
    }
  }, children) : children);
}

/** Header row for a Card — sits on the subtle surface with a hairline below. */
function CardHeader({
  icon = null,
  title,
  action = null,
  className = "",
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `dg-card__header ${className}`,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
      padding: "10px 14px",
      background: "var(--surface-subtle)",
      borderBottom: "1px solid var(--border)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      fontSize: "var(--text-base)",
      fontWeight: "var(--fw-semibold)",
      color: "var(--text-primary)"
    }
  }, icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      fontSize: 15,
      color: "var(--text-secondary)"
    }
  }, icon) : null, title), action ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, action) : null);
}
Object.assign(__ds_scope, { Card, CardHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "dg-iconbtn-focus-css";
const FOCUS_CSS = `.dg-iconbtn:focus-visible{outline:none;box-shadow:var(--ring-focus);}`;
function useFocusCss() {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = FOCUS_CSS;
    document.head.appendChild(el);
  }, []);
}
const SIZES = {
  sm: {
    box: 24,
    font: 14
  },
  md: {
    box: 28,
    font: 16
  },
  lg: {
    box: 32,
    font: 18
  }
};
const VARIANTS = {
  ghost: {
    bg: "transparent",
    color: "var(--text-secondary)",
    border: "transparent",
    hoverBg: "var(--surface-hover)",
    hoverColor: "var(--text-primary)"
  },
  outline: {
    bg: "var(--surface)",
    color: "var(--text-secondary)",
    border: "var(--border)",
    hoverBg: "var(--surface-subtle)",
    hoverColor: "var(--text-primary)"
  },
  danger: {
    bg: "transparent",
    color: "var(--text-secondary)",
    border: "transparent",
    hoverBg: "var(--danger-tint)",
    hoverColor: "var(--danger-text)"
  }
};

/** Square icon-only button — toolbar actions, row affordances. Inline-styled. */
function IconButton({
  variant = "ghost",
  size = "md",
  label,
  children,
  className = "",
  style = {},
  disabled = false,
  ...rest
}) {
  useFocusCss();
  const [hover, setHover] = React.useState(false);
  const v = VARIANTS[variant] || VARIANTS.ghost;
  const sz = SIZES[size] || SIZES.md;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    className: `dg-iconbtn ${className}`,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: sz.box,
      height: sz.box,
      fontSize: sz.font,
      WebkitAppearance: "none",
      appearance: "none",
      border: `1px solid ${v.border}`,
      borderRadius: "var(--radius)",
      background: !disabled && hover ? v.hoverBg : v.bg,
      color: !disabled && hover ? v.hoverColor : v.color,
      cursor: disabled ? "default" : "pointer",
      opacity: disabled ? 0.45 : 1,
      transition: "background var(--dur) var(--ease-std), color var(--dur) var(--ease-std)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "dg-input-focus-css";
const FOCUS_CSS = `
.dg-input:focus{outline:none;border-color:var(--accent)!important;box-shadow:var(--ring-focus);}
.dg-input--invalid:focus{box-shadow:0 0 0 3px rgba(220,38,38,.18);}
.dg-input::placeholder{color:var(--text-tertiary);}`;
function useFocusCss() {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = FOCUS_CSS;
    document.head.appendChild(el);
  }, []);
}

/** Text input with optional label, leading icon, and hint / error states. */
function Input({
  label,
  icon = null,
  hint,
  error,
  invalid = false,
  className = "",
  id,
  style = {},
  ...rest
}) {
  useFocusCss();
  const [hover, setHover] = React.useState(false);
  const inputId = id || (label ? `dg-${String(label).replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const isInvalid = invalid || !!error;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      flexDirection: "column",
      gap: 5,
      width: "100%"
    },
    htmlFor: inputId
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      fontWeight: "var(--fw-medium)",
      color: "var(--text-secondary)"
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 9,
      display: "inline-flex",
      color: "var(--text-tertiary)",
      fontSize: 15,
      pointerEvents: "none"
    }
  }, icon) : null, /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    className: `dg-input ${isInvalid ? "dg-input--invalid" : ""} ${className}`,
    "aria-invalid": isInvalid || undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: "100%",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      color: "var(--text-primary)",
      background: "var(--surface)",
      WebkitAppearance: "none",
      appearance: "none",
      border: `1px solid ${isInvalid ? "var(--danger)" : hover ? "var(--n-300)" : "var(--border)"}`,
      borderRadius: "var(--radius-md)",
      height: "var(--control-h-md)",
      padding: icon ? "0 10px 0 30px" : "0 10px",
      ...style
    }
  }, rest))), error ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--danger-text)"
    }
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--text-tertiary)"
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/MetricCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONE = {
  neutral: "var(--text-primary)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
  info: "var(--info)"
};

/**
 * Dashboard KPI tile — label + icon, big tabular figure, supporting sub-line.
 * The figure color carries urgency (danger when alerts exist, etc.).
 */
function MetricCard({
  label,
  value,
  sub,
  icon = null,
  tone = "neutral",
  className = "",
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `dg-metric ${className}`,
    style: {
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
      padding: "13px 15px",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 7,
      fontSize: "var(--text-xs)",
      color: "var(--text-secondary)"
    }
  }, icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      fontSize: 14,
      color: "var(--text-tertiary)"
    }
  }, icon) : null, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-2xl)",
      fontWeight: "var(--fw-semibold)",
      lineHeight: "var(--lh-tight)",
      letterSpacing: "var(--ls-tight)",
      color: TONE[tone] || TONE.neutral,
      fontVariantNumeric: "var(--numeric-tabular)"
    }
  }, value), sub ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--text-tertiary)",
      marginTop: 3
    }
  }, sub) : null);
}
Object.assign(__ds_scope, { MetricCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/MetricCard.jsx", error: String((e && e.message) || e) }); }

// components/core/PhaseBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const PHASES = {
  SIGNE: {
    label: "Signé",
    tint: "var(--phase-signe-tint)",
    ink: "var(--phase-signe-ink)",
    bar: "var(--phase-signe-bar)"
  },
  PREPARATION: {
    label: "Préparation",
    tint: "var(--phase-preparation-tint)",
    ink: "var(--phase-preparation-ink)",
    bar: "var(--phase-preparation-bar)"
  },
  CHANTIER: {
    label: "Chantier",
    tint: "var(--phase-chantier-tint)",
    ink: "var(--phase-chantier-ink)",
    bar: "var(--phase-chantier-bar)"
  },
  LIVRAISON: {
    label: "Livraison",
    tint: "var(--phase-livraison-tint)",
    ink: "var(--phase-livraison-ink)",
    bar: "var(--phase-livraison-bar)"
  },
  TERMINE: {
    label: "Terminé",
    tint: "var(--phase-termine-tint)",
    ink: "var(--phase-termine-ink)",
    bar: "var(--phase-termine-bar)"
  }
};

/**
 * Project-lifecycle phase badge. Owns the canonical 5-phase palette.
 * Pass the phase key (SIGNE | PREPARATION | CHANTIER | LIVRAISON | TERMINE).
 */
function PhaseBadge({
  phase = "SIGNE",
  solid = false,
  className = "",
  style = {},
  ...rest
}) {
  const p = PHASES[phase] || PHASES.SIGNE;
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-2xs)",
    fontWeight: "var(--fw-semibold)",
    lineHeight: 1,
    letterSpacing: ".01em",
    whiteSpace: "nowrap",
    padding: "3px 8px",
    borderRadius: "var(--radius-full)"
  };
  const skin = solid ? {
    background: p.bar,
    color: "#fff"
  } : {
    background: p.tint,
    color: p.ink
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `dg-phase ${className}`,
    style: {
      ...base,
      ...skin,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: solid ? "rgba(255,255,255,.85)" : p.bar,
      flex: "0 0 auto"
    }
  }), p.label);
}

/** Exposed for charts/bars that need the raw phase color. */
const PHASE_COLORS = PHASES;
Object.assign(__ds_scope, { PhaseBadge, PHASE_COLORS });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/PhaseBadge.jsx", error: String((e && e.message) || e) }); }

// components/core/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Thin progress bar, colored by project phase (or a custom color).
 * Track is the neutral fill; the bar uses the phase bar color.
 */
function ProgressBar({
  value = 0,
  phase = null,
  color = null,
  height = 3,
  className = "",
  style = {},
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, value));
  const barColor = color || (phase && __ds_scope.PHASE_COLORS[phase] ? __ds_scope.PHASE_COLORS[phase].bar : "var(--accent)");
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `dg-progress ${className}`,
    role: "progressbar",
    "aria-valuenow": pct,
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    style: {
      height,
      background: "var(--n-100)",
      borderRadius: "var(--radius-full)",
      overflow: "hidden",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${pct}%`,
      background: barColor,
      borderRadius: "var(--radius-full)",
      transition: "width var(--dur-slow) var(--ease-out)"
    }
  }));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/core/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "dg-select-focus-css";
const FOCUS_CSS = `.dg-select:focus{outline:none;border-color:var(--accent)!important;box-shadow:var(--ring-focus);}`;
function useFocusCss() {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = FOCUS_CSS;
    document.head.appendChild(el);
  }, []);
}

/** Native select, styled inline to match the field system. Pass `options` or children. */
function Select({
  label,
  options = null,
  size = "md",
  className = "",
  id,
  children,
  disabled = false,
  style = {},
  ...rest
}) {
  useFocusCss();
  const [hover, setHover] = React.useState(false);
  const selId = id || (label ? `dg-sel-${String(label).replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const sm = size === "sm";
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      flexDirection: "column",
      gap: 5,
      width: "100%"
    },
    htmlFor: selId
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      fontWeight: "var(--fw-medium)",
      color: "var(--text-secondary)"
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selId,
    className: `dg-select ${className}`,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: "100%",
      fontFamily: "var(--font-sans)",
      fontSize: sm ? "var(--text-xs)" : "var(--text-sm)",
      color: disabled ? "var(--text-disabled)" : "var(--text-primary)",
      background: disabled ? "var(--surface-subtle)" : "var(--surface)",
      WebkitAppearance: "none",
      appearance: "none",
      border: `1px solid ${hover && !disabled ? "var(--n-300)" : "var(--border)"}`,
      borderRadius: "var(--radius-md)",
      height: sm ? "var(--control-h)" : "var(--control-h-md)",
      padding: "0 28px 0 10px",
      cursor: disabled ? "not-allowed" : "pointer",
      ...style
    }
  }, rest), options ? options.map(o => {
    const val = typeof o === "string" ? o : o.value;
    const lab = typeof o === "string" ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: val,
      value: val
    }, lab);
  }) : children), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 9,
      pointerEvents: "none",
      color: "var(--text-tertiary)",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  })))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Select.jsx", error: String((e && e.message) || e) }); }

// components/core/StatusDot.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STATUS = {
  termine: {
    color: "var(--task-termine)",
    label: "Terminé"
  },
  encours: {
    color: "var(--task-encours)",
    label: "En cours"
  },
  demain: {
    color: "var(--task-demain)",
    label: "Commence demain"
  },
  avenir: {
    color: "var(--task-avenir)",
    label: "À venir"
  }
};

/**
 * Task-status dot, color-keyed to the Gantt status system. Optionally labelled,
 * and optionally "pulsing" for the live "en cours" state.
 */
function StatusDot({
  status = "avenir",
  showLabel = false,
  pulse = false,
  size = 8,
  className = "",
  style = {},
  ...rest
}) {
  const s = STATUS[status] || STATUS.avenir;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `dg-status ${className}`,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: "50%",
      background: s.color,
      flex: "0 0 auto",
      boxShadow: pulse ? `0 0 0 0 ${s.color}` : "none",
      animation: pulse && status === "encours" ? "dg-pulse 1.8s var(--ease-out) infinite" : "none"
    }
  }), showLabel ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      fontWeight: "var(--fw-medium)",
      color: "var(--text-secondary)"
    }
  }, s.label) : null, /*#__PURE__*/React.createElement("style", null, `@keyframes dg-pulse{0%{box-shadow:0 0 0 0 rgba(29,158,117,.4)}70%{box-shadow:0 0 0 5px rgba(29,158,117,0)}100%{box-shadow:0 0 0 0 rgba(29,158,117,0)}}`));
}
Object.assign(__ds_scope, { StatusDot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatusDot.jsx", error: String((e && e.message) || e) }); }

// components/core/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "dg-tabs-focus-css";
const FOCUS_CSS = `.dg-tab:focus-visible{outline:none;box-shadow:var(--ring-focus);border-radius:var(--radius-sm);}`;
function useFocusCss() {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = FOCUS_CSS;
    document.head.appendChild(el);
  }, []);
}
function Tab({
  label,
  count,
  active,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    role: "tab",
    "aria-selected": active,
    className: "dg-tab",
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-base)",
      fontWeight: active ? "var(--fw-semibold)" : "var(--fw-medium)",
      color: active || hover ? "var(--text-primary)" : "var(--text-secondary)",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      WebkitAppearance: "none",
      appearance: "none",
      padding: "9px 12px",
      marginBottom: -1,
      borderBottom: `2px solid ${active ? "var(--accent)" : "transparent"}`,
      transition: "color var(--dur) var(--ease-std)"
    }
  }, label, count != null ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-2xs)",
      fontWeight: "var(--fw-semibold)",
      padding: "1px 6px",
      borderRadius: "var(--radius-full)",
      background: active ? "var(--accent-tint)" : "var(--n-100)",
      color: active ? "var(--dg-red-700)" : "var(--text-tertiary)"
    }
  }, count) : null);
}

/**
 * Underlined tab bar — the project page nav (Cédule · Extras · …).
 * Active tab gets a red underline. Inline-styled for reliable rendering.
 */
function Tabs({
  tabs = [],
  value,
  onChange,
  className = "",
  ...rest
}) {
  useFocusCss();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `dg-tabs ${className}`,
    role: "tablist",
    style: {
      display: "flex",
      alignItems: "stretch",
      gap: 2,
      borderBottom: "1px solid var(--border)"
    }
  }, rest), tabs.map(t => {
    const id = typeof t === "string" ? t : t.id;
    const label = typeof t === "string" ? t : t.label;
    const count = typeof t === "string" ? undefined : t.count;
    return /*#__PURE__*/React.createElement(Tab, {
      key: id,
      label: label,
      count: count,
      active: id === value,
      onClick: () => onChange && onChange(id)
    });
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/core/Toggle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "dg-toggle-css";
const CSS = `
.dg-toggle{display:inline-flex;align-items:center;gap:8px;cursor:pointer;user-select:none;}
.dg-toggle--disabled{opacity:.5;cursor:not-allowed;}
.dg-toggle__track{
  position:relative;width:32px;height:18px;border-radius:var(--radius-full);
  background:var(--n-300);transition:background var(--dur) var(--ease-std);flex:0 0 auto;
}
.dg-toggle__track--on{background:var(--success);}
.dg-toggle__thumb{
  position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
  background:#fff;box-shadow:var(--shadow-sm);
  transition:transform var(--dur) var(--ease-out);
}
.dg-toggle__track--on .dg-toggle__thumb{transform:translateX(14px);}
.dg-toggle input:focus-visible + .dg-toggle__track{box-shadow:var(--ring-focus);}
.dg-toggle__label{font-size:var(--text-sm);color:var(--text-primary);}
`;
function useInjected(id, css) {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }, [id, css]);
}

/** On/off switch. Used for the "visible client" toggle on cédule steps. */
function Toggle({
  checked = false,
  onChange,
  label,
  disabled = false,
  className = "",
  ...rest
}) {
  useInjected(STYLE_ID, CSS);
  return /*#__PURE__*/React.createElement("label", {
    className: `dg-toggle ${disabled ? "dg-toggle--disabled" : ""} ${className}`
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked, e),
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: `dg-toggle__track ${checked ? "dg-toggle__track--on" : ""}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "dg-toggle__thumb"
  })), label ? /*#__PURE__*/React.createElement("span", {
    className: "dg-toggle__label"
  }, label) : null);
}
Object.assign(__ds_scope, { Toggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Toggle.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
/**
 * Modal dialog with a scrim, header, body and footer. Confirmation variant via
 * `tone` (danger paints the icon + title for destructive actions).
 */
function Dialog({
  open = true,
  onClose,
  title,
  icon,
  tone = "neutral",
  children,
  footer,
  width = 460
}) {
  if (!open) return null;
  const tint = {
    neutral: "var(--text-secondary)",
    danger: "var(--danger)",
    warning: "var(--warning)",
    success: "var(--success)"
  }[tone] || "var(--text-secondary)";
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 900,
      background: "rgba(31,29,27,0.42)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      backdropFilter: "blur(1.5px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    role: "dialog",
    "aria-modal": "true",
    style: {
      width,
      maxWidth: "100%",
      background: "var(--surface)",
      borderRadius: "var(--radius-xl)",
      boxShadow: "var(--shadow-pop)",
      overflow: "hidden",
      border: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: "18px 20px 14px"
    }
  }, icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 36,
      height: 36,
      borderRadius: "var(--radius-md)",
      background: tone === "danger" ? "var(--danger-tint)" : "var(--surface-subtle)",
      color: tint,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ti ti-" + icon,
    style: {
      fontSize: 19
    }
  })) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "var(--text-lg)",
      fontWeight: "var(--fw-semibold)",
      letterSpacing: "var(--ls-snug)",
      color: "var(--text-primary)"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-secondary)",
      marginTop: 4,
      lineHeight: "var(--lh-normal)"
    }
  }, children)), onClose ? /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Fermer",
    style: {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      color: "var(--text-tertiary)",
      padding: 2,
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ti ti-x",
    style: {
      fontSize: 17
    }
  })) : null), footer ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 8,
      padding: "12px 20px",
      background: "var(--surface-subtle)",
      borderTop: "1px solid var(--border)"
    }
  }, footer) : null));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
/**
 * Empty-state block — icon, title, supporting line, optional action.
 * Used for "aucun projet", "aucune cédule", "aucune dépense", etc.
 */
function EmptyState({
  icon = "inbox",
  title,
  message,
  action,
  compact = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      padding: compact ? "28px 20px" : "52px 24px",
      color: "var(--text-tertiary)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: compact ? 40 : 52,
      height: compact ? 40 : 52,
      borderRadius: "var(--radius-lg)",
      background: "var(--surface-subtle)",
      border: "1px solid var(--border)",
      color: "var(--text-disabled)",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ti ti-" + icon,
    style: {
      fontSize: compact ? 20 : 26
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-md)",
      fontWeight: "var(--fw-semibold)",
      color: "var(--text-secondary)"
    }
  }, title), message ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      marginTop: 5,
      maxWidth: 320,
      lineHeight: "var(--lh-normal)"
    }
  }, message) : null, action ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, action) : null);
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Skeleton.jsx
try { (() => {
/** Shimmering skeleton block for loading states. */
function Skeleton({
  width = "100%",
  height = 14,
  radius = "var(--radius-sm)",
  style = {},
  className = ""
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: `dg-skeleton ${className}`,
    style: {
      display: "block",
      width,
      height,
      borderRadius: radius,
      background: "linear-gradient(90deg, var(--n-100) 25%, var(--n-150) 37%, var(--n-100) 63%)",
      backgroundSize: "400% 100%",
      animation: "dg-shimmer 1.4s ease infinite",
      ...style
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes dg-shimmer{0%{background-position:100% 50%}100%{background-position:0 50%}}`));
}

/** A skeleton placeholder shaped like a list/table row. */
function SkeletonRow({
  cols = [40, "60%", 80],
  height = 12,
  gap = 16,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap,
      padding: "12px 14px",
      ...style
    }
  }, cols.map((w, i) => /*#__PURE__*/React.createElement(Skeleton, {
    key: i,
    width: typeof w === "number" ? w : w,
    height: height
  })));
}
Object.assign(__ds_scope, { Skeleton, SkeletonRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Skeleton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const TONE = {
  neutral: {
    bar: "var(--n-400)",
    icon: "info-circle",
    color: "var(--text-primary)"
  },
  success: {
    bar: "var(--success)",
    icon: "circle-check",
    color: "var(--success-text)"
  },
  warning: {
    bar: "var(--warning)",
    icon: "alert-triangle",
    color: "var(--warning-text)"
  },
  danger: {
    bar: "var(--danger)",
    icon: "alert-circle",
    color: "var(--danger-text)"
  },
  info: {
    bar: "var(--info)",
    icon: "info-circle",
    color: "var(--info-text)"
  }
};

/** A single toast notification. Compose several inside `ToastStack`. */
function Toast({
  tone = "neutral",
  title,
  message,
  onClose,
  action,
  icon
}) {
  const t = TONE[tone] || TONE.neutral;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      width: 340,
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderLeft: `3px solid ${t.bar}`,
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-lg)",
      padding: "11px 12px"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ti ti-" + (icon || t.icon),
    style: {
      fontSize: 18,
      color: t.bar,
      marginTop: 1,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--fw-semibold)",
      color: "var(--text-primary)"
    }
  }, title) : null, message ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--text-secondary)",
      marginTop: 2
    }
  }, message) : null, action ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, action) : null), onClose ? /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Fermer",
    style: {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      color: "var(--text-tertiary)",
      padding: 2,
      display: "inline-flex",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ti ti-x",
    style: {
      fontSize: 15
    }
  })) : null);
}

/** Fixed bottom-right stack for toasts. */
function ToastStack({
  children,
  position = "bottom-right"
}) {
  const pos = {
    "bottom-right": {
      bottom: 20,
      right: 20,
      alignItems: "flex-end"
    },
    "bottom-left": {
      bottom: 20,
      left: 20,
      alignItems: "flex-start"
    },
    "top-right": {
      top: 20,
      right: 20,
      alignItems: "flex-end"
    }
  }[position] || {
    bottom: 20,
    right: 20,
    alignItems: "flex-end"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      ...pos
    }
  }, children);
}
Object.assign(__ds_scope, { Toast, ToastStack });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/navigation/FilterChip.jsx
try { (() => {
/**
 * Filterable chip / pill. Used for phase filters on the projects list and the
 * map legend. Shows a leading color dot and an optional count.
 */
function FilterChip({
  label,
  active = false,
  dotColor,
  count,
  onClick,
  className = ""
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    className: `dg-chip ${className}`,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 28,
      padding: "0 11px",
      borderRadius: "var(--radius-full)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-xs)",
      fontWeight: "var(--fw-medium)",
      whiteSpace: "nowrap",
      cursor: "pointer",
      border: `1px solid ${active ? "var(--n-900)" : "var(--border)"}`,
      background: active ? "var(--n-900)" : hover ? "var(--surface-subtle)" : "var(--surface)",
      color: active ? "#fff" : "var(--text-secondary)",
      transition: "background var(--dur) var(--ease-std), border-color var(--dur) var(--ease-std), color var(--dur) var(--ease-std)"
    }
  }, dotColor ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: dotColor,
      flexShrink: 0
    }
  }) : null, label, count != null ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-2xs)",
      fontWeight: "var(--fw-semibold)",
      opacity: active ? 0.8 : 0.6,
      fontVariantNumeric: "tabular-nums"
    }
  }, count) : null);
}
Object.assign(__ds_scope, { FilterChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/FilterChip.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SegmentedControl.jsx
try { (() => {
/**
 * Segmented control — 2–4 short options. Used for Consultation/Édition, the
 * cartes/liste view toggle, and the costing global/projet switch.
 */
function SegmentedControl({
  options = [],
  value,
  onChange,
  size = "md",
  className = ""
}) {
  const h = size === "sm" ? 28 : 32;
  const pad = size === "sm" ? "0 10px" : "0 13px";
  const fs = size === "sm" ? "var(--text-xs)" : "var(--text-sm)";
  return /*#__PURE__*/React.createElement("div", {
    className: `dg-seg ${className}`,
    role: "tablist",
    style: {
      display: "inline-flex",
      padding: 3,
      gap: 2,
      background: "var(--n-100)",
      borderRadius: "var(--radius-md)"
    }
  }, options.map(o => {
    const id = typeof o === "string" ? o : o.value;
    const label = typeof o === "string" ? o : o.label;
    const icon = typeof o === "string" ? null : o.icon;
    const active = id === value;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      role: "tab",
      "aria-selected": active,
      onClick: () => onChange && onChange(id),
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        height: h,
        padding: pad,
        borderRadius: "var(--radius)",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: fs,
        fontWeight: "var(--fw-semibold)",
        whiteSpace: "nowrap",
        background: active ? "var(--surface)" : "transparent",
        color: active ? "var(--text-primary)" : "var(--text-secondary)",
        boxShadow: active ? "var(--shadow-sm)" : "none",
        transition: "background var(--dur) var(--ease-std), color var(--dur) var(--ease-std)"
      }
    }, icon ? /*#__PURE__*/React.createElement("i", {
      className: "ti ti-" + icon,
      style: {
        fontSize: 14
      }
    }) : null, label);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Stepper.jsx
try { (() => {
/**
 * Horizontal step indicator for multi-step flows (project creation).
 * Past steps show a check; the current step is red; future steps are muted.
 */
function Stepper({
  steps = [],
  current = 0,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `dg-stepper ${className}`,
    style: {
      display: "flex",
      alignItems: "center",
      width: "100%"
    }
  }, steps.map((s, i) => {
    const label = typeof s === "string" ? s : s.label;
    const done = i < current;
    const active = i === current;
    const dotBg = done ? "var(--success)" : active ? "var(--accent)" : "var(--surface)";
    const dotBorder = done ? "var(--success)" : active ? "var(--accent)" : "var(--border-strong)";
    const dotColor = done || active ? "#fff" : "var(--text-tertiary)";
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 9,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 26,
        height: 26,
        borderRadius: "50%",
        flexShrink: 0,
        background: dotBg,
        border: `1.5px solid ${dotBorder}`,
        color: dotColor,
        fontSize: "var(--text-xs)",
        fontWeight: "var(--fw-semibold)",
        transition: "background var(--dur) var(--ease-std)"
      }
    }, done ? /*#__PURE__*/React.createElement("i", {
      className: "ti ti-check",
      style: {
        fontSize: 14
      }
    }) : i + 1), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--text-sm)",
        fontWeight: active ? "var(--fw-semibold)" : "var(--fw-medium)",
        color: active ? "var(--text-primary)" : done ? "var(--text-secondary)" : "var(--text-tertiary)",
        whiteSpace: "nowrap"
      }
    }, label)), i < steps.length - 1 ? /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        height: 1.5,
        margin: "0 12px",
        borderRadius: 2,
        background: i < current ? "var(--success)" : "var(--border)"
      }
    }) : null);
  }));
}
Object.assign(__ds_scope, { Stepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Stepper.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/AppShell.jsx
try { (() => {
/* App shell — fixed 200px sidebar mirroring the production layout. */
(function () {
  // [label, icon, screenId, badgeCount]
  const NAV_MAIN = [['Dashboard', 'layout-dashboard', 'dashboard'], ['Projets', 'building-community', 'projets', 7], ['Carte', 'map-2', 'carte'], ['Clients', 'users', 'clients'], ['Fournisseurs', 'truck', 'fournisseurs'], ['Costing', 'chart-bar', 'costing'], ['Feuilles de temps', 'clock', 'feuilles']];
  // Design-system showcase screens (not part of the real product nav)
  const NAV_DEMO = [['Vue mobile', 'device-mobile', 'mobile'], ['Vue client', 'eye-share', 'vueclient'], ['États & patterns', 'components', 'etats']];

  // Which nav item highlights for a given screen
  const SCREEN_TO_NAV = {
    dashboard: 'dashboard',
    projets: 'projets',
    projet: 'projets',
    create: 'projets',
    carte: 'carte',
    clients: 'clients',
    fournisseurs: 'fournisseurs',
    costing: 'costing',
    feuilles: 'feuilles',
    parametres: 'parametres',
    mobile: 'mobile',
    vueclient: 'vueclient',
    etats: 'etats'
  };
  function NavItem({
    label,
    icon,
    active,
    count,
    onClick,
    disabled
  }) {
    const [hover, setHover] = React.useState(false);
    return /*#__PURE__*/React.createElement("a", {
      onClick: disabled ? undefined : onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 10px',
        borderRadius: 6,
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        color: active ? 'var(--dg-red)' : disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
        background: active ? 'var(--dg-red-50)' : hover && !disabled ? 'var(--n-100)' : 'transparent',
        cursor: disabled ? 'default' : 'pointer',
        textDecoration: 'none',
        transition: 'background .1s'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: 'ti ti-' + icon,
      style: {
        fontSize: 18,
        color: active ? 'var(--dg-red)' : 'var(--text-tertiary)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, label), count ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 600,
        padding: '1px 6px',
        borderRadius: 10,
        background: active ? 'var(--dg-red)' : 'var(--n-200)',
        color: active ? '#fff' : 'var(--text-secondary)'
      }
    }, count) : null);
  }
  function AppShell({
    active,
    onNavigate,
    children
  }) {
    const navActive = SCREEN_TO_NAV[active] || active;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        minHeight: '100%',
        background: 'var(--bg-app)'
      }
    }, /*#__PURE__*/React.createElement("aside", {
      style: {
        width: 200,
        minWidth: 200,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '18px 16px 14px',
        borderBottom: '1px solid var(--divider)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/habitationsdg.svg",
      alt: "Habitations DG",
      style: {
        width: 130,
        display: 'block',
        cursor: 'pointer'
      },
      onClick: () => onNavigate('dashboard')
    })), /*#__PURE__*/React.createElement("nav", {
      style: {
        flex: 1,
        padding: '12px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflowY: 'auto'
      }
    }, NAV_MAIN.map(([label, icon, screen, count]) => /*#__PURE__*/React.createElement(NavItem, {
      key: label,
      label: label,
      icon: icon,
      count: count,
      active: navActive === screen,
      onClick: () => onNavigate(screen)
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9.5,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'var(--text-disabled)',
        padding: '14px 10px 6px'
      }
    }, "D\xE9mos design"), NAV_DEMO.map(([label, icon, screen]) => /*#__PURE__*/React.createElement(NavItem, {
      key: label,
      label: label,
      icon: icon,
      active: navActive === screen,
      onClick: () => onNavigate(screen)
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 8,
        borderTop: '1px solid var(--divider)'
      }
    }, /*#__PURE__*/React.createElement(NavItem, {
      label: "Param\xE8tres",
      icon: "settings",
      active: navActive === 'parametres',
      onClick: () => onNavigate('parametres')
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'var(--success)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 600,
        flexShrink: 0
      }
    }, "NS"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, "Nicolas"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: 'var(--text-tertiary)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, "nicolas.savard@habitationsdg.com")), /*#__PURE__*/React.createElement("button", {
      title: "Se d\xE9connecter",
      style: {
        width: 28,
        height: 28,
        border: '1px solid var(--border)',
        borderRadius: 6,
        background: 'var(--surface)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: 'var(--text-secondary)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-logout",
      style: {
        fontSize: 16
      }
    })))), /*#__PURE__*/React.createElement("main", {
      style: {
        flex: 1,
        minWidth: 0,
        overflow: 'auto',
        height: '100vh'
      }
    }, children));
  }
  window.AppShell = AppShell;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/Carte.jsx
try { (() => {
/* Écran — Carte : vue Leaflet, marqueurs par phase, légende-filtre interactive. */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const {
    FilterChip,
    PhaseBadge,
    Card,
    Badge
  } = NS;
  const TYPE_LABEL = {
    MAISON: 'Maison',
    JUMELE: 'Jumelé',
    LOGEMENT: 'Logement'
  };
  const TYPE_ICON = {
    MAISON: 'home',
    JUMELE: 'home-2',
    LOGEMENT: 'building'
  };
  function markerHtml(phaseColor, typeIcon) {
    return `<div style="position:relative;width:30px;height:38px;">
      <div style="position:absolute;left:50%;top:0;transform:translateX(-50%);width:30px;height:30px;border-radius:50% 50% 50% 0;transform-origin:center;rotate:-45deg;background:${phaseColor};border:2px solid #fff;box-shadow:0 2px 5px rgba(31,29,27,.3);"></div>
      <div style="position:absolute;left:50%;top:14px;transform:translate(-50%,-50%);color:#fff;font-size:13px;display:flex;"><i class="ti ti-${typeIcon}"></i></div>
    </div>`;
  }
  function Carte({
    onOpenProject
  }) {
    const DGd = window.DG;
    const mapRef = React.useRef(null);
    const mapObj = React.useRef(null);
    const layer = React.useRef(null);
    const [phase, setPhase] = React.useState(null);
    const [selected, setSelected] = React.useState(null);
    const counts = {};
    DGd.projets.forEach(p => {
      counts[p.phase] = (counts[p.phase] || 0) + 1;
    });
    const PHASES = ['SIGNE', 'PREPARATION', 'CHANTIER', 'LIVRAISON', 'TERMINE'];
    React.useEffect(() => {
      if (!window.L || mapObj.current) return;
      const map = window.L.map(mapRef.current, {
        scrollWheelZoom: true,
        attributionControl: false,
        zoomControl: false
      }).setView([46.62, -70.86], 9);
      window.L.control.zoom({
        position: 'topright'
      }).addTo(map);
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);
      mapObj.current = map;
      layer.current = window.L.layerGroup().addTo(map);
      drawMarkers();
      setTimeout(() => map.invalidateSize(), 200);
    }, []);
    function drawMarkers() {
      if (!layer.current) return;
      layer.current.clearLayers();
      DGd.projets.filter(p => !phase || p.phase === phase).forEach(p => {
        const ph = DGd.phase(p.phase);
        const icon = window.L.divIcon({
          html: markerHtml(ph.bar, TYPE_ICON[p.type]),
          className: 'dg-marker',
          iconSize: [30, 38],
          iconAnchor: [15, 32]
        });
        const m = window.L.marker([p.lat, p.lng], {
          icon
        }).addTo(layer.current);
        m.on('click', () => setSelected(p.id));
      });
    }
    React.useEffect(() => {
      drawMarkers();
    }, [phase]);
    const sel = selected ? DGd.projets.find(p => p.id === selected) : null;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '18px 24px 14px'
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: '-0.02em'
      }
    }, "Carte des chantiers"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: 'var(--text-secondary)',
        marginTop: 3
      }
    }, DGd.projets.length, " projets en Chaudi\xE8re-Appalaches")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        flex: 1,
        minHeight: 480,
        margin: '0 24px 24px',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--border)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      ref: mapRef,
      style: {
        position: 'absolute',
        inset: 0,
        background: 'var(--n-100)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 500,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        padding: 12,
        width: 200
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)',
        marginBottom: 9
      }
    }, "Filtrer par phase"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(FilterChip, {
      label: "Tous les projets",
      count: DGd.projets.length,
      active: phase == null,
      onClick: () => setPhase(null)
    }), PHASES.map(ph => counts[ph] ? /*#__PURE__*/React.createElement(FilterChip, {
      key: ph,
      label: DGd.phase(ph).label,
      dotColor: DGd.phase(ph).bar,
      count: counts[ph],
      active: phase === ph,
      onClick: () => setPhase(phase === ph ? null : ph)
    }) : null))), sel ? /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 14,
        right: 14,
        zIndex: 500,
        width: 270,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 14px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600
      }
    }, sel.adresse), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--text-tertiary)'
      }
    }, sel.ville, " \xB7 ", sel.client)), /*#__PURE__*/React.createElement("button", {
      onClick: () => setSelected(null),
      style: {
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: 'var(--text-tertiary)',
        padding: 2
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-x",
      style: {
        fontSize: 15
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        marginTop: 9
      }
    }, /*#__PURE__*/React.createElement(PhaseBadge, {
      phase: sel.phase
    }), /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, TYPE_LABEL[sel.type])), /*#__PURE__*/React.createElement("button", {
      onClick: () => onOpenProject && onOpenProject(sel.id),
      style: {
        marginTop: 12,
        width: '100%',
        height: 30,
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius)',
        background: 'var(--surface)',
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'var(--font-sans)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        color: 'var(--text-primary)'
      }
    }, "Ouvrir le projet ", /*#__PURE__*/React.createElement("i", {
      className: "ti ti-arrow-right",
      style: {
        fontSize: 14
      }
    })))) : null, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 14,
        left: 12,
        zIndex: 500,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        padding: '8px 11px',
        display: 'flex',
        gap: 14
      }
    }, Object.keys(TYPE_LABEL).map(t => /*#__PURE__*/React.createElement("span", {
      key: t,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 11,
        color: 'var(--text-secondary)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: 'ti ti-' + TYPE_ICON[t],
      style: {
        fontSize: 14,
        color: 'var(--text-tertiary)'
      }
    }), TYPE_LABEL[t])))));
  }
  window.Carte = Carte;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/Carte.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/CeduleEditor.jsx
try { (() => {
/* Cédule — mode édition. Nudge de dates avec cascade, buffer, assignation,
   visible client, étapes verrouillées (terminées / en cours), détection de conflits. */
(function () {
  const DS = window.HabitationsDGDesignSystem_408490;
  const {
    Select,
    Toggle
  } = DS;
  function cascadeDown(etapes, from) {
    const a = etapes.map(e => ({
      ...e
    }));
    for (let i = from + 1; i < a.length; i++) {
      const prev = a[i - 1];
      a[i].dateDebut = window.DG.addJoursOuvrables(prev.dateFin, 1 + (prev.buffer || 0));
      a[i].dateFin = a[i].jours <= 1 ? new Date(a[i].dateDebut) : window.DG.addJoursOuvrables(a[i].dateDebut, a[i].jours - 1);
    }
    return a;
  }
  function detecterConflits(etapes) {
    const c = [];
    for (let i = 0; i < etapes.length - 1; i++) {
      const d1 = new Date(etapes[i].dateFin);
      d1.setHours(0, 0, 0, 0);
      const d2 = new Date(etapes[i + 1].dateDebut);
      d2.setHours(0, 0, 0, 0);
      if (d1 >= d2) {
        c.push(i);
        c.push(i + 1);
      }
    }
    return [...new Set(c)];
  }
  function NudgeGroup({
    value,
    onNudge,
    disabled,
    accent
  }) {
    const btn = off => /*#__PURE__*/React.createElement("button", {
      key: off,
      disabled: disabled,
      onClick: () => onNudge(off),
      style: {
        width: 24,
        height: 26,
        padding: 0,
        border: '1px solid var(--border)',
        borderRadius: 4,
        background: disabled ? 'var(--surface-subtle)' : 'var(--surface)',
        color: disabled ? 'var(--text-disabled)' : 'var(--text-secondary)',
        fontSize: 10,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontVariantNumeric: 'tabular-nums'
      },
      onMouseEnter: e => {
        if (!disabled) {
          e.currentTarget.style.background = 'var(--n-100)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }
      },
      onMouseLeave: e => {
        if (!disabled) {
          e.currentTarget.style.background = 'var(--surface)';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }
      }
    }, off > 0 ? '+' : '', off);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 3
      }
    }, [-5, -3, -1].map(btn), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 54,
        textAlign: 'center',
        fontSize: 11,
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
        color: disabled ? 'var(--text-tertiary)' : accent || 'var(--text-primary)',
        background: disabled ? 'transparent' : 'var(--info-tint)',
        borderRadius: 4,
        padding: '4px 0'
      }
    }, value), [1, 3, 5].map(btn));
  }
  function CeduleEditor({
    etapesInit,
    dateLivraison,
    fournisseurs
  }) {
    const DGd = window.DG;
    const [etapes, setEtapes] = React.useState(() => etapesInit.map(e => ({
      ...e
    })));
    const conflits = React.useMemo(() => detecterConflits(etapes), [etapes]);
    const totalJours = DGd.joursOuvrableEntre(etapes[0].dateDebut, dateLivraison);
    const totalBuffer = etapes.reduce((s, e) => s + (e.buffer || 0), 0);
    const overflow = etapes[etapes.length - 1].dateFin > dateLivraison;
    const lockState = e => e.statut === 'termine' ? 'full' : e.statut === 'encours' ? 'start' : 'none';
    function nudgeDebut(idx, off) {
      setEtapes(prev => {
        const a = prev.map(e => ({
          ...e
        }));
        a[idx].dateDebut = DGd.addJoursOuvrables(a[idx].dateDebut, off);
        a[idx].dateFin = a[idx].jours <= 1 ? new Date(a[idx].dateDebut) : DGd.addJoursOuvrables(a[idx].dateDebut, a[idx].jours - 1);
        return cascadeDown(a, idx);
      });
    }
    function nudgeFin(idx, off) {
      setEtapes(prev => {
        const a = prev.map(e => ({
          ...e
        }));
        a[idx].dateFin = DGd.addJoursOuvrables(a[idx].dateFin, off);
        a[idx].jours = DGd.joursOuvrableEntre(a[idx].dateDebut, a[idx].dateFin);
        return cascadeDown(a, idx);
      });
    }
    function nudgeBuffer(idx, off) {
      setEtapes(prev => {
        const a = prev.map(e => ({
          ...e
        }));
        a[idx].buffer = Math.max(0, (a[idx].buffer || 0) + off);
        return cascadeDown(a, idx);
      });
    }
    function setAssigne(idx, val) {
      setEtapes(prev => prev.map((e, i) => i === idx ? {
        ...e,
        assigneA: val
      } : e));
    }
    function toggleVisible(idx) {
      setEtapes(prev => prev.map((e, i) => i === idx ? {
        ...e,
        visibleClient: !e.visibleClient
      } : e));
    }
    const HEAD = ['#', 'Étape', 'Jours', 'Date début', 'Fin', 'Buffer', 'Assigné', 'Vue client'];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--success-tint)',
        border: '1px solid #C7E3D4',
        borderRadius: 'var(--radius-md)',
        padding: '11px 14px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--text-secondary)',
        marginBottom: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-calendar-event",
      style: {
        color: 'var(--success)'
      }
    }), "D\xE9but estim\xE9"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: 'var(--success-text)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, DGd.dateLong(etapes[0].dateDebut))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--accent-tint)',
        border: '1px solid var(--accent-border)',
        borderRadius: 'var(--radius-md)',
        padding: '11px 14px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--text-secondary)',
        marginBottom: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-flag",
      style: {
        color: 'var(--dg-red)'
      }
    }), "Date de livraison"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: 'var(--dg-red-700)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, DGd.dateLong(dateLivraison))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--surface-subtle)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '11px 14px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--text-secondary)',
        marginBottom: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-sum",
      style: {
        color: 'var(--text-tertiary)'
      }
    }), "Total"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums'
      }
    }, totalJours, " jours ouvrables", totalBuffer > 0 ? ` · ${totalBuffer}j buffer` : ''))), conflits.length > 0 || overflow ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, conflits.length > 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 240,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--danger-tint)',
        border: '1px solid var(--accent-border)',
        borderRadius: 'var(--radius-md)',
        padding: '9px 13px',
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--danger-text)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-alert-triangle"
    }), Math.ceil(conflits.length / 2), " conflit", conflits.length > 2 ? 's' : '', " de chevauchement d\xE9tect\xE9", conflits.length > 2 ? 's' : '') : null, overflow ? /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 240,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--warning-tint)',
        border: '1px solid #F2D9A6',
        borderRadius: 'var(--radius-md)',
        padding: '9px 13px',
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--warning-text)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-clock-exclamation"
    }), "La c\xE9dule d\xE9passe la date de livraison") : null) : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--success-tint)',
        borderRadius: 'var(--radius-md)',
        padding: '9px 13px',
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--success-text)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-circle-check"
    }), "Aucun conflit \u2014 la c\xE9dule tient dans l'\xE9ch\xE9ancier"), /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: 'var(--surface)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        overflowX: 'auto'
      }
    }, /*#__PURE__*/React.createElement("table", {
      style: {
        borderCollapse: 'collapse',
        fontSize: 12,
        width: '100%',
        minWidth: 1080
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        background: 'var(--surface-subtle)',
        borderBottom: '1px solid var(--border)'
      }
    }, HEAD.map((h, i) => /*#__PURE__*/React.createElement("th", {
      key: i,
      style: {
        textAlign: i === 2 || i === 7 ? 'center' : 'left',
        padding: '8px 12px',
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)',
        whiteSpace: 'nowrap'
      }
    }, h)))), /*#__PURE__*/React.createElement("tbody", null, etapes.map((e, idx) => {
      const lock = lockState(e);
      const isConflict = conflits.includes(idx);
      const bg = isConflict ? 'var(--danger-tint)' : lock === 'full' ? 'rgba(99,153,34,0.07)' : idx % 2 ? 'var(--surface)' : 'var(--n-25)';
      return /*#__PURE__*/React.createElement("tr", {
        key: idx,
        style: {
          borderBottom: '1px solid var(--divider)',
          background: bg,
          borderLeft: isConflict ? '3px solid var(--danger)' : lock === 'full' ? '3px solid var(--task-termine)' : '3px solid transparent'
        }
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '7px 12px',
          color: 'var(--text-tertiary)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, e.ordre), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '7px 12px',
          fontWeight: 500,
          whiteSpace: 'nowrap'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          opacity: lock === 'full' ? 0.7 : 1
        }
      }, lock !== 'none' ? /*#__PURE__*/React.createElement("i", {
        className: 'ti ti-' + (lock === 'full' ? 'lock' : 'lock-open'),
        style: {
          fontSize: 13,
          color: lock === 'full' ? 'var(--task-termine)' : 'var(--task-encours)'
        }
      }) : null, e.nom)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '7px 12px',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, e.jours, "j"), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '7px 12px'
        }
      }, /*#__PURE__*/React.createElement(NudgeGroup, {
        value: DGd.dateCourt(e.dateDebut),
        disabled: lock === 'full' || lock === 'start',
        onNudge: o => nudgeDebut(idx, o),
        accent: 'var(--info-text)'
      })), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '7px 12px'
        }
      }, /*#__PURE__*/React.createElement(NudgeGroup, {
        value: DGd.dateCourt(e.dateFin),
        disabled: lock === 'full',
        onNudge: o => nudgeFin(idx, o),
        accent: 'var(--info-text)'
      })), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '7px 12px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 3
        }
      }, /*#__PURE__*/React.createElement("button", {
        disabled: lock === 'full',
        onClick: () => nudgeBuffer(idx, -1),
        style: {
          width: 24,
          height: 26,
          border: '1px solid var(--border)',
          borderRadius: 4,
          background: 'var(--surface)',
          color: 'var(--text-secondary)',
          fontSize: 11,
          fontWeight: 600,
          cursor: lock === 'full' ? 'not-allowed' : 'pointer'
        }
      }, "\u2212"), /*#__PURE__*/React.createElement("span", {
        style: {
          width: 34,
          textAlign: 'center',
          fontSize: 11,
          fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
          borderRadius: 4,
          padding: '4px 0',
          background: e.buffer > 0 ? 'var(--warning-tint)' : 'var(--n-100)',
          color: e.buffer > 0 ? 'var(--warning-text)' : 'var(--text-secondary)'
        }
      }, e.buffer || 0, "j"), /*#__PURE__*/React.createElement("button", {
        disabled: lock === 'full',
        onClick: () => nudgeBuffer(idx, 1),
        style: {
          width: 24,
          height: 26,
          border: '1px solid var(--border)',
          borderRadius: 4,
          background: 'var(--surface)',
          color: 'var(--text-secondary)',
          fontSize: 11,
          fontWeight: 600,
          cursor: lock === 'full' ? 'not-allowed' : 'pointer'
        }
      }, "+"))), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '7px 12px',
          minWidth: 160
        }
      }, /*#__PURE__*/React.createElement(Select, {
        size: "sm",
        value: e.assigneA,
        onChange: ev => setAssigne(idx, ev.target.value),
        options: ['Interne', ...fournisseurs],
        disabled: lock === 'full'
      })), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '7px 12px',
          textAlign: 'center'
        }
      }, /*#__PURE__*/React.createElement(Toggle, {
        checked: e.visibleClient,
        onChange: () => toggleVisible(idx),
        disabled: lock === 'full'
      })));
    }))))));
  }
  window.CeduleEditor = CeduleEditor;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/CeduleEditor.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/ClientsFournisseurs.jsx
try { (() => {
/* Écran — Clients & Fournisseurs : vues cartes / liste avec toggle. */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const {
    SegmentedControl,
    Card,
    CardHeader,
    Badge,
    Avatar,
    PhaseBadge,
    Button,
    FilterChip
  } = NS;
  function ClientsFournisseurs({
    onOpenProject,
    defaultData
  }) {
    const DGd = window.DG;
    const [data, setData] = React.useState(defaultData || 'clients');
    const [view, setView] = React.useState('cartes');
    React.useEffect(() => {
      if (defaultData) setData(defaultData);
    }, [defaultData]);
    const isClients = data === 'clients';
    const items = isClients ? DGd.CLIENTS : DGd.FOURNISSEURS;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '22px 24px 40px',
        maxWidth: 1180
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 14,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: '-0.02em'
      }
    }, "Carnet d'adresses"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: 'var(--text-secondary)',
        marginTop: 3
      }
    }, DGd.CLIENTS.length, " clients \xB7 ", DGd.FOURNISSEURS.length, " fournisseurs")), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-plus"
      })
    }, isClients ? 'Nouveau client' : 'Nouveau fournisseur')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 12,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(SegmentedControl, {
      value: data,
      onChange: setData,
      options: [{
        value: 'clients',
        label: 'Clients',
        icon: 'users'
      }, {
        value: 'fournisseurs',
        label: 'Fournisseurs',
        icon: 'truck'
      }]
    }), /*#__PURE__*/React.createElement(SegmentedControl, {
      size: "sm",
      value: view,
      onChange: setView,
      options: [{
        value: 'cartes',
        label: 'Cartes',
        icon: 'layout-grid'
      }, {
        value: 'liste',
        label: 'Liste',
        icon: 'list'
      }]
    })), view === 'cartes' ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 12
      }
    }, isClients ? DGd.CLIENTS.map(c => /*#__PURE__*/React.createElement("div", {
      key: c.id,
      onClick: () => onOpenProject && onOpenProject(c.projet),
      style: cardSt
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: c.nom
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, c.nom), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--text-tertiary)'
      }
    }, c.ville)), /*#__PURE__*/React.createElement(PhaseBadge, {
      phase: c.phase
    })), /*#__PURE__*/React.createElement(Line, {
      icon: "map-pin",
      text: c.adresse
    }), /*#__PURE__*/React.createElement(Line, {
      icon: "mail",
      text: c.courriel
    }), /*#__PURE__*/React.createElement(Line, {
      icon: "phone",
      text: c.tel
    }))) : DGd.FOURNISSEURS.map(f => /*#__PURE__*/React.createElement("div", {
      key: f.id,
      style: cardSt
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface-subtle)',
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-tool",
      style: {
        fontSize: 16
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, f.nom), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--text-tertiary)'
      }
    }, f.metier)), /*#__PURE__*/React.createElement(Badge, {
      tone: "success"
    }, f.actifs, " chantiers")), /*#__PURE__*/React.createElement(Line, {
      icon: "user",
      text: f.contact
    }), /*#__PURE__*/React.createElement(Line, {
      icon: "phone",
      text: f.tel
    })))) : /*#__PURE__*/React.createElement(Card, {
      padding: false
    }, /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 12.5
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        background: 'var(--surface-subtle)',
        borderBottom: '1px solid var(--border)'
      }
    }, (isClients ? [['Client', 'left'], ['Ville', 'left'], ['Courriel', 'left'], ['Téléphone', 'left'], ['Phase', 'left']] : [['Fournisseur', 'left'], ['Métier', 'left'], ['Contact', 'left'], ['Téléphone', 'left'], ['Chantiers', 'right']]).map((h, i) => /*#__PURE__*/React.createElement("th", {
      key: i,
      style: {
        textAlign: h[1],
        padding: '9px 14px',
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)',
        whiteSpace: 'nowrap'
      }
    }, h[0])))), /*#__PURE__*/React.createElement("tbody", null, isClients ? DGd.CLIENTS.map((c, i) => /*#__PURE__*/React.createElement("tr", {
      key: c.id,
      onClick: () => onOpenProject && onOpenProject(c.projet),
      style: {
        borderBottom: i === DGd.CLIENTS.length - 1 ? 'none' : '1px solid var(--divider)',
        cursor: 'pointer'
      },
      onMouseEnter: e => e.currentTarget.style.background = 'var(--surface-subtle)',
      onMouseLeave: e => e.currentTarget.style.background = 'transparent'
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: c.nom,
      size: "sm"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600
      }
    }, c.nom))), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        color: 'var(--text-secondary)'
      }
    }, c.ville), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        color: 'var(--text-secondary)'
      }
    }, c.courriel), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        color: 'var(--text-secondary)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, c.tel), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px'
      }
    }, /*#__PURE__*/React.createElement(PhaseBadge, {
      phase: c.phase
    })))) : DGd.FOURNISSEURS.map((f, i) => /*#__PURE__*/React.createElement("tr", {
      key: f.id,
      style: {
        borderBottom: i === DGd.FOURNISSEURS.length - 1 ? 'none' : '1px solid var(--divider)'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        fontWeight: 600
      }
    }, f.nom), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        color: 'var(--text-secondary)'
      }
    }, f.metier), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        color: 'var(--text-secondary)'
      }
    }, f.contact), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        color: 'var(--text-secondary)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, f.tel), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "success"
    }, f.actifs))))))));
  }
  function Line({
    icon,
    text
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 12,
        color: 'var(--text-secondary)',
        padding: '3px 0'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: 'ti ti-' + icon,
      style: {
        fontSize: 14,
        color: 'var(--text-tertiary)',
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, text));
  }
  const cardSt = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: 15,
    cursor: 'pointer',
    transition: 'border-color var(--dur)'
  };
  window.ClientsFournisseurs = ClientsFournisseurs;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/ClientsFournisseurs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/Costing.jsx
try { (() => {
/* Écran — Costing : page globale (tous projets) + onglet costing dans la page projet. */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const {
    Card,
    CardHeader,
    Badge,
    ProgressBar,
    PhaseBadge
  } = NS;
  const SANTE_COLOR = {
    success: 'var(--success)',
    warning: 'var(--warning)',
    danger: 'var(--danger)'
  };
  const SANTE_TINT = {
    success: 'var(--success-tint)',
    warning: 'var(--warning-tint)',
    danger: 'var(--danger-tint)'
  };
  const SANTE_LABEL = {
    success: 'Saine',
    warning: 'À surveiller',
    danger: 'Sous pression'
  };
  function pct(x) {
    return (x * 100).toFixed(1).replace('.', ',') + ' %';
  }
  function BigStat({
    label,
    value,
    tone,
    icon,
    sub
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '15px 17px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        color: 'var(--text-secondary)',
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: 'ti ti-' + icon,
      style: {
        fontSize: 15,
        color: 'var(--text-tertiary)'
      }
    }), label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 24,
        fontWeight: 600,
        letterSpacing: '-0.018em',
        color: tone ? SANTE_COLOR[tone] : 'var(--text-primary)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, value), sub ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--text-tertiary)',
        marginTop: 3
      }
    }, sub) : null);
  }

  /* ---- Page globale ---- */
  function CostingGlobal({
    onOpenProject
  }) {
    const DGd = window.DG;
    const g = DGd.costingGlobal();
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '22px 24px 40px',
        maxWidth: 1280
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: '-0.02em'
      }
    }, "Costing"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: 'var(--text-secondary)',
        marginTop: 3
      }
    }, "Sant\xE9 financi\xE8re de tous les projets actifs \xB7 ", g.rows.length, " projets")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gap: 10,
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement(BigStat, {
      icon: "trending-up",
      label: "Revenus totaux",
      value: DGd.formatMontantCourt(g.revenus),
      sub: "contrats + extras sign\xE9s"
    }), /*#__PURE__*/React.createElement(BigStat, {
      icon: "trending-down",
      label: "D\xE9penses",
      value: DGd.formatMontantCourt(g.depenses),
      sub: "budget engag\xE9"
    }), /*#__PURE__*/React.createElement(BigStat, {
      icon: "businessplan",
      label: "Profit projet\xE9",
      value: DGd.formatMontantCourt(g.profit),
      tone: g.sante
    }), /*#__PURE__*/React.createElement(BigStat, {
      icon: "percentage",
      label: "Marge moyenne",
      value: pct(g.marge),
      tone: g.sante,
      sub: SANTE_LABEL[g.sante]
    })), /*#__PURE__*/React.createElement(Card, {
      padding: false
    }, /*#__PURE__*/React.createElement(CardHeader, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-chart-bar"
      }),
      title: "Profitabilit\xE9 par projet"
    }), /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 12.5
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        background: 'var(--surface-subtle)',
        borderBottom: '1px solid var(--border)'
      }
    }, [['Projet', 'left'], ['Phase', 'left'], ['Revenus', 'right'], ['Dépenses', 'right'], ['Profit', 'right'], ['Marge', 'right'], ['Santé', 'left']].map((h, i) => /*#__PURE__*/React.createElement("th", {
      key: i,
      style: {
        textAlign: h[1],
        padding: '9px 14px',
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)',
        whiteSpace: 'nowrap'
      }
    }, h[0])))), /*#__PURE__*/React.createElement("tbody", null, g.rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
      key: r.id,
      onClick: () => onOpenProject && onOpenProject(r.id),
      style: {
        borderBottom: i === g.rows.length - 1 ? 'none' : '1px solid var(--divider)',
        cursor: 'pointer'
      },
      onMouseEnter: e => e.currentTarget.style.background = 'var(--surface-subtle)',
      onMouseLeave: e => e.currentTarget.style.background = 'transparent'
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600
      }
    }, r.projet), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--text-tertiary)'
      }
    }, r.client)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px'
      }
    }, /*#__PURE__*/React.createElement(PhaseBadge, {
      phase: r.phase
    })), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums'
      }
    }, DGd.formatMontant(r.revenus, 0)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
        color: 'var(--text-secondary)'
      }
    }, DGd.formatMontant(r.depenses, 0)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
        fontWeight: 600,
        color: SANTE_COLOR[r.sante]
      }
    }, DGd.formatMontant(r.profit, 0)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
        fontWeight: 600,
        color: SANTE_COLOR[r.sante]
      }
    }, pct(r.marge)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11.5,
        fontWeight: 500,
        color: SANTE_COLOR[r.sante]
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: SANTE_COLOR[r.sante]
      }
    }), SANTE_LABEL[r.sante]))))))));
  }

  /* ---- Onglet costing dans la page projet ---- */
  function CostingTab({
    projectId
  }) {
    const DGd = window.DG;
    const c = DGd.costing(projectId);
    if (!c) return null;
    const maxCat = Math.max(...c.cats.map(x => x.budget));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(BigStat, {
      icon: "trending-up",
      label: "Revenus",
      value: DGd.formatMontant(c.revenus, 0),
      sub: `contrat ${DGd.formatMontantCourt(c.revenusContrat)} + extras ${DGd.formatMontantCourt(c.revenusExtras)}`
    }), /*#__PURE__*/React.createElement(BigStat, {
      icon: "trending-down",
      label: "D\xE9penses (budget)",
      value: DGd.formatMontant(c.depensesTotal, 0),
      sub: `${DGd.formatMontant(c.depensesReel, 0)} engagé`
    }), /*#__PURE__*/React.createElement(BigStat, {
      icon: "businessplan",
      label: "Profit projet\xE9",
      value: DGd.formatMontant(c.profit, 0),
      tone: c.sante
    }), /*#__PURE__*/React.createElement(BigStat, {
      icon: "percentage",
      label: "Marge",
      value: pct(c.marge),
      tone: c.sante,
      sub: SANTE_LABEL[c.sante]
    })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 12,
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600
      }
    }, "D\xE9penses engag\xE9es"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-secondary)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, DGd.formatMontant(c.depensesReel, 0), " / ", DGd.formatMontant(c.depensesTotal, 0), " budget")), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 9,
        background: 'var(--n-100)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        width: Math.min(100, c.depensesReel / c.depensesTotal * 100) + '%',
        background: c.depensesReel > c.depensesTotal ? 'var(--danger)' : 'var(--success)',
        borderRadius: 'var(--radius-full)'
      }
    }))), /*#__PURE__*/React.createElement(Card, {
      padding: false
    }, /*#__PURE__*/React.createElement(CardHeader, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-list-details"
      }),
      title: "D\xE9penses par cat\xE9gorie",
      action: /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          color: 'var(--text-tertiary)'
        }
      }, "budget \xB7 engag\xE9 \xB7 \xE9cart")
    }), /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 12.5
      }
    }, /*#__PURE__*/React.createElement("tbody", null, c.cats.map((cat, i) => {
      const isMO = /Main/.test(cat.nom);
      return /*#__PURE__*/React.createElement("tr", {
        key: i,
        style: {
          borderBottom: i === c.cats.length - 1 ? 'none' : '1px solid var(--divider)',
          background: isMO ? 'var(--surface-subtle)' : 'transparent'
        }
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '9px 14px',
          width: 30
        }
      }, /*#__PURE__*/React.createElement("i", {
        className: 'ti ti-' + cat.icon,
        style: {
          fontSize: 16,
          color: isMO ? 'var(--info)' : 'var(--text-tertiary)'
        }
      })), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '9px 14px',
          fontWeight: isMO ? 600 : 500,
          whiteSpace: 'nowrap'
        }
      }, cat.nom, isMO ? /*#__PURE__*/React.createElement("span", {
        style: {
          marginLeft: 7
        }
      }, /*#__PURE__*/React.createElement(Badge, {
        tone: "info"
      }, "feuilles de temps")) : null), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '9px 14px',
          width: '34%'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          height: 6,
          background: 'var(--n-100)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          height: '100%',
          width: Math.round(cat.budget / maxCat * 100) + '%',
          background: isMO ? 'var(--info)' : 'var(--n-400)',
          borderRadius: 'var(--radius-full)'
        }
      }))), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '9px 14px',
          textAlign: 'right',
          fontVariantNumeric: 'tabular-nums',
          color: 'var(--text-secondary)',
          whiteSpace: 'nowrap'
        }
      }, DGd.formatMontant(cat.budget, 0)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '9px 14px',
          textAlign: 'right',
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 600,
          whiteSpace: 'nowrap'
        }
      }, DGd.formatMontant(cat.reel, 0)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '9px 14px',
          textAlign: 'right',
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap',
          color: cat.ecart > 0 ? 'var(--danger)' : 'var(--success-text)'
        }
      }, cat.ecart > 0 ? '+' : '', DGd.formatMontant(cat.ecart, 0)));
    })), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        borderTop: '2px solid var(--border)',
        background: 'var(--surface-subtle)'
      }
    }, /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        fontWeight: 700
      }
    }, "Total"), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
        fontWeight: 700,
        color: 'var(--text-secondary)'
      }
    }, DGd.formatMontant(c.depensesTotal, 0)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
        fontWeight: 700
      }
    }, DGd.formatMontant(c.depensesReel, 0)), /*#__PURE__*/React.createElement("td", null))))));
  }
  window.CostingGlobal = CostingGlobal;
  window.CostingTab = CostingTab;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/Costing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/Dashboard.jsx
try { (() => {
/* Écran 1 — Dashboard (la vue de Nicolas le matin) */
(function () {
  const DS = window.HabitationsDGDesignSystem_408490;
  const {
    MetricCard,
    Card,
    CardHeader,
    PhaseBadge,
    ProgressBar,
    Badge
  } = DS;
  function Row({
    children,
    onClick,
    last
  }) {
    const [h, setH] = React.useState(false);
    return /*#__PURE__*/React.createElement("div", {
      onClick: onClick,
      onMouseEnter: () => setH(true),
      onMouseLeave: () => setH(false),
      style: {
        borderBottom: last ? 'none' : '1px solid var(--divider)',
        background: h ? 'var(--surface-subtle)' : 'transparent',
        cursor: 'pointer',
        transition: 'background .1s'
      }
    }, children);
  }
  function Dashboard({
    onOpenProject
  }) {
    const DGd = window.DG;
    const agenda = DGd.semaineAgenda();
    const nbEtapes = agenda.reduce((s, j) => s + j.etapes.length, 0);
    const projets = DGd.projets;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '22px 24px 40px',
        maxWidth: 1180
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: '-0.02em'
      }
    }, "Bonjour Nicolas ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 400
      }
    }, "\uD83D\uDC4B")), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: 'var(--text-secondary)',
        marginTop: 3
      }
    }, DGd.jourLong(DGd.TODAY))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--text-tertiary)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        color: 'var(--text-primary)'
      }
    }, "7"), " projets actifs")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5,1fr)',
        gap: 10,
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement(MetricCard, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-building-community"
      }),
      label: "Projets actifs",
      value: "7",
      sub: "1 livraison ce mois"
    }), /*#__PURE__*/React.createElement(MetricCard, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-currency-dollar"
      }),
      label: "Valeur en chantier",
      value: "2,1 M$",
      sub: "valeur totale active",
      tone: "success"
    }), /*#__PURE__*/React.createElement(MetricCard, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-alert-triangle"
      }),
      label: "Alertes",
      value: "3",
      sub: "1 urgente",
      tone: "danger"
    }), /*#__PURE__*/React.createElement(MetricCard, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-receipt"
      }),
      label: "Extras non sign\xE9s",
      value: "4 800 $",
      sub: "4 \xE0 confirmer",
      tone: "warning"
    }), /*#__PURE__*/React.createElement(MetricCard, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-cash"
      }),
      label: "Paiements attendus",
      value: "187 500 $",
      sub: "\xE0 recevoir",
      tone: "info"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: 20,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: false
    }, /*#__PURE__*/React.createElement(CardHeader, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-bell",
        style: {
          color: 'var(--dg-red)'
        }
      }),
      title: "Alertes prioritaires",
      action: /*#__PURE__*/React.createElement(Badge, {
        tone: "danger"
      }, "3")
    }), DGd.alertes.map((a, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      last: i === DGd.alertes.length - 1,
      onClick: () => onOpenProject(a.projet)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '11px 14px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: a.type === 'urgent' ? 'var(--danger)' : 'var(--warning)',
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        fontWeight: 500
      }
    }, a.titre), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--text-tertiary)',
        marginTop: 1
      }
    }, a.sous)), /*#__PURE__*/React.createElement(Badge, {
      tone: a.type === 'urgent' ? 'danger' : 'warning',
      pill: true
    }, a.badge), /*#__PURE__*/React.createElement("i", {
      className: "ti ti-chevron-right",
      style: {
        fontSize: 15,
        color: 'var(--text-disabled)'
      }
    }))))), /*#__PURE__*/React.createElement(Card, {
      padding: false
    }, /*#__PURE__*/React.createElement(CardHeader, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-calendar-week",
        style: {
          color: 'var(--info)'
        }
      }),
      title: "Agenda de la semaine",
      action: /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          color: 'var(--text-tertiary)'
        }
      }, nbEtapes, " \xE9tapes")
    }), agenda.map((jour, ji) => /*#__PURE__*/React.createElement("div", {
      key: ji
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '6px 14px',
        background: 'var(--surface-subtle)',
        borderBottom: '1px solid var(--divider)',
        borderTop: ji > 0 ? '1px solid var(--divider)' : 'none',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text-secondary)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        textTransform: 'capitalize'
      }
    }, jour.label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 400,
        color: 'var(--text-tertiary)'
      }
    }, jour.etapes.length, " \xE9tape", jour.etapes.length > 1 ? 's' : '')), jour.etapes.map((e, ei) => /*#__PURE__*/React.createElement(Row, {
      key: ei,
      last: ei === jour.etapes.length - 1,
      onClick: () => onOpenProject(projets.find(p => p.adresse === e.projet)?.id)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 14px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 3,
        height: 30,
        borderRadius: 2,
        background: DGd.phase(e.phase).bar,
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        fontWeight: 500
      }
    }, e.nom), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--text-tertiary)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, e.projet, " \xB7 ", e.client)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 500,
        padding: '2px 7px',
        borderRadius: 'var(--radius-full)',
        background: e.assigneA === 'Interne' ? 'var(--n-100)' : 'var(--n-150)',
        color: 'var(--text-secondary)',
        whiteSpace: 'nowrap',
        flexShrink: 0
      }
    }, e.assigneA)))))))), /*#__PURE__*/React.createElement(Card, {
      padding: false
    }, /*#__PURE__*/React.createElement(CardHeader, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-list"
      }),
      title: "Tous les projets",
      action: /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          color: 'var(--text-tertiary)'
        }
      }, projets.length)
    }), projets.map((p, i) => {
      const jr = DGd.joursRestants(p.dateLivraison);
      const next = DGd.prochaineEtape(p);
      return /*#__PURE__*/React.createElement(Row, {
        key: p.id,
        last: i === projets.length - 1,
        onClick: () => onOpenProject(p.id)
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          padding: '11px 14px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12.5,
          fontWeight: 500,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, p.client), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: 'var(--text-tertiary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, p.adresse), next && p.avancement > 0 && p.avancement < 100 ? /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: 'var(--text-secondary)',
          marginTop: 2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, "\u21B3 ", next.nom) : null, /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 6
        }
      }, /*#__PURE__*/React.createElement(ProgressBar, {
        value: p.avancement,
        phase: p.phase
      }))), /*#__PURE__*/React.createElement("div", {
        style: {
          textAlign: 'right',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 3
        }
      }, /*#__PURE__*/React.createElement(PhaseBadge, {
        phase: p.phase
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          color: 'var(--text-tertiary)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, p.avancement, "%"), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          fontWeight: 500,
          color: jr <= 14 ? 'var(--danger)' : 'var(--success-text)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, jr, " j"))));
    }))));
  }
  window.Dashboard = Dashboard;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/FeuillesTemps.jsx
try { (() => {
/* Écran — Feuilles de temps : Consultation · Saisie (grille hebdo) · Employés. */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const {
    SegmentedControl,
    Badge,
    Avatar,
    Card,
    CardHeader,
    Button
  } = NS;
  const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
  function heuresColor(total, max) {
    if (total > max) return 'var(--danger)';
    if (total >= max - 2) return 'var(--success)';
    if (total === 0) return 'var(--text-disabled)';
    return 'var(--warning)';
  }
  function FeuillesTemps() {
    const DGd = window.DG;
    const [tab, setTab] = React.useState('saisie');
    const rows = DGd.feuillesSemaine();
    const jours = DGd.semaineCourante();
    const totalSemaine = rows.reduce((s, r) => s + r.total, 0);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '22px 24px 40px',
        maxWidth: 1180
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 18,
        gap: 14,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: '-0.02em'
      }
    }, "Feuilles de temps"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: 'var(--text-secondary)',
        marginTop: 3
      }
    }, "Semaine du ", DGd.dateCourt(jours[0]), " au ", DGd.dateCourt(jours[4]), " ", jours[4].getFullYear(), " \xB7 ", totalSemaine.toLocaleString('fr-CA').replace('.', ','), " h saisies")), /*#__PURE__*/React.createElement(SegmentedControl, {
      value: tab,
      onChange: setTab,
      options: [{
        value: 'consult',
        label: 'Consultation',
        icon: 'table'
      }, {
        value: 'saisie',
        label: 'Saisie',
        icon: 'edit'
      }, {
        value: 'employes',
        label: 'Employés',
        icon: 'users'
      }]
    })), tab === 'saisie' ? /*#__PURE__*/React.createElement(Card, {
      padding: false
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        background: 'var(--surface-subtle)',
        borderBottom: '1px solid var(--border)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: navBtn
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-chevron-left"
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600
      }
    }, "Semaine du ", DGd.dateCourt(jours[0]), " ", jours[0].getFullYear()), /*#__PURE__*/React.createElement("button", {
      style: navBtn
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-chevron-right"
    }))), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "primary",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-device-floppy"
      })
    }, "Enregistrer")), /*#__PURE__*/React.createElement("div", {
      style: {
        overflowX: 'auto'
      }
    }, /*#__PURE__*/React.createElement("table", {
      style: {
        borderCollapse: 'collapse',
        width: '100%',
        minWidth: 820,
        fontSize: 12.5
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        borderBottom: '1px solid var(--border)'
      }
    }, /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: 'left',
        padding: '8px 14px',
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)'
      }
    }, "Employ\xE9"), /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: 'left',
        padding: '8px 14px',
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)'
      }
    }, "Projet"), jours.map((j, i) => /*#__PURE__*/React.createElement("th", {
      key: i,
      style: {
        textAlign: 'center',
        padding: '8px 6px',
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
        color: 'var(--text-tertiary)',
        minWidth: 64
      }
    }, JOURS[i], /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        fontWeight: 400,
        color: 'var(--text-disabled)'
      }
    }, j.getDate()))), /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: 'center',
        padding: '8px 12px',
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
        color: 'var(--text-tertiary)'
      }
    }, "Total"))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, ri) => /*#__PURE__*/React.createElement("tr", {
      key: r.id,
      style: {
        borderBottom: ri === rows.length - 1 ? 'none' : '1px solid var(--divider)'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '7px 14px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: r.nom,
      size: "sm"
    }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        display: 'block',
        whiteSpace: 'nowrap'
      }
    }, r.nom), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10.5,
        color: 'var(--text-tertiary)'
      }
    }, r.role)))), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '7px 14px'
      }
    }, r.projet === '—' ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-disabled)'
      }
    }, "\u2014") : /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, DGd.projets.find(p => p.id === r.projet)?.adresse.replace(/^\d+\s/, '') || r.projet)), r.heures.map((h, hi) => /*#__PURE__*/React.createElement("td", {
      key: hi,
      style: {
        padding: '5px 6px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("input", {
      defaultValue: h === 0 ? '' : h.toString().replace('.', ','),
      placeholder: "\u2014",
      style: {
        width: 46,
        height: 28,
        textAlign: 'center',
        fontSize: 12.5,
        fontVariantNumeric: 'tabular-nums',
        border: '1px solid var(--border)',
        borderRadius: 6,
        background: h === 0 ? 'var(--surface-subtle)' : 'var(--surface)',
        fontFamily: 'var(--font-sans)',
        color: 'var(--text-primary)'
      }
    }))), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '7px 12px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
        color: heuresColor(r.total, r.max)
      }
    }, r.depasse ? /*#__PURE__*/React.createElement("i", {
      className: "ti ti-alert-triangle",
      style: {
        fontSize: 13
      }
    }) : null, r.total.toString().replace('.', ','), " h"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9.5,
        color: 'var(--text-disabled)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, "/ ", r.max.toString().replace('.', ','), " max"))))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 16,
        padding: '9px 14px',
        borderTop: '1px solid var(--border)',
        background: 'var(--surface-subtle)',
        fontSize: 11,
        color: 'var(--text-secondary)',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Lg, {
      c: "var(--success)",
      t: "Semaine compl\xE8te (\u2248 36,5 h)"
    }), /*#__PURE__*/React.createElement(Lg, {
      c: "var(--warning)",
      t: "Sous le maximum"
    }), /*#__PURE__*/React.createElement(Lg, {
      c: "var(--danger)",
      t: "D\xE9passement > 36,5 h"
    }))) : null, tab === 'consult' ? /*#__PURE__*/React.createElement(Card, {
      padding: false
    }, /*#__PURE__*/React.createElement(CardHeader, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-table"
      }),
      title: "Heures de la semaine",
      action: /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          color: 'var(--text-tertiary)'
        }
      }, rows.length, " employ\xE9s")
    }), /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 12.5
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        background: 'var(--surface-subtle)',
        borderBottom: '1px solid var(--border)'
      }
    }, [['Employé', 'left'], ['Projet', 'left'], ['Heures', 'right'], ['Taux', 'right'], ['Coût main-d\u2019œuvre', 'right'], ['Statut', 'left']].map((h, i) => /*#__PURE__*/React.createElement("th", {
      key: i,
      style: {
        textAlign: h[1],
        padding: '9px 14px',
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)',
        whiteSpace: 'nowrap'
      }
    }, h[0])))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
      key: r.id,
      style: {
        borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--divider)'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: r.nom,
      size: "sm"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600
      }
    }, r.nom))), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px'
      }
    }, r.projet === '—' ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-disabled)'
      }
    }, "\u2014") : /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, DGd.projets.find(p => p.id === r.projet)?.adresse.replace(/^\d+\s/, '') || r.projet)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        textAlign: 'right',
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
        color: heuresColor(r.total, r.max)
      }
    }, r.total.toString().replace('.', ','), " h"), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
        color: 'var(--text-secondary)'
      }
    }, DGd.formatMontant(r.taux)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
        fontWeight: 600
      }
    }, DGd.formatMontant(r.total * r.taux)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px'
      }
    }, r.depasse ? /*#__PURE__*/React.createElement(Badge, {
      tone: "danger",
      dot: true
    }, "D\xE9passement") : r.sousMax ? /*#__PURE__*/React.createElement(Badge, {
      tone: "warning"
    }, "Sous max") : /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      dot: true
    }, "Compl\xE8te"))))))) : null, tab === 'employes' ? /*#__PURE__*/React.createElement(Card, {
      padding: false
    }, /*#__PURE__*/React.createElement(CardHeader, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-users"
      }),
      title: "Employ\xE9s",
      action: /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        variant: "outline",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "ti ti-plus"
        })
      }, "Ajouter")
    }), /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 12.5
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        background: 'var(--surface-subtle)',
        borderBottom: '1px solid var(--border)'
      }
    }, [['Employé', 'left'], ['Rôle', 'left'], ['Taux horaire', 'right'], ['Max hebdo', 'right'], ['Statut', 'left']].map((h, i) => /*#__PURE__*/React.createElement("th", {
      key: i,
      style: {
        textAlign: h[1],
        padding: '9px 14px',
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)',
        whiteSpace: 'nowrap'
      }
    }, h[0])))), /*#__PURE__*/React.createElement("tbody", null, DGd.EMPLOYES.map((e, i) => /*#__PURE__*/React.createElement("tr", {
      key: e.id,
      style: {
        borderBottom: i === DGd.EMPLOYES.length - 1 ? 'none' : '1px solid var(--divider)',
        opacity: e.actif ? 1 : 0.55
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: e.nom,
      size: "sm"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600
      }
    }, e.nom))), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        color: 'var(--text-secondary)'
      }
    }, e.role), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums'
      }
    }, DGd.formatMontant(e.taux)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
        color: 'var(--text-secondary)'
      }
    }, e.max.toString().replace('.', ','), " h"), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px'
      }
    }, e.actif ? /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      dot: true
    }, "Actif") : /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, "Inactif"))))))) : null);
  }
  function Lg({
    c,
    t
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 9,
        height: 9,
        borderRadius: 2,
        background: c
      }
    }), t);
  }
  const navBtn = {
    width: 26,
    height: 26,
    border: '1px solid var(--border)',
    borderRadius: 6,
    background: 'var(--surface)',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15
  };
  window.FeuillesTemps = FeuillesTemps;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/FeuillesTemps.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/GanttView.jsx
try { (() => {
/* Cédule — vue Gantt (consultation) + tableau « Détail des étapes ». */
(function () {
  const DS = window.HabitationsDGDesignSystem_408490;
  const {
    StatusDot,
    Badge
  } = DS;
  const STATUT_COLOR = {
    termine: 'var(--task-termine)',
    encours: 'var(--task-encours)',
    demain: 'var(--task-demain)',
    avenir: 'var(--task-avenir)'
  };
  const STATUT_LABEL = {
    termine: 'Terminé',
    encours: 'En cours',
    demain: 'Demain',
    avenir: 'À venir'
  };
  const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juill.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  function buildColumns(minDate, maxDate) {
    const cols = [];
    let cur = new Date(minDate);
    cur.setHours(0, 0, 0, 0);
    const end = new Date(maxDate);
    end.setHours(0, 0, 0, 0);
    while (cur <= end) {
      const w = cur.getDay();
      if (w !== 0 && w !== 6) cols.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return cols;
  }
  function GanttView({
    etapes
  }) {
    const DGd = window.DG;
    const COLW = 26,
      ROWH = 38,
      LABELW = 248;
    const minDate = etapes[0].dateDebut;
    const maxDate = etapes[etapes.length - 1].dateFin;
    const cols = React.useMemo(() => buildColumns(minDate, maxDate), [etapes]);
    const idxOf = d => {
      const t = new Date(d);
      t.setHours(0, 0, 0, 0);
      for (let i = 0; i < cols.length; i++) if (cols[i].getTime() === t.getTime()) return i; // nearest working day fallback
      for (let i = 0; i < cols.length; i++) if (cols[i] >= t) return i;
      return cols.length - 1;
    };
    const todayIdx = (() => {
      const t = DGd.TODAY;
      for (let i = 0; i < cols.length; i++) if (cols[i].getTime() === t.getTime()) return i;
      for (let i = 0; i < cols.length; i++) if (cols[i] > t) return i - 0.5;
      return -1;
    })();

    // week tint groups (alternate by ISO week)
    const colTint = cols.map(d => {
      const onejan = new Date(d.getFullYear(), 0, 1);
      const wk = Math.ceil(((d - onejan) / 86400000 + onejan.getDay() + 1) / 7);
      return wk % 2 === 0;
    });
    // month header spans
    const monthSpans = [];
    cols.forEach((d, i) => {
      const last = monthSpans[monthSpans.length - 1];
      if (last && last.m === d.getMonth()) last.span++;else monthSpans.push({
        m: d.getMonth(),
        y: d.getFullYear(),
        span: 1
      });
    });
    const gridW = cols.length * COLW;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: 'var(--surface)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        overflowX: 'auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: LABELW + gridW
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: LABELW,
        flexShrink: 0,
        borderRight: '1px solid var(--border)',
        padding: '7px 12px',
        display: 'flex',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "dg-eyebrow"
    }, "\xC9tapes \xB7 ", etapes.length)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex'
      }
    }, monthSpans.map((ms, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: ms.span * COLW,
        borderRight: '1px solid var(--border)',
        padding: '6px 8px',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text-secondary)',
        textTransform: 'capitalize',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
      }
    }, MOIS[ms.m])))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        borderBottom: '1px solid var(--border)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: LABELW,
        flexShrink: 0,
        borderRight: '1px solid var(--border)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        position: 'relative'
      }
    }, cols.map((d, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: COLW,
        borderRight: '1px solid var(--divider)',
        padding: '3px 0',
        fontSize: 9.5,
        textAlign: 'center',
        color: d.getTime() === DGd.TODAY.getTime() ? 'var(--dg-red)' : 'var(--text-tertiary)',
        fontWeight: d.getTime() === DGd.TODAY.getTime() ? 700 : 400,
        background: colTint[i] ? 'var(--n-50)' : 'transparent',
        fontVariantNumeric: 'tabular-nums'
      }
    }, d.getDate())))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, todayIdx >= 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: LABELW + todayIdx * COLW + COLW / 2,
        width: 2,
        background: 'var(--task-today-line)',
        zIndex: 5,
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: -1,
        left: -19,
        fontSize: 8,
        fontWeight: 700,
        color: '#fff',
        background: 'var(--task-today-line)',
        padding: '1px 4px',
        borderRadius: 3,
        whiteSpace: 'nowrap'
      }
    }, "auj.")) : null, etapes.map((e, i) => {
      const start = idxOf(e.dateDebut);
      const span = Math.max(1, DGd.joursOuvrableEntre(e.dateDebut, e.dateFin));
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          height: ROWH,
          borderBottom: i === etapes.length - 1 ? 'none' : '1px solid var(--divider)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: LABELW,
          flexShrink: 0,
          borderRight: '1px solid var(--border)',
          padding: '0 12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'var(--surface)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          fontWeight: 500,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--text-tertiary)',
          fontVariantNumeric: 'tabular-nums',
          marginRight: 5
        }
      }, e.ordre, "."), e.nom), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          color: 'var(--text-tertiary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, e.jours, "j ouvr.", e.assigneA !== 'Interne' ? ' · ' + e.assigneA : '')), /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative',
          display: 'flex'
        }
      }, cols.map((d, ci) => /*#__PURE__*/React.createElement("div", {
        key: ci,
        style: {
          width: COLW,
          borderRight: '1px solid var(--divider)',
          background: colTint[ci] ? 'var(--n-50)' : 'transparent'
        }
      })), /*#__PURE__*/React.createElement("div", {
        title: STATUT_LABEL[e.statut],
        style: {
          position: 'absolute',
          left: start * COLW + 2,
          width: span * COLW - 4,
          height: 18,
          top: (ROWH - 18) / 2,
          borderRadius: 5,
          background: STATUT_COLOR[e.statut],
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 6,
          zIndex: 2
        }
      }, span >= 3 ? /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 9,
          fontWeight: 600,
          color: '#fff',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }
      }, e.assigneA !== 'Interne' ? e.assigneA : e.nom) : null)));
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        padding: '9px 14px',
        borderTop: '1px solid var(--border)',
        background: 'var(--surface-subtle)',
        flexWrap: 'wrap'
      }
    }, ['termine', 'encours', 'demain', 'avenir'].map(s => /*#__PURE__*/React.createElement("span", {
      key: s,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        color: 'var(--text-secondary)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 11,
        height: 11,
        borderRadius: 3,
        background: STATUT_COLOR[s]
      }
    }), STATUT_LABEL[s])), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        color: 'var(--text-secondary)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 2,
        height: 13,
        background: 'var(--task-today-line)'
      }
    }), "Aujourd'hui")));
  }

  /* Tableau « Détail des étapes » */
  function DetailTable({
    etapes
  }) {
    const DGd = window.DG;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: 'var(--surface)'
      }
    }, /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 12
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        background: 'var(--surface-subtle)',
        borderBottom: '1px solid var(--border)'
      }
    }, ['N°', 'Étape', 'Début', 'Fin', 'Durée', 'Assigné', 'Visible client', ''].map((h, i) => /*#__PURE__*/React.createElement("th", {
      key: i,
      style: {
        textAlign: i >= 4 && i < 5 ? 'center' : i === 6 ? 'center' : 'left',
        padding: '8px 12px',
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)',
        whiteSpace: 'nowrap'
      }
    }, h)))), /*#__PURE__*/React.createElement("tbody", null, etapes.map((e, i) => /*#__PURE__*/React.createElement("tr", {
      key: i,
      style: {
        borderBottom: i === etapes.length - 1 ? 'none' : '1px solid var(--divider)',
        background: i % 2 ? 'var(--surface)' : 'var(--n-25)'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 12px',
        color: 'var(--text-tertiary)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, e.ordre), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 12px',
        fontWeight: 500
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7
      }
    }, /*#__PURE__*/React.createElement(StatusDot, {
      status: e.statut,
      pulse: e.statut === 'encours'
    }), e.nom)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 12px',
        color: 'var(--text-secondary)',
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap'
      }
    }, DGd.dateCourt(e.dateDebut)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 12px',
        color: 'var(--text-secondary)',
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap'
      }
    }, DGd.dateCourt(e.dateFin)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 12px',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, e.jours, "j"), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 12px'
      }
    }, e.assigneA === 'Interne' ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-tertiary)'
      }
    }, "Interne") : /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, e.assigneA)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 12px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: 'ti ti-' + (e.visibleClient ? 'eye' : 'eye-off'),
      style: {
        fontSize: 15,
        color: e.visibleClient ? 'var(--success)' : 'var(--text-disabled)'
      }
    })), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 12px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-dots",
      style: {
        fontSize: 15,
        color: 'var(--text-disabled)'
      }
    })))))));
  }
  window.GanttView = GanttView;
  window.DetailTable = DetailTable;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/GanttView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/GcrTab.jsx
try { (() => {
/* Onglet GCR (page projet) : checklist administrative, 3 inspections, journal. */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const {
    Card,
    CardHeader,
    Badge,
    ProgressBar
  } = NS;
  const INSP_STATUT = {
    PLANIFIE: {
      label: 'Planifiée',
      tone: 'info',
      icon: 'calendar-check'
    },
    FAIT: {
      label: 'Complétée',
      tone: 'success',
      icon: 'circle-check'
    },
    A_VENIR: {
      label: 'À venir',
      tone: 'neutral',
      icon: 'clock'
    }
  };
  function GcrTab({
    projectId
  }) {
    const DGd = window.DG;
    const g = DGd.gcr(projectId);
    if (!g) return null;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.3fr 1fr',
        gap: 16,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: false
    }, /*#__PURE__*/React.createElement(CardHeader, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-clipboard-check",
        style: {
          color: 'var(--success)'
        }
      }),
      title: "Checklist administrative GCR",
      action: /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text-secondary)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, g.done, "/", g.total)
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 14px 4px'
      }
    }, /*#__PURE__*/React.createElement(ProgressBar, {
      value: Math.round(g.done / g.total * 100),
      color: "var(--success)",
      height: 5
    })), g.checklist.map((c, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 14px',
        borderBottom: i === g.checklist.length - 1 ? 'none' : '1px solid var(--divider)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 19,
        height: 19,
        borderRadius: 5,
        flexShrink: 0,
        background: c.fait ? 'var(--success)' : 'var(--surface)',
        border: c.fait ? 'none' : '1.5px solid var(--border-strong)',
        color: '#fff'
      }
    }, c.fait ? /*#__PURE__*/React.createElement("i", {
      className: "ti ti-check",
      style: {
        fontSize: 13
      }
    }) : null), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 500,
        color: c.fait ? 'var(--text-primary)' : 'var(--text-secondary)'
      }
    }, c.label), !c.fait ? /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, "\xC0 faire")) : null))), /*#__PURE__*/React.createElement(Card, {
      padding: false
    }, /*#__PURE__*/React.createElement(CardHeader, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-shield-check",
        style: {
          color: 'var(--info)'
        }
      }),
      title: "Inspections"
    }), g.inspections.map((ins, i) => {
      const st = INSP_STATUT[ins.statut];
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 14px',
          borderBottom: i === g.inspections.length - 1 ? 'none' : '1px solid var(--divider)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 34,
          height: 34,
          borderRadius: 'var(--radius-md)',
          background: 'var(--surface-subtle)',
          border: '1px solid var(--border)',
          color: 'var(--text-tertiary)',
          flexShrink: 0
        }
      }, /*#__PURE__*/React.createElement("i", {
        className: 'ti ti-' + st.icon,
        style: {
          fontSize: 17
        }
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13,
          fontWeight: 600
        }
      }, ins.nom), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: 'var(--text-tertiary)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, DGd.dateLong(ins.date), " \xB7 ", ins.insp)), /*#__PURE__*/React.createElement(Badge, {
        tone: st.tone,
        dot: ins.statut !== 'A_VENIR'
      }, st.label));
    }))), /*#__PURE__*/React.createElement(Card, {
      padding: false
    }, /*#__PURE__*/React.createElement(CardHeader, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-history"
      }),
      title: "Journal d'activit\xE9"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '4px 0'
      }
    }, DGd.JOURNAL.slice(0, 6).map((j, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        gap: 10,
        padding: '10px 14px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 26,
        height: 26,
        borderRadius: '50%',
        background: 'var(--surface-subtle)',
        border: '1px solid var(--border)',
        color: 'var(--text-tertiary)',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: 'ti ti-' + j.icon,
      style: {
        fontSize: 14
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        lineHeight: 1.45
      }
    }, /*#__PURE__*/React.createElement("b", {
      style: {
        fontWeight: 600
      }
    }, j.qui), " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-secondary)'
      }
    }, j.action)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        color: 'var(--text-tertiary)',
        marginTop: 1
      }
    }, j.quand)))))));
  }
  window.GcrTab = GcrTab;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/GcrTab.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/MobileViews.jsx
try { (() => {
/* Écran — Vue mobile : dashboard + page projet adaptés (Nicolas dans son camion). */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const {
    MetricCard,
    PhaseBadge,
    ProgressBar,
    Badge,
    StatusDot,
    SegmentedControl
  } = NS;
  function Phone({
    children,
    title
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: 380,
        maxWidth: '100%',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)',
        marginBottom: 10,
        textAlign: 'center'
      }
    }, title), /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: 720,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }
    }, children));
  }

  // Mobile top bar with hamburger (collapsed sidebar)
  function TopBar({
    title
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 14px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: {
        width: 32,
        height: 32,
        border: '1px solid var(--border)',
        borderRadius: 8,
        background: 'var(--surface)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        fontSize: 18
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-menu-2"
    })), /*#__PURE__*/React.createElement("img", {
      src: "../../assets/habitationsdg-icon.svg",
      alt: "DG",
      style: {
        height: 22
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        flex: 1
      }
    }, title), /*#__PURE__*/React.createElement("button", {
      style: {
        width: 32,
        height: 32,
        border: 'none',
        background: 'transparent',
        color: 'var(--text-secondary)',
        fontSize: 19,
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-bell"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 4,
        right: 5,
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: 'var(--danger)',
        border: '1.5px solid var(--surface)'
      }
    })));
  }
  // Bottom tab bar
  function BottomBar({
    active
  }) {
    const items = [['Accueil', 'home'], ['Projets', 'building-community'], ['Carte', 'map-2'], ['Plus', 'dots']];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        borderTop: '1px solid var(--border)',
        flexShrink: 0,
        background: 'var(--surface)'
      }
    }, items.map(([l, ic], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        padding: '8px 0',
        color: i === active ? 'var(--dg-red)' : 'var(--text-tertiary)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: 'ti ti-' + ic,
      style: {
        fontSize: 20
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9.5,
        fontWeight: i === active ? 600 : 500
      }
    }, l))));
  }
  function MobileViews() {
    const DGd = window.DG;
    const pj = DGd.projets.find(p => p.id === 'p7');
    const sched = DGd.buildSchedule(pj.dateLivraison);
    const jr = DGd.joursRestants(pj.dateLivraison);
    const next = DGd.prochaineEtape(pj);
    const [ptab, setPtab] = React.useState('apercu');
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '22px 24px 40px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: '-0.02em'
      }
    }, "Vue mobile"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: 'var(--text-secondary)',
        marginTop: 3
      }
    }, "Nicolas consulte sur son t\xE9l\xE9phone dans son camion \u2014 sidebar repli\xE9e en barre du bas, m\xE9triques empil\xE9es, Gantt remplac\xE9 par une liste d'\xE9tapes scrollable.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 28,
        flexWrap: 'wrap',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Phone, {
      title: "Dashboard"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Bonjour Nicolas"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflowY: 'auto',
        padding: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--text-tertiary)',
        marginBottom: 10
      }
    }, DGd.jourLong(DGd.TODAY)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement(MetricCard, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-building-community"
      }),
      label: "Projets actifs",
      value: "7"
    }), /*#__PURE__*/React.createElement(MetricCard, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-alert-triangle"
      }),
      label: "Alertes",
      value: "3",
      sub: "1 urgente",
      tone: "danger"
    }), /*#__PURE__*/React.createElement(MetricCard, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-currency-dollar"
      }),
      label: "En chantier",
      value: "2,1 M$",
      tone: "success"
    }), /*#__PURE__*/React.createElement(MetricCard, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-cash"
      }),
      label: "\xC0 recevoir",
      value: "187 k$",
      tone: "info"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)',
        margin: '4px 0 8px'
      }
    }, "Alertes prioritaires"), /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden'
      }
    }, DGd.alertes.map((a, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderBottom: i === DGd.alertes.length - 1 ? 'none' : '1px solid var(--divider)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: a.type === 'urgent' ? 'var(--danger)' : 'var(--warning)',
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        fontWeight: 500
      }
    }, a.titre), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        color: 'var(--text-tertiary)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, a.sous))))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)',
        margin: '16px 0 8px'
      }
    }, "Projets"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, DGd.projets.slice(0, 4).map(p => /*#__PURE__*/React.createElement("div", {
      key: p.id,
      style: {
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 12px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, p.client), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        color: 'var(--text-tertiary)'
      }
    }, p.adresse)), /*#__PURE__*/React.createElement(PhaseBadge, {
      phase: p.phase
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement(ProgressBar, {
      value: p.avancement,
      phase: p.phase
    })))))), /*#__PURE__*/React.createElement(BottomBar, {
      active: 0
    })), /*#__PURE__*/React.createElement(Phone, {
      title: "Page projet"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Projet"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflowY: 'auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '14px 14px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: 18,
        fontWeight: 600,
        letterSpacing: '-0.01em'
      }
    }, pj.adresse), /*#__PURE__*/React.createElement(PhaseBadge, {
      phase: pj.phase
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--text-secondary)',
        marginTop: 3
      }
    }, pj.ville, " \xB7 ", pj.client), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 1,
        background: 'var(--border)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        margin: '14px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--surface)',
        padding: '10px 12px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: mLbl
    }, "Avancement"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 18,
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums'
      }
    }, pj.avancement, "%")), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--surface)',
        padding: '10px 12px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: mLbl
    }, "Livraison"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: jr <= 14 ? 'var(--danger)' : 'var(--text-primary)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, jr, " j")))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 14px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        gap: 2,
        overflowX: 'auto'
      }
    }, [['apercu', 'Aperçu'], ['cedule', 'Cédule'], ['extras', 'Extras'], ['paiements', 'Paiements']].map(([id, l]) => /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => setPtab(id),
      style: {
        padding: '8px 10px',
        fontSize: 12.5,
        fontWeight: ptab === id ? 600 : 500,
        color: ptab === id ? 'var(--text-primary)' : 'var(--text-secondary)',
        background: 'none',
        border: 'none',
        borderBottom: ptab === id ? '2px solid var(--accent)' : '2px solid transparent',
        marginBottom: -1,
        whiteSpace: 'nowrap',
        cursor: 'pointer'
      }
    }, l)))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 14
      }
    }, ptab === 'cedule' || ptab === 'apercu' ? /*#__PURE__*/React.createElement(React.Fragment, null, ptab === 'apercu' ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 12px',
        marginBottom: 12,
        background: 'var(--info-tint)',
        borderRadius: 'var(--radius-md)',
        fontSize: 12
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-arrow-right",
      style: {
        color: 'var(--info)'
      }
    }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-tertiary)'
      }
    }, "Prochaine :"), " ", /*#__PURE__*/React.createElement("b", null, next.nom))) : null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)',
        marginBottom: 8
      }
    }, "\xC9tapes ", ptab === 'apercu' ? 'récentes' : '(liste)'), /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden'
      }
    }, sched.filter(e => e.statut !== 'avenir' || e.ordre <= 32).slice(26, 34).map((e, i, arr) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '9px 12px',
        borderBottom: i === arr.length - 1 ? 'none' : '1px solid var(--divider)'
      }
    }, /*#__PURE__*/React.createElement(StatusDot, {
      status: e.statut,
      pulse: e.statut === 'encours'
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        fontWeight: 500
      }
    }, e.ordre, ". ", e.nom), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        color: 'var(--text-tertiary)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, DGd.dateCourt(e.dateDebut), " \u2013 ", DGd.dateCourt(e.dateFin), " \xB7 ", e.assigneA))))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--text-tertiary)',
        textAlign: 'center',
        marginTop: 10
      }
    }, "Le Gantt complet est disponible sur ordinateur")) : /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: 'var(--text-tertiary)',
        textAlign: 'center',
        padding: '30px 0'
      }
    }, "Contenu \xAB ", ptab, " \xBB"))), /*#__PURE__*/React.createElement(BottomBar, {
      active: 1
    }))));
  }
  const mLbl = {
    fontSize: 9.5,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--text-tertiary)',
    marginBottom: 3
  };
  window.MobileViews = MobileViews;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/MobileViews.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/Parametres.jsx
try { (() => {
/* Écran — Paramètres : onglets selon rôle (Général, Mon compte, Utilisateurs) + Journal. */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const {
    Card,
    CardHeader,
    Badge,
    Avatar,
    Toggle,
    Button,
    Input,
    Tabs
  } = NS;
  function Row({
    label,
    hint,
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '13px 0',
        borderBottom: '1px solid var(--divider)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 500
      }
    }, label), hint ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: 'var(--text-tertiary)',
        marginTop: 2
      }
    }, hint) : null), /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0
      }
    }, children));
  }
  function Parametres() {
    const DGd = window.DG;
    const [tab, setTab] = React.useState('general');
    const [t1, setT1] = React.useState(true),
      [t2, setT2] = React.useState(true),
      [t3, setT3] = React.useState(false);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '22px 24px 40px',
        maxWidth: 900
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: '-0.02em'
      }
    }, "Param\xE8tres"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: 'var(--text-secondary)',
        marginTop: 3
      }
    }, "Connect\xE9 comme ", /*#__PURE__*/React.createElement("b", null, "Nicolas Savard"), " \xB7 ", /*#__PURE__*/React.createElement(Badge, {
      tone: "danger"
    }, "Admin"))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      tabs: [{
        id: 'general',
        label: 'Général'
      }, {
        id: 'compte',
        label: 'Mon compte'
      }, {
        id: 'users',
        label: 'Utilisateurs',
        count: DGd.UTILISATEURS.length
      }, {
        id: 'journal',
        label: "Journal d'activité"
      }]
    })), tab === 'general' ? /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        marginBottom: 4
      }
    }, "Pr\xE9f\xE9rences g\xE9n\xE9rales"), /*#__PURE__*/React.createElement(Row, {
      label: "Notifications par courriel",
      hint: "Recevoir un courriel pour les alertes urgentes (livraison, retard de paiement)."
    }, /*#__PURE__*/React.createElement(Toggle, {
      checked: t1,
      onChange: setT1
    })), /*#__PURE__*/React.createElement(Row, {
      label: "Recalcul automatique de la c\xE9dule",
      hint: "D\xE9caler les \xE9tapes suivantes en cascade quand une date change."
    }, /*#__PURE__*/React.createElement(Toggle, {
      checked: t2,
      onChange: setT2
    })), /*#__PURE__*/React.createElement(Row, {
      label: "Afficher les montants en vue compacte",
      hint: "Ex. \xAB 2,1 M$ \xBB plut\xF4t que \xAB 2 100 000,00 $ \xBB sur le dashboard."
    }, /*#__PURE__*/React.createElement(Toggle, {
      checked: t3,
      onChange: setT3
    })), /*#__PURE__*/React.createElement(Row, {
      label: "Jours ouvrables",
      hint: "Base de calcul des dur\xE9es d'\xE9tapes."
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: 'var(--text-secondary)'
      }
    }, "Lundi \u2192 Vendredi")), /*#__PURE__*/React.createElement("div", {
      style: {
        paddingTop: 14
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-device-floppy"
      })
    }, "Enregistrer"))) : null, tab === 'compte' ? /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: "Nicolas Savard",
      size: "lg"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600
      }
    }, "Nicolas Savard"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--text-tertiary)'
      }
    }, "Directeur des op\xE9rations"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Nom complet",
      defaultValue: "Nicolas Savard"
    }), /*#__PURE__*/React.createElement(Input, {
      label: "Courriel",
      defaultValue: "nicolas.savard@habitationsdg.com"
    }), /*#__PURE__*/React.createElement(Input, {
      label: "T\xE9l\xE9phone",
      defaultValue: "418 555-0117"
    }), /*#__PURE__*/React.createElement(Input, {
      label: "R\xF4le",
      defaultValue: "Directeur des op\xE9rations",
      disabled: true
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        paddingTop: 18,
        marginTop: 4,
        borderTop: '1px solid var(--divider)'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-device-floppy"
      })
    }, "Enregistrer"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-key"
      })
    }, "Changer le mot de passe"))) : null, tab === 'users' ? /*#__PURE__*/React.createElement(Card, {
      padding: false
    }, /*#__PURE__*/React.createElement(CardHeader, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-users"
      }),
      title: "Utilisateurs",
      action: /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        variant: "outline",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "ti ti-plus"
        })
      }, "Inviter")
    }), /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 12.5
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        background: 'var(--surface-subtle)',
        borderBottom: '1px solid var(--border)'
      }
    }, [['Utilisateur', 'left'], ['Rôle', 'left'], ['Courriel', 'left'], ['Statut', 'left'], ['', 'right']].map((h, i) => /*#__PURE__*/React.createElement("th", {
      key: i,
      style: {
        textAlign: h[1],
        padding: '9px 14px',
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)',
        whiteSpace: 'nowrap'
      }
    }, h[0])))), /*#__PURE__*/React.createElement("tbody", null, DGd.UTILISATEURS.map((u, i) => /*#__PURE__*/React.createElement("tr", {
      key: u.id,
      style: {
        borderBottom: i === DGd.UTILISATEURS.length - 1 ? 'none' : '1px solid var(--divider)'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: u.nom,
      size: "sm"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600
      }
    }, u.nom))), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: DGd.ROLE_TINT[u.role]
    }, u.roleLabel)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        color: 'var(--text-secondary)'
      }
    }, u.courriel), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px'
      }
    }, u.actif ? /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      dot: true
    }, "Actif") : /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, "Inactif")), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: {
        width: 26,
        height: 26,
        border: 'none',
        background: 'transparent',
        borderRadius: 6,
        cursor: 'pointer',
        color: 'var(--text-tertiary)',
        fontSize: 16
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-dots"
    })))))))) : null, tab === 'journal' ? /*#__PURE__*/React.createElement(Card, {
      padding: false
    }, /*#__PURE__*/React.createElement(CardHeader, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-history"
      }),
      title: "Journal d'activit\xE9",
      action: /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          color: 'var(--text-tertiary)'
        }
      }, "tous les utilisateurs")
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '4px 0'
      }
    }, DGd.JOURNAL.map((j, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        gap: 11,
        padding: '11px 14px',
        borderBottom: i === DGd.JOURNAL.length - 1 ? 'none' : '1px solid var(--divider)'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: j.qui,
      size: "sm"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45
      }
    }, /*#__PURE__*/React.createElement("b", {
      style: {
        fontWeight: 600
      }
    }, j.qui), " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-secondary)'
      }
    }, j.action)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--text-tertiary)',
        marginTop: 2
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-map-pin",
      style: {
        fontSize: 12,
        verticalAlign: '-1px'
      }
    }), " ", j.cible, " \xB7 ", j.quand)))))) : null);
  }
  window.Parametres = Parametres;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/Parametres.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/ProjectPage.jsx
try { (() => {
/* Écran 2 + 3 — Page projet (en-tête, vue d'ensemble, onglets) avec l'onglet
   Cédule en vedette (consultation / édition). */
(function () {
  const DS = window.HabitationsDGDesignSystem_408490;
  const {
    Tabs,
    PhaseBadge,
    Badge,
    Button,
    ProgressBar
  } = DS;
  const FOURNISSEURS = ['Plomberie Côté', 'Gypse Beauce', 'Élec. Vachon', 'Peinture Martin', 'Céramique Plus', 'Cuisines Beauce', 'Ventil. Express'];
  const CONTRAT = {
    PRELIMINAIRE: 'Préliminaire',
    ENTREPRISE: 'Entreprise'
  };
  function Stat({
    label,
    value,
    sub,
    color
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '2px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)'
      }
    }, label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        marginTop: 3,
        color: color || 'var(--text-primary)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, value), sub ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--text-tertiary)',
        marginTop: 1
      }
    }, sub) : null);
  }
  function CeduleTab({
    project,
    schedule
  }) {
    const [mode, setMode] = React.useState('consult');
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        padding: 3,
        background: 'var(--n-100)',
        borderRadius: 'var(--radius-md)',
        gap: 2
      }
    }, [['consult', 'Consultation', 'eye'], ['edit', 'Édition', 'pencil']].map(([m, label, icon]) => /*#__PURE__*/React.createElement("button", {
      key: m,
      onClick: () => setMode(m),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 12px',
        borderRadius: 6,
        border: 'none',
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'var(--font-sans)',
        background: mode === m ? 'var(--surface)' : 'transparent',
        color: mode === m ? 'var(--text-primary)' : 'var(--text-secondary)',
        boxShadow: mode === m ? 'var(--shadow-sm)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: 'ti ti-' + icon,
      style: {
        fontSize: 14
      }
    }), label))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, mode === 'edit' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "md",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-refresh"
      })
    }, "R\xE9initialiser"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "md",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-device-floppy"
      })
    }, "Enregistrer")) : /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "md",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-printer"
      })
    }, "Imprimer la c\xE9dule"))), mode === 'consult' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(window.GanttView, {
      etapes: schedule
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        margin: '2px 0 -4px'
      }
    }, "D\xE9tail des \xE9tapes"), /*#__PURE__*/React.createElement(window.DetailTable, {
      etapes: schedule
    })) : /*#__PURE__*/React.createElement(window.CeduleEditor, {
      etapesInit: schedule,
      dateLivraison: project.dateLivraison,
      fournisseurs: FOURNISSEURS
    }));
  }
  function ExtrasTab() {
    const rows = [['Céramique format 24x24', 1200, 'SIGNE', '15 avr. 2026'], ['Escalier bois franc', 2400, 'SIGNE', '20 avr. 2026'], ['Luminaires DEL — cuisine', 680, 'EN_ATTENTE', null]];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: 'var(--surface)'
      }
    }, /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 12.5
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        background: 'var(--surface-subtle)',
        borderBottom: '1px solid var(--border)'
      }
    }, ['Description', 'Montant', 'Statut', 'Signé le'].map((h, i) => /*#__PURE__*/React.createElement("th", {
      key: i,
      style: {
        textAlign: i === 1 ? 'right' : 'left',
        padding: '9px 14px',
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)'
      }
    }, h)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
      key: i,
      style: {
        borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--divider)'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        fontWeight: 500
      }
    }, r[0]), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
        fontWeight: 500
      }
    }, window.DG.formatMontant(r[1])), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px'
      }
    }, r[2] === 'SIGNE' ? /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      dot: true
    }, "Sign\xE9") : /*#__PURE__*/React.createElement(Badge, {
      tone: "warning"
    }, "En attente")), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        color: 'var(--text-secondary)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, r[3] || '—'))))));
  }
  function PaiementsTab() {
    const rows = [['Acompte', 15000, true, '20 sept. 2025'], ['Solde final', 472500, false, '4 juin 2026']];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: 'var(--surface)'
      }
    }, /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 12.5
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        background: 'var(--surface-subtle)',
        borderBottom: '1px solid var(--border)'
      }
    }, ['Description', 'Montant', 'Statut', 'Date'].map((h, i) => /*#__PURE__*/React.createElement("th", {
      key: i,
      style: {
        textAlign: i === 1 ? 'right' : 'left',
        padding: '9px 14px',
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)'
      }
    }, h)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
      key: i,
      style: {
        borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--divider)'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        fontWeight: 500
      }
    }, r[0]), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
        fontWeight: 500,
        color: r[2] ? 'var(--success-text)' : 'var(--text-primary)'
      }
    }, window.DG.formatMontant(r[1])), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px'
      }
    }, r[2] ? /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      dot: true
    }, "Re\xE7u") : /*#__PURE__*/React.createElement(Badge, {
      tone: "warning"
    }, "Attendu")), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        color: 'var(--text-secondary)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, r[3]))))));
  }
  function EmptyTab({
    icon,
    title,
    note
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface)',
        padding: '48px 24px',
        textAlign: 'center',
        color: 'var(--text-tertiary)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: 'ti ti-' + icon,
      style: {
        fontSize: 30,
        color: 'var(--text-disabled)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--text-secondary)',
        marginTop: 10
      }
    }, title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        marginTop: 3
      }
    }, note));
  }
  function ProjectPage({
    projectId,
    onBack
  }) {
    const DGd = window.DG;
    const project = DGd.projets.find(p => p.id === projectId) || DGd.projets[0];
    const schedule = React.useMemo(() => DGd.buildSchedule(project.dateLivraison), [project.id]);
    const [tab, setTab] = React.useState('Cédule');
    const next = schedule.find(e => e.statut === 'encours') || schedule.find(e => e.statut === 'demain') || schedule.find(e => e.statut === 'avenir');
    const jr = DGd.joursRestants(project.dateLivraison);
    const tabs = ['Cédule', {
      id: 'Extras',
      label: 'Extras',
      count: 3
    }, {
      id: 'Paiements',
      label: 'Paiements',
      count: 2
    }, 'GCR', 'Costing', 'Documents'];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '18px 24px 40px',
        maxWidth: 1240
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: onBack,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-tertiary)',
        fontSize: 12,
        padding: 0,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-chevron-left",
      style: {
        fontSize: 14
      }
    }), "Tous les projets"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 20,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 26,
        fontWeight: 600,
        letterSpacing: '-0.02em'
      }
    }, project.adresse), /*#__PURE__*/React.createElement(PhaseBadge, {
      phase: project.phase
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 5,
        fontSize: 13,
        color: 'var(--text-secondary)'
      }
    }, /*#__PURE__*/React.createElement("span", null, project.ville), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-disabled)'
      }
    }, "\xB7"), /*#__PURE__*/React.createElement("i", {
      className: "ti ti-user",
      style: {
        fontSize: 14
      }
    }), /*#__PURE__*/React.createElement("span", null, project.client), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-disabled)'
      }
    }, "\xB7"), /*#__PURE__*/React.createElement(Badge, {
      tone: "outline"
    }, CONTRAT[project.contrat]))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "md",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-pencil"
      })
    }, "Modifier"), /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "md",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-eye"
      })
    }, "Vue client"), /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "md",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-printer"
      })
    }, "Imprimer"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "md",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-send"
      })
    }, "Envoyer la c\xE9dule"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
        gap: 1,
        background: 'var(--border)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        margin: '18px 0 4px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--surface)',
        padding: '14px 16px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)'
      }
    }, "Avancement global"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        marginTop: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 22,
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums'
      }
    }, project.avancement, "%"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--text-tertiary)'
      }
    }, schedule.filter(e => e.statut === 'termine').length, "/", schedule.length, " \xE9tapes")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement(ProgressBar, {
      value: project.avancement,
      phase: project.phase,
      height: 5
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--surface)',
        padding: '14px 16px'
      }
    }, /*#__PURE__*/React.createElement(Stat, {
      label: "Montant du contrat",
      value: DGd.formatMontant(project.montant, 0)
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--surface)',
        padding: '14px 16px'
      }
    }, /*#__PURE__*/React.createElement(Stat, {
      label: "Livraison",
      value: DGd.dateLong(project.dateLivraison),
      sub: `${jr} jours restants`,
      color: jr <= 14 ? 'var(--danger)' : undefined
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--surface)',
        padding: '14px 16px'
      }
    }, /*#__PURE__*/React.createElement(Stat, {
      label: "Prochaine \xE9tape",
      value: next ? next.nom : '—',
      sub: next ? `${next.assigneA} · ${DGd.dateCourt(next.dateDebut)}` : ''
    }))), jr <= 14 ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        background: 'var(--danger-tint)',
        border: '1px solid var(--accent-border)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        margin: '12px 0 0',
        fontSize: 12.5,
        color: 'var(--danger-text)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-alert-triangle",
      style: {
        fontSize: 16
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600
      }
    }, "Livraison imminente"), " \u2014 remise des cl\xE9s dans ", jr, " jours. Solde final de ", DGd.formatMontant(472500, 0), " attendu.") : next ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        background: 'var(--info-tint)',
        border: '1px solid #C7DBF2',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        margin: '12px 0 0',
        fontSize: 12.5,
        color: 'var(--info-text)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-info-circle",
      style: {
        fontSize: 16
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600
      }
    }, next.nom), " en cours \u2014 ", next.assigneA, " \xB7 \xE0 coordonner d'ici le ", DGd.dateCourt(next.dateDebut), ".") : null, /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 18,
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      tabs: tabs
    })), tab === 'Cédule' ? /*#__PURE__*/React.createElement(CeduleTab, {
      project: project,
      schedule: schedule
    }) : null, tab === 'Extras' ? /*#__PURE__*/React.createElement(ExtrasTab, null) : null, tab === 'Paiements' ? /*#__PURE__*/React.createElement(PaiementsTab, null) : null, tab === 'GCR' ? /*#__PURE__*/React.createElement(window.GcrTab, {
      projectId: project.id
    }) : null, tab === 'Costing' ? /*#__PURE__*/React.createElement(window.CostingTab, {
      projectId: project.id
    }) : null, tab === 'Documents' ? /*#__PURE__*/React.createElement(EmptyTab, {
      icon: "folder",
      title: "Documents",
      note: "Contrat, plans, devis et photos de chantier."
    }) : null);
  }
  window.ProjectPage = ProjectPage;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/ProjectPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/ProjetCreate.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Écran — Création de projet : flux 4 étapes (Client → Projet → Cédule → Confirmation). */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const {
    Stepper,
    Button,
    Input,
    Select,
    Card,
    Badge,
    Toggle,
    PhaseBadge
  } = NS;
  const STEPS = ['Client', 'Projet', 'Cédule', 'Confirmation'];
  function Field({
    label,
    children
  }) {
    return /*#__PURE__*/React.createElement("label", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 500,
        color: 'var(--text-secondary)'
      }
    }, label), children);
  }
  function TextField({
    label,
    ...rest
  }) {
    return /*#__PURE__*/React.createElement(Field, {
      label: label
    }, /*#__PURE__*/React.createElement("input", _extends({}, rest, {
      style: {
        height: 32,
        padding: '0 10px',
        fontSize: 12.5,
        border: '1px solid var(--border)',
        borderRadius: 8,
        fontFamily: 'var(--font-sans)',
        background: 'var(--surface)',
        width: '100%'
      }
    })));
  }
  function ProjetCreate({
    onCancel,
    onDone
  }) {
    const DGd = window.DG;
    const [step, setStep] = React.useState(0);
    const [skipCedule, setSkipCedule] = React.useState(false);
    const [type, setType] = React.useState('JUMELE');
    const [contrat, setContrat] = React.useState('ENTREPRISE');
    const livraison = new Date(2027, 1, 26);
    const sched = React.useMemo(() => DGd.buildSchedule(livraison), []);
    const next = () => setStep(s => Math.min(STEPS.length - 1, s + (s === 2 && skipCedule ? 1 : 1)));
    const back = () => setStep(s => Math.max(0, s - 1));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '22px 24px 40px',
        maxWidth: 820,
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: onCancel,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-tertiary)',
        fontSize: 12,
        padding: 0,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-chevron-left",
      style: {
        fontSize: 14
      }
    }), "Annuler la cr\xE9ation"), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: '-0.02em',
        marginBottom: 20
      }
    }, "Nouveau projet"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement(Stepper, {
      current: step,
      steps: STEPS
    })), /*#__PURE__*/React.createElement(Card, null, step === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600
      }
    }, "Informations du client"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--text-tertiary)',
        marginTop: 2
      }
    }, "\xC0 qui appartient ce projet de construction\xA0?")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(TextField, {
      label: "Pr\xE9nom",
      defaultValue: "Genevi\xE8ve"
    }), /*#__PURE__*/React.createElement(TextField, {
      label: "Nom",
      defaultValue: "Tremblay"
    }), /*#__PURE__*/React.createElement(TextField, {
      label: "Courriel",
      defaultValue: "genevieve.tremblay@courriel.com"
    }), /*#__PURE__*/React.createElement(TextField, {
      label: "T\xE9l\xE9phone",
      defaultValue: "418 555-0142"
    }), /*#__PURE__*/React.createElement(TextField, {
      label: "Adresse postale actuelle",
      defaultValue: "44 Rue Notre-Dame"
    }), /*#__PURE__*/React.createElement(TextField, {
      label: "Ville",
      defaultValue: "Sainte-Marie"
    }))) : null, step === 1 ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600
      }
    }, "D\xE9tails du projet"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--text-tertiary)',
        marginTop: 2
      }
    }, "Adresse du chantier, type et contrat.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(TextField, {
      label: "Adresse du chantier",
      defaultValue: "12 Rue des C\xE8dres"
    }), /*#__PURE__*/React.createElement(TextField, {
      label: "Ville",
      defaultValue: "Scott"
    }), /*#__PURE__*/React.createElement(Field, {
      label: "Type de projet"
    }, /*#__PURE__*/React.createElement(Select, {
      value: type,
      onChange: e => setType(e.target.value),
      options: [{
        value: 'MAISON',
        label: 'Maison'
      }, {
        value: 'JUMELE',
        label: 'Jumelé'
      }, {
        value: 'LOGEMENT',
        label: 'Logement'
      }]
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Type de contrat"
    }, /*#__PURE__*/React.createElement(Select, {
      value: contrat,
      onChange: e => setContrat(e.target.value),
      options: [{
        value: 'PRELIMINAIRE',
        label: 'Préliminaire'
      }, {
        value: 'ENTREPRISE',
        label: 'Entreprise'
      }]
    })), /*#__PURE__*/React.createElement(TextField, {
      label: "Montant du contrat",
      defaultValue: "456 000 $"
    }), /*#__PURE__*/React.createElement(TextField, {
      label: "Date de livraison vis\xE9e",
      defaultValue: "26 f\xE9vrier 2027"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        padding: '11px 13px',
        background: 'var(--info-tint)',
        borderRadius: 'var(--radius-md)',
        fontSize: 12,
        color: 'var(--info-text)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-info-circle",
      style: {
        fontSize: 16,
        flexShrink: 0
      }
    }), "Le projet d\xE9marre en phase ", /*#__PURE__*/React.createElement("b", {
      style: {
        margin: '0 3px'
      }
    }, "Sign\xE9"), ". La phase avancera automatiquement selon l'avancement de la c\xE9dule.")) : null, step === 2 ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600
      }
    }, "C\xE9dule de construction"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--text-tertiary)',
        marginTop: 2
      }
    }, "G\xE9n\xE8re l'\xE9ch\xE9ancier ", type === 'JUMELE' ? 'jumelé' : 'standard', " de 43 \xE9tapes \xE0 partir de la date de livraison.")), /*#__PURE__*/React.createElement("label", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 12,
        color: 'var(--text-secondary)',
        whiteSpace: 'nowrap',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Toggle, {
      checked: skipCedule,
      onChange: setSkipCedule
    }), "Passer la c\xE9dule")), skipCedule ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        padding: '14px',
        background: 'var(--surface-subtle)',
        border: '1px dashed var(--border-strong)',
        borderRadius: 'var(--radius-md)',
        fontSize: 12.5,
        color: 'var(--text-secondary)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-calendar-off",
      style: {
        fontSize: 18,
        color: 'var(--text-tertiary)',
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", null, "La c\xE9dule sera ", /*#__PURE__*/React.createElement("b", null, "vide"), ". Tu pourras la g\xE9n\xE9rer ou la b\xE2tir manuellement plus tard depuis l'onglet C\xE9dule du projet. Utile pour un contrat pr\xE9liminaire pas encore planifi\xE9.")) : /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '9px 13px',
        background: 'var(--surface-subtle)',
        borderBottom: '1px solid var(--border)',
        fontSize: 11.5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600
      }
    }, "Aper\xE7u \u2014 ", sched.length, " \xE9tapes"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-tertiary)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, DGd.dateCourt(sched[0].dateDebut), " \u2192 ", DGd.dateCourt(livraison), " \xB7 ", DGd.joursOuvrableEntre(sched[0].dateDebut, livraison), " j ouvr.")), /*#__PURE__*/React.createElement("div", {
      style: {
        maxHeight: 200,
        overflowY: 'auto'
      }
    }, sched.slice(0, 10).map((e, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '7px 13px',
        borderBottom: '1px solid var(--divider)',
        fontSize: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-tertiary)',
        width: 18,
        fontVariantNumeric: 'tabular-nums'
      }
    }, e.ordre), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontWeight: 500
      }
    }, e.nom), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--text-tertiary)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, e.jours, "j \xB7 ", DGd.dateCourt(e.dateDebut)))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 13px',
        fontSize: 11,
        color: 'var(--text-tertiary)',
        textAlign: 'center'
      }
    }, "\u2026 ", sched.length - 10, " \xE9tapes de plus")))) : null, step === 3 ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        alignItems: 'center',
        textAlign: 'center',
        padding: '14px 0'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'var(--success-tint)',
        color: 'var(--success)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-check",
      style: {
        fontSize: 30
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 17,
        fontWeight: 600
      }
    }, "Pr\xEAt \xE0 cr\xE9er le projet"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--text-secondary)',
        marginTop: 4
      }
    }, "V\xE9rifie le r\xE9capitulatif avant de confirmer.")), /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        maxWidth: 460,
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        textAlign: 'left'
      }
    }, [['Client', 'Geneviève Tremblay'], ['Chantier', '12 Rue des Cèdres, Scott'], ['Type', type === 'JUMELE' ? 'Jumelé' : type === 'MAISON' ? 'Maison' : 'Logement'], ['Contrat', contrat === 'ENTREPRISE' ? 'Entreprise · 456 000 $' : 'Préliminaire · 456 000 $'], ['Livraison', '26 février 2027'], ['Cédule', skipCedule ? 'Passée (vide)' : `${sched.length} étapes générées`]].map((r, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 14px',
        borderBottom: i === 5 ? 'none' : '1px solid var(--divider)',
        fontSize: 12.5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-tertiary)'
      }
    }, r[0]), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600
      }
    }, r[1]))))) : null), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 18
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: step === 0 ? onCancel : back
    }, step === 0 ? 'Annuler' : '← Précédent'), step < 3 ? /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: next,
      iconTrailing: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-arrow-right"
      })
    }, step === 2 && skipCedule ? 'Passer et continuer' : 'Continuer') : /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-check"
      }),
      onClick: onDone
    }, "Cr\xE9er le projet")));
  }
  window.ProjetCreate = ProjetCreate;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/ProjetCreate.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/ProjetsList.jsx
try { (() => {
/* Écran — Liste des projets : tableau dense, filtres par phase, recherche. */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const {
    PhaseBadge,
    ProgressBar,
    Badge,
    Button,
    FilterChip,
    Avatar,
    EmptyState
  } = NS;
  const CONTRAT = {
    PRELIMINAIRE: 'Préliminaire',
    ENTREPRISE: 'Entreprise'
  };
  function ProjetsList({
    onOpenProject,
    onCreate
  }) {
    const DGd = window.DG;
    const [phase, setPhase] = React.useState(null);
    const [q, setQ] = React.useState('');
    const [sort, setSort] = React.useState('livraison');
    const counts = {};
    DGd.projets.forEach(p => {
      counts[p.phase] = (counts[p.phase] || 0) + 1;
    });
    let rows = DGd.projets.filter(p => (!phase || p.phase === phase) && (!q || (p.client + ' ' + p.adresse + ' ' + p.ville).toLowerCase().includes(q.toLowerCase())));
    rows = [...rows].sort((a, b) => sort === 'livraison' ? a.dateLivraison - b.dateLivraison : sort === 'avancement' ? b.avancement - a.avancement : sort === 'montant' ? b.montant - a.montant : 0);
    const PHASES = ['SIGNE', 'PREPARATION', 'CHANTIER', 'LIVRAISON', 'TERMINE'];
    const HEAD = [['Projet', 'left'], ['Phase', 'left'], ['Avancement', 'left'], ['Livraison', 'left'], ['Contrat', 'left'], ['Montant', 'right'], ['Vendeur', 'left'], ['', 'right']];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '22px 24px 40px',
        maxWidth: 1280
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 18,
        gap: 16,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: '-0.02em'
      }
    }, "Projets"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: 'var(--text-secondary)',
        marginTop: 3
      }
    }, DGd.projets.length, " projets \xB7 ", DGd.projets.filter(p => ['CHANTIER', 'LIVRAISON'].includes(p.phase)).length, " en chantier")), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-plus"
      }),
      onClick: onCreate
    }, "Nouveau projet")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
        marginBottom: 14,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(FilterChip, {
      label: "Tous",
      count: DGd.projets.length,
      active: phase == null,
      onClick: () => setPhase(null)
    }), PHASES.map(ph => /*#__PURE__*/React.createElement(FilterChip, {
      key: ph,
      label: DGd.phase(ph).label,
      dotColor: DGd.phase(ph).bar,
      count: counts[ph] || 0,
      active: phase === ph,
      onClick: () => setPhase(ph)
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-search",
      style: {
        position: 'absolute',
        left: 9,
        fontSize: 15,
        color: 'var(--text-tertiary)'
      }
    }), /*#__PURE__*/React.createElement("input", {
      value: q,
      onChange: e => setQ(e.target.value),
      placeholder: "Rechercher un projet, client, ville\u2026",
      style: {
        height: 32,
        width: 250,
        padding: '0 10px 0 30px',
        fontSize: 12,
        border: '1px solid var(--border)',
        borderRadius: 8,
        fontFamily: 'var(--font-sans)',
        background: 'var(--surface)'
      }
    })), /*#__PURE__*/React.createElement("select", {
      value: sort,
      onChange: e => setSort(e.target.value),
      style: {
        height: 32,
        padding: '0 10px',
        fontSize: 12,
        border: '1px solid var(--border)',
        borderRadius: 8,
        background: 'var(--surface)',
        fontFamily: 'var(--font-sans)',
        color: 'var(--text-secondary)'
      }
    }, /*#__PURE__*/React.createElement("option", {
      value: "livraison"
    }, "Trier : livraison"), /*#__PURE__*/React.createElement("option", {
      value: "avancement"
    }, "Trier : avancement"), /*#__PURE__*/React.createElement("option", {
      value: "montant"
    }, "Trier : montant")))), /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: 'var(--surface)'
      }
    }, /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 12.5
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        background: 'var(--surface-subtle)',
        borderBottom: '1px solid var(--border)'
      }
    }, HEAD.map((h, i) => /*#__PURE__*/React.createElement("th", {
      key: i,
      style: {
        textAlign: h[1],
        padding: '9px 14px',
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)',
        whiteSpace: 'nowrap'
      }
    }, h[0])))), /*#__PURE__*/React.createElement("tbody", null, rows.map((p, i) => {
      const jr = DGd.joursRestants(p.dateLivraison);
      return /*#__PURE__*/React.createElement("tr", {
        key: p.id,
        onClick: () => onOpenProject(p.id),
        style: {
          borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--divider)',
          cursor: 'pointer'
        },
        onMouseEnter: e => e.currentTarget.style.background = 'var(--surface-subtle)',
        onMouseLeave: e => e.currentTarget.style.background = 'transparent'
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 14px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: 600
        }
      }, p.adresse), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: 'var(--text-tertiary)'
        }
      }, p.ville, " \xB7 ", p.client)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 14px'
        }
      }, /*#__PURE__*/React.createElement(PhaseBadge, {
        phase: p.phase
      })), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 14px',
          minWidth: 130
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/React.createElement(ProgressBar, {
        value: p.avancement,
        phase: p.phase
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text-secondary)',
          fontVariantNumeric: 'tabular-nums',
          width: 30,
          textAlign: 'right'
        }
      }, p.avancement, "%"))), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 14px',
          whiteSpace: 'nowrap'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontVariantNumeric: 'tabular-nums'
        }
      }, DGd.dateCourt(p.dateLivraison), " ", p.dateLivraison.getFullYear()), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: jr <= 14 ? 'var(--danger)' : 'var(--text-tertiary)',
          fontWeight: jr <= 14 ? 600 : 400,
          fontVariantNumeric: 'tabular-nums'
        }
      }, jr > 0 ? `${jr} j restants` : 'livré')), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 14px'
        }
      }, /*#__PURE__*/React.createElement(Badge, {
        tone: p.contrat === 'ENTREPRISE' ? 'info' : 'outline'
      }, CONTRAT[p.contrat])), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 14px',
          textAlign: 'right',
          fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap'
        }
      }, DGd.formatMontant(p.montant, 0)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 14px'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7
        }
      }, /*#__PURE__*/React.createElement(Avatar, {
        name: p.vendeur,
        size: "sm"
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12,
          color: 'var(--text-secondary)',
          whiteSpace: 'nowrap'
        }
      }, p.vendeur))), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 14px',
          textAlign: 'right'
        },
        onClick: e => e.stopPropagation()
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          gap: 2
        }
      }, /*#__PURE__*/React.createElement("button", {
        title: "Ouvrir",
        onClick: () => onOpenProject(p.id),
        style: iconBtn
      }, /*#__PURE__*/React.createElement("i", {
        className: "ti ti-arrow-right"
      })), /*#__PURE__*/React.createElement("button", {
        title: "Options",
        style: iconBtn
      }, /*#__PURE__*/React.createElement("i", {
        className: "ti ti-dots"
      })))));
    }))), rows.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
      compact: true,
      icon: "search-off",
      title: "Aucun r\xE9sultat",
      message: "Aucun projet ne correspond \xE0 ce filtre ou \xE0 cette recherche."
    }) : null));
  }
  const iconBtn = {
    width: 26,
    height: 26,
    border: 'none',
    background: 'transparent',
    borderRadius: 6,
    cursor: 'pointer',
    color: 'var(--text-tertiary)',
    fontSize: 16,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  window.ProjetsList = ProjetsList;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/ProjetsList.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/States.jsx
try { (() => {
/* Écran — États & patterns : empty states, skeletons, toasts, dialogs, alerte cascade. */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const {
    Card,
    CardHeader,
    Button,
    EmptyState,
    Skeleton,
    SkeletonRow,
    Toast,
    ToastStack,
    Dialog,
    Badge
  } = NS;
  function Section({
    title,
    hint,
    children
  }) {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 600
      }
    }, title), hint ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: 'var(--text-tertiary)',
        marginTop: 1
      }
    }, hint) : null), children);
  }
  function States() {
    const [toasts, setToasts] = React.useState([]);
    const [confirm, setConfirm] = React.useState(false);
    const [cascade, setCascade] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    function push(t) {
      const id = Date.now() + Math.random();
      setToasts(ts => [...ts, {
        ...t,
        id
      }]);
      setTimeout(() => setToasts(ts => ts.filter(x => x.id !== id)), 4200);
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '22px 24px 40px',
        maxWidth: 1080
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: '-0.02em'
      }
    }, "\xC9tats & patterns"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: 'var(--text-secondary)',
        marginTop: 3
      }
    }, "Empty states, chargement, notifications, confirmations et l'alerte de d\xE9calage de c\xE9dule.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 26
      }
    }, /*#__PURE__*/React.createElement(Section, {
      title: "Empty states",
      hint: "Aucun projet \xB7 aucune c\xE9dule \xB7 aucune d\xE9pense"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: false
    }, /*#__PURE__*/React.createElement(EmptyState, {
      compact: true,
      icon: "building-community",
      title: "Aucun projet actif",
      message: "Cr\xE9e ton premier projet pour g\xE9n\xE9rer une c\xE9dule.",
      action: /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "ti ti-plus"
        })
      }, "Nouveau projet")
    })), /*#__PURE__*/React.createElement(Card, {
      padding: false
    }, /*#__PURE__*/React.createElement(EmptyState, {
      compact: true,
      icon: "calendar-off",
      title: "Aucune c\xE9dule",
      message: "La c\xE9dule a \xE9t\xE9 pass\xE9e. G\xE9n\xE8re-la quand le projet est planifi\xE9.",
      action: /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        variant: "outline",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "ti ti-wand"
        })
      }, "G\xE9n\xE9rer")
    })), /*#__PURE__*/React.createElement(Card, {
      padding: false
    }, /*#__PURE__*/React.createElement(EmptyState, {
      compact: true,
      icon: "receipt-off",
      title: "Aucune d\xE9pense",
      message: "Ajoute une facture fournisseur pour suivre le costing.",
      action: /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        variant: "outline",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "ti ti-plus"
        })
      }, "Ajouter")
    })))), /*#__PURE__*/React.createElement(Section, {
      title: "\xC9tats de chargement (skeletons)",
      hint: "Pendant le chargement d'une liste ou d'une c\xE9dule"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: false,
      style: {
        flex: 1,
        minWidth: 320
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 14px',
        background: 'var(--surface-subtle)',
        borderBottom: '1px solid var(--border)'
      }
    }, /*#__PURE__*/React.createElement(Skeleton, {
      width: 120,
      height: 13
    }), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      onClick: () => setLoading(l => !l)
    }, loading ? 'Afficher chargé' : 'Rejouer')), loading ? Array.from({
      length: 4
    }).map((_, i) => /*#__PURE__*/React.createElement(SkeletonRow, {
      key: i,
      cols: [32, '52%', 70, 50],
      style: {
        borderBottom: i === 3 ? 'none' : '1px solid var(--divider)'
      }
    })) : Array.from({
      length: 4
    }).map((_, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        borderBottom: i === 3 ? 'none' : '1px solid var(--divider)',
        fontSize: 12.5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: 'var(--task-termine)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontWeight: 500
      }
    }, "\xC9tape compl\xE9t\xE9e"), /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      dot: true
    }, "Termin\xE9")))))), /*#__PURE__*/React.createElement(Section, {
      title: "Toasts / notifications",
      hint: "Confirmations passag\xE8res en bas \xE0 droite"
    }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "success",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-send"
      }),
      onClick: () => push({
        tone: 'success',
        title: 'Cédule envoyée',
        message: 'Le client a reçu l\u2019échéancier par courriel.'
      })
    }, "Succ\xE8s"), /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-cash"
      }),
      onClick: () => push({
        tone: 'info',
        title: 'Paiement enregistré',
        message: 'Tranche chantier · 272 300 $.'
      })
    }, "Info"), /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-alert-triangle"
      }),
      onClick: () => push({
        tone: 'warning',
        title: 'Étape sous le maximum',
        message: 'Kevin Roy : 31,5 h cette semaine.'
      })
    }, "Avertissement"), /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-alert-circle"
      }),
      onClick: () => push({
        tone: 'danger',
        title: 'Conflit de cédule',
        message: '« Pose gypse » chevauche l\u2019étape précédente.'
      })
    }, "Erreur")))), /*#__PURE__*/React.createElement(Section, {
      title: "Dialogs de confirmation",
      hint: "Suppression destructive \xB7 recalcul en cascade"
    }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "danger",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-trash"
      }),
      onClick: () => setConfirm(true)
    }, "Supprimer un projet\u2026"), /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-calendar-event"
      }),
      onClick: () => setCascade(true)
    }, "D\xE9caler une \xE9tape\u2026"))))), /*#__PURE__*/React.createElement(ToastStack, null, toasts.map(t => /*#__PURE__*/React.createElement(Toast, {
      key: t.id,
      tone: t.tone,
      title: t.title,
      message: t.message,
      onClose: () => setToasts(ts => ts.filter(x => x.id !== t.id))
    }))), /*#__PURE__*/React.createElement(Dialog, {
      open: confirm,
      onClose: () => setConfirm(false),
      tone: "danger",
      icon: "trash",
      title: "Supprimer ce projet ?",
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        onClick: () => setConfirm(false)
      }, "Annuler"), /*#__PURE__*/React.createElement(Button, {
        variant: "danger",
        onClick: () => {
          setConfirm(false);
          push({
            tone: 'danger',
            title: 'Projet supprimé',
            message: '18 Rue des Érables a été retiré.'
          });
        }
      }, "Supprimer d\xE9finitivement"))
    }, "Cette action est irr\xE9versible. La c\xE9dule, les extras et les paiements li\xE9s \xE0 ", /*#__PURE__*/React.createElement("b", null, "18 Rue des \xC9rables"), " seront retir\xE9s."), /*#__PURE__*/React.createElement(Dialog, {
      open: cascade,
      onClose: () => setCascade(false),
      tone: "warning",
      icon: "calendar-event",
      title: "Recalculer la c\xE9dule en cascade ?",
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        onClick: () => setCascade(false)
      }, "D\xE9caler cette \xE9tape seulement"), /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        onClick: () => {
          setCascade(false);
          push({
            tone: 'warning',
            title: 'Cédule recalculée',
            message: '11 étapes décalées de +2 jours.'
          });
        }
      }, "Recalculer en cascade"))
    }, "L'\xE9tape ", /*#__PURE__*/React.createElement("b", null, "\xAB Pose gypse \xBB"), " est d\xE9cal\xE9e de ", /*#__PURE__*/React.createElement("b", null, "+2 jours ouvrables"), ". 11 \xE9tapes suivantes peuvent \xEAtre repouss\xE9es d'autant pour pr\xE9server les dur\xE9es et les buffers. La date de livraison passerait au ", /*#__PURE__*/React.createElement("b", null, "22 juin 2026"), "."));
  }
  window.States = States;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/States.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/VueClient.jsx
try { (() => {
/* Écran — Vue client publique : mobile-first, lecture seule, étapes visibles client. */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const {
    PhaseBadge,
    ProgressBar,
    StatusDot,
    Badge
  } = NS;
  function PhoneFrame({
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        padding: '28px 20px 40px',
        background: 'var(--bg-canvas)',
        minHeight: '100%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 390,
        maxWidth: '100%',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
        alignSelf: 'flex-start'
      }
    }, children));
  }
  function VueClient() {
    const DGd = window.DG;
    const p = DGd.projets.find(x => x.id === 'p1');
    const sched = DGd.buildSchedule(p.dateLivraison).filter(e => e.visibleClient);
    const jr = DGd.joursRestants(p.dateLivraison);
    const done = sched.filter(e => e.statut === 'termine').length;
    const next = sched.find(e => e.statut === 'encours') || sched.find(e => e.statut === 'demain') || sched.find(e => e.statut === 'avenir');
    const STATUT_LABEL = {
      termine: 'Terminé',
      encours: 'En cours',
      demain: 'Bientôt',
      avenir: 'À venir'
    };
    return /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--n-900)',
        color: '#fff',
        padding: '16px 18px 18px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/habitationsdg-icon.svg",
      alt: "DG",
      style: {
        height: 26
      }
    }), /*#__PURE__*/React.createElement(Badge, {
      tone: "outline",
      pill: true
    }, "Espace client")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        opacity: 0.7
      }
    }, "Votre projet"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 20,
        fontWeight: 600,
        letterSpacing: '-0.01em',
        marginTop: 2
      }
    }, p.adresse), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        opacity: 0.75,
        marginTop: 2
      }
    }, p.ville))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 18px',
        borderBottom: '1px solid var(--divider)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement(PhaseBadge, {
      phase: p.phase
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: jr <= 14 ? 'var(--danger)' : 'var(--success-text)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, "Livraison dans ", jr, " jours")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 7
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 26,
        fontWeight: 600,
        letterSpacing: '-0.018em',
        fontVariantNumeric: 'tabular-nums'
      }
    }, p.avancement, "%"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--text-tertiary)'
      }
    }, "compl\xE9t\xE9 \xB7 ", done, "/", sched.length, " \xE9tapes visibles")), /*#__PURE__*/React.createElement(ProgressBar, {
      value: p.avancement,
      phase: p.phase,
      height: 6
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 14,
        padding: '10px 12px',
        background: 'var(--info-tint)',
        borderRadius: 'var(--radius-md)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ti ti-arrow-right",
      style: {
        fontSize: 16,
        color: 'var(--info)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-tertiary)'
      }
    }, "Prochaine \xE9tape :"), " ", /*#__PURE__*/React.createElement("b", {
      style: {
        fontWeight: 600
      }
    }, next ? next.nom : '—')))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '14px 18px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)',
        marginBottom: 10
      }
    }, "\xC9tapes de votre construction"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        paddingLeft: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 4,
        top: 6,
        bottom: 6,
        width: 2,
        background: 'var(--divider)'
      }
    }), sched.map((e, i) => {
      const c = {
        termine: 'var(--task-termine)',
        encours: 'var(--task-encours)',
        demain: 'var(--task-demain)',
        avenir: 'var(--task-avenir)'
      }[e.statut];
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          padding: '8px 0'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          left: -18,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: c,
          border: '2px solid var(--surface)',
          boxShadow: '0 0 0 1.5px ' + c
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13,
          fontWeight: 500,
          color: e.statut === 'avenir' ? 'var(--text-secondary)' : 'var(--text-primary)'
        }
      }, e.nom), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: 'var(--text-tertiary)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, DGd.dateCourt(e.dateDebut), " \u2013 ", DGd.dateCourt(e.dateFin))), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10.5,
          fontWeight: 600,
          color: c,
          whiteSpace: 'nowrap'
        }
      }, STATUT_LABEL[e.statut]));
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 18px 18px',
        borderTop: '1px solid var(--divider)',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--text-tertiary)'
      }
    }, "Une question sur votre projet\xA0?"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        marginTop: 2
      }
    }, "M\xE9lanie Vachon \xB7 418 555-0182")));
  }
  window.VueClient = VueClient;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/VueClient.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/data-ext.js
try { (() => {
/* ==========================================================================
   Habitations DG — UI kit EXTENDED data (window.DG additions)
   Runs after data.js. Adds: clients, fournisseurs, employés, costing,
   feuilles de temps, GCR, géo-coordonnées, utilisateurs, journal d'activité.
   Derived from the same seed/schema understanding as data.js.
   ========================================================================== */
(function () {
  const DG = window.DG;
  if (!DG) {
    console.error('data-ext.js: window.DG manquant');
    return;
  }
  const d = (y, m, day) => new Date(y, m, day);

  /* --- Vendeurs / chargés (sur les projets) ------------------------------ */
  const VENDEURS = {
    p1: 'Carl Boucher',
    p2: 'Carl Boucher',
    p3: 'Mélanie Roy',
    p4: 'Carl Boucher',
    p5: 'Mélanie Roy',
    p6: 'Carl Boucher',
    p7: 'Mélanie Roy'
  };
  const CHARGES = {
    p1: 'Mélanie Vachon',
    p2: 'Mélanie Vachon',
    p3: 'Jonathan Bélanger',
    p4: 'Mélanie Vachon',
    p5: 'Jonathan Bélanger',
    p6: 'Mélanie Vachon',
    p7: 'Jonathan Bélanger'
  };
  DG.projets.forEach(p => {
    p.vendeur = VENDEURS[p.id];
    p.charge = CHARGES[p.id];
    p.tel = '418 555-' + (1000 + parseInt(p.id.slice(1)) * 137 % 8999).toString().slice(0, 4);
  });

  /* --- Géo-coordonnées (Beauce / Chaudière-Appalaches) ------------------- */
  const GEO = {
    p1: [46.690, -71.070],
    p2: [46.553, -70.502],
    p3: [46.621, -70.651],
    p4: [46.713, -70.892],
    p5: [46.648, -70.879],
    p6: [46.601, -70.864],
    p7: [46.624, -70.981]
  };
  DG.projets.forEach(p => {
    p.lat = GEO[p.id][0];
    p.lng = GEO[p.id][1];
  });

  /* --- Extras par projet -------------------------------------------------- */
  const EXTRAS = {
    p1: [['Céramique format 24x24', 1200, 'SIGNE'], ['Escalier bois franc', 2400, 'SIGNE'], ['Luminaires DEL — cuisine', 680, 'EN_ATTENTE']],
    p2: [['Plancher chauffant salle de bain', 3200, 'SIGNE'], ['Comptoir quartz', 4100, 'EN_ATTENTE']],
    p3: [['Foyer au gaz', 3600, 'SIGNE'], ['Agrandissement terrasse', 890, 'EN_ATTENTE']],
    p5: [['Garage isolé', 12500, 'SIGNE'], ['Stores motorisés', 2100, 'EN_ATTENTE']],
    p7: [['Douche en céramique', 2800, 'SIGNE'], ['Îlot de cuisine sur mesure', 3900, 'SIGNE'], ['Borne recharge VÉ', 1450, 'EN_ATTENTE']]
  };
  function extras(pid) {
    return (EXTRAS[pid] || []).map(e => ({
      nom: e[0],
      montant: e[1],
      statut: e[2]
    }));
  }
  function extrasTotal(pid, signedOnly) {
    return extras(pid).filter(e => !signedOnly || e.statut === 'SIGNE').reduce((s, e) => s + e.montant, 0);
  }

  /* --- Paiements par projet (tranches) ----------------------------------- */
  function paiements(pid) {
    const p = DG.projets.find(x => x.id === pid);
    if (!p) return [];
    const t1 = Math.round(p.montant * 0.15),
      t3 = Math.round(p.montant * 0.15),
      t2 = p.montant - t1 - t3;
    const recu = p.avancement;
    return [{
      nom: 'Acompte (15%)',
      montant: t1,
      statut: recu >= 5 ? 'RECU' : 'ATTENDU',
      date: p.dateContrat
    }, {
      nom: 'Tranche chantier (70%)',
      montant: t2,
      statut: recu >= 60 ? 'RECU' : recu >= 25 ? 'PARTIEL' : 'ATTENDU',
      date: DG.addJoursOuvrables(p.dateContrat, 40)
    }, {
      nom: 'Solde à la livraison (15%)',
      montant: t3,
      statut: recu >= 99 ? 'RECU' : 'ATTENDU',
      date: p.dateLivraison
    }];
  }

  /* --- COSTING ----------------------------------------------------------- */
  const CATEGORIES = [['Excavation & terrassement', 0.055, 'backhoe'], ['Fondation & béton', 0.095, 'wall'], ['Structure & charpente', 0.165, 'home-2'], ['Toiture & revêtement ext.', 0.105, 'roof'], ['Plomberie', 0.060, 'pipe'], ['Électricité', 0.055, 'bolt'], ['Ventilation & CVC', 0.040, 'air-conditioning'], ['Isolation & gypse', 0.080, 'layout-board'], ['Cuisine & armoires', 0.075, 'tools-kitchen-2'], ['Revêtements & céramique', 0.060, 'grid-dots'], ['Peinture & finition', 0.050, 'brush'], ['Main-d\u2019œuvre interne', 0.095, 'users'], ['Divers & imprévus', 0.020, 'dots']];
  const MARGE = {
    p1: 0.205,
    p2: 0.158,
    p3: 0.088,
    p4: 0.192,
    p5: 0.142,
    p6: 0.225,
    p7: 0.176
  };
  function santeMarge(m) {
    if (m >= 0.18) return 'success';
    if (m >= 0.12) return 'warning';
    return 'danger';
  }
  function costing(pid) {
    const p = DG.projets.find(x => x.id === pid);
    if (!p) return null;
    const revenusContrat = p.montant;
    const revenusExtras = extrasTotal(pid, true);
    const revenus = revenusContrat + revenusExtras;
    const marge = MARGE[pid] != null ? MARGE[pid] : 0.16;
    const depensesTotal = Math.round(revenus * (1 - marge));
    const av = Math.max(0.02, p.avancement / 100);
    // jitter helper (deterministic by index)
    const cats = CATEGORIES.map((c, i) => {
      const budget = Math.round(depensesTotal * c[1] / 0.955);
      const f = Math.min(1, av + (i * 37 % 23 - 11) / 100 * (av < 0.95 ? 1 : 0));
      const reel = Math.round(budget * Math.max(0, Math.min(1, f)));
      return {
        nom: c[0],
        icon: c[2],
        budget,
        reel,
        ecart: reel - budget
      };
    });
    const budgetTotal = cats.reduce((s, c) => s + c.budget, 0);
    const reelTotal = cats.reduce((s, c) => s + c.reel, 0);
    const profit = revenus - budgetTotal;
    const mo = cats.find(c => /Main/.test(c.nom));
    return {
      revenus,
      revenusContrat,
      revenusExtras,
      depensesTotal: budgetTotal,
      depensesReel: reelTotal,
      profit,
      marge: profit / revenus,
      sante: santeMarge(profit / revenus),
      cats,
      mainOeuvre: mo
    };
  }
  function costingGlobal() {
    const rows = DG.projets.filter(p => p.phase !== 'SIGNE').map(p => {
      const c = costing(p.id);
      return {
        id: p.id,
        projet: p.adresse,
        client: p.client,
        phase: p.phase,
        revenus: c.revenus,
        depenses: c.depensesTotal,
        profit: c.profit,
        marge: c.marge,
        sante: c.sante,
        avancement: p.avancement
      };
    });
    const revenus = rows.reduce((s, r) => s + r.revenus, 0);
    const depenses = rows.reduce((s, r) => s + r.depenses, 0);
    const profit = revenus - depenses;
    return {
      rows,
      revenus,
      depenses,
      profit,
      marge: profit / revenus,
      sante: santeMarge(profit / revenus)
    };
  }

  /* --- EMPLOYÉS / FEUILLES DE TEMPS -------------------------------------- */
  const EMPLOYES = [{
    id: 'e1',
    nom: 'Jonathan Bélanger',
    role: 'Chargé de projet',
    taux: 38.50,
    max: 36.5,
    actif: true
  }, {
    id: 'e2',
    nom: 'Kevin Roy',
    role: 'Charpentier-menuisier',
    taux: 32.00,
    max: 36.5,
    actif: true
  }, {
    id: 'e3',
    nom: 'Patrick Gagné',
    role: 'Charpentier-menuisier',
    taux: 33.50,
    max: 36.5,
    actif: true
  }, {
    id: 'e4',
    nom: 'Marc-André Thibault',
    role: 'Manœuvre',
    taux: 26.00,
    max: 36.5,
    actif: true
  }, {
    id: 'e5',
    nom: 'Steve Pelletier',
    role: 'Charpentier-menuisier',
    taux: 31.00,
    max: 36.5,
    actif: true
  }, {
    id: 'e6',
    nom: 'Mélanie Vachon',
    role: 'Chargée de projet',
    taux: 39.00,
    max: 36.5,
    actif: true
  }, {
    id: 'e7',
    nom: 'Dany Lessard',
    role: 'Manœuvre',
    taux: 25.50,
    max: 36.5,
    actif: false
  }];
  // Weekly hours grid: emp -> [lun,mar,mer,jeu,ven], + project assignment per emp
  const SEMAINE_HEURES = {
    e1: [7.5, 7.5, 7.5, 7, 7.5],
    e2: [8, 8, 8, 7.5, 8],
    e3: [7.5, 8, 8, 8, 4],
    e4: [7, 7.5, 7.5, 7.5, 7.5],
    e5: [8, 8, 4, 0, 0],
    e6: [7.5, 7.5, 7.5, 7.5, 6],
    e7: [0, 0, 0, 0, 0]
  };
  const SEMAINE_PROJET = {
    e1: 'p7',
    e2: 'p2',
    e3: 'p2',
    e4: 'p5',
    e5: 'p3',
    e6: 'p7',
    e7: '—'
  };
  function semaineCourante() {
    const lundi = new Date(DG.TODAY);
    const dow = lundi.getDay();
    lundi.setDate(lundi.getDate() - (dow === 0 ? 6 : dow - 1));
    lundi.setHours(0, 0, 0, 0);
    const jours = [];
    for (let i = 0; i < 5; i++) {
      const x = new Date(lundi);
      x.setDate(lundi.getDate() + i);
      jours.push(x);
    }
    return jours;
  }
  function feuillesSemaine() {
    return EMPLOYES.filter(e => e.actif).map(e => {
      const h = SEMAINE_HEURES[e.id] || [0, 0, 0, 0, 0];
      const total = h.reduce((s, x) => s + x, 0);
      return {
        ...e,
        heures: h,
        total,
        projet: SEMAINE_PROJET[e.id],
        depasse: total > e.max,
        sousMax: total < e.max - 2
      };
    });
  }

  /* --- GCR (Garantie de construction résidentielle) ---------------------- */
  function gcr(pid) {
    const p = DG.projets.find(x => x.id === pid);
    if (!p) return null;
    const av = p.avancement;
    const checklist = [['Plan de garantie GCR enregistré', true], ['Contrat d\u2019entreprise signé', true], ['Acompte protégé (dépôt en fidéicommis)', true], ['Certificat de localisation reçu', av >= 30], ['Formulaire de pré-réception préparé', av >= 80], ['Liste de déficiences remise au client', av >= 90], ['Réception du bâtiment signée', av >= 99]];
    const inspections = [{
      nom: 'Inspection pré-livraison',
      date: DG.subJoursOuvrables(p.dateLivraison, 8),
      statut: av >= 85 ? 'PLANIFIE' : 'A_VENIR',
      insp: 'Mélanie Vachon'
    }, {
      nom: 'Réception du bâtiment',
      date: p.dateLivraison,
      statut: av >= 99 ? 'PLANIFIE' : 'A_VENIR',
      insp: 'Nicolas Savard'
    }, {
      nom: 'Visite de garantie — 1 an',
      date: new Date(p.dateLivraison.getFullYear() + 1, p.dateLivraison.getMonth(), p.dateLivraison.getDate()),
      statut: 'A_VENIR',
      insp: '—'
    }];
    const done = checklist.filter(c => c[1]).length;
    return {
      checklist: checklist.map(c => ({
        label: c[0],
        fait: c[1]
      })),
      done,
      total: checklist.length,
      inspections
    };
  }

  /* --- UTILISATEURS ------------------------------------------------------ */
  const UTILISATEURS = [{
    id: 'u1',
    nom: 'Nicolas Savard',
    courriel: 'nicolas.savard@habitationsdg.com',
    role: 'ADMIN',
    roleLabel: 'Directeur des opérations',
    actif: true
  }, {
    id: 'u2',
    nom: 'Sophie-Rose Dion',
    courriel: 'sophie-rose.dion@habitationsdg.com',
    role: 'COMPTA',
    roleLabel: 'Comptabilité',
    actif: true
  }, {
    id: 'u3',
    nom: 'Carl Boucher',
    courriel: 'carl.boucher@habitationsdg.com',
    role: 'VENDEUR',
    roleLabel: 'Vendeur',
    actif: true
  }, {
    id: 'u4',
    nom: 'Mélanie Roy',
    courriel: 'melanie.roy@habitationsdg.com',
    role: 'VENDEUR',
    roleLabel: 'Vendeuse',
    actif: true
  }, {
    id: 'u5',
    nom: 'Mélanie Vachon',
    courriel: 'melanie.vachon@habitationsdg.com',
    role: 'CHARGE_PROJET',
    roleLabel: 'Chargée de projet',
    actif: true
  }, {
    id: 'u6',
    nom: 'Jonathan Bélanger',
    courriel: 'jonathan.belanger@habitationsdg.com',
    role: 'CHARGE_PROJET',
    roleLabel: 'Chargé de projet',
    actif: true
  }];
  const ROLE_TINT = {
    ADMIN: 'danger',
    COMPTA: 'info',
    VENDEUR: 'success',
    CHARGE_PROJET: 'warning'
  };

  /* --- CLIENTS / FOURNISSEURS -------------------------------------------- */
  const CLIENTS = DG.projets.map(p => ({
    id: 'c' + p.id.slice(1),
    nom: p.client,
    projet: p.id,
    adresse: p.adresse,
    ville: p.ville,
    courriel: p.client.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '.').replace(/\.+/g, '.') + '@courriel.com',
    tel: p.tel,
    phase: p.phase
  }));
  const FOURNISSEURS = [{
    id: 'f1',
    nom: 'Plomberie Côté',
    metier: 'Plomberie',
    contact: 'Réjean Côté',
    tel: '418 555-2210',
    actifs: 3
  }, {
    id: 'f2',
    nom: 'Gypse Beauce',
    metier: 'Gypse & joints',
    contact: 'Luc Vachon',
    tel: '418 555-7782',
    actifs: 4
  }, {
    id: 'f3',
    nom: 'Élec. Vachon',
    metier: 'Électricité',
    contact: 'Martin Vachon',
    tel: '418 555-3391',
    actifs: 5
  }, {
    id: 'f4',
    nom: 'Peinture Martin',
    metier: 'Peinture',
    contact: 'Martin Boutin',
    tel: '418 555-8847',
    actifs: 2
  }, {
    id: 'f5',
    nom: 'Céramique Plus',
    metier: 'Céramique & revêtement',
    contact: 'Sylvie Roy',
    tel: '418 555-6620',
    actifs: 3
  }, {
    id: 'f6',
    nom: 'Cuisines Beauce',
    metier: 'Armoires & comptoirs',
    contact: 'André Poulin',
    tel: '418 555-1145',
    actifs: 4
  }, {
    id: 'f7',
    nom: 'Ventil. Express',
    metier: 'Ventilation / CVC',
    contact: 'Éric Lessard',
    tel: '418 555-9903',
    actifs: 5
  }, {
    id: 'f8',
    nom: 'Bomat',
    metier: 'Matériaux de construction',
    contact: 'Comptoir pro',
    tel: '418 555-4400',
    actifs: 7
  }, {
    id: 'f9',
    nom: 'Canac',
    metier: 'Quincaillerie',
    contact: 'Comptoir contracteur',
    tel: '418 555-2002',
    actifs: 7
  }, {
    id: 'f10',
    nom: 'Rona',
    metier: 'Quincaillerie',
    contact: 'Comptoir pro',
    tel: '418 555-5567',
    actifs: 6
  }];

  /* --- JOURNAL D'ACTIVITÉ ------------------------------------------------ */
  const JOURNAL = [{
    qui: 'Nicolas Savard',
    action: 'a décalé l\u2019étape « Pose gypse » de +2 jours',
    cible: '210 Rang Saint-Charles',
    quand: 'il y a 12 min',
    icon: 'calendar-event'
  }, {
    qui: 'Sophie-Rose Dion',
    action: 'a marqué la tranche chantier comme reçue (272 300 $)',
    cible: '7 Chemin des Pins',
    quand: 'il y a 1 h',
    icon: 'cash'
  }, {
    qui: 'Carl Boucher',
    action: 'a signé un extra « Îlot de cuisine sur mesure » (3 900 $)',
    cible: '210 Rang Saint-Charles',
    quand: 'il y a 3 h',
    icon: 'receipt'
  }, {
    qui: 'Mélanie Vachon',
    action: 'a envoyé la cédule au client',
    cible: '18 Rue des Érables',
    quand: 'hier, 16 h 42',
    icon: 'send'
  }, {
    qui: 'Nicolas Savard',
    action: 'a complété l\u2019étape « Tireur de joints »',
    cible: '52 Rue des Bouleaux',
    quand: 'hier, 11 h 03',
    icon: 'circle-check'
  }, {
    qui: 'Sophie-Rose Dion',
    action: 'a ajouté une dépense « Bomat — 4 280 $ »',
    cible: '144 Route du Lac',
    quand: 'lun. 9 juin',
    icon: 'plus'
  }, {
    qui: 'Carl Boucher',
    action: 'a créé le projet',
    cible: '9 Place du Verger',
    quand: 'jeu. 28 mai',
    icon: 'building-plus'
  }];
  Object.assign(DG, {
    extras,
    extrasTotal,
    paiements,
    CATEGORIES,
    costing,
    costingGlobal,
    santeMarge,
    EMPLOYES,
    feuillesSemaine,
    semaineCourante,
    gcr,
    UTILISATEURS,
    ROLE_TINT,
    CLIENTS,
    FOURNISSEURS,
    JOURNAL
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/data-ext.js", error: String((e && e.message) || e) }); }

// ui_kits/crm/data.js
try { (() => {
/* ==========================================================================
   Habitations DG — UI kit shared data + logic (window.DG)
   Mirrors the production codebase: Québec money/date formatting, working-day
   date cascade, and auto task-status computation. Seed data from prisma/seed.ts
   + the 43-step TEMPLATE_JUMELE.
   ========================================================================== */
(function () {
  // "Today" for the kit — matches the project's current date so the Gantt's
  // completed / in-progress / upcoming split reads naturally.
  const TODAY = new Date(2026, 5, 12); // 12 juin 2026
  TODAY.setHours(0, 0, 0, 0);

  /* --- Québec formatting -------------------------------------------------- */
  const moisLong = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const moisShort = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juill.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  const joursLong = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  function formatMontant(n, dec = 2) {
    return new Intl.NumberFormat('fr-CA', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec
    }).format(n) + ' $';
  }
  function formatMontantCourt(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.', ',') + ' M$';
    if (n >= 1000) return Math.round(n / 1000) + ' k$';
    return formatMontant(n, 0);
  }
  function dateLong(d) {
    return `${d.getDate()} ${moisLong[d.getMonth()]} ${d.getFullYear()}`;
  }
  function dateCourt(d) {
    return `${d.getDate()} ${moisShort[d.getMonth()]}`;
  }
  function jourLong(d) {
    const s = `${joursLong[d.getDay()]} ${d.getDate()} ${moisLong[d.getMonth()]} ${d.getFullYear()}`;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /* --- Working-day date math (from cedula-utils.ts) ----------------------- */
  function addJoursOuvrables(date, n) {
    let d = new Date(date),
      count = 0;
    while (count < n) {
      d = new Date(d.getTime() + 86400000);
      const w = d.getDay();
      if (w !== 0 && w !== 6) count++;
    }
    return d;
  }
  function subJoursOuvrables(date, n) {
    let d = new Date(date),
      count = 0;
    while (count < n) {
      d = new Date(d.getTime() - 86400000);
      const w = d.getDay();
      if (w !== 0 && w !== 6) count++;
    }
    return d;
  }
  function joursOuvrableEntre(debut, fin) {
    let count = 0,
      cur = new Date(debut);
    cur.setHours(0, 0, 0, 0);
    const f = new Date(fin);
    f.setHours(0, 0, 0, 0);
    while (cur <= f) {
      const w = cur.getDay();
      if (w !== 0 && w !== 6) count++;
      cur.setDate(cur.getDate() + 1);
    }
    return count;
  }

  /* --- Auto task status by date (from task-status.ts / gantt-component) ---- */
  function tacheStatut(dateDebut, dateFin) {
    const debut = new Date(dateDebut);
    debut.setHours(0, 0, 0, 0);
    const fin = new Date(dateFin);
    fin.setHours(0, 0, 0, 0);
    const demain = new Date(TODAY);
    demain.setDate(TODAY.getDate() + 1);
    if (fin < TODAY) return 'termine';
    if (debut <= TODAY && fin >= TODAY) return 'encours';
    if (debut.getTime() === demain.getTime()) return 'demain';
    return 'avenir';
  }

  /* --- Phase config (from DashboardClient.tsx) ---------------------------- */
  const PHASES = {
    SIGNE: {
      label: 'Signé',
      bar: '#378ADD',
      tint: '#E6F1FB',
      ink: '#185FA5'
    },
    PREPARATION: {
      label: 'Préparation',
      bar: '#7F77DD',
      tint: '#EEEDFE',
      ink: '#3C3489'
    },
    CHANTIER: {
      label: 'Chantier',
      bar: '#EF9F27',
      tint: '#FAEEDA',
      ink: '#854F0B'
    },
    LIVRAISON: {
      label: 'Livraison',
      bar: '#639922',
      tint: '#EAF3DE',
      ink: '#3B6D11'
    },
    TERMINE: {
      label: 'Terminé',
      bar: '#B4B2A9',
      tint: '#F1EFE8',
      ink: '#5F5E5A'
    }
  };
  function phase(p) {
    return PHASES[p] || PHASES.SIGNE;
  }

  /* --- The canonical 43-step jumelé schedule (TEMPLATE_JUMELE) ------------ */
  const TEMPLATE = [['Excavation', 3, 'Interne'], ['Fondations', 5, 'Interne'], ['Charpente', 10, 'Interne'], ['Mur extérieur', 5, 'Interne'], ['Plombier fond de cave', 2, 'Plomberie Côté'], ['Couler plancher intérieur', 1, 'Interne'], ['Intérieur division', 3, 'Interne'], ['Installation foyer', 2, 'Interne'], ['Intérieur division (2)', 1, 'Interne'], ['Mesure armoire', 1, 'Cuisines Beauce'], ['Air climatisé', 1, 'Ventil. Express'], ['Électricien + TV & Tél', 2, 'Élec. Vachon'], ['Plombier', 1, 'Plomberie Côté'], ['Échangeur d\u2019air', 1, 'Ventil. Express'], ['Isolation entretoit', 1, 'Interne'], ['Mesure finition', 1, 'Interne'], ['Final menuiserie', 2, 'Interne'], ['Entrée gypse', 1, 'Gypse Beauce'], ['Pose gypse', 3, 'Gypse Beauce'], ['Tireur de joints', 5, 'Gypse Beauce'], ['Entrée finition', 1, 'Interne'], ['Pose finition', 3, 'Interne'], ['Peinture', 3, 'Peinture Martin'], ['Livraison céramique', 1, 'Céramique Plus'], ['Pose céramique', 2, 'Céramique Plus'], ['Coulis', 1, 'Céramique Plus'], ['Livraison armoire', 1, 'Cuisines Beauce'], ['Pose armoire', 1, 'Cuisines Beauce'], ['Dosseret', 1, 'Cuisines Beauce'], ['Livraison fixture', 1, 'Interne'], ['Finition électrique + TV & Tél', 1, 'Élec. Vachon'], ['Finition plomberie', 1, 'Plomberie Côté'], ['Finition échangeur d\u2019air', 1, 'Ventil. Express'], ['Air climatisé final', 1, 'Ventil. Express'], ['Installation porte de douche', 1, 'Interne'], ['Pose escalier ou rampe', 1, 'Interne'], ['Pose plancher', 2, 'Interne'], ['Petite finition', 1, 'Interne'], ['Peinture finale', 2, 'Peinture Martin'], ['Pose miroir + tablettes', 1, 'Interne'], ['Service +', 1, 'Interne'], ['Pose tapis', 1, 'Interne'], ['Ménage', 1, 'Interne']];

  // Visible-client default: first 8 are internal/structural -> false
  const INTERNE_COUNT = 8;

  /* Build a dated schedule anchored to a delivery date (livraison - 5 ouvr.) */
  function buildSchedule(dateLivraison) {
    const etapes = TEMPLATE.map((t, i) => ({
      ordre: i + 1,
      nom: t[0],
      jours: t[1],
      assigneA: t[2],
      buffer: 0,
      visibleClient: i >= INTERNE_COUNT,
      dateDebut: null,
      dateFin: null
    }));
    let cursor = subJoursOuvrables(dateLivraison, 5);
    for (let i = etapes.length - 1; i >= 0; i--) {
      const e = etapes[i];
      e.dateFin = new Date(cursor);
      e.dateDebut = e.jours <= 1 ? new Date(cursor) : subJoursOuvrables(cursor, e.jours - 1);
      cursor = subJoursOuvrables(e.dateDebut, 1);
    }
    etapes.forEach(e => {
      e.statut = tacheStatut(e.dateDebut, e.dateFin);
    });
    return etapes;
  }

  /* --- Projects (from seed.ts) ------------------------------------------- */
  const projets = [{
    id: 'p1',
    slug: 'michel-rodrigue',
    client: 'Michel Rodrigue',
    adresse: '18 Rue des Érables',
    ville: 'Saint-Henri',
    type: 'JUMELE',
    contrat: 'PRELIMINAIRE',
    montant: 487500,
    phase: 'LIVRAISON',
    avancement: 88,
    dateContrat: new Date(2025, 8, 15),
    dateLivraison: new Date(2026, 5, 20)
  }, {
    id: 'p2',
    slug: 'isabelle-cloutier',
    client: 'Isabelle Cloutier',
    adresse: '7 Chemin des Pins',
    ville: 'Saint-Lazare-de-Bellechasse',
    type: 'MAISON',
    contrat: 'ENTREPRISE',
    montant: 612000,
    phase: 'CHANTIER',
    avancement: 60,
    dateContrat: new Date(2025, 10, 3),
    dateLivraison: new Date(2026, 7, 14)
  }, {
    id: 'p3',
    slug: 'steve-beaulieu',
    client: 'Steve Beaulieu',
    adresse: '144 Route du Lac',
    ville: 'Saint-Damien-de-Buckland',
    type: 'JUMELE',
    contrat: 'ENTREPRISE',
    montant: 398000,
    phase: 'CHANTIER',
    avancement: 25,
    dateContrat: new Date(2026, 0, 20),
    dateLivraison: new Date(2026, 9, 3)
  }, {
    id: 'p4',
    slug: 'nathalie-grondin',
    client: 'Nathalie Grondin',
    adresse: '33 Rue Principale',
    ville: 'Saint-Gervais',
    type: 'MAISON',
    contrat: 'PRELIMINAIRE',
    montant: 541000,
    phase: 'PREPARATION',
    avancement: 5,
    dateContrat: new Date(2026, 3, 8),
    dateLivraison: new Date(2026, 11, 18)
  }, {
    id: 'p5',
    slug: 'marc-page',
    client: 'Marc Pagé',
    adresse: '52 Rue des Bouleaux',
    ville: 'Honfleur',
    type: 'JUMELE',
    contrat: 'ENTREPRISE',
    montant: 421000,
    phase: 'CHANTIER',
    avancement: 42,
    dateContrat: new Date(2025, 11, 2),
    dateLivraison: new Date(2026, 8, 11)
  }, {
    id: 'p6',
    slug: 'julie-fortin',
    client: 'Julie Fortin',
    adresse: '9 Place du Verger',
    ville: 'Sainte-Claire',
    type: 'MAISON',
    contrat: 'PRELIMINAIRE',
    montant: 573000,
    phase: 'SIGNE',
    avancement: 0,
    dateContrat: new Date(2026, 4, 28),
    dateLivraison: new Date(2027, 1, 5)
  }, {
    id: 'p7',
    slug: 'eric-lemieux',
    client: 'Éric Lemieux',
    adresse: '210 Rang Saint-Charles',
    ville: 'Saint-Anselme',
    type: 'JUMELE',
    contrat: 'ENTREPRISE',
    montant: 389000,
    phase: 'CHANTIER',
    avancement: 71,
    dateContrat: new Date(2025, 9, 18),
    dateLivraison: new Date(2026, 6, 9)
  }];

  // Derive avancement from the dated schedule so the % matches the Gantt exactly.
  projets.forEach(p => {
    if (p.phase === 'SIGNE') {
      p.avancement = 0;
      return;
    }
    const s = buildSchedule(p.dateLivraison);
    p.avancement = Math.round(s.filter(e => e.statut === 'termine').length / s.length * 100);
  });
  // Showcase project for the Cédule screen — richest status spread.
  const SHOWCASE = 'p7';
  function joursRestants(d) {
    return Math.round((d - TODAY) / 86400000);
  }
  function prochaineEtape(p) {
    const sched = buildSchedule(p.dateLivraison);
    return sched.find(e => e.statut === 'encours') || sched.find(e => e.statut === 'demain') || sched.find(e => e.statut === 'avenir') || sched[sched.length - 1];
  }

  /* --- Dashboard derived data -------------------------------------------- */
  const alertes = [{
    type: 'urgent',
    titre: 'Livraison imminente',
    sous: '18 Rue des Érables · Michel Rodrigue',
    badge: '8 j',
    projet: 'p1'
  }, {
    type: 'warn',
    titre: 'Extra non signé · 890 $',
    sous: '144 Route du Lac · Steve Beaulieu',
    badge: 'À confirmer',
    projet: 'p3'
  }, {
    type: 'warn',
    titre: 'Paiement en retard · 187 500 $',
    sous: '7 Chemin des Pins · Isabelle Cloutier',
    badge: 'Tranche 2',
    projet: 'p2'
  }];

  // Week agenda — steps grouped by weekday (lun→ven), drawn from live schedules
  function semaineAgenda() {
    const lundi = new Date(TODAY);
    const dow = lundi.getDay();
    lundi.setDate(lundi.getDate() - (dow === 0 ? 6 : dow - 1));
    const jours = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(lundi);
      d.setDate(lundi.getDate() + i);
      d.setHours(0, 0, 0, 0);
      jours.push({
        date: d,
        label: jourLong(d).replace(/ \d{4}$/, ''),
        etapes: []
      });
    }
    projets.forEach(p => {
      const sched = buildSchedule(p.dateLivraison);
      sched.forEach(e => {
        const ds = new Date(e.dateDebut);
        ds.setHours(0, 0, 0, 0);
        jours.forEach(j => {
          if (ds.getTime() === j.date.getTime()) j.etapes.push({
            nom: e.nom,
            projet: p.adresse,
            client: p.client,
            assigneA: e.assigneA,
            phase: p.phase
          });
        });
      });
    });
    return jours.filter(j => j.etapes.length);
  }
  window.DG = {
    TODAY,
    moisLong,
    moisShort,
    joursLong,
    formatMontant,
    formatMontantCourt,
    dateLong,
    dateCourt,
    jourLong,
    addJoursOuvrables,
    subJoursOuvrables,
    joursOuvrableEntre,
    tacheStatut,
    PHASES,
    phase,
    TEMPLATE,
    buildSchedule,
    projets,
    alertes,
    semaineAgenda,
    SHOWCASE,
    joursRestants,
    prochaineEtape,
    montantTotalChantier: projets.filter(p => ['CHANTIER', 'LIVRAISON'].includes(p.phase)).reduce((s, p) => s + p.montant, 0)
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.CardHeader = __ds_scope.CardHeader;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.MetricCard = __ds_scope.MetricCard;

__ds_ns.PhaseBadge = __ds_scope.PhaseBadge;

__ds_ns.PHASE_COLORS = __ds_scope.PHASE_COLORS;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.StatusDot = __ds_scope.StatusDot;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Toggle = __ds_scope.Toggle;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Skeleton = __ds_scope.Skeleton;

__ds_ns.SkeletonRow = __ds_scope.SkeletonRow;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.ToastStack = __ds_scope.ToastStack;

__ds_ns.FilterChip = __ds_scope.FilterChip;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Stepper = __ds_scope.Stepper;

})();
