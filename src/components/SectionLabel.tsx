import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export function SectionLabel({ label, title }: { label: string; title: string }) {
  return (
    <Flex align="center" gap={6}>
      <Text fontFamily="mono" fontSize="xs" color="accent" letterSpacing="0.15em" opacity={0.6}>
        [{label}]
      </Text>
      <Heading
        fontFamily="sans"
        fontSize={{ base: "1.75rem", md: "2.5rem" }}
        fontWeight={700}
        letterSpacing="-0.01em"
        color="fg"
      >
        {title}
      </Heading>
      <Box flex={1} h="1px" bg="border.base" ml={4} />
    </Flex>
  );
}
