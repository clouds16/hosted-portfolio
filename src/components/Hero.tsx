import { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { data } from "../data";
import { useDiscipline } from "../discipline";
import { useTypewriter } from "../hooks/useTypewriter";

const MotionBox = motion.create(Box);
const MotionHeading = motion.create(Heading);
const MotionStack = motion.create(Stack);

const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#01_";

function useGlitchedText(text: string, delayMs = 0, durationMs = 600) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    let raf = 0;
    let stopped = false;
    const startAt = performance.now() + delayMs;
    const tick = () => {
      if (stopped) return;
      const t = performance.now();
      if (t < startAt) {
        setOut("");
        raf = requestAnimationFrame(tick);
        return;
      }
      const elapsed = t - startAt;
      if (elapsed >= durationMs) {
        setOut(text);
        return;
      }
      const reveal = Math.floor((elapsed / durationMs) * text.length);
      const next = text
        .split("")
        .map((c, i) => {
          if (i < reveal || c === " ") return c;
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        })
        .join("");
      setOut(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, [text, delayMs, durationMs]);
  return out;
}

function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cellSize = 48;
    const cols = Math.ceil(canvas.width / cellSize);
    const rows = Math.ceil(canvas.height / cellSize);
    const cells = Array.from({ length: 18 }, () => ({
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
      alpha: Math.random(),
      speed: 0.004 + Math.random() * 0.008,
    }));

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(30,30,46,0.6)";
      ctx.lineWidth = 0.5;
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * cellSize, 0);
        ctx.lineTo(c * cellSize, canvas.height);
        ctx.stroke();
      }
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * cellSize);
        ctx.lineTo(canvas.width, r * cellSize);
        ctx.stroke();
      }
      cells.forEach((cell) => {
        cell.alpha += cell.speed;
        if (cell.alpha > 1) {
          cell.alpha = 0;
          cell.x = Math.floor(Math.random() * cols);
          cell.y = Math.floor(Math.random() * rows);
        }
        ctx.fillStyle = `rgba(0,255,136,${cell.alpha * 0.12})`;
        ctx.fillRect(cell.x * cellSize + 1, cell.y * cellSize + 1, cellSize - 2, cellSize - 2);
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <Box
      as="canvas"
      ref={canvasRef}
      position="absolute"
      inset={0}
      w="100%"
      h="100%"
      pointerEvents="none"
    />
  );
}

export function Hero() {
  const { discipline } = useDiscipline();
  const hero = data.hero[discipline];
  const { displayed: title, done: titleDone } = useTypewriter(hero.title, 50, 600);
  const { displayed: tagline } = useTypewriter(hero.tagline, 30, titleDone ? 200 : 9999);

  const promptLabel =
    discipline === "all" ? "whoami --all" : discipline === "software" ? "whoami" : "whoami --mech";

  return (
    <Flex
      as="section"
      id="hero"
      minH="100vh"
      direction="column"
      justify="center"
      px={{ base: 6, md: 12 }}
      position="relative"
      overflow="hidden"
    >
      <GridBackground />

      <Box
        position="absolute"
        top="30%"
        left="10%"
        w="500px"
        h="500px"
        background="radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)"
        pointerEvents="none"
      />

      <Stack maxW="800px" position="relative" zIndex={1} gap={4}>
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Text fontSize="xs" letterSpacing="0.2em" textTransform="uppercase" color="accent" fontFamily="mono">
            <Box as="span" color="fg.dim">~/</Box>
            portfolio
            <Box as="span" color="fg.dim"> $</Box>
            {" "}
            {promptLabel}
          </Text>
        </MotionBox>

        <MotionHeading
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          fontFamily="sans"
          fontSize={{ base: "3rem", md: "clamp(3rem, 6vw, 5.5rem)" }}
          fontWeight={800}
          lineHeight={1.05}
          letterSpacing="-0.02em"
          color="fg"
        >
          {data.name.split(" ").map((word, i) => (
            <GlitchWord
              key={i}
              word={word}
              color={i === 0 ? "fg" : i === 1 ? "fg.muted" : "accent"}
              delay={300 + i * 200}
            />
          ))}
        </MotionHeading>

        <Box
          fontFamily="mono"
          fontSize={{ base: "md", md: "xl" }}
          color="accent.cyan"
          minH="2rem"
        >
          <Box as="span" color="fg.dim">// </Box>
          {title}
          <MotionBox
            display="inline-block"
            w="2px"
            h="1em"
            bg="accent.cyan"
            ml={1}
            verticalAlign="middle"
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.7 }}
          />
        </Box>

        <Text fontFamily="mono" fontSize={{ base: "sm", md: "md" }} color="fg.muted" minH="1.5rem">
          {tagline}
        </Text>

        <MotionStack
          direction="row"
          gap={4}
          flexWrap="wrap"
          mt={6}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <HeroButton href="#projects" variant="solid">
            ./view_projects
          </HeroButton>
          <HeroButton href="#contact" variant="outline">
            ./get_in_touch
          </HeroButton>
        </MotionStack>

        <MotionBox
          mt={12}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
        >
          <HStack gap={6} fontSize="xs" color="fg.dim" flexWrap="wrap">
            <Meta k="loc" v={data.location} />
            <Meta k="status" v="open to work" />
            <Meta k="stack" v={hero.stack} />
          </HStack>
        </MotionBox>
      </Stack>

      <MotionBox
        position="absolute"
        bottom={10}
        left="50%"
        transform="translateX(-50%)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        display={{ base: "none", md: "flex" }}
        flexDirection="column"
        alignItems="center"
        gap={1.5}
      >
        <Text color="fg.dim" fontSize="0.65rem" letterSpacing="0.15em">
          SCROLL
        </Text>
        <MotionBox
          w="1px"
          h="28px"
          background="linear-gradient(to bottom, var(--chakra-colors-fg-dim), transparent)"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
        />
      </MotionBox>
    </Flex>
  );
}

function GlitchWord({ word, color, delay }: { word: string; color: string; delay: number }) {
  const text = useGlitchedText(word, delay, 550);
  return (
    <Box as="span" display="block" color={color} minH="1em">
      {text || " "}
    </Box>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <Text as="span" fontFamily="mono" fontSize="xs">
      <Box as="span" color="fg.muted">{k}</Box>
      <Box as="span" color="fg.dim">="</Box>
      <Box as="span" color="accent">{v}</Box>
      <Box as="span" color="fg.dim">"</Box>
    </Text>
  );
}

function HeroButton({
  href,
  variant,
  children,
}: {
  href: string;
  variant: "solid" | "outline";
  children: React.ReactNode;
}) {
  const solid = variant === "solid";
  return (
    <Button
      asChild
      px={6}
      py={3}
      h="auto"
      fontFamily="mono"
      fontSize="sm"
      fontWeight={500}
      letterSpacing="0.05em"
      borderRadius="0"
      bg={solid ? "accent" : "transparent"}
      color={solid ? "bg" : "accent"}
      borderWidth="1px"
      borderColor="accent"
      cursor="none"
      _hover={solid ? { bg: "accent.cyan", borderColor: "accent.cyan" } : { bg: "rgba(0,255,136,0.08)" }}
      style={{ transition: "all 0.2s" }}
    >
      <a href={href}>{children}</a>
    </Button>
  );
}
