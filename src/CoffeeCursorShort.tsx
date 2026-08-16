import React from "react";
import { CalculateMetadataFunction, Composition } from "remotion";
import { CLIPS } from "./config/clips";
import { buildRecapPlan } from "./lib/recapPlan";
import { RecapSequence } from "./components/RecapSequence";

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920;

// Vertical 9:16 cut — Reels / TikTok / Shorts.
//
// Originally targeted ~20-25s, but that assumed a curated ~15-clip subset.
// Showing all 23 uploads at a legible pace (photos can't go much below
// ~0.8s each, and the 4 videos alone are ~18s combined) doesn't fit in 25s —
// the honest floor is closer to 36s. If you want a tighter Short later, the
// straightforward path is trimming CLIPS down for this composition
// specifically (e.g. a shorter list passed just to the Short) rather than
// flash-cutting everything below ~0.8s.
const INTRO_SECONDS = 1.3;
const OUTRO_SECONDS = 1.8;
const BODY_SECONDS = 36;

type Props = {};

const getPlan = () =>
  buildRecapPlan({
    fps: FPS,
    introSeconds: INTRO_SECONDS,
    outroSeconds: OUTRO_SECONDS,
    bodySeconds: BODY_SECONDS,
    clips: CLIPS,
  });

const calculateMetadata: CalculateMetadataFunction<Props> = () => {
  const plan = getPlan();
  return { durationInFrames: plan.totalDurationInFrames };
};

export const CoffeeCursorShortComponent: React.FC<Props> = () => {
  const plan = getPlan();
  return <RecapSequence plan={plan} clips={CLIPS} />;
};

export const CoffeeCursorShort = () => {
  return (
    <Composition
      id="CoffeeCursorShort"
      component={CoffeeCursorShortComponent}
      durationInFrames={Math.round((INTRO_SECONDS + BODY_SECONDS + OUTRO_SECONDS) * FPS)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{}}
      calculateMetadata={calculateMetadata}
    />
  );
};
