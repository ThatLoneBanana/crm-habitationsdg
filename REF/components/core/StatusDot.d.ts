import { HTMLAttributes } from "react";

export type TaskStatus = "termine" | "encours" | "demain" | "avenir";

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  /** Auto-computed task status. @default "avenir" */
  status?: TaskStatus;
  /** Show the French status label next to the dot. @default false */
  showLabel?: boolean;
  /** Pulse animation (only animates for `encours`). @default false */
  pulse?: boolean;
  /** Dot diameter in px. @default 8 */
  size?: number;
}

/** Task-status dot keyed to the Gantt status colors. */
export function StatusDot(props: StatusDotProps): JSX.Element;
