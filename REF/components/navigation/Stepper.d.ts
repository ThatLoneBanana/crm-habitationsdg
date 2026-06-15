export interface StepperStep { label: string; }

export interface StepperProps {
  /** Step labels (strings or `{label}`). */
  steps: (string | StepperStep)[];
  /** Zero-based index of the active step. */
  current: number;
  className?: string;
}

/** Horizontal step indicator for multi-step flows (project creation). */
export function Stepper(props: StepperProps): JSX.Element;
