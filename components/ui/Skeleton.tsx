import React from "react";

/* ---- hoisted static styles (perf: avoid re-allocating on every render) ---- */
const __style1 = { borderRadius: 12, overflow: "hidden" } as const;
const __style2 = { marginTop: 6 } as const;


export interface SkeletonProps {
  variant?: "line" | "circle" | "rect" | "card";
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}

export const Skeleton = React.memo(function Skeleton({ variant = "line", width, height, style: extraStyle = {} }: SkeletonProps) {
  const base = {
    background: "linear-gradient(90deg, #102433 25%, #17303F 37%, #102433 63%)",
    backgroundSize: "400% 100%",
    animation: "skeletonShimmer 1.4s ease infinite",
    borderRadius: variant === "circle" ? "50%" : 8,
  };
  const dims =
    variant === "card" ? { width: width ?? "100%", aspectRatio: "1/1" } :
    variant === "circle" ? { width: width ?? 40, height: height ?? 40 } :
    { width: width ?? "100%", height: height ?? 12 };
  return (
    <>
      <style>{`@keyframes skeletonShimmer { 0%{background-position:100% 50%} 100%{background-position:0% 50%} }`}</style>
      <div style={{ ...base, ...dims, ...extraStyle }} />
    </>
  );
});


export interface SkeletonGridProps {
  count?: number;
  columns?: number;
}

export function SkeletonGrid({ count = 3, columns = 3 }: SkeletonGridProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 8 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={__style1}>
          <Skeleton variant="card" />
          <Skeleton height={10} style={__style2} />
        </div>
      ))}
    </div>
  );
}

