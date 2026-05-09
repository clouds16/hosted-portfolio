import { useEffect, useState } from "react";
import { Cursor } from "./components/Cursor";
import { IdleGlitch } from "./components/IdleGlitch";
import { MatrixRain } from "./components/MatrixRain";
import {
  BootFlash,
  BOOT_DURATION_MS,
  EdgePulse,
  PowerDownFlash,
  ScanlinesOverlay,
  SHUTDOWN_DURATION_MS,
} from "./components/HackEffects";
import { HackTerminal } from "./components/HackTerminal";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Skills } from "./components/Skills";
import { Experience } from "./components/Experience";
import { Projects } from "./components/Projects";
import { Education } from "./components/Education";
import { Contact } from "./components/Contact";
import { DisciplineProvider } from "./discipline";

export default function App() {
  const [hackMode, setHackMode] = useState(false);
  const [bootFlash, setBootFlash] = useState(false);
  const [shutdownFlash, setShutdownFlash] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);

  // Set/unset body[data-hack] so CSS-only hover effects scope to hack mode.
  // Stays "true" during shutdown so the page keeps its hack styling until the
  // power-down sequence finishes.
  useEffect(() => {
    if (hackMode || shutdownFlash) document.body.dataset.hack = "true";
    else delete document.body.dataset.hack;
    return () => {
      delete document.body.dataset.hack;
    };
  }, [hackMode, shutdownFlash]);

  // Console easter egg — fires once on first mount.
  useEffect(() => {
    /* eslint-disable no-console */
    console.log(
      "%c\n  ▲ engineerhectoralvarez.com\n  ─────────────────────────────\n  press [Hack] in the nav for the\n  full ghost-in-the-shell loadout.\n",
      "color: #00ff88; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.4;",
    );
    /* eslint-enable no-console */
  }, []);

  // Auto-close the terminal when hack mode turns off.
  useEffect(() => {
    if (!hackMode) setTerminalOpen(false);
  }, [hackMode]);

  const toggleHack = () => {
    if (shutdownFlash || bootFlash) return; // ignore clicks mid-sequence

    if (hackMode) {
      // Powering down — keep effects visible during the shutdown overlay,
      // then drop hack mode at the end.
      setShutdownFlash(true);
      window.setTimeout(() => {
        setShutdownFlash(false);
        setHackMode(false);
      }, SHUTDOWN_DURATION_MS);
    } else {
      // Booting up — flip mode immediately so effects mount, then run boot
      // overlay on top.
      setHackMode(true);
      setBootFlash(true);
      window.setTimeout(() => setBootFlash(false), BOOT_DURATION_MS);
    }
  };

  const effectsActive = hackMode || shutdownFlash;

  return (
    <DisciplineProvider>
      {effectsActive && (
        <>
          <MatrixRain />
          <IdleGlitch />
          <ScanlinesOverlay />
          <EdgePulse />
        </>
      )}
      {bootFlash && <BootFlash />}
      {shutdownFlash && <PowerDownFlash />}
      {hackMode && terminalOpen && <HackTerminal onClose={() => setTerminalOpen(false)} />}
      {hackMode && !terminalOpen && !bootFlash && !shutdownFlash && (
        <TerminalLauncher onOpen={() => setTerminalOpen(true)} />
      )}
      <Cursor />
      <Nav hackMode={hackMode} onToggleHack={toggleHack} />
      <main>
        <Hero />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
    </DisciplineProvider>
  );
}

function TerminalLauncher({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open ghost terminal"
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 150,
        padding: "10px 16px",
        background: "rgba(8, 8, 14, 0.92)",
        border: "1px solid var(--accent)",
        color: "var(--accent)",
        fontFamily: "var(--mono)",
        fontSize: "0.7rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        cursor: "none",
        boxShadow: "0 0 18px rgba(0, 255, 136, 0.35), inset 0 0 12px rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(6px)",
        animation: "hack-edge-pulse 4s ease-in-out infinite",
      }}
    >
      ⌬ Open ghost.terminal
    </button>
  );
}
