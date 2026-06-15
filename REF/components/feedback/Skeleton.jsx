import React from "react";

/** Shimmering skeleton block for loading states. */
export function Skeleton({ width = "100%", height = 14, radius = "var(--radius-sm)", style = {}, className = "" }) {
  return (
    <span
      className={`dg-skeleton ${className}`}
      style={{ display: "block", width, height, borderRadius: radius,
        background: "linear-gradient(90deg, var(--n-100) 25%, var(--n-150) 37%, var(--n-100) 63%)",
        backgroundSize: "400% 100%", animation: "dg-shimmer 1.4s ease infinite", ...style }}
    >
      <style>{`@keyframes dg-shimmer{0%{background-position:100% 50%}100%{background-position:0 50%}}`}</style>
    </span>
  );
}

/** A skeleton placeholder shaped like a list/table row. */
export function SkeletonRow({ cols = [40, "60%", 80], height = 12, gap = 16, style = {} }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap, padding: "12px 14px", ...style }}>
      {cols.map((w, i) => <Skeleton key={i} width={typeof w === "number" ? w : w} height={height} />)}
    </div>
  );
}
