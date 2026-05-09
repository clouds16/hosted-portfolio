import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const PALETTE = {
  bg: "#0a0a0f",
  bg2: "#0f0f1a",
  bg3: "#13131f",
  border: "#1e1e2e",
  borderMuted: "#2a2a3e",
  accent: "#00ff88",
  accentCyan: "#00d4ff",
  accentCoral: "#ff6b6b",
  textBase: "#e2e8f0",
  textMuted: "#64748b",
  textDim: "#334155",
} as const;

// Force every semantic token to the same value in both color modes so
// Chakra's built-in light/dark splits can't override our palette.
const locked = (color: string) => ({ value: { _light: color, _dark: color } });

const config = defineConfig({
  globalCss: {
    "*, *::before, *::after": {
      boxSizing: "border-box",
    },
    "html, body": {
      margin: 0,
      padding: 0,
      bg: PALETTE.bg,
      color: PALETTE.textBase,
      fontFamily: "mono",
      overflowX: "hidden",
      cursor: "none",
    },
    html: {
      scrollBehavior: "smooth",
      colorScheme: "dark",
    },
    "::-webkit-scrollbar": { width: "4px" },
    "::-webkit-scrollbar-track": { bg: PALETTE.bg },
    "::-webkit-scrollbar-thumb": { bg: PALETTE.borderMuted, borderRadius: "2px" },
    "::-webkit-scrollbar-thumb:hover": { bg: PALETTE.accent },
    "::selection": { bg: PALETTE.accent, color: PALETTE.bg },
  },
  theme: {
    tokens: {
      colors: {
        bgBase: { value: PALETTE.bg },
        bg2: { value: PALETTE.bg2 },
        bg3: { value: PALETTE.bg3 },
        borderBase: { value: PALETTE.border },
        borderMuted: { value: PALETTE.borderMuted },
        accent: { value: PALETTE.accent },
        accent2: { value: PALETTE.accentCyan },
        accent3: { value: PALETTE.accentCoral },
        textBase: { value: PALETTE.textBase },
        textMuted: { value: PALETTE.textMuted },
        textDim: { value: PALETTE.textDim },
      },
      fonts: {
        mono: { value: "'JetBrains Mono', monospace" },
        sans: { value: "'Syne', sans-serif" },
      },
    },
    semanticTokens: {
      colors: {
        bg: locked(PALETTE.bg),
        "bg.subtle": locked(PALETTE.bg2),
        "bg.muted": locked(PALETTE.bg3),
        fg: locked(PALETTE.textBase),
        "fg.muted": locked(PALETTE.textMuted),
        "fg.dim": locked(PALETTE.textDim),
        "border.base": locked(PALETTE.border),
        "border.muted": locked(PALETTE.borderMuted),
        accent: locked(PALETTE.accent),
        "accent.cyan": locked(PALETTE.accentCyan),
        "accent.coral": locked(PALETTE.accentCoral),
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
