export interface FilterChipProps {
  label: string;
  active?: boolean;
  /** Leading status dot color (e.g. a phase bar color). */
  dotColor?: string;
  /** Trailing count. */
  count?: number;
  onClick?: () => void;
  className?: string;
}

/** Toggleable filter chip — phase filters, map legend. Active = solid near-black. */
export function FilterChip(props: FilterChipProps): JSX.Element;
