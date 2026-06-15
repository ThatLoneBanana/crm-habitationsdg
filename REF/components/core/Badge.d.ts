import { ReactNode, HTMLAttributes } from "react";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger" | "info" | "outline";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Semantic color. @default "neutral" */
  tone?: BadgeTone;
  /** Fully rounded pill shape. @default false */
  pill?: boolean;
  /** Show a leading status dot in the current color. @default false */
  dot?: boolean;
  children: ReactNode;
}

/** Small status / category label. For project phases use `PhaseBadge` instead. */
export function Badge(props: BadgeProps): JSX.Element;
