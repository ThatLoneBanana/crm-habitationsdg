import React from "react";

const PHASES = {
  SIGNE:       { label: "Signé",       tint: "var(--phase-signe-tint)",       ink: "var(--phase-signe-ink)",       bar: "var(--phase-signe-bar)" },
  PREPARATION: { label: "Préparation", tint: "var(--phase-preparation-tint)", ink: "var(--phase-preparation-ink)", bar: "var(--phase-preparation-bar)" },
  CHANTIER:    { label: "Chantier",    tint: "var(--phase-chantier-tint)",    ink: "var(--phase-chantier-ink)",    bar: "var(--phase-chantier-bar)" },
  LIVRAISON:   { label: "Livraison",   tint: "var(--phase-livraison-tint)",   ink: "var(--phase-livraison-ink)",   bar: "var(--phase-livraison-bar)" },
  TERMINE:     { label: "Terminé",     tint: "var(--phase-termine-tint)",     ink: "var(--phase-termine-ink)",     bar: "var(--phase-termine-bar)" },
};

/**
 * Project-lifecycle phase badge. Owns the canonical 5-phase palette.
 * Pass the phase key (SIGNE | PREPARATION | CHANTIER | LIVRAISON | TERMINE).
 */
export function PhaseBadge({ phase = "SIGNE", solid = false, className = "", style = {}, ...rest }) {
  const p = PHASES[phase] || PHASES.SIGNE;
  const base = {
    display: "inline-flex", alignItems: "center", gap: 5,
    fontFamily: "var(--font-sans)", fontSize: "var(--text-2xs)", fontWeight: "var(--fw-semibold)",
    lineHeight: 1, letterSpacing: ".01em", whiteSpace: "nowrap",
    padding: "3px 8px", borderRadius: "var(--radius-full)",
  };
  const skin = solid
    ? { background: p.bar, color: "#fff" }
    : { background: p.tint, color: p.ink };
  return (
    <span className={`dg-phase ${className}`} style={{ ...base, ...skin, ...style }} {...rest}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: solid ? "rgba(255,255,255,.85)" : p.bar, flex: "0 0 auto" }} />
      {p.label}
    </span>
  );
}

/** Exposed for charts/bars that need the raw phase color. */
export const PHASE_COLORS = PHASES;
