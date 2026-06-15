import { ReactNode } from "react";

export type ToastTone = "neutral" | "success" | "warning" | "danger" | "info";

export interface ToastProps {
  /** Semantic color of the accent bar + icon. @default "neutral" */
  tone?: ToastTone;
  title?: ReactNode;
  message?: ReactNode;
  /** Optional action node (e.g. an "Annuler" button). */
  action?: ReactNode;
  /** Tabler icon name override (without the `ti ti-` prefix). */
  icon?: string;
  /** Shows a close affordance when provided. */
  onClose?: () => void;
}

export interface ToastStackProps {
  children: ReactNode;
  position?: "bottom-right" | "bottom-left" | "top-right";
}

/** Toast notification + its fixed stack container. */
export function Toast(props: ToastProps): JSX.Element;
export function ToastStack(props: ToastStackProps): JSX.Element;
