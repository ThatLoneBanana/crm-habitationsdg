import { ReactNode, CSSProperties } from "react";

export interface EmptyStateProps {
  /** Tabler icon name (without `ti ti-`). @default "inbox" */
  icon?: string;
  title: ReactNode;
  message?: ReactNode;
  /** Optional primary action (button). */
  action?: ReactNode;
  /** Tighter padding for in-card empties. @default false */
  compact?: boolean;
  style?: CSSProperties;
}

/** Empty-state block for "aucun projet / aucune cédule / aucune dépense" etc. */
export function EmptyState(props: EmptyStateProps): JSX.Element;
