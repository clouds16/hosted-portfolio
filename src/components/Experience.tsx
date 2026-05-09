import { useRef } from "react";
import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";
import { data } from "../data";
import { filterByDiscipline, useDiscipline } from "../discipline";
import { SectionLabel } from "./SectionLabel";

const MotionBox = motion.create(Box);

export function Experience() {
  const { discipline } = useDiscipline();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const jobs = filterByDiscipline(data.experience, discipline);

  return (
    <Box as="section" id="experience" py={32} px={{ base: 6, md: 12 }} bg="bg">
      <Box maxW="900px" mx="auto">
        <SectionLabel label="03" title="Experience" />

        <Box ref={ref} mt={16} position="relative">
          <MotionBox
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1, ease: "easeInOut" }}
            position="absolute"
            left={0}
            top={0}
            bottom={0}
            w="1px"
            bg="border.muted"
            transformOrigin="top"
          />

          <Stack pl={12} gap={16}>
            {jobs.map((job, i) => (
              <MotionBox
                key={`${discipline}-${job.company}`}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                position="relative"
              >
                <Box
                  position="absolute"
                  left="-38px"
                  top="8px"
                  w="9px"
                  h="9px"
                  borderRadius="50%"
                  bg={i === 0 ? "accent" : "border.muted"}
                  borderWidth="2px"
                  borderColor={i === 0 ? "accent" : "fg.dim"}
                  boxShadow={i === 0 ? "0 0 12px var(--chakra-colors-accent)" : "none"}
                />

                <Flex justify="space-between" align="flex-start" wrap="wrap" gap={2} mb={3}>
                  <Box>
                    <Heading
                      fontFamily="sans"
                      fontSize="1.3rem"
                      fontWeight={700}
                      color="fg"
                      letterSpacing="-0.01em"
                    >
                      {job.role}
                    </Heading>
                    <Text fontFamily="mono" fontSize="sm" color="accent" mt={1}>
                      @{" "}
                      {job.href ? (
                        <a
                          href={job.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "var(--accent)",
                            textDecoration: "underline",
                            textDecorationStyle: "dotted",
                            textUnderlineOffset: "3px",
                            cursor: "none",
                          }}
                        >
                          {job.company} ↗
                        </a>
                      ) : (
                        job.company
                      )}
                      <Box as="span" color="fg.dim" ml={2}>
                        // {job.location}
                      </Box>
                    </Text>
                  </Box>
                  <Text
                    fontFamily="mono"
                    fontSize="xs"
                    color="fg.muted"
                    letterSpacing="0.08em"
                    bg="bg.muted"
                    borderWidth="1px"
                    borderColor="border.base"
                    px={3}
                    py={1}
                  >
                    {job.period}
                  </Text>
                </Flex>

                <Stack as="ul" listStyleType="none" gap={2.5}>
                  {job.bullets.map((b, bi) => (
                    <MotionBox
                      as="li"
                      key={bi}
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: i * 0.2 + bi * 0.07 + 0.3 }}
                      fontFamily="mono"
                      fontSize="sm"
                      color="fg.muted"
                      lineHeight={1.7}
                      display="flex"
                      gap={3}
                    >
                      <Box as="span" color="accent" flexShrink={0}>
                        ▸
                      </Box>
                      {b}
                    </MotionBox>
                  ))}
                </Stack>
              </MotionBox>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
