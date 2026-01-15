import { Box, Text, Tooltip, Icon, Flex } from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";

interface KpiCardProps {
    label: string;
    value: string | number;
    subValue?: string;
    tooltip?: string;
    icon?: any;
    color?: string;
}

export const KpiCard = ({ label, value, subValue, tooltip, color = "blue.500" }: KpiCardProps) => {
    return (
        <Box
            p={5}
            bg="white"
            borderRadius="lg"
            boxShadow="sm"
            borderLeft="4px solid"
            borderColor={color}
            transition="all 0.2s"
            _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
        >
            <Flex justifyContent="space-between" alignItems="start" mb={2}>
                <Text fontSize="sm" fontWeight="medium" color="gray.500" textTransform="uppercase" letterSpacing="wide">
                    {label}
                </Text>
                {tooltip && (
                    <Tooltip label={tooltip} fontSize="sm" placement="top" hasArrow>
                        <Icon as={InfoOutlineIcon} color="gray.400" />
                    </Tooltip>
                )}
            </Flex>
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                {value}
            </Text>
            {subValue && (
                <Text fontSize="xs" color="gray.500" mt={1}>
                    {subValue}
                </Text>
            )}
        </Box>
    );
};
