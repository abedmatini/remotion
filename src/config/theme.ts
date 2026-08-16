// "Coffee Cursor" visual identity: built on Cursor's own real brand colors
// (pulled from their public brand kit at cursor.com/brand) fused with warm
// coffee-shop accent tones. Cursor's actual palette turns out to already be
// warm-neutral (a warm near-black, not pure black), which blends naturally
// with a coffee-shop feel instead of fighting it.
//
// The small mark used in the end card / watermark (public/brand/cursor-cube.svg)
// is Cursor's own official logo, downloaded from their public "Download
// brand assets" page — used here as a small, tasteful credit, not as our own
// primary logo. "Coffee Cursor" is a community event, not an official Cursor
// production, so keep this usage subtle rather than swapping it in as our
// main title mark.
export const PALETTE = {
  bgDeep: "#14120b", // Cursor's own dark-mode background
  bgPanel: "#1c1911",
  bgPanelAlt: "#26251e", // Cursor's own secondary dark tone (also their logo fill)
  border: "rgba(247,247,244,0.10)",

  textPrimary: "#f7f7f4", // Cursor's own light/off-white text color
  textMuted: "rgba(247,247,244,0.55)",
  textComment: "#8f897a",

  accent: "#c08532", // warm amber seen on cursor.com — doubles as a coffee/caramel tone
  accentSoft: "rgba(192,133,50,0.28)",

  coffeeCream: "#e8d2ae",
  coffeeTan: "#c6935e",
  coffeeEspresso: "#3a2417",

  syntaxOrange: "#e3a566",
  syntaxGreen: "#6fae82",

  macRed: "#ff5f57",
  macYellow: "#febc2e",
  macGreen: "#28c840",
} as const;

// Cycled accent color for placeholder-card left rails / tags — keeps the
// "code editor" look coherent instead of a rainbow of full-card gradients.
export const PLACEHOLDER_ACCENTS = [
  PALETTE.accent,
  PALETTE.coffeeTan,
  PALETTE.syntaxOrange,
  PALETTE.syntaxGreen,
] as const;
