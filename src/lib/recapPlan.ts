import type { ClipConfig } from "../config/clips";

// Pure, deterministic timing logic shared by both compositions.
//
// Each clip in `clips` gets exactly one slot — no cycling/repeats. Video
// clips get the exact length of their trimmed source window (so they
// actually play for their "couple of seconds" instead of getting cut off by
// a beat grid). Photo clips split whatever time is left over after the
// videos, using a beat-flavored weight pattern (a mix of shorter/longer
// holds, like short/long musical phrases) so the edit still has some
// rhythmic variety instead of every photo getting an identical duration.
//
// It's pure so it can be called once in `calculateMetadata` (to get the
// exact final duration, since transitions overlap and shrink the timeline)
// and again in the component render with identical results.

export type TransitionKind = "hard" | "whip" | "fade";

export type CutEntry = {
  durationInFrames: number;
  transitionIn: TransitionKind;
  transitionInFrames: number;
};

export type RecapPlan = {
  introFrames: number;
  outroFrames: number;
  outroTransitionFrames: number;
  cuts: CutEntry[]; // one per clip, same length & order as `clips`
  totalDurationInFrames: number;
};

const WHIP_TRANSITION_FRAMES = 6;
const FADE_TRANSITION_FRAMES = 10;
const OUTRO_FADE_FRAMES = 12;
const MIN_PHOTO_SECONDS = 0.8;
const MIN_VIDEO_SECONDS = 1.5;

// Relative hold-time weights for photo slots — mix of short and long so nothing
// is perfectly evenly spaced. Cycles for however many photos there are.
const PHOTO_WEIGHT_PATTERN = [2, 3, 2, 4, 3, 2, 3, 4, 2, 3, 4, 2, 3];

// Splits `budgetFrames` across `weights.length` slots proportionally to
// their weight, guaranteeing every slot gets at least `floorFrames` and the
// total matches `budgetFrames` exactly. A naive proportional-then-round
// split can push slots below the floor when many low-weight slots need
// clamping up — this redistributes what's left over the remaining slots
// (water-filling) instead of just clamping and hoping the rounding drift
// works out, which is what let one clip's duration go negative.
const allocateWithFloor = (budgetFrames: number, weights: number[], floorFrames: number): number[] => {
  const n = weights.length;
  const allocated = new Array<number>(n).fill(0);
  const fixed = new Array<boolean>(n).fill(false);
  let remainingBudget = budgetFrames;
  let remainingWeightSum = weights.reduce((sum, w) => sum + w, 0);

  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < n; i++) {
      if (fixed[i]) continue;
      const share = remainingWeightSum > 0 ? (remainingBudget * weights[i]) / remainingWeightSum : 0;
      if (share < floorFrames) {
        allocated[i] = floorFrames;
        fixed[i] = true;
        remainingBudget -= floorFrames;
        remainingWeightSum -= weights[i];
        changed = true;
      }
    }
  }
  for (let i = 0; i < n; i++) {
    if (!fixed[i]) {
      allocated[i] = remainingWeightSum > 0 ? (remainingBudget * weights[i]) / remainingWeightSum : floorFrames;
    }
  }

  const rounded = allocated.map((v) => Math.round(v));
  const drift = budgetFrames - rounded.reduce((sum, v) => sum + v, 0);
  if (drift !== 0 && n > 0) {
    // Absorb the rounding drift into the largest slot — it has the most
    // headroom to shift by a frame or two without it being noticeable.
    let largestIndex = 0;
    for (let i = 1; i < n; i++) {
      if (rounded[i] > rounded[largestIndex]) largestIndex = i;
    }
    rounded[largestIndex] += drift;
  }

  return rounded;
};

export const buildRecapPlan = ({
  fps,
  introSeconds,
  outroSeconds,
  bodySeconds,
  clips,
}: {
  fps: number;
  introSeconds: number;
  outroSeconds: number;
  bodySeconds: number;
  clips: ClipConfig[];
}): RecapPlan => {
  const introFrames = Math.round(introSeconds * fps);
  const outroFrames = Math.round(outroSeconds * fps);
  const bodyFrames = Math.round(bodySeconds * fps);

  const videoFramesFor = (clip: ClipConfig) => {
    const windowSeconds = (clip.trimEndSec ?? 0) - (clip.trimStartSec ?? 0);
    return Math.round(Math.max(windowSeconds, MIN_VIDEO_SECONDS) * fps);
  };

  const videoTotalFrames = clips
    .filter((clip) => clip.type === "video")
    .reduce((sum, clip) => sum + videoFramesFor(clip), 0);

  const photoCount = clips.filter((clip) => clip.type === "photo").length;
  const minPhotoFrames = Math.round(MIN_PHOTO_SECONDS * fps);
  const photoBudgetFrames = Math.max(bodyFrames - videoTotalFrames, photoCount * minPhotoFrames);

  const weights = clips
    .filter((clip) => clip.type === "photo")
    .map((_, i) => PHOTO_WEIGHT_PATTERN[i % PHOTO_WEIGHT_PATTERN.length]);

  const photoFrames = allocateWithFloor(photoBudgetFrames, weights, minPhotoFrames);

  let photoCursor = 0;
  const cuts: CutEntry[] = clips.map((clip, i) => {
    const durationInFrames = clip.type === "video" ? videoFramesFor(clip) : photoFrames[photoCursor++];

    const transitionIn: TransitionKind =
      i === 0 ? "hard" : i % 7 === 6 ? "fade" : i % 4 === 3 ? "whip" : "hard";
    const transitionInFrames =
      transitionIn === "hard" ? 0 : transitionIn === "whip" ? WHIP_TRANSITION_FRAMES : FADE_TRANSITION_FRAMES;

    return { durationInFrames, transitionIn, transitionInFrames };
  });

  const bodyTotalFrames = cuts.reduce((sum, cut) => sum + cut.durationInFrames, 0);
  const transitionOverlapFrames = cuts.reduce((sum, cut) => sum + cut.transitionInFrames, 0) + OUTRO_FADE_FRAMES;

  const totalDurationInFrames = introFrames + bodyTotalFrames + outroFrames - transitionOverlapFrames;

  return {
    introFrames,
    outroFrames,
    outroTransitionFrames: OUTRO_FADE_FRAMES,
    cuts,
    totalDurationInFrames,
  };
};
