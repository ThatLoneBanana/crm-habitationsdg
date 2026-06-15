import { ReactNode, ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Props for the primary action button.
 *
 * @startingPoint section="Core" subtitle="Buttons in every variant & size" viewport="700x150"
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. `primary` is DG red — use one per view. `success` is for positive/confirm actions only, never a generic CTA. */
  variant?: ButtonVariant;
  /** Control height. @default "md" (28px) */
  size?: ButtonSize;
  /** Leading icon node, e.g. `<i className="ti ti-plus" />`. */
  icon?: ReactNode;
  /** Trailing icon node. */
  iconTrailing?: ReactNode;
  children?: ReactNode;
}

/**
 * Primary action button for the Habitations DG CRM.
 */
export function Button(props: ButtonProps): JSX.Element;
