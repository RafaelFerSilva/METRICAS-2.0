import { AccordionItem, AccordionButton, AccordionPanel, Box, Icon, Text, Badge, useColorModeValue, AccordionIcon } from "@chakra-ui/react";
import { MdList } from "react-icons/md";

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  badgeCount?: number;
  badgeColor?: string;
}

export function AccordionSection({ title, children, badgeCount, badgeColor = "blue" }: AccordionSectionProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <AccordionItem
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      bg={bgColor}
      boxShadow="sm"
      mb={4}
      _last={{ mb: 0 }}
    >
      {({ isExpanded }) => (
        <>
          <AccordionButton
            py={4}
            px={6}
            _hover={{ bg: hoverBg }}
            transition="all 0.2s"
          >
            <Box flex="1" textAlign="left">
              <Text fontSize="lg" fontWeight="bold" display="flex" alignItems="center" gap={2}>
                <Icon as={MdList} color={`${badgeColor}.500`} />
                {title}
                {badgeCount !== undefined && (
                  <Badge colorScheme={badgeColor} ml={2} fontSize="sm" borderRadius="full" px={3}>
                    {badgeCount}
                  </Badge>
                )}
              </Text>
            </Box>
            <AccordionIcon fontSize="24px" color={`${badgeColor}.500`} />
          </AccordionButton>
          <AccordionPanel pb={6} px={6} pt={2}>
            <Box
              borderTop="1px solid"
              borderColor={borderColor}
              pt={4}
            >
              {children}
            </Box>
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
}
