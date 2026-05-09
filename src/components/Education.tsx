import { useRef } from "react";
import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { data } from "../data";
import { SectionLabel } from "./SectionLabel";

const MotionBox = motion.create(Box);

export function Education() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <Box as="section" id="education" py={32} px={{ base: 6, md: 12 }} bg="bg">
      <Box maxW="900px" mx="auto">
        <SectionLabel label="05" title="Education" />

        <Stack ref={ref} mt={16} gap={6}>
          {data.education.map((edu, i) => (
            <MotionBox
              key={edu.school}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.55 }}
              bg="bg.muted"
              borderWidth="1px"
              borderColor="border.base"
              p={8}
              position="relative"
              overflow="hidden"
              data-hack-glow="card"
            >
              <Box position="absolute" top={0} left={0} w="100%" h="2px" bg="accent" opacity={0.7} />

              <Flex align="flex-start" gap={4} mb={4}>
                <Flex
                  w={10}
                  h={10}
                  borderWidth="1px"
                  borderColor="border.muted"
                  align="center"
                  justify="center"
                  bg="bg.subtle"
                  flexShrink={0}
                >
                  <GraduationCap size={18} color="var(--chakra-colors-accent)" />
                </Flex>
                <Box>
                  <Heading
                    fontFamily="sans"
                    fontSize="1.4rem"
                    fontWeight={700}
                    color="fg"
                    letterSpacing="-0.01em"
                  >
                    {edu.degree}
                  </Heading>
                  <Text fontFamily="mono" fontSize="sm" color="accent" mt={1}>
                    @ {edu.school}
                    {edu.location && (
                      <Box as="span" color="fg.dim" ml={2}>
                        // {edu.location}
                      </Box>
                    )}
                  </Text>
                  {edu.period && (
                    <Text fontFamily="mono" fontSize="xs" color="fg.muted" mt={1}>
                      {edu.period}
                    </Text>
                  )}
                </Box>
              </Flex>

              {edu.highlights && edu.highlights.length > 0 && (
                <Stack as="ul" listStyleType="none" gap={2.5} pl={14}>
                  {edu.highlights.map((h, hi) => (
                    <Box
                      as="li"
                      key={hi}
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
                      {h}
                    </Box>
                  ))}
                </Stack>
              )}
            </MotionBox>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
