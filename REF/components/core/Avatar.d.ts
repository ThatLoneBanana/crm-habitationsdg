import { HTMLAttributes } from "react";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Full name — initials and the auto color are derived from it. */
  name: string;
  /** Size keyword or explicit px. @default "md" (32px) */
  size?: "sm" | "md" | "lg" | number;
  /** Override the auto background color. */
  color?: string | null;
}

/** Initials avatar with a deterministic color from the name. */
export function Avatar(props: AvatarProps): JSX.Element;
