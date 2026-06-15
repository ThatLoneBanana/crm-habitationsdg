export interface SegmentOption { value: string; label: string; icon?: string; }

export interface SegmentedControlProps {
  /** Options as strings or `{value,label,icon}`. */
  options: (string | SegmentOption)[];
  value: string;
  onChange?: (value: string) => void;
  /** @default "md" (32px) */
  size?: "sm" | "md";
  className?: string;
}

/** Segmented control for 2–4 short options (mode toggles, view switches). */
export function SegmentedControl(props: SegmentedControlProps): JSX.Element;
