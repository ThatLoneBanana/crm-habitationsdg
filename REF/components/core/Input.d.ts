import { ReactNode, InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Field label rendered above the input. */
  label?: ReactNode;
  /** Leading icon node, e.g. `<i className="ti ti-search" />`. */
  icon?: ReactNode;
  /** Helper text below the field. */
  hint?: ReactNode;
  /** Error message — sets the invalid state and red hint. */
  error?: ReactNode;
  /** Force the invalid styling without a message. */
  invalid?: boolean;
}

/** Text input with label, optional leading icon, hint and error states. */
export function Input(props: InputProps): JSX.Element;
