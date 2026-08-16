import React from "react";
import { CalculateMetadataFunction, Composition } from "remotion";
import { CLIPS } from "./config/clips";
import { buildRecapPlan } from "./lib/recapPlan";
import { RecapSequence } from "./components/RecapSequence";

const FPS = 30;
// 16:9 rather than a strict 1:1 square — event photos/video lean heavily on
// wide crowd/room/screen shots, which a square crop would constantly fight.
// Change to 1080x1080 here if you'd rather keep it square for feed.
const WIDTH = 1920;
const HEIGHT = 1080;

// Feed cut for LinkedIn / general use. Target ~55-60s.
const INTRO_SECONDS = 1.4;
const OUTRO_SECONDS = 1.9;
// With only 15 clips (no repeats) there are far fewer transitions than
// before, so less overlap gets subtracted from the total — 56.5s of body
// lands the final rendered length around 58s, not 62s+.
const BODY_SECONDS = 56.5;

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

export const CoffeeCursorRecapComponent: React.FC<Props> = () => {
  const plan = getPlan();
  return <RecapSequence plan={plan} clips={CLIPS} />;
};

export const CoffeeCursorRecap = () => {
  return (
    <Composition
      id="CoffeeCursorRecap"
      component={CoffeeCursorRecapComponent}
      durationInFrames={Math.round((INTRO_SECONDS + BODY_SECONDS + OUTRO_SECONDS) * FPS)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{}}
      calculateMetadata={calculateMetadata}
    />
  );
};
