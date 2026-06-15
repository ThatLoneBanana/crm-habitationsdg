import React from "react";

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
    el.id = id; el.textContent = css;
    document.head.appendChild(el);
  }, [id, css]);
}

/** Small status / category label. */
export function Badge({ tone = "neutral", pill = false, dot = false, children, className = "", ...rest }) {
  useInjected(STYLE_ID, CSS);
  return (
    <span className={`dg-badge dg-badge--${tone} ${pill ? "dg-badge--pill" : ""} ${className}`} {...rest}>
      {dot ? <span className="dg-badge__dot" /> : null}
      {children}
    </span>
  );
}
