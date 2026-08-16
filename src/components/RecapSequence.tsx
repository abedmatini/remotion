import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import type { ClipConfig } from "../config/clips";
import { HAS_MUSIC, MUSIC_SRC } from "../config/clips";
import type { RecapPlan } from "../lib/recapPlan";
import { buildMusicVolumeFn } from "../lib/musicVolume";
import { KenBurnsMedia } from "./KenBurnsMedia";
import { TitleCard } from "./TitleCard";
import { EndCard } from "./EndCard";

// The engine shared by both CoffeeCursorShort and CoffeeCursorRecap: given a
// precomputed plan (see lib/recapPlan.ts) and the clip list, it lays out the
// title card, beat-synced clips, and end card as a TransitionSeries, plus the
// faded music bed. No persistent watermark during the body clips — just the
// Cursor credit on the end card.
export const RecapSequence: React.FC<{
  plan: RecapPlan;
  clips: ClipConfig[];
}> = ({ plan, clips }) => {
  const bodyElements = plan.cuts.flatMap((cut, i) => {
    const elements: React.ReactNode[] = [];

    if (i > 0 && cut.transitionIn !== "hard") {
      elements.push(
        <TransitionSeries.Transition
          key={`transition-${i}`}
          presentation={cut.transitionIn === "whip" ? slide({ direction: i % 2 === 0 ? "from-right" : "from-left" }) : fade()}
          timing={linearTiming({ durationInFrames: cut.transitionInFrames })}
        />,
      );
    }

    elements.push(
      <TransitionSeries.Sequence key={`clip-${i}`} durationInFrames={cut.durationInFrames}>
        <KenBurnsMedia
          clip={clips[i]}
          index={i}
          durationInFrames={cut.durationInFrames}
          entryTransition={cut.transitionIn}
        />
      </TransitionSeries.Sequence>,
    );

    return elements;
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence key="title" durationInFrames={plan.introFrames}>
          <TitleCard />
        </TransitionSeries.Sequence>
        {bodyElements}
        <TransitionSeries.Transition
          key="outro-transition"
          presentation={fade()}
          timing={linearTiming({ durationInFrames: plan.outroTransitionFrames })}
        />
        <TransitionSeries.Sequence key="end" durationInFrames={plan.outroFrames}>
          <EndCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {HAS_MUSIC ? (
        <Audio
          src={staticFile(MUSIC_SRC)}
          volume={(f) => buildMusicVolumeFn(plan.totalDurationInFrames)(f)}
        />
      ) : null}
    </AbsoluteFill>
  );
};
