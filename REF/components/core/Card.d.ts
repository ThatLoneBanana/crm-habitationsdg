import { ReactNode, HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Inner padding. Pass `""`/`false` for an unpadded card (e.g. a list or header+body). @default "16px" */
  padding?: string | false;
  children: ReactNode;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Leading icon node. */
  icon?: ReactNode;
  /** Header title. */
  title: ReactNode;
  /** Right-aligned action (button, count, link). */
  action?: ReactNode;
}

/** Crisp bordered container — the dominant surface in the CRM. Flat at rest. */
export function Card(props: CardProps): JSX.Element;
export function CardHeader(props: CardHeaderProps): JSX.Element;
