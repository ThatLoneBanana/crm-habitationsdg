import React from "react";

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
    el.id = id; el.textContent = css;
    document.head.appendChild(el);
  }, [id, css]);
}

/** On/off switch. Used for the "visible client" toggle on cédule steps. */
export function Toggle({ checked = false, onChange, label, disabled = false, className = "", ...rest }) {
  useInjected(STYLE_ID, CSS);
  return (
    <label className={`dg-toggle ${disabled ? "dg-toggle--disabled" : ""} ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.checked, e)}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
        {...rest}
      />
      <span className={`dg-toggle__track ${checked ? "dg-toggle__track--on" : ""}`}>
        <span className="dg-toggle__thumb" />
      </span>
      {label ? <span className="dg-toggle__label">{label}</span> : null}
    </label>
  );
}
