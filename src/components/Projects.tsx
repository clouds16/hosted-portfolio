import { useRef } from "react";
import { AspectRatio, Box, Flex, Grid, Heading, Image, Text } from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Image as ImageIcon } from "lucide-react";
import type { Project } from "../types";
import { data } from "../data";
import { filterByDiscipline, useDiscipline } from "../discipline";
import { SectionLabel } from "./SectionLabel";

const MotionBox = motion.create(Box);

export function Projects() {
  const { discipline } = useDiscipline();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const projects = filterByDiscipline(data.projects, discipline);
  const title =
    discipline === "all" ? "Projects & Engagements" : discipline === "software" ? "Projects" : "Engagements";

  return (
    <Box as="section" id="projects" py={32} px={{ base: 6, md: 12 }} bg="bg.subtle">
      <Box maxW="1100px" mx="auto">
        <SectionLabel label="04" title={title} />

        <Grid
          ref={ref}
          mt={16}
          gap={6}
          gridTemplateColumns={{ base: "1fr", md: "repeat(auto-fill, minmax(460px, 1fr))" }}
        >
          {projects.map((project, i) => (
            <MotionBox
              key={`${discipline}-${project.name}`}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.55 }}
              whileHover={{ y: -4 }}
              bg="bg.muted"
              borderWidth="1px"
              borderColor="border.base"
              position="relative"
              overflow="hidden"
              cursor="none"
              data-hack-glow="card"
            >
              <Box position="absolute" top={0} left={0} w="100%" h="2px" bg={project.color} opacity={0.7} zIndex={2} />

              <ProjectMedia project={project} />

              <Box p={8}>
                <Box
                  position="absolute"
                  top={0}
                  right={0}
                  w="60px"
                  h="60px"
                  background={`linear-gradient(225deg, ${project.color}22, transparent 60%)`}
                  pointerEvents="none"
                />

                <Flex justify="space-between" align="flex-start" mb={4}>
                  <Text fontFamily="mono" fontSize="0.65rem" color="fg.dim" letterSpacing="0.15em">
                    <Box as="span" color={project.color}>
                      //
                    </Box>{" "}
                    project/{String(i + 1).padStart(2, "0")}
                  </Text>
                  {project.href ? (
                    <a href={project.href} target="_blank" rel="noopener noreferrer" style={{ cursor: "none" }}>
                      <ExternalLink size={14} color="var(--chakra-colors-fg-dim)" />
                    </a>
                  ) : (
                    <ExternalLink size={14} color="var(--chakra-colors-fg-dim)" />
                  )}
                </Flex>

                <Heading fontFamily="sans" fontSize="1.4rem" fontWeight={700} color="fg" letterSpacing="-0.01em" mb={3}>
                  {project.name}
                </Heading>

                <Text fontFamily="mono" fontSize="sm" color="fg.muted" lineHeight={1.8} mb={6}>
                  {project.desc}
                </Text>

                <Flex wrap="wrap" gap={1.5}>
                  {project.tags.map((tag) => (
                    <Box
                      as="span"
                      key={tag}
                      fontFamily="mono"
                      fontSize="0.65rem"
                      letterSpacing="0.06em"
                      color={project.color}
                      bg={`${project.color}14`}
                      borderWidth="1px"
                      borderColor={`${project.color}33`}
                      px={2.5}
                      py={1}
                      data-hack-glow="pill"
                    >
                      {tag}
                    </Box>
                  ))}
                </Flex>
              </Box>
            </MotionBox>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

function ProjectMedia({ project }: { project: Project }) {
  return (
    <Box position="relative" borderBottomWidth="1px" borderBottomColor="border.base">
      <AspectRatio ratio={16 / 9} bg="bg.subtle">
        {project.cadEmbed ? (
          <iframe
            src={project.cadEmbed}
            title={`${project.name} — 3D model`}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
            style={{ width: "100%", height: "100%", border: 0 }}
          />
        ) : project.image ? (
          <Image
            src={project.image}
            alt={project.imageAlt ?? `${project.name} preview`}
            objectFit="cover"
            w="100%"
            h="100%"
          />
        ) : (
          <Flex
            align="center"
            justify="center"
            background={`linear-gradient(135deg, ${project.color}1a 0%, transparent 60%, ${project.color}22 100%)`}
            color={project.color}
            flexDirection="column"
            gap={2}
          >
            <ImageIcon size={28} strokeWidth={1.2} opacity={0.6} />
            <Text fontFamily="mono" fontSize="0.65rem" letterSpacing="0.15em" opacity={0.7}>
              // no preview yet
            </Text>
          </Flex>
        )}
      </AspectRatio>

      {project.cadEmbed && (
        <Box
          position="absolute"
          top={2}
          right={2}
          fontFamily="mono"
          fontSize="0.6rem"
          letterSpacing="0.15em"
          color={project.color}
          bg="rgba(8, 8, 14, 0.75)"
          borderWidth="1px"
          borderColor={`${project.color}55`}
          px={2}
          py={0.5}
          textTransform="uppercase"
          pointerEvents="none"
        >
          // 3D model
        </Box>
      )}
    </Box>
  );
}
