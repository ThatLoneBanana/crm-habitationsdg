import { ReactNode, ButtonHTMLAttributes } from "react";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. @default "ghost" */
  variant?: "ghost" | "outline" | "danger";
  /** @default "md" (28px) */
  size?: "sm" | "md" | "lg";
  /** Accessible label (also the tooltip). */
  label: string;
  /** Icon node, e.g. `<i className="ti ti-dots" />`. */
  children: ReactNode;
}

/** Square icon-only button for toolbar actions and row affordances. */
export function IconButton(props: IconButtonProps): JSX.Element;
