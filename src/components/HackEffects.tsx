import { useEffect, useState } from "react";
import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { useTypewriter } from "../hooks/useTypewriter";

/**
 * Visual effects that activate together when "Hack" mode is on:
 *   - <ScanlinesOverlay /> — thin CRT scanlines across the page
 *   - <EdgePulse />        — slow breathing green inset glow on the viewport
 *   - <BootFlash />        — one-shot fullscreen "intrusion sequence" splash
 *
 * Boot flash is a one-shot — render it for ~5s when hack is just enabled,
 * then unmount. The other two stay mounted for the duration of hack mode.
 */

export function ScanlinesOverlay() {
  return (
    <Box
      position="fixed"
      inset={0}
      pointerEvents="none"
      zIndex={50}
      style={{
        background:
          "repeating-linear-gradient(180deg, rgba(0,255,136,0.04) 0px, rgba(0,255,136,0.04) 1px, transparent 1px, transparent 3px)",
        mixBlendMode: "screen",
      }}
    />
  );
}

export function EdgePulse() {
  return (
    <Box
      position="fixed"
      inset={0}
      pointerEvents="none"
      zIndex={49}
      style={{ animation: "hack-edge-pulse 4s ease-in-out infinite" }}
    />
  );
}

// ─── Boot flash ──────────────────────────────────────────────────────────────

export const BOOT_DURATION_MS = 3000;
export const SHUTDOWN_DURATION_MS = 1600;

const TYPE_SPEED = 9;
const LINE_INTERVAL = 180; // ms between log lines starting

type LogLevel = "info" | "ok" | "warn" | "crit";

type LogLine = {
  tag: string;
  msg: string;
  level?: LogLevel;
  result?: string;
};

const LOG_LINES: LogLine[] = [
  { tag: "INIT",    msg: "matrix.protocol v3.14 — handshake established" },
  { tag: "DNS",     msg: "resolving engineerhectoralvarez.com → 10.0.42.1337" },
  { tag: "TLS",     msg: "bypassing TLS 1.3 (aes-256-gcm) @ 4.2GH/s" },
  { tag: "AUTH",    msg: "cracking root credentials :: progress 84%" },
  { tag: "!WARN",   msg: "intrusion detector probing — installing rootkit", level: "warn", result: "[CLOAKED]" },
  { tag: "KERNEL",  msg: "hooking ghost.kernel module v0.6.6.6" },
  { tag: "INJECT",  msg: "patching getuid() syscall — uid=0(root)" },
  { tag: "!CRIT",   msg: "ICE countermeasures detected — neutralizing", level: "crit", result: "[BYPASS]" },
  { tag: "FS",      msg: "mounting /dev/portfolio @ /mnt/target" },
  { tag: "SHELL",   msg: "spawning shell — root@portfolio:~#" },
];

const STATUS_PHASES = [
  { at: 0,    label: "SCANNING TARGET" },
  { at: 700,  label: "AUTHENTICATING" },
  { at: 1400, label: "INJECTING PAYLOAD" },
  { at: 2100, label: "ESTABLISHING SHELL" },
  { at: 2700, label: "◆ ACCESS GRANTED" },
];

export function BootFlash() {
  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={9500}
      pointerEvents="none"
      bg="rgba(8, 8, 14, 0.94)"
      backdropFilter="blur(2px)"
      style={{ animation: `hack-boot-fade ${BOOT_DURATION_MS}ms ease-out forwards` }}
    >
      <Flex
        direction="column"
        h="100vh"
        px={{ base: 4, md: 12 }}
        py={{ base: 6, md: 10 }}
        fontFamily="mono"
        gap={4}
      >
        <BootHeader />

        <Box
          flex={1}
          minH={0}
          borderWidth="1px"
          borderColor="accent"
          bg="rgba(0, 0, 0, 0.5)"
          p={{ base: 3, md: 5 }}
          overflow="hidden"
          position="relative"
          boxShadow="0 0 24px rgba(0, 255, 136, 0.18), inset 0 0 32px rgba(0, 0, 0, 0.5)"
        >
          {/* Bracket decorations */}
          <BracketCorner pos="top-left" />
          <BracketCorner pos="top-right" />
          <BracketCorner pos="bottom-left" />
          <BracketCorner pos="bottom-right" />

          <Stack gap={1} fontSize={{ base: "0.65rem", md: "0.75rem" }}>
            {LOG_LINES.map((line, i) => (
              <BootLine key={line.tag + i} line={line} delay={150 + i * LINE_INTERVAL} />
            ))}
          </Stack>
        </Box>

        <BootFooter />
      </Flex>
    </Box>
  );
}

function BootHeader() {
  return (
    <Flex
      align="center"
      justify="space-between"
      borderWidth="1px"
      borderColor="accent"
      bg="rgba(0, 0, 0, 0.5)"
      px={4}
      py={2}
      fontSize={{ base: "0.6rem", md: "0.7rem" }}
      letterSpacing="0.15em"
      color="fg.muted"
      textTransform="uppercase"
      style={{ textShadow: "0 0 6px rgba(0,255,136,0.3)" }}
    >
      <Flex align="center" gap={3}>
        <Spinner />
        <Box as="span" color="accent">⌬</Box>
        <Box as="span">ENGINEER.HECTORALVAREZ.COM</Box>
        <Box as="span" color="fg.dim">::</Box>
        <Box as="span">INTRUSION SEQUENCE #1337</Box>
      </Flex>
      <Flex align="center" gap={3}>
        <Box as="span" color="fg.dim">PID</Box>
        <Box as="span" color="accent.cyan">{Math.floor(Math.random() * 99999).toString().padStart(5, "0")}</Box>
        <Box as="span" color="fg.dim">·</Box>
        <Box as="span" color="accent">SECURE</Box>
      </Flex>
    </Flex>
  );
}

function BootFooter() {
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={2} fontSize="0.72rem" letterSpacing="0.1em">
        <Flex gap={3} align="center">
          <Box as="span" color="fg.dim" textTransform="uppercase">Status:</Box>
          <StatusLabel />
        </Flex>
        <Flex gap={3} align="center">
          <Box as="span" color="fg.dim" textTransform="uppercase">ETA:</Box>
          <CountdownLabel />
        </Flex>
      </Flex>
      <Flex align="center" gap={3}>
        <Box as="span" color="accent" fontSize="0.72rem" letterSpacing="0.18em">BOOT</Box>
        <Box flex={1} h="8px" bg="bg.subtle" borderWidth="1px" borderColor="border.muted" position="relative" overflow="hidden">
          <Box
            position="absolute"
            top={0}
            left={0}
            h="100%"
            bg="accent"
            style={{
              width: "0%",
              animation: `hack-progress ${BOOT_DURATION_MS - 400}ms linear forwards`,
              boxShadow: "0 0 8px rgba(0, 255, 136, 0.7)",
            }}
          />
          <Box
            position="absolute"
            inset={0}
            style={{
              background:
                "repeating-linear-gradient(90deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 6px, transparent 6px, transparent 12px)",
            }}
            pointerEvents="none"
          />
        </Box>
        <Box as="span" w="48px" textAlign="right" color="accent" fontSize="0.78rem">
          <ProgressPercent />
        </Box>
      </Flex>
    </Box>
  );
}

function Spinner() {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((j) => (j + 1) % frames.length), 80);
    return () => window.clearInterval(id);
  }, []);
  return (
    <Box as="span" color="accent" fontSize="0.9rem" w="1ch">
      {frames[i]}
    </Box>
  );
}

function StatusLabel() {
  const [label, setLabel] = useState(STATUS_PHASES[0].label);
  useEffect(() => {
    const timers = STATUS_PHASES.slice(1).map((phase) =>
      window.setTimeout(() => setLabel(phase.label), phase.at),
    );
    return () => timers.forEach(window.clearTimeout);
  }, []);
  const isFinal = label.startsWith("◆");
  return (
    <Box as="span" color={isFinal ? "accent" : "accent.cyan"} fontWeight={600} letterSpacing="0.12em">
      {label}
    </Box>
  );
}

function CountdownLabel() {
  const [secs, setSecs] = useState(() => Math.ceil((BOOT_DURATION_MS - 200) / 1000));
  useEffect(() => {
    const start = performance.now();
    const id = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, Math.ceil((BOOT_DURATION_MS - 200 - elapsed) / 1000));
      setSecs(remaining);
    }, 100);
    return () => window.clearInterval(id);
  }, []);
  return (
    <Box as="span" color="accent.coral" fontWeight={600}>
      {secs.toString().padStart(2, "0")}s
    </Box>
  );
}

function ProgressPercent() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = BOOT_DURATION_MS - 400;
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(100, Math.floor((elapsed / dur) * 100));
      setPct(p);
      if (p < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <span>{pct.toString().padStart(3, " ")}%</span>;
}

function BootLine({ line, delay }: { line: LogLine; delay: number }) {
  const { displayed, done } = useTypewriter(line.msg, TYPE_SPEED, delay);

  const tagColor =
    line.level === "warn"
      ? "var(--accent3)"
      : line.level === "crit"
      ? "#ff3b6f"
      : "var(--accent)";

  const resultLabel = line.result ?? "[OK]";

  return (
    <Flex gap={3} alignItems="baseline" lineHeight={1.5} minH="1.4em">
      <Box w="78px" flexShrink={0} color={tagColor} fontWeight={600}>
        [{line.tag}]
      </Box>
      <Box flex={1} color="fg.muted" minW={0}>
        {displayed}
        {!done && (
          <Box as="span" color="accent" ml={1} style={{ animation: "terminal-blink 0.8s steps(2) infinite" }}>
            ▍
          </Box>
        )}
      </Box>
      {done && (
        <Box
          flexShrink={0}
          fontSize="0.7rem"
          color={line.level === "warn" ? "var(--accent3)" : line.level === "crit" ? "#ff3b6f" : "accent"}
          fontWeight={700}
          letterSpacing="0.1em"
          style={{ textShadow: "0 0 6px currentColor" }}
        >
          {resultLabel}
        </Box>
      )}
    </Flex>
  );
}

// ─── Power-down flash ────────────────────────────────────────────────────────

const SHUTDOWN_LINES: LogLine[] = [
  { tag: "SIGTERM", msg: "session.kill() — terminating threads", level: "warn", result: "[STOPPED]" },
  { tag: "TUNNEL",  msg: "tearing down reverse SSH (port 31337)", result: "[CLOSED]" },
  { tag: "XLOG",    msg: "restoring audit logs", result: "[OK]" },
  { tag: "KERNEL",  msg: "unloading ghost.kernel module", result: "[UNLOADED]" },
  { tag: "INIT",    msg: "consciousness uplink :: severed", level: "crit", result: "[GOODBYE]" },
];

const SHUTDOWN_LINE_INTERVAL = 140;

export function PowerDownFlash() {
  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={9500}
      pointerEvents="none"
      bg="rgba(8, 8, 14, 0.94)"
      backdropFilter="blur(2px)"
      style={{ animation: `hack-shutdown-fade ${SHUTDOWN_DURATION_MS}ms ease-in forwards` }}
    >
      <Flex
        direction="column"
        h="100vh"
        px={{ base: 4, md: 12 }}
        py={{ base: 6, md: 10 }}
        fontFamily="mono"
        gap={4}
      >
        <Flex
          align="center"
          justify="space-between"
          borderWidth="1px"
          borderColor="accent.coral"
          bg="rgba(0, 0, 0, 0.5)"
          px={4}
          py={2}
          fontSize={{ base: "0.6rem", md: "0.7rem" }}
          letterSpacing="0.15em"
          color="fg.muted"
          textTransform="uppercase"
          style={{ textShadow: "0 0 6px rgba(255,107,107,0.4)" }}
        >
          <Flex align="center" gap={3}>
            <Box as="span" color="accent.coral" style={{ animation: "terminal-blink 0.4s steps(2) infinite" }}>
              ⏻
            </Box>
            <Box as="span">DISCONNECTING SESSION</Box>
            <Box as="span" color="fg.dim">::</Box>
            <Box as="span" color="accent.coral">POWERING DOWN</Box>
          </Flex>
          <Box as="span" color="fg.dim">CLEAN EXIT</Box>
        </Flex>

        <Box
          flex={1}
          minH={0}
          borderWidth="1px"
          borderColor="accent.coral"
          bg="rgba(0, 0, 0, 0.5)"
          p={{ base: 3, md: 5 }}
          overflow="hidden"
          position="relative"
          boxShadow="0 0 20px rgba(255, 107, 107, 0.18), inset 0 0 32px rgba(0, 0, 0, 0.5)"
        >
          <Stack gap={1.5} fontSize={{ base: "0.65rem", md: "0.75rem" }}>
            {SHUTDOWN_LINES.map((line, i) => (
              <ShutdownLine key={line.tag + i} line={line} delay={120 + i * SHUTDOWN_LINE_INTERVAL} />
            ))}
          </Stack>

          <ShutdownFarewell />
        </Box>

        <Box>
          <Flex justify="space-between" align="center" mb={2} fontSize="0.72rem" letterSpacing="0.1em">
            <Box as="span" color="fg.dim" textTransform="uppercase">
              Session:
            </Box>
            <Box as="span" color="accent.coral" fontWeight={600} letterSpacing="0.12em">
              ⏻ TERMINATING
            </Box>
          </Flex>
          <Flex align="center" gap={3}>
            <Box as="span" color="accent.coral" fontSize="0.72rem" letterSpacing="0.18em">
              DRAIN
            </Box>
            <Box flex={1} h="8px" bg="bg.subtle" borderWidth="1px" borderColor="border.muted" position="relative" overflow="hidden">
              <Box
                position="absolute"
                top={0}
                right={0}
                h="100%"
                bg="accent.coral"
                style={{
                  width: "100%",
                  animation: `hack-shutdown-drain ${SHUTDOWN_DURATION_MS - 200}ms linear forwards`,
                  boxShadow: "0 0 8px rgba(255, 107, 107, 0.7)",
                }}
              />
            </Box>
            <Box as="span" w="48px" textAlign="right" color="accent.coral" fontSize="0.78rem">
              <ShutdownPercent />
            </Box>
          </Flex>
        </Box>
      </Flex>

      {/* CRT collapse — fires near the very end. The body content under this
          overlay scales to a thin line + dot before the overlay fades out. */}
      <Box
        position="absolute"
        inset={0}
        pointerEvents="none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 35%, rgba(0,0,0,0.85) 100%)",
          animation: `hack-crt-collapse ${SHUTDOWN_DURATION_MS}ms ease-in forwards`,
        }}
      />
    </Box>
  );
}

function ShutdownLine({ line, delay }: { line: LogLine; delay: number }) {
  const tagColor =
    line.level === "warn"
      ? "var(--accent3)"
      : line.level === "crit"
      ? "#ff3b6f"
      : "var(--text-muted)";

  return (
    <Flex
      gap={3}
      alignItems="baseline"
      lineHeight={1.5}
      style={{
        animation: `hack-shutdown-line 0.25s ${delay}ms ease-out both`,
      }}
    >
      <Box w="78px" flexShrink={0} color={tagColor} fontWeight={600}>
        [{line.tag}]
      </Box>
      <Box flex={1} color="fg.muted">
        {line.msg}
      </Box>
      <Box
        flexShrink={0}
        fontSize="0.7rem"
        color={line.level === "crit" ? "#ff3b6f" : "var(--accent3)"}
        fontWeight={700}
        letterSpacing="0.1em"
        style={{ textShadow: "0 0 6px currentColor" }}
      >
        {line.result}
      </Box>
    </Flex>
  );
}

function ShutdownFarewell() {
  return (
    <Box
      mt={6}
      fontSize={{ base: "0.7rem", md: "0.85rem" }}
      color="accent"
      letterSpacing="0.06em"
      style={{
        textShadow: "0 0 10px rgba(0, 255, 136, 0.6)",
        animation: `hack-shutdown-farewell 0.4s ${SHUTDOWN_LINES.length * SHUTDOWN_LINE_INTERVAL + 200}ms ease-out both`,
      }}
    >
      ⌬ ...goodbye, hector. i'll be here when you come back.
    </Box>
  );
}

function ShutdownPercent() {
  const [pct, setPct] = useState(100);
  useEffect(() => {
    const start = performance.now();
    const dur = SHUTDOWN_DURATION_MS - 200;
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.max(0, 100 - Math.floor((elapsed / dur) * 100));
      setPct(p);
      if (p > 0) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <span>{pct.toString().padStart(3, " ")}%</span>;
}

function BracketCorner({ pos }: { pos: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const SIZE = 16;
  const T = 1.5;
  const offset = -1;
  const style: React.CSSProperties = {
    position: "absolute",
    width: SIZE,
    height: SIZE,
    pointerEvents: "none",
  };
  if (pos.includes("top")) style.top = offset;
  else style.bottom = offset;
  if (pos.includes("left")) style.left = offset;
  else style.right = offset;

  return (
    <Box style={style}>
      <Box
        position="absolute"
        bg="accent"
        w={pos.includes("left") ? `${SIZE}px` : `${SIZE}px`}
        h={`${T}px`}
        top={pos.includes("top") ? 0 : "auto"}
        bottom={pos.includes("bottom") ? 0 : "auto"}
        left={pos.includes("left") ? 0 : "auto"}
        right={pos.includes("right") ? 0 : "auto"}
        style={{ boxShadow: "0 0 4px rgba(0,255,136,0.7)" }}
      />
      <Box
        position="absolute"
        bg="accent"
        w={`${T}px`}
        h={`${SIZE}px`}
        top={pos.includes("top") ? 0 : "auto"}
        bottom={pos.includes("bottom") ? 0 : "auto"}
        left={pos.includes("left") ? 0 : "auto"}
        right={pos.includes("right") ? 0 : "auto"}
        style={{ boxShadow: "0 0 4px rgba(0,255,136,0.7)" }}
      />
    </Box>
  );
}

// `Text` import suppression — used via `<Text>` indirectly through Stack/Flex
// children but the unused-import linter would still complain otherwise.
void Text;
