import { loadFont as loadDisplayFont } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadMonoFont } from "@remotion/google-fonts/JetBrainsMono";

// Display font — headlines / CTAs.
export const { fontFamily } = loadDisplayFont("normal", {
  weights: ["500", "700"],
  subsets: ["latin"],
});

// Monospace font — terminal chrome, code-comment labels, the watermark.
// This is what ties the visual language to "an IDE" rather than just "dark
// mode with a coffee cup emoji".
export const { fontFamily: monoFontFamily } = loadMonoFont("normal", {
  weights: ["500", "700"],
  subsets: ["latin"],
});
