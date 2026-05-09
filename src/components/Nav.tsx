import { useEffect, useState } from "react";
import { Box, Flex, HStack, Link, Stack, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Code2, Layers, Sparkles, Wrench } from "lucide-react";
import type { DisciplineFilter } from "../types";
import { useDiscipline } from "../discipline";

const SECTIONS = ["hero", "skills", "experience", "projects", "education", "contact"];

const MotionBox = motion.create(Box);

type NavProps = {
  hackMode: boolean;
  onToggleHack: () => void;
};

export function Nav({ hackMode, onToggleHack }: NavProps) {
  const { discipline, setDiscipline } = useDiscipline();
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      for (const id of [...SECTIONS].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <MotionBox
      as="nav"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={100}
      px={{ base: 6, md: 12 }}
      py={5}
      borderBottomWidth="1px"
      borderBottomColor={scrolled ? "border.base" : "transparent"}
      bg={scrolled ? "rgba(10,10,15,0.92)" : "transparent"}
      backdropFilter={scrolled ? "blur(12px)" : "none"}
      style={{ transition: "background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease" }}
    >
      <Flex align="center" justify="space-between" gap={4}>
        <Text
          fontFamily="mono"
          fontSize={{ base: "xs", md: "sm" }}
          letterSpacing="wider"
          color="accent"
          whiteSpace="nowrap"
        >
          engineerhectoralvarez
          <Box as="span" color="fg.muted">
            .com
          </Box>
        </Text>

        <DisciplineToggle value={discipline} onChange={setDiscipline} />

        <HStack gap={{ base: 3, md: 5 }}>
          <HackButton on={hackMode} onClick={onToggleHack} />

          <HStack gap={{ base: 4, md: 6 }} display={{ base: "none", lg: "flex" }}>
          {SECTIONS.map((id) => (
            <Link
              key={id}
              href={`#${id}`}
              fontFamily="mono"
              fontSize="xs"
              letterSpacing="0.12em"
              textTransform="uppercase"
              textDecoration="none"
              color={active === id ? "accent" : "fg.muted"}
              position="relative"
              style={{ transition: "color 0.2s" }}
              _hover={{ color: "accent" }}
            >
              {id}
              {active === id && (
                <MotionBox
                  layoutId="nav-dot"
                  position="absolute"
                  bottom="-6px"
                  left="50%"
                  transform="translateX(-50%)"
                  w="3px"
                  h="3px"
                  borderRadius="50%"
                  bg="accent"
                />
              )}
            </Link>
          ))}
          </HStack>
        </HStack>
      </Flex>
    </MotionBox>
  );
}

function HackButton({ on, onClick }: { on: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      position="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box
        as="button"
        onClick={onClick}
        aria-pressed={on}
        aria-label={on ? "Disable hack mode" : "Enable hack mode"}
        display="inline-flex"
        alignItems="center"
        gap={1.5}
        px={3}
        py={1.5}
        borderRadius="full"
        borderWidth="1px"
        borderColor={on ? "accent" : "border.muted"}
        bg={on ? "rgba(0, 255, 136, 0.12)" : "transparent"}
        color={on ? "accent" : "fg.muted"}
        fontFamily="mono"
        fontSize="xs"
        letterSpacing="0.08em"
        textTransform="uppercase"
        cursor="none"
        style={{
          transition: "background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s",
          boxShadow: on ? "0 0 14px rgba(0, 255, 136, 0.35)" : "none",
        }}
        _hover={{ color: "accent", borderColor: "accent" }}
      >
        <Sparkles size={12} />
        {on ? "Hacked" : "Hack"}
      </Box>

      <AnimatePresence>
        {hovered && <HackTooltip on={on} />}
      </AnimatePresence>
    </Box>
  );
}

function HackTooltip({ on }: { on: boolean }) {
  const items = on
    ? ["Click to disable.", "Returns the page to a quieter mode."]
    : [
        "+ matrix rain on the sides",
        "+ CRT scanlines + edge glow",
        "+ ghost-in-the-shell idle glitches",
        "+ amplified hover effects",
      ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15 }}
      style={{
        position: "absolute",
        top: "calc(100% + 10px)",
        right: 0,
        width: 260,
        zIndex: 200,
        pointerEvents: "none",
      }}
    >
      {/* Triangle pointer */}
      <Box
        position="absolute"
        top="-5px"
        right="22px"
        w="10px"
        h="10px"
        bg="rgba(8, 8, 14, 0.95)"
        borderTopWidth="1px"
        borderLeftWidth="1px"
        borderColor="accent"
        transform="rotate(45deg)"
        zIndex={-1}
      />

      <Box
        bg="rgba(8, 8, 14, 0.95)"
        borderWidth="1px"
        borderColor="accent"
        boxShadow="0 0 24px rgba(0, 255, 136, 0.18), inset 0 0 18px rgba(0, 0, 0, 0.5)"
        backdropFilter="blur(6px)"
        p={3}
        fontFamily="mono"
        fontSize="0.7rem"
        color="fg.muted"
      >
        <Flex align="center" gap={2} mb={2}>
          <Sparkles size={11} color="var(--chakra-colors-accent)" />
          <Text fontSize="0.62rem" letterSpacing="0.18em" color="accent" textTransform="uppercase">
            {on ? "Hack mode · active" : "Hack mode"}
          </Text>
          <Box flex={1} h="1px" bg="border.muted" />
        </Flex>
        <Stack gap={1} lineHeight={1.5}>
          {items.map((item) => (
            <Text key={item} color={on ? "fg.muted" : "fg"}>
              {item}
            </Text>
          ))}
        </Stack>
      </Box>
    </motion.div>
  );
}

type ToggleProps = {
  value: DisciplineFilter;
  onChange: (v: DisciplineFilter) => void;
};

function DisciplineToggle({ value, onChange }: ToggleProps) {
  return (
    <Flex
      role="tablist"
      aria-label="Discipline filter"
      borderWidth="1px"
      borderColor="border.muted"
      borderRadius="full"
      p="2px"
      bg="bg.subtle"
      fontFamily="mono"
      fontSize="xs"
      gap="2px"
    >
      <ToggleButton active={value === "all"} onClick={() => onChange("all")} icon={<Layers size={12} />} label="All" />
      <ToggleButton
        active={value === "software"}
        onClick={() => onChange("software")}
        icon={<Code2 size={12} />}
        label="Software"
      />
      <ToggleButton
        active={value === "mechanical"}
        onClick={() => onChange("mechanical")}
        icon={<Wrench size={12} />}
        label="Mechanical"
      />
    </Flex>
  );
}

function ToggleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Box
      as="button"
      onClick={onClick}
      role="tab"
      aria-selected={active}
      px={3}
      py={1.5}
      borderRadius="full"
      bg={active ? "accent" : "transparent"}
      color={active ? "bg" : "fg.muted"}
      letterSpacing="0.08em"
      textTransform="uppercase"
      cursor="none"
      style={{ transition: "background 0.2s, color 0.2s" }}
      _hover={!active ? { color: "fg" } : undefined}
      display="inline-flex"
      alignItems="center"
      gap={1.5}
    >
      {icon}
      {label}
    </Box>
  );
}
