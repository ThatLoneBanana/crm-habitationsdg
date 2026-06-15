import { ReactNode, HTMLAttributes } from "react";

/**
 * Props for the dashboard KPI tile.
 *
 * @startingPoint section="Core" subtitle="KPI metric tile" viewport="260x120"
 */
export interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Small label above the figure, e.g. "Projets actifs". */
  label: ReactNode;
  /** The headline figure (pre-formatted string or node), e.g. "2,1 M$". */
  value: ReactNode;
  /** Supporting sub-line, e.g. "1 urgente". */
  sub?: ReactNode;
  /** Leading icon node. */
  icon?: ReactNode;
  /** Color of the figure — use to signal urgency. @default "neutral" */
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}

/**
 * Dashboard KPI tile.
 */
export function MetricCard(props: MetricCardProps): JSX.Element;
