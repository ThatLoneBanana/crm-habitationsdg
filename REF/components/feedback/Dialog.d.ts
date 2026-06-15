import { ReactNode } from "react";

export interface DialogProps {
  open?: boolean;
  onClose?: () => void;
  title: ReactNode;
  /** Tabler icon name (without `ti ti-`), shown in a tinted square. */
  icon?: string;
  /** `danger` tints the icon square + title red for destructive confirmations. */
  tone?: "neutral" | "danger" | "warning" | "success";
  /** Body content. */
  children?: ReactNode;
  /** Footer actions (right-aligned), e.g. cancel + confirm buttons. */
  footer?: ReactNode;
  /** Dialog width in px. @default 460 */
  width?: number;
}

/** Modal dialog with scrim, header, body and footer. Use for confirmations. */
export function Dialog(props: DialogProps): JSX.Element | null;
