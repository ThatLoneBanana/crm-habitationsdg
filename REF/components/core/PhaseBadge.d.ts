import { HTMLAttributes } from "react";

export type Phase = "SIGNE" | "PREPARATION" | "CHANTIER" | "LIVRAISON" | "TERMINE";

export interface PhaseBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Lifecycle phase key. @default "SIGNE" */
  phase?: Phase;
  /** Solid (filled bar color) vs. tint background. @default false */
  solid?: boolean;
}

/** Project-lifecycle phase badge — owns the canonical 5-phase palette. */
export function PhaseBadge(props: PhaseBadgeProps): JSX.Element;

export const PHASE_COLORS: Record<Phase, { label: string; tint: string; ink: string; bar: string }>;
