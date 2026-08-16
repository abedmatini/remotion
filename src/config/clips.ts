import { staticFile } from "remotion";

// ---------------------------------------------------------------------------
// EDIT ME: this is the single place that controls what footage appears and in
// what order. Add/remove/reorder entries here — nothing else in the project
// needs to change.
// ---------------------------------------------------------------------------

export type ClipType = "photo" | "video";
export type PanDirection = "left" | "right" | "up" | "down";

export type ClipConfig = {
  /** Stable id, only used as a React key. */
  id: string;
  type: ClipType;
  /** staticFile(...) path once real media exists. Leave null for a placeholder card. */
  src: string | null;
  /** Shown on the placeholder card, and useful as a comment once real media is in. */
  label: string;
  /** Ken Burns pan direction. Omit to auto-alternate. */
  pan?: PanDirection;
  /**
   * For video clips only: the in/out points (in seconds, in the SOURCE file)
   * of the punchiest 1.5-3s moment. The edit will never play past
   * `trimEndSec`, even if its beat-driven slot on screen is longer.
   */
  trimStartSec?: number;
  trimEndSec?: number;
  /**
   * Natural pixel dimensions of the source file (already EXIF-rotation
   * corrected for photos). Used to decide whether cover-fit would crop too
   * much of the image away — e.g. a portrait photo cover-fit into a 16:9
   * frame only shows ~42% of it. When the mismatch is severe, KenBurnsMedia
   * shows the full image letterboxed over a blurred fill instead of
   * cropping it. Omit only for placeholder (src: null) entries.
   */
  width?: number;
  height?: number;
};

export const HAS_MUSIC = true;
export const MUSIC_SRC = "alex-morgan-cinematic-corporate-presentation-556231.mp3";
// Video clips have their own audio muted (see KenBurnsMedia) — this track is
// the only audio in the edit.
//
// Reference only — not read by the timing code. Cut pacing is now driven by
// how many clips there are and how long the video trims are (see
// lib/recapPlan.ts), not by literal BPM math, since a fixed BPM-times-beats
// approach was causing clips to repeat and videos to get cut short. Kept
// here as a note in case you want to hand-tune PHOTO_WEIGHT_PATTERN in
// recapPlan.ts against the track's actual tempo.
export const MUSIC_BPM = 100;

// 21 of the 23 uploads — everything except IMG_7888 (deleted from /public)
// and IMG_7877 (near-duplicate of IMG_7876's same moment, and a portrait
// photo that crops badly/looks over-zoomed once cover-fit into a 16:9
// frame). With this many clips + long video holds, the Short composition
// runs longer than a typical "short" (see the comment on BODY_SECONDS in
// CoffeeCursorShort.tsx) — that's the direct tradeoff of using everything.
export const CLIPS: ClipConfig[] = [
  {
    id: "coffee-cup-hero",
    type: "photo",
    src: staticFile("IMG_2153.JPEG"),
    label: "Coffee cup w/ Cursor sticker",
    pan: "up",
    width: 1536,
    height: 2048,
  },
  {
    id: "group-thumbsup",
    type: "photo",
    src: staticFile("IMG_2171.JPEG"),
    label: "Group thumbs up",
    pan: "left",
    width: 2048,
    height: 1536,
  },
  {
    id: "cursor-banner-video",
    type: "video",
    src: staticFile("IMG_2198.MP4"),
    label: "Cursor Cape Town banner, room wide",
    trimStartSec: 8,
    trimEndSec: 12.5,
    width: 1280,
    height: 720,
  },
  {
    id: "group-banner-six",
    type: "photo",
    src: staticFile("IMG_2176.JPEG"),
    label: "Group of six at the Cursor banner",
    pan: "right",
    width: 2048,
    height: 1536,
  },
  {
    id: "cafe-signage-video",
    type: "video",
    src: staticFile("IMG_2165.MP4"),
    label: "Pure Good Cafe signage, busy room",
    trimStartSec: 0.3,
    trimEndSec: 4,
    width: 1280,
    height: 720,
  },
  {
    id: "wide-table-network",
    type: "photo",
    src: staticFile("IMG_2190.JPEG"),
    label: "Wide shot, networking at the long table",
    pan: "left",
    width: 3520,
    height: 1980,
  },
  {
    id: "two-at-banner",
    type: "photo",
    src: staticFile("IMG_2180.JPEG"),
    label: "Two attendees at the Cursor banner",
    pan: "up",
    width: 1536,
    height: 2048,
  },
  {
    id: "sticker-swag-pile",
    type: "photo",
    src: staticFile("IMG_2197.JPEG"),
    label: "Cursor sticker swag pile",
    pan: "down",
    width: 2048,
    height: 1536,
  },
  {
    id: "pastries-and-laughs",
    type: "video",
    src: staticFile("IMG_2203.MP4"),
    label: "Coffee table spread + laughing group",
    trimStartSec: 0.2,
    trimEndSec: 4,
    width: 1280,
    height: 720,
  },
  {
    id: "group-banner-five",
    type: "photo",
    src: staticFile("IMG_2186.JPEG"),
    label: "Group of five at the Cursor banner",
    pan: "right",
    width: 1536,
    height: 2048,
  },
  {
    id: "candid-laptop-sticker",
    type: "photo",
    src: staticFile("IMG_7876.JPG"),
    label: "Laptop w/ Cursor sticker, candid laugh",
    pan: "left",
    width: 4000,
    height: 6000,
  },
  {
    id: "candid-three-way-chat",
    type: "photo",
    src: staticFile("IMG_7879.JPG"),
    label: "Candid three-way conversation",
    pan: "up",
    width: 6000,
    height: 4000,
  },
  {
    id: "group-laughing",
    type: "photo",
    src: staticFile("IMG_7881.JPG"),
    label: "Group laughing together",
    pan: "down",
    width: 6000,
    height: 4000,
  },
  {
    id: "selfie-at-banner",
    type: "photo",
    src: staticFile("IMG_2205.JPEG"),
    label: "Selfie at the Cursor banner",
    pan: "left",
    width: 2048,
    height: 1536,
  },
  {
    id: "coworking-wide-video",
    type: "video",
    src: staticFile("IMG_2155.MP4"),
    label: "Wide coworking floor, coffee in hand",
    trimStartSec: 1,
    trimEndSec: 7,
    width: 1280,
    height: 720,
  },
  {
    id: "standing-conversation",
    type: "photo",
    src: staticFile("IMG_7880.JPG"),
    label: "Standing conversation by the laptops",
    pan: "right",
    width: 6000,
    height: 4000,
  },
  {
    id: "llms-love-language",
    type: "photo",
    src: staticFile("IMG_7919.JPG"),
    label: "\"LLMs are my love language\" group",
    pan: "up",
    width: 6000,
    height: 4000,
  },
  {
    id: "counter-conversation",
    type: "photo",
    src: staticFile("IMG_7902.JPG"),
    label: "Conversation by the coffee counter",
    pan: "down",
    width: 6000,
    height: 4000,
  },
  {
    id: "three-pose-banner",
    type: "photo",
    src: staticFile("IMG_7931.JPG"),
    label: "Three-person pose at the Cursor banner",
    pan: "up",
    width: 6000,
    height: 4000,
  },
  {
    id: "focused-laptop-work",
    type: "photo",
    src: staticFile("IMG_7974.JPG"),
    label: "Focused laptop work",
    pan: "down",
    width: 6000,
    height: 4000,
  },
  {
    id: "collaborate-selfie",
    type: "photo",
    src: staticFile("IMG_7997.JPG"),
    label: "Energetic group selfie under \"collaborate\"",
    pan: "up",
    width: 6000,
    height: 4000,
  },
];
