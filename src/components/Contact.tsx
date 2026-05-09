import { useRef } from "react";
import { Box, Flex, Grid, Stack, Text } from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";
import { Cog, Mail, MapPin } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { data } from "../data";
import { useDiscipline } from "../discipline";
import type { DisciplineFilter } from "../types";
import { useTypewriter } from "../hooks/useTypewriter";
import { SectionLabel } from "./SectionLabel";

const MotionBox = motion.create(Box);

const PITCHES: Record<DisciplineFilter, string[]> = {
  all: [
    "Open to opportunities across",
    "software, mechanical, and controls.",
    "Let's build something — anything.",
  ],
  software: [
    "Open to new opportunities — full-stack,",
    "DevOps, and frontend-heavy roles.",
    "Let's build something.",
  ],
  mechanical: [
    "Open to mechanical design,",
    "manufacturing, and controls work.",
    "Let's build something physical.",
  ],
};

const TAGS: Record<DisciplineFilter, string[]> = {
  all: ["TypeScript", "React", "AWS", "Inventor", "PLC"],
  software: ["TypeScript", "React", "Go", "AWS", "Docker"],
  mechanical: ["Inventor", "AutoCAD", "PLC", "GD&T", "Python"],
};

const TYPE_SPEED = 18; // ms per character
const LINE_GAP = 120; // ms pause between lines

export function Contact() {
  const { discipline } = useDiscipline();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  const links = [
    { icon: Mail, label: "Email", value: data.email, href: `mailto:${data.email}` },
    { icon: FaGithub, label: "GitHub", value: "github.com/clouds16", href: data.github },
    { icon: FaLinkedin, label: "LinkedIn", value: "in/hector-alvarez-toledo", href: data.linkedin },
    { icon: MapPin, label: "Location", value: data.location, href: "#" },
  ];

  return (
    <Box as="section" id="contact" pt={32} pb={24} px={{ base: 6, md: 12 }} bg="bg">
      <Box maxW="900px" mx="auto">
        <SectionLabel label="06" title="Contact" />

        <Grid
          ref={ref}
          mt={16}
          gap={10}
          gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
        >
          <MotionBox
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {discipline === "mechanical" ? (
              <MechanicalTitleBlock active={inView} />
            ) : (
              <ContactTerminal discipline={discipline} active={inView} />
            )}
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Stack gap={4}>
              {links.map(({ icon: Icon, label, value, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  whileHover={{ x: 6 }}
                  style={{ textDecoration: "none", cursor: "none" }}
                >
                  <Flex
                    align="center"
                    gap={4}
                    px={5}
                    py={4}
                    bg="bg.muted"
                    borderWidth="1px"
                    borderColor="border.base"
                    style={{ transition: "border-color 0.2s" }}
                    _hover={{ borderColor: "accent" }}
                    data-hack-glow="card"
                  >
                    <Icon size={16} color="var(--chakra-colors-accent)" />
                    <Box>
                      <Text fontFamily="mono" fontSize="0.65rem" color="fg.dim" letterSpacing="0.1em" textTransform="uppercase">
                        {label}
                      </Text>
                      <Text fontFamily="mono" fontSize="sm" color="fg.muted">
                        {value}
                      </Text>
                    </Box>
                  </Flex>
                </motion.a>
              ))}
            </Stack>
          </MotionBox>
        </Grid>

        <Flex
          mt={24}
          pt={8}
          borderTopWidth="1px"
          borderTopColor="border.base"
          justify="space-between"
          align="center"
          fontFamily="mono"
          fontSize="xs"
          color="fg.dim"
          wrap="wrap"
          gap={4}
        >
          <Text>
            <Box as="span" color="accent">engineerhectoralvarez</Box>.com — Hector Alvarez Toledo
          </Text>
          <Text>Built with React + Chakra UI · Deployed on AWS/Nginx</Text>
          <Text>© {new Date().getFullYear()}</Text>
        </Flex>
      </Box>
    </Box>
  );
}

type TerminalLine = {
  text: string;
  color: string;
  prefix?: string;
  prefixColor?: string;
};

function buildLines(discipline: DisciplineFilter): TerminalLine[] {
  const pitch = PITCHES[discipline];
  const tags = TAGS[discipline];
  return [
    { prefix: "$", prefixColor: "var(--accent)", text: "cat about.txt", color: "var(--text)" },
    { text: pitch[0], color: "var(--text-muted)" },
    { text: pitch[1], color: "var(--text-muted)" },
    { text: pitch[2], color: "var(--text-muted)" },
    { text: "", color: "transparent" },
    { prefix: "$", prefixColor: "var(--accent)", text: "stack --installed", color: "var(--text)" },
    ...tags.map((t) => ({
      prefix: "✓",
      prefixColor: "var(--accent)",
      text: t,
      color: "var(--accent2)",
    })),
  ];
}

function ContactTerminal({ discipline, active }: { discipline: DisciplineFilter; active: boolean }) {
  const lines = buildLines(discipline);
  // Compute cumulative start delay for each line so they type in sequence.
  const delays: number[] = [];
  let cursor = 250;
  for (const line of lines) {
    delays.push(cursor);
    cursor += line.text.length * TYPE_SPEED + LINE_GAP;
  }
  const totalDuration = cursor;

  return (
    <Box
      key={`${discipline}-${active}`}
      borderWidth="1px"
      borderColor="border.muted"
      borderRadius="md"
      bg="rgba(8, 8, 14, 0.85)"
      boxShadow="0 0 24px rgba(0, 255, 136, 0.08), inset 0 0 32px rgba(0, 0, 0, 0.5)"
      overflow="hidden"
      backdropFilter="blur(6px)"
    >
      <TerminalChrome />
      <Box p={5} fontFamily="mono" fontSize="xs" minH="220px">
        <Stack gap={1.5}>
          {lines.map((line, i) => (
            <TerminalRow
              key={`${discipline}-${i}`}
              line={line}
              delay={active ? delays[i] : 999_999}
              speed={TYPE_SPEED}
            />
          ))}
          <Box pt={2}>
            <PromptCursor delay={active ? totalDuration : 999_999} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

function TerminalChrome() {
  return (
    <Flex
      align="center"
      px={3}
      py={2}
      borderBottomWidth="1px"
      borderBottomColor="border.muted"
      bg="rgba(0, 0, 0, 0.4)"
      fontFamily="mono"
      fontSize="0.65rem"
      color="fg.muted"
      letterSpacing="0.08em"
    >
      <Flex gap={1.5} mr={3}>
        <Box w="9px" h="9px" borderRadius="50%" bg="accent.coral" opacity={0.8} />
        <Box w="9px" h="9px" borderRadius="50%" bg="accent" opacity={0.8} />
        <Box w="9px" h="9px" borderRadius="50%" bg="accent.cyan" opacity={0.8} />
      </Flex>
      <Text flex={1} textAlign="center">
        <Box as="span" color="fg.dim">~/portfolio/</Box>
        <Box as="span" color="accent">contact.sh</Box>
      </Text>
      <Box w="38px" />
    </Flex>
  );
}

function TerminalRow({ line, delay, speed }: { line: TerminalLine; delay: number; speed: number }) {
  const { displayed } = useTypewriter(line.text, speed, delay);
  return (
    <Box minH="1.2em" lineHeight={1.5}>
      {line.prefix && (
        <>
          <Box as="span" color={line.prefixColor ?? "var(--text-muted)"} mr={2}>
            {line.prefix}
          </Box>
        </>
      )}
      <Box as="span" color={line.color}>
        {displayed}
      </Box>
    </Box>
  );
}

function PromptCursor({ delay }: { delay: number }) {
  const { done } = useTypewriter(" ", 0, delay);
  return (
    <Flex align="center" gap={2} fontFamily="mono" fontSize="xs">
      <Box as="span" color="accent">$</Box>
      <Box
        as="span"
        w="8px"
        h="14px"
        bg="accent"
        display="inline-block"
        style={done ? { animation: "terminal-blink 1s steps(2) infinite" } : { opacity: 0 }}
      />
    </Flex>
  );
}

// ─── Mechanical mode: engineering drawing title block ────────────────────────

const MECH_TYPE_SPEED = 14;
const MECH_LINE_GAP = 90;

function MechanicalTitleBlock({ active }: { active: boolean }) {
  const today = new Date().toISOString().slice(0, 10);
  const pitch = PITCHES.mechanical;
  const tags = TAGS.mechanical;

  // Sequence: title bar (instant) → metadata cells → notes → BOM items
  let cursor = 350;
  const headerDelay = active ? 100 : 999_999;
  const metaDelays = [0, 0, 0, 0].map(() => {
    const d = active ? cursor : 999_999;
    cursor += 11 * MECH_TYPE_SPEED + MECH_LINE_GAP; // ~longest meta value length
    return d;
  });
  const noteDelays = pitch.map((line) => {
    const d = active ? cursor : 999_999;
    cursor += line.length * MECH_TYPE_SPEED + MECH_LINE_GAP;
    return d;
  });
  cursor += 200;
  const bomDelays = tags.map((t) => {
    const d = active ? cursor : 999_999;
    cursor += t.length * MECH_TYPE_SPEED + MECH_LINE_GAP / 2;
    return d;
  });

  return (
    <Box
      position="relative"
      borderWidth="1px"
      borderColor="border.muted"
      bg="rgba(8, 8, 14, 0.85)"
      boxShadow="0 0 24px rgba(0, 255, 136, 0.06), inset 0 0 32px rgba(0, 0, 0, 0.5)"
      backdropFilter="blur(6px)"
      fontFamily="mono"
    >
      <CornerMark corner="top-left" />
      <CornerMark corner="top-right" />
      <CornerMark corner="bottom-left" />
      <CornerMark corner="bottom-right" />

      {/* Title bar */}
      <Flex
        align="center"
        gap={2}
        px={3}
        py={2}
        borderBottomWidth="1px"
        borderBottomColor="border.muted"
        bg="rgba(0, 0, 0, 0.4)"
        fontSize="0.6rem"
        letterSpacing="0.15em"
        textTransform="uppercase"
      >
        <RotatingGear delay={headerDelay} />
        <Text flex={1} color="fg.muted">
          <Box as="span" color="fg.dim">DWG /</Box> hat-portfolio /{" "}
          <Box as="span" color="accent">contact.dwg</Box>
        </Text>
        <Box
          borderWidth="1px"
          borderColor="accent"
          color="accent"
          px={1.5}
          py="1px"
          fontSize="0.55rem"
          letterSpacing="0.1em"
        >
          REV A
        </Box>
      </Flex>

      {/* Metadata grid */}
      <Grid templateColumns="1fr 1fr" borderBottomWidth="1px" borderBottomColor="border.muted">
        <MetaCell label="DRAWN BY" value="H. ALVAREZ" delay={metaDelays[0]} borderRight />
        <MetaCell label="DATE" value={today} delay={metaDelays[1]} />
        <MetaCell label="SCALE" value="1:1" delay={metaDelays[2]} borderRight borderTop />
        <MetaCell label="SHEET" value="1 OF 1" delay={metaDelays[3]} borderTop />
      </Grid>

      {/* Notes section */}
      <Box px={4} py={3} borderBottomWidth="1px" borderBottomColor="border.muted">
        <Flex align="center" gap={2} mb={2}>
          <Box w="3px" h="10px" bg="accent" />
          <Text fontSize="0.6rem" letterSpacing="0.18em" color="fg.dim" textTransform="uppercase">
            Notes
          </Text>
          <Box flex={1} h="1px" bg="border.muted" />
        </Flex>
        <Stack gap={1}>
          {pitch.map((line, i) => (
            <NoteLine key={`mech-note-${i}`} text={line} delay={noteDelays[i]} />
          ))}
        </Stack>
      </Box>

      {/* Bill of materials */}
      <Box px={4} py={3}>
        <Flex align="center" gap={2} mb={2}>
          <Box w="3px" h="10px" bg="accent.cyan" />
          <Text fontSize="0.6rem" letterSpacing="0.18em" color="fg.dim" textTransform="uppercase">
            Bill of Materials
          </Text>
          <Box flex={1} h="1px" bg="border.muted" />
        </Flex>
        <Box>
          <Grid
            templateColumns="42px 1fr 1fr"
            fontSize="0.6rem"
            letterSpacing="0.12em"
            color="fg.dim"
            textTransform="uppercase"
            pb={1}
            borderBottomWidth="1px"
            borderBottomColor="border.muted"
          >
            <Box>Item</Box>
            <Box>Description</Box>
            <Box>Qty</Box>
          </Grid>
          <Stack gap={0} divideY="1px" divideColor="border.muted">
            {tags.map((tag, i) => (
              <BomRow
                key={`mech-bom-${i}`}
                index={i + 1}
                description={tag}
                delay={bomDelays[i]}
              />
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

function MetaCell({
  label,
  value,
  delay,
  borderRight,
  borderTop,
}: {
  label: string;
  value: string;
  delay: number;
  borderRight?: boolean;
  borderTop?: boolean;
}) {
  const { displayed } = useTypewriter(value, MECH_TYPE_SPEED, delay);
  return (
    <Box
      px={3}
      py={2}
      borderRightWidth={borderRight ? "1px" : "0"}
      borderTopWidth={borderTop ? "1px" : "0"}
      borderColor="border.muted"
    >
      <Text fontSize="0.55rem" letterSpacing="0.18em" color="fg.dim" textTransform="uppercase" mb={0.5}>
        {label}
      </Text>
      <Text fontSize="0.78rem" color="fg" letterSpacing="0.05em" minH="1em">
        {displayed}
      </Text>
    </Box>
  );
}

function NoteLine({ text, delay }: { text: string; delay: number }) {
  const { displayed } = useTypewriter(text, MECH_TYPE_SPEED, delay);
  return (
    <Flex gap={2} fontSize="0.72rem" color="fg.muted" lineHeight={1.6}>
      <Box color="accent" flexShrink={0}>
        →
      </Box>
      <Box minH="1em">{displayed}</Box>
    </Flex>
  );
}

function BomRow({ index, description, delay }: { index: number; description: string; delay: number }) {
  const { displayed } = useTypewriter(description, MECH_TYPE_SPEED, delay);
  return (
    <Grid templateColumns="42px 1fr 1fr" py={1} fontSize="0.7rem" alignItems="center">
      <Box color="fg.dim" letterSpacing="0.08em">{String(index).padStart(2, "0")}</Box>
      <Box color="accent" letterSpacing="0.04em" textTransform="uppercase" minH="1em">
        {displayed}
      </Box>
      <Box color="fg.muted" letterSpacing="0.08em">×1</Box>
    </Grid>
  );
}

function RotatingGear({ delay }: { delay: number }) {
  return (
    <Box
      style={{
        animation: "mech-gear-spin 8s linear infinite",
        animationDelay: `${delay}ms`,
        display: "inline-flex",
      }}
      color="var(--chakra-colors-accent)"
    >
      <Cog size={14} strokeWidth={1.6} />
    </Box>
  );
}

function CornerMark({ corner }: { corner: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const offset = "-5px";
  const style: React.CSSProperties = { position: "absolute", width: 10, height: 10, pointerEvents: "none" };
  if (corner.includes("top")) style.top = offset;
  else style.bottom = offset;
  if (corner.includes("left")) style.left = offset;
  else style.right = offset;
  return (
    <Box style={style}>
      <Box position="absolute" top="50%" left={0} w="100%" h="1px" bg="accent" opacity={0.7} />
      <Box position="absolute" top={0} left="50%" w="1px" h="100%" bg="accent" opacity={0.7} />
    </Box>
  );
}
