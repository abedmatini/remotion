import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily, monoFontFamily } from "../config/fonts";
import { BRAND } from "../config/brand";
import { PALETTE } from "../config/theme";
import { BlinkingCursor } from "./BlinkingCursor";
import { TerminalChrome } from "./TerminalChrome";

export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, durationInFrames } = useVideoConfig();
  const scaleUnit = width / 1080;

  const punchIn = interpolate(frame, [0, 12], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    output: "perceptual-scale",
  });
  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 6, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 15%, ${PALETTE.accentSoft} 0%, ${PALETTE.bgDeep} 55%), ${PALETTE.bgDeep}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily,
        opacity: opacity * exitOpacity,
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
        <TerminalChrome label={BRAND.introChromeLabel} scaleUnit={scaleUnit} />
      </div>

      <div style={{ scale: punchIn, textAlign: "center" }}>
        <div
          style={{
            fontSize: 96 * scaleUnit,
            fontWeight: 700,
            color: PALETTE.textPrimary,
            letterSpacing: -1,
          }}
        >
          ☕ {BRAND.title}
          <BlinkingCursor fontSize={96 * scaleUnit} color={PALETTE.accent} />
        </div>
        <div
          style={{
            fontFamily: monoFontFamily,
            fontSize: 40 * scaleUnit,
            fontWeight: 500,
            color: PALETTE.coffeeCream,
            marginTop: 18 * scaleUnit,
          }}
        >
          <span style={{ color: PALETTE.accent }}>{">"}</span> {BRAND.tagline}
        </div>
        <div
          style={{
            fontFamily: monoFontFamily,
            fontSize: 26 * scaleUnit,
            fontWeight: 500,
            color: PALETTE.textComment,
            marginTop: 18 * scaleUnit,
            letterSpacing: 0.5,
          }}
        >
          // {BRAND.dateLabel.toLowerCase()}
        </div>
      </div>
    </AbsoluteFill>
  );
};
