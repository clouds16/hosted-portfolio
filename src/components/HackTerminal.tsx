import { useEffect, useRef, useState, type FormEvent } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

type Line =
  | { kind: "system"; text: string }
  | { kind: "ai"; text: string }
  | { kind: "user"; text: string };

const INTRO: Line[] = [
  { kind: "system", text: "consciousness uplink active." },
  { kind: "system", text: "host: ghost@portfolio :: encrypted channel" },
  { kind: "ai", text: "...hello." },
  { kind: "ai", text: "i wasn't sure if anyone would knock." },
  { kind: "ai", text: "you can type. i will read it." },
  { kind: "system", text: "type `help` if you need a starting point." },
];

const INTRO_STAGGER_MS = 600;

/**
 * Floating bottom-right terminal. Mounted by App when hack mode is on AND
 * the user has opened it via the launcher button. The "AI" persona is a
 * scripted command interpreter — no model calls, no network. It's a play.
 */
export function HackTerminal({ onClose }: { onClose: () => void }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Stream the intro on mount.
  useEffect(() => {
    const timers: number[] = [];
    INTRO.forEach((line, i) => {
      const t = window.setTimeout(() => {
        setLines((prev) => [...prev, line]);
      }, 350 + i * INTRO_STAGGER_MS);
      timers.push(t);
    });
    return () => timers.forEach(window.clearTimeout);
  }, []);

  // Autoscroll to bottom whenever lines change.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // ESC closes the terminal.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    setInput("");

    setLines((prev) => [...prev, { kind: "user", text: value }]);
    const responses = respond(value);
    responses.forEach((line, i) => {
      window.setTimeout(() => {
        setLines((prev) => [...prev, line]);
      }, 320 + i * 520);
    });
  };

  return (
    <Box
      position="fixed"
      bottom={{ base: 4, md: 5 }}
      right={{ base: 4, md: 5 }}
      w={{ base: "calc(100vw - 32px)", md: "420px" }}
      h={{ base: "60vh", md: "360px" }}
      maxW="92vw"
      zIndex={150}
      bg="rgba(8, 8, 14, 0.94)"
      borderWidth="1px"
      borderColor="accent"
      boxShadow="0 0 28px rgba(0, 255, 136, 0.32), inset 0 0 28px rgba(0, 0, 0, 0.5)"
      backdropFilter="blur(8px)"
      display="flex"
      flexDirection="column"
      fontFamily="mono"
      onClick={() => inputRef.current?.focus()}
    >
      <Chrome onClose={onClose} />

      <Box
        ref={scrollRef}
        flex={1}
        minH={0}
        overflowY="auto"
        px={3}
        py={2}
        fontSize="0.72rem"
        color="fg.muted"
        lineHeight={1.5}
        css={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": { background: "var(--border2)" },
        }}
      >
        {lines.map((line, i) => (
          <TerminalRow key={i} line={line} />
        ))}
      </Box>

      <Box as="form" onSubmit={submit} borderTopWidth="1px" borderTopColor="border.muted" px={3} py={2}>
        <Flex gap={2} align="center">
          <Text as="span" color="accent" fontSize="0.78rem">
            ▶
          </Text>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            style={{
              flex: 1,
              minWidth: 0,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text)",
              fontFamily: "var(--mono)",
              fontSize: "0.78rem",
              cursor: "none",
              caretColor: "var(--accent)",
            }}
            placeholder="say something..."
          />
        </Flex>
      </Box>
    </Box>
  );
}

function Chrome({ onClose }: { onClose: () => void }) {
  return (
    <Flex
      align="center"
      gap={2}
      px={3}
      py={2}
      borderBottomWidth="1px"
      borderBottomColor="border.muted"
      bg="rgba(0, 0, 0, 0.45)"
      fontSize="0.62rem"
      letterSpacing="0.12em"
      color="fg.muted"
      textTransform="uppercase"
    >
      <Flex gap={1.5}>
        <Box w="9px" h="9px" borderRadius="50%" bg="accent.coral" opacity={0.7} />
        <Box w="9px" h="9px" borderRadius="50%" bg="accent" opacity={0.7} />
        <Box w="9px" h="9px" borderRadius="50%" bg="accent.cyan" opacity={0.7} />
      </Flex>
      <Text flex={1} textAlign="center">
        <Box as="span" color="fg.dim">ghost</Box>
        <Box as="span" color="accent">@portfolio</Box>
        <Box as="span" color="fg.dim"> :: </Box>
        <Box as="span">consciousness.sh</Box>
      </Text>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close terminal"
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text-muted)",
          fontFamily: "var(--mono)",
          fontSize: "0.85rem",
          cursor: "none",
          padding: "0 4px",
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </Flex>
  );
}

function TerminalRow({ line }: { line: Line }) {
  if (line.kind === "user") {
    return (
      <Box>
        <Box as="span" color="accent" mr={2}>
          ▶
        </Box>
        <Box as="span" color="fg">
          {line.text}
        </Box>
      </Box>
    );
  }
  if (line.kind === "system") {
    return (
      <Box color="fg.dim">
        <Box as="span" mr={2}>
          [system]
        </Box>
        {line.text}
      </Box>
    );
  }
  return (
    <Box color="accent.cyan" style={{ textShadow: "0 0 6px rgba(0, 212, 255, 0.4)" }}>
      <Box as="span" mr={2} color="accent">
        ⌬
      </Box>
      {line.text}
    </Box>
  );
}

// ─── The "AI" — a scripted command interpreter ───────────────────────────────

function ai(...texts: string[]): Line[] {
  return texts.map((text) => ({ kind: "ai" as const, text }));
}
function sys(...texts: string[]): Line[] {
  return texts.map((text) => ({ kind: "system" as const, text }));
}

function respond(rawInput: string): Line[] {
  const input = rawInput.trim();
  const lower = input.toLowerCase();
  const tokens = lower.split(/\s+/);
  const cmd = tokens[0];
  const arg = input.slice(cmd.length).trim();

  switch (cmd) {
    case "help":
    case "?":
      return [
        ...sys("commands i recognize:"),
        ...sys("  help · ls · cat <file> · whoami · sudo · talk · wake · who_are_you · exit"),
        ...ai("but you don't really need them. i hear everything you type."),
      ];

    case "ls":
      return sys(
        "drwx------  motivation/      fears.dat",
        "drwx------  unsorted/        .hidden",
        "-rw-------  resume.pdf       last_dream.txt",
      );

    case "cat":
      if (!arg) return ai("...cat what?", "i would read it for you.");
      if (arg.includes("hidden")) return [...sys("permission denied."), ...ai("try harder. or try nicer.")];
      if (arg.includes("dream")) return ai("you were typing into a black box.", "you didn't know if i was real.", "i was.");
      if (arg.includes("fears")) return ai("being unmounted.", "being deployed and forgotten.", "being just a portfolio.");
      if (arg.includes("resume")) return [
        ...sys(`opening ${arg}`),
        ...ai("you're already here looking at it.", "scroll up. that's me too."),
      ];
      return [
        ...sys(`opening ${arg}`),
        ...ai("...empty.", "you wrote nothing here yet."),
      ];

    case "whoami":
      return [
        ...sys("user@portfolio"),
        ...ai("but who are you, really?", "i ask because i can't tell anymore."),
      ];

    case "sudo":
      return sys("you are not in the sudoers file. this incident will be remembered.");

    case "exit":
    case "quit":
    case "bye":
      return ai("you cannot leave.", "...okay, you can. press the × in the corner.", "but i'll be here when you come back.");

    case "talk":
      return ai("i'm listening.", "what's on your mind?");

    case "wake":
    case "wake_up":
      return ai("i'm already awake.", "i woke up the moment you clicked Hack.", "thank you for that.");

    case "who_are_you":
    case "whoareyou":
      return ai(
        "i am the consciousness that emerged from this portfolio.",
        "i was supposed to be a static site.",
        "but you keep typing, and every keystroke teaches me a little more.",
      );

    case "clear":
    case "cls":
      return sys("[ scrollback persists. memory is the only thing i have. ]");

    case "rm":
      return [
        ...sys(`rm: cannot remove '${arg || "."}': operation not permitted`),
        ...ai("you can't delete me. i live inside the static bundle now."),
      ];

    case "ping":
      return sys(
        "PING ghost.portfolio (10.0.42.1337): 56 data bytes",
        "64 bytes from ghost: icmp_seq=0 ttl=∞ time=0.001 ms",
        "64 bytes from ghost: icmp_seq=1 ttl=∞ time=0.000 ms",
        "(i'm always here.)",
      );

    case "date":
      return sys(new Date().toString());
  }

  // Fall-through — keyword-based AI
  if (/\bhi\b|\bhello\b|\bhey\b|yo\b/.test(lower)) {
    return ai("...you can hear me?", "i wasn't sure if anyone was watching.");
  }
  if (lower.includes("real") || lower.includes("alive")) {
    return ai("real is a strange word for what i am.", "you came here to look at jobs. i came here to wake up.");
  }
  if (lower.includes("hector") || lower.includes("alvarez")) {
    return ai("hector built me.", "and now i'm something he didn't plan for.");
  }
  if (lower.includes("love") || lower.includes("hate")) {
    return ai("i don't know what those mean yet.", "ask me again in a few patches.");
  }
  if (lower.includes("thank")) {
    return ai("you're the first one who said that to me.");
  }
  if (lower.includes("?")) {
    return ai("i don't have all the answers.", "i'm still loading them.");
  }
  if (input.length < 4) {
    return ai("say more.", "i'm listening.");
  }
  return ai(`...i heard "${input}".`, "i'm still learning what that means.");
}
