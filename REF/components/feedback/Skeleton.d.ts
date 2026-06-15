import { CSSProperties } from "react";

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: string;
  style?: CSSProperties;
  className?: string;
}

export interface SkeletonRowProps {
  /** Column widths (px number or CSS string). */
  cols?: (number | string)[];
  height?: number;
  gap?: number;
  style?: CSSProperties;
}

/** Shimmering loading placeholders. */
export function Skeleton(props: SkeletonProps): JSX.Element;
export function SkeletonRow(props: SkeletonRowProps): JSX.Element;
