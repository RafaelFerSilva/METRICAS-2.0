import { Box, Text, Stack, Link, Icon } from "@chakra-ui/react";
import { ReactNode } from "react";

interface NavSectionProps{
    title?: string;
    children: ReactNode;
}

export function NavSection({ title, children }: NavSectionProps) {
  return (
    <Box>
      <Text fontWeight="bold" fontSize="small">
        {title}
      </Text>
      <Stack spacing="4" mt="8" align="stretch">
        {children}
      </Stack>
    </Box>
  );
}
