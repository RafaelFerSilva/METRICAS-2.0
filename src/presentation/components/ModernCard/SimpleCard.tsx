import React from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Icon,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  VStack,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { MdInfoOutline } from "react-icons/md";

interface SimpleCardProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  icon?: IconType;
  colorScheme?: string;
  onClick?: () => void;
}

interface SimpleCardProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  icon?: IconType;
  colorScheme?: string;
  onClick?: () => void;
}

export default function SimpleCard({
  title,
  subtitle,
  children,
  icon,
  colorScheme = "blue",
  onClick,
}: SimpleCardProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBgColor = useColorModeValue(`${colorScheme}.50`, `${colorScheme}.700`); // Chame aqui

  const clickableProps = onClick ? {
    cursor: 'pointer',
    role: 'button',
    tabIndex: 0,
    onClick,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    },
    _hover: {
      bg: hoverBgColor, // Use a variável aqui
    }
  } : {};

  return (
    <Box
      bg={bgColor}
      borderColor={borderColor}
      boxShadow="lg"
      borderRadius="lg"
      border="1px solid"
      p={6}
      {...clickableProps}
    >
      <VStack spacing={4} align="stretch">
        <Flex align="center" gap={3}>
          {icon && (
            <Box
              p={2}
              borderRadius="md"
              bg={`${colorScheme}.100`}
            >
              <Icon as={icon} boxSize={5} color={`${colorScheme}.500`} />
            </Box>
          )}
          <Box>
            <Heading size="md" color="gray.700">
              {title}
            </Heading>
            {subtitle && (
              <Text fontSize="sm" color="gray.500" mt={1}>
                {subtitle}
              </Text>
            )}
          </Box>
        </Flex>
        <Box>
          {children}
        </Box>
      </VStack>
    </Box>
  );
}

// Componente para métricas
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "increase" | "decrease";
  icon?: React.ElementType;
  colorScheme?: string;
  tooltipText?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeType,
  icon,
  colorScheme = "blue",
  tooltipText
}: MetricCardProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      bg={bgColor}
      borderColor={borderColor}
      boxShadow="md"
      borderRadius="lg"
      border="1px solid"
      p={6}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Stat>
            <HStack spacing={2} mb={1}>
              <StatLabel fontSize="sm" color="gray.600">
                {title}
              </StatLabel>
              {tooltipText && (
                <Tooltip label={tooltipText} placement="top" hasArrow>
                  <span>
                    <Icon as={MdInfoOutline} color="gray.400" boxSize={3.5} cursor="help" />
                  </span>
                </Tooltip>
              )}
            </HStack>
            <StatNumber fontSize="2xl" color={`${colorScheme}.500`}>
              {value}
            </StatNumber>
            {change && (
              <StatHelpText fontSize="sm" mb={0}>
                {changeType && (
                  <StatArrow type={changeType} />
                )}
                {change}
              </StatHelpText>
            )}
          </Stat>
        </Box>
        {icon && (
          <Box
            p={3}
            borderRadius="full"
            bg={`${colorScheme}.100`}
          >
            <Icon as={icon} boxSize={6} color={`${colorScheme}.500`} />
          </Box>
        )}
      </Flex>
    </Box>
  );
}

// Componente para gráficos
interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ElementType;
  colorScheme?: string;
}

export function ChartCard({
  title,
  subtitle,
  children,
  icon,
  colorScheme = "blue"
}: ChartCardProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      bg={bgColor}
      borderColor={borderColor}
      boxShadow="lg"
      borderRadius="lg"
      border="1px solid"
      p={6}
      h="full"
    >
      <VStack spacing={4} align="stretch" h="full">
        <HStack spacing={3}>
          {icon && (
            <Box
              p={2}
              borderRadius="md"
              bg={`${colorScheme}.100`}
            >
              <Icon as={icon} boxSize={5} color={`${colorScheme}.500`} />
            </Box>
          )}
          <Box>
            <Heading size="md" color="gray.700">
              {title}
            </Heading>
            {subtitle && (
              <Text fontSize="sm" color="gray.500" mt={1}>
                {subtitle}
              </Text>
            )}
          </Box>
        </HStack>
        <Box flex={1}>
          {children}
        </Box>
      </VStack>
    </Box>
  );
}