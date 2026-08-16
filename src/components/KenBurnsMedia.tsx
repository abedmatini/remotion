import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import type { ClipConfig, PanDirection } from "../config/clips";
import { monoFontFamily } from "../config/fonts";
import { PALETTE, PLACEHOLDER_ACCENTS } from "../config/theme";

const PAN_ORDER: PanDirection[] = ["left", "right", "up", "down"];

// Subtle — a stronger value crops noticeably into the frame (people at the
// edges getting cut off), especially combined with the cover-fit crop.
const KEN_BURNS_SCALE = 1.06;
const PAN_PX = 40;

// Below this, cover-fit is cropping away too much of the source to be worth
// it — e.g. a portrait photo cover-fit into a 16:9 frame only shows ~42% of
// it. Below the threshold, show the full image/video letterboxed over a
// blurred fill of itself instead of cropping people out of frame.
const MIN_COVER_VISIBLE_FRACTION = 0.8;

const getVisibleFraction = (mediaRatio: number, frameRatio: number) => {
  const r = mediaRatio / frameRatio;
  return Math.min(r, 1 / r);
};

// Subtle "punch" whip-pan entry for clips assigned a whip transition —
// implemented here (rather than via TransitionSeries' own presentation) so
// the on-screen duration stays exactly what the beat plan assigned.
const ENTRY_WHIP_FRAMES = 6;

export const KenBurnsMedia: React.FC<{
  clip: ClipConfig;
  index: number;
  durationInFrames: number;
  entryTransition: "hard" | "whip" | "fade";
}> = ({ clip, index, durationInFrames, entryTransition }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const frameRatio = width / height;
  const needsLetterbox =
    clip.width !== undefined && clip.height !== undefined
      ? getVisibleFraction(clip.width / clip.height, frameRatio) < MIN_COVER_VISIBLE_FRACTION
      : false;

  // Always start at the baseline (least-cropped) framing and zoom in gently
  // from there — starting already zoomed in was cropping people out of the
  // shot from frame one.
  const scale = interpolate(frame, [0, durationInFrames], [1, KEN_BURNS_SCALE], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  const pan = clip.pan ?? PAN_ORDER[index % PAN_ORDER.length];
  const panProgress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateX = pan === "left" ? -PAN_PX * panProgress : pan === "right" ? PAN_PX * panProgress : 0;
  const translateY = pan === "up" ? -PAN_PX * panProgress : pan === "down" ? PAN_PX * panProgress : 0;

  const entryOpacity =
    entryTransition === "fade"
      ? interpolate(frame, [0, ENTRY_WHIP_FRAMES], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 1;
  const entryWhipX =
    entryTransition === "whip"
      ? interpolate(frame, [0, ENTRY_WHIP_FRAMES], [index % 2 === 0 ? width : -width, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  const trimBefore = clip.trimStartSec !== undefined ? Math.round(clip.trimStartSec * fps) : undefined;
  const trimAfter = clip.trimEndSec !== undefined ? Math.round(clip.trimEndSec * fps) : undefined;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", opacity: entryOpacity }}>
      <AbsoluteFill
        style={{
          scale,
          translate: `${translateX + entryWhipX}px ${translateY}px`,
        }}
      >
        {clip.src ? (
          needsLetterbox ? (
            <AbsoluteFill>
              {clip.type === "photo" ? (
                <Img
                  src={clip.src}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    scale: 1.15, // extra headroom so the blur radius never exposes an edge
                    filter: "blur(60px) brightness(0.45)",
                  }}
                />
              ) : (
                <Video
                  src={clip.src}
                  trimBefore={trimBefore}
                  trimAfter={trimAfter}
                  muted
                  objectFit="cover"
                  style={{ width: "100%", height: "100%", scale: 1.15, filter: "blur(60px) brightness(0.45)" }}
                />
              )}
              <AbsoluteFill>
                {clip.type === "photo" ? (
                  <Img src={clip.src} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                ) : (
                  <Video
                    src={clip.src}
                    trimBefore={trimBefore}
                    trimAfter={trimAfter}
                    muted
                    objectFit="contain"
                    style={{ width: "100%", height: "100%" }}
                  />
                )}
              </AbsoluteFill>
            </AbsoluteFill>
          ) : clip.type === "photo" ? (
            <Img
              src={clip.src}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                // Biased toward the top third rather than dead-center: a
                // plain center crop on a photo of standing people cuts off
                // heads more often than not.
                objectPosition: "center 25%",
              }}
            />
          ) : (
            <Video
              src={clip.src}
              trimBefore={trimBefore}
              trimAfter={trimAfter}
              muted
              objectFit="cover"
              style={{ width: "100%", height: "100%" }}
            />
          )
        ) : (
          <PlaceholderCard clip={clip} index={index} />
        )}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Faint rows of varying-width bars behind the label — reads as an
// out-of-focus code editor rather than empty dead space.
const CODE_LINE_WIDTHS = [62, 38, 71, 45, 55, 30, 66, 41];

const PlaceholderCard: React.FC<{ clip: ClipConfig; index: number }> = ({ clip, index }) => {
  const { width } = useVideoConfig();
  const accent = PLACEHOLDER_ACCENTS[index % PLACEHOLDER_ACCENTS.length];
  const scaleUnit = width / 1080;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(180deg, ${PALETTE.bgPanelAlt} 0%, ${PALETTE.bgDeep} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: monoFontFamily,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "18%",
          left: "10%",
          display: "flex",
          flexDirection: "column",
          gap: 16 * scaleUnit,
          opacity: 0.35,
        }}
      >
        {CODE_LINE_WIDTHS.map((w, i) => (
          <div
            key={i}
            style={{
              width: w * scaleUnit * 4,
              height: 10 * scaleUnit,
              borderRadius: 4 * scaleUnit,
              background: i % 3 === 0 ? accent : PALETTE.border,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          top: 28 * scaleUnit,
          left: 28 * scaleUnit,
          fontSize: 20 * scaleUnit,
          fontWeight: 500,
          color: PALETTE.textComment,
          borderLeft: `3px solid ${accent}`,
          paddingLeft: 12 * scaleUnit,
        }}
      >
        // {clip.type}
      </div>

      <div
        style={{
          fontSize: 90 * scaleUnit,
          fontWeight: 700,
          color: "rgba(255,255,255,0.10)",
          lineHeight: 1,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <div
        style={{
          fontSize: 38 * scaleUnit,
          fontWeight: 700,
          color: PALETTE.textPrimary,
          textAlign: "center",
          maxWidth: "80%",
          marginTop: 10 * scaleUnit,
          borderLeft: `4px solid ${accent}`,
          paddingLeft: 16 * scaleUnit,
        }}
      >
        {clip.label}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 28 * scaleUnit,
          fontSize: 16 * scaleUnit,
          color: PALETTE.textComment,
          letterSpacing: 0.5,
        }}
      >
        // placeholder — drop real media into /public and set `src` in clips.ts
      </div>
    </div>
  );
};
