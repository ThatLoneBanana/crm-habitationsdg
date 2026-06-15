import { ReactNode } from "react";

export interface ToggleProps {
  /** On/off state. */
  checked?: boolean;
  /** Called with `(checked, event)`. */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Optional trailing label. */
  label?: ReactNode;
  disabled?: boolean;
  className?: string;
}

/** On/off switch — e.g. the "visible client" toggle on a cédule step. Green when on. */
export function Toggle(props: ToggleProps): JSX.Element;
