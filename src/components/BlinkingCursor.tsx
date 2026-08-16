import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

// A terminal-style blinking caret. Frame-driven (not CSS animation): toggles
// visibility on a fixed frame interval derived from fps, matching a ~2Hz
// blink regardless of the composition's fps.
export const BlinkingCursor: React.FC<{
  fontSize: number;
  color?: string;
}> = ({ fontSize, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const blinkIntervalFrames = Math.max(1, Math.round(fps * 0.5));
  const visible = Math.floor(frame / blinkIntervalFrames) % 2 === 0;

  return (
    <span
      style={{
        display: "inline-block",
        width: fontSize * 0.5,
        height: fontSize * 0.9,
        marginLeft: fontSize * 0.12,
        background: color,
        opacity: visible ? 1 : 0,
        verticalAlign: "middle",
        translate: `0px ${fontSize * 0.05}px`,
      }}
    />
  );
};
