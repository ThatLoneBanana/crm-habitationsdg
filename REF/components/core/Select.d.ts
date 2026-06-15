import { ReactNode, SelectHTMLAttributes } from "react";

export interface SelectOption { value: string; label: string; }

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Field label rendered above the control. */
  label?: ReactNode;
  /** Options as strings or `{value,label}`. Omit to pass `<option>` children. */
  options?: (string | SelectOption)[] | null;
  /** @default "md" (32px). `sm` matches inline table controls (28px). */
  size?: "sm" | "md";
}

/** Native select styled to match the field system — e.g. the trade (corps de métier) picker. */
export function Select(props: SelectProps): JSX.Element;
