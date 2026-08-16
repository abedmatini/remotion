import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "../config/fonts";
import { BRAND } from "../config/brand";
import { PALETTE } from "../config/theme";
import { TerminalChrome } from "./TerminalChrome";

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const scaleUnit = width / 1080;

  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // A slow breathing pulse so the "held" end card is never fully static.
  const breathe = 1 + Math.sin(frame / 20) * 0.015;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 85%, ${PALETTE.accentSoft} 0%, ${PALETTE.bgDeep} 55%), ${PALETTE.bgDeep}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily,
        opacity,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 64 * scaleUnit,
          left: "50%",
          translate: "-50% 0px",
        }}
      >
        <TerminalChrome label={BRAND.outroChromeLabel} scaleUnit={scaleUnit} />
      </div>

      <div
        style={{
          scale: breathe,
          textAlign: "center",
          fontSize: 60 * scaleUnit,
          fontWeight: 700,
          color: PALETTE.textPrimary,
        }}
      >
        {BRAND.ctaText} ☕
      </div>
    </AbsoluteFill>
  );
};
