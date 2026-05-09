import { useRef } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";
import { data } from "../data";
import { filterByDiscipline, useDiscipline } from "../discipline";
import { SectionLabel } from "./SectionLabel";

const MotionBox = motion.create(Box);

const ACCENT_RAIL = ["accent", "accent.cyan", "accent.coral"] as const;

export function Skills() {
  const { discipline } = useDiscipline();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-100px" });
  const skills = filterByDiscipline(data.skills, discipline);

  return (
    <Box as="section" id="skills" py={32} px={{ base: 6, md: 12 }} bg="bg.subtle">
      <Box maxW="1100px" mx="auto">
        <SectionLabel label="02" title="Skills & Stack" />

        <Grid
          ref={ref}
          mt={16}
          gap={6}
          gridTemplateColumns={{ base: "1fr", md: "repeat(auto-fill, minmax(320px, 1fr))" }}
        >
          {skills.map((group, gi) => (
            <MotionBox
              key={`${discipline}-${group.category}`}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: gi * 0.1, duration: 0.5 }}
              bg="bg.muted"
              borderWidth="1px"
              borderColor="border.base"
              p={7}
              position="relative"
              overflow="hidden"
              data-hack-glow="card"
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                h="2px"
                bg={ACCENT_RAIL[gi % ACCENT_RAIL.length]}
              />
              <Text
                fontFamily="mono"
                fontSize="0.65rem"
                letterSpacing="0.18em"
                textTransform="uppercase"
                color="fg.dim"
                mb={5}
              >
                <Box as="span" color="accent">$</Box> {group.category}
              </Text>
              <Flex wrap="wrap" gap={2}>
                {group.items.map((item, ii) => (
                  <MotionBox
                    key={item}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: gi * 0.1 + ii * 0.04 }}
                    fontFamily="mono"
                    fontSize="xs"
                    color="fg.muted"
                    bg="bg.subtle"
                    borderWidth="1px"
                    borderColor="border.muted"
                    px={3}
                    py={1}
                    letterSpacing="0.04em"
                    data-hack-glow="pill"
                  >
                    {item}
                  </MotionBox>
                ))}
              </Flex>
            </MotionBox>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
