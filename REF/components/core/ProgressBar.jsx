import React from "react";
import { PHASE_COLORS } from "./PhaseBadge.jsx";

/**
 * Thin progress bar, colored by project phase (or a custom color).
 * Track is the neutral fill; the bar uses the phase bar color.
 */
export function ProgressBar({ value = 0, phase = null, color = null, height = 3, className = "", style = {}, ...rest }) {
  const pct = Math.max(0, Math.min(100, value));
  const barColor = color || (phase && PHASE_COLORS[phase] ? PHASE_COLORS[phase].bar : "var(--accent)");
  return (
    <div
      className={`dg-progress ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ height, background: "var(--n-100)", borderRadius: "var(--radius-full)", overflow: "hidden", ...style }}
      {...rest}
    >
      <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: "var(--radius-full)", transition: "width var(--dur-slow) var(--ease-out)" }} />
    </div>
  );
}
