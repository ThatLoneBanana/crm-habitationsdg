import React from "react";

const PALETTE = ["#1D9E75", "#378ADD", "#7F77DD", "#EF9F27", "#C0563B", "#5F8F3A"];

function hashColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
}

const SIZES = { sm: 24, md: 32, lg: 40 };

/** Initials avatar with a deterministic color from the name. */
export function Avatar({ name = "", size = "md", color = null, className = "", style = {}, ...rest }) {
  const px = typeof size === "number" ? size : SIZES[size] || SIZES.md;
  const parts = name.trim().split(/\s+/);
  const initials = ((parts[0]?.[0] || "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "?";
  const bg = color || hashColor(name || "?");
  return (
    <span
      className={`dg-avatar ${className}`}
      title={name || undefined}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: px, height: px, borderRadius: "50%", background: bg, color: "#fff",
        fontFamily: "var(--font-sans)", fontWeight: "var(--fw-semibold)",
        fontSize: Math.round(px * 0.4), letterSpacing: ".01em", flex: "0 0 auto", ...style,
      }}
      {...rest}
    >
      {initials}
    </span>
  );
}
