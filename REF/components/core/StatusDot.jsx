import React from "react";

const STATUS = {
  termine: { color: "var(--task-termine)", label: "Terminé" },
  encours: { color: "var(--task-encours)", label: "En cours" },
  demain:  { color: "var(--task-demain)",  label: "Commence demain" },
  avenir:  { color: "var(--task-avenir)",  label: "À venir" },
};

/**
 * Task-status dot, color-keyed to the Gantt status system. Optionally labelled,
 * and optionally "pulsing" for the live "en cours" state.
 */
export function StatusDot({ status = "avenir", showLabel = false, pulse = false, size = 8, className = "", style = {}, ...rest }) {
  const s = STATUS[status] || STATUS.avenir;
  return (
    <span
      className={`dg-status ${className}`}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, ...style }}
      {...rest}
    >
      <span
        style={{
          width: size, height: size, borderRadius: "50%", background: s.color, flex: "0 0 auto",
          boxShadow: pulse ? `0 0 0 0 ${s.color}` : "none",
          animation: pulse && status === "encours" ? "dg-pulse 1.8s var(--ease-out) infinite" : "none",
        }}
      />
      {showLabel ? (
        <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--fw-medium)", color: "var(--text-secondary)" }}>{s.label}</span>
      ) : null}
      <style>{`@keyframes dg-pulse{0%{box-shadow:0 0 0 0 rgba(29,158,117,.4)}70%{box-shadow:0 0 0 5px rgba(29,158,117,0)}100%{box-shadow:0 0 0 0 rgba(29,158,117,0)}}`}</style>
    </span>
  );
}
