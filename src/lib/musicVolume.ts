import { interpolate } from "remotion";

const FADE_IN_FRAMES = 15;
const FADE_OUT_FRAMES = 45;
const VOLUME = 0.85;

/**
 * Frame -> volume callback for the background track. Video clips have their
 * own audio muted (see KenBurnsMedia), so this doesn't need to duck under
 * anything — just a quick fade-in at the start and a clean fade-out at the
 * very end.
 */
export const buildMusicVolumeFn = (totalDurationInFrames: number) => {
  return (frame: number) => {
    const fadeIn = interpolate(frame, [0, FADE_IN_FRAMES], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const fadeOut = interpolate(
      frame,
      [totalDurationInFrames - FADE_OUT_FRAMES, totalDurationInFrames],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

    return VOLUME * fadeIn * fadeOut;
  };
};
