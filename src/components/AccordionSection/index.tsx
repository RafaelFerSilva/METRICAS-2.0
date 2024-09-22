import { AccordionItem, AccordionButton, AccordionPanel, Box, AccordionIcon } from "@chakra-ui/react";

export function AccordionSection({ title, children }: any) {
  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            {title}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>{children}</AccordionPanel>
    </AccordionItem>
  );
}
