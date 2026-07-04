import React from "react";
import { COLORS } from "../../theme";
import { AppleEmoji } from "./AppleEmoji";

/* ---- hoisted static styles (perf: avoid re-allocating on every render) ---- */
const __style1 = { width: "100%", height: "100%", objectFit: "cover" } as const;


export interface StickerProps {
  e?: string | null;
  size?: number;
  radius?: number;
  bg?: string;
  ring?: boolean;
  borderColor?: string;
  title?: string;
  photo?: string | null;
}

export const Sticker = React.memo(function Sticker({ e, size = 40, radius, bg = "#0A1620", ring = false, borderColor, title, photo }: StickerProps) {
  const r = radius ?? Math.round(size * 0.28);
  return (
    <div
      title={title}
      style={{
        width: size,
        height: size,
        borderRadius: r,
        background: bg,
        border: `1px solid ${borderColor || (ring ? COLORS.border : "rgba(255,255,255,0.08)")}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {photo ? (
        <img src={photo} alt={title || ""} style={__style1} />
      ) : (
        <AppleEmoji e={e} size={Math.round(size * 0.58)} />
      )}
    </div>
  );
});

