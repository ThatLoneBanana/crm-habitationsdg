import { HTMLAttributes } from "react";
import { Phase } from "./PhaseBadge";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Completion 0–100. */
  value?: number;
  /** Color the bar by project phase. */
  phase?: Phase | null;
  /** Explicit bar color (overrides `phase`). */
  color?: string | null;
  /** Bar thickness in px. @default 3 */
  height?: number;
}

/** Thin progress bar, colored by project phase. */
export function ProgressBar(props: ProgressBarProps): JSX.Element;
