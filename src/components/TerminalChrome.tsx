import React from "react";
import { monoFontFamily } from "../config/fonts";
import { PALETTE } from "../config/theme";

// macOS-style window titlebar — the "this is a code editor" visual cue used
// on the title/end cards.
export const TerminalChrome: React.FC<{ label: string; scaleUnit: number }> = ({ label, scaleUnit }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12 * scaleUnit,
        background: PALETTE.bgPanel,
        border: `1px solid ${PALETTE.border}`,
        borderRadius: 10 * scaleUnit,
        padding: `${10 * scaleUnit}px ${18 * scaleUnit}px`,
        fontFamily: monoFontFamily,
        fontSize: 15 * scaleUnit,
        color: PALETTE.textMuted,
      }}
    >
      <div style={{ display: "flex", gap: 6 * scaleUnit }}>
        <Dot color={PALETTE.macRed} size={9 * scaleUnit} />
        <Dot color={PALETTE.macYellow} size={9 * scaleUnit} />
        <Dot color={PALETTE.macGreen} size={9 * scaleUnit} />
      </div>
      <span>{label}</span>
    </div>
  );
};

const Dot: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: color }} />
);
