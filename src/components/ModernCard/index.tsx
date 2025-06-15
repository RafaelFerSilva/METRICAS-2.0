import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Icon,
  Badge,
  Stat,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
} from "@chakra-ui/react";

export interface ModernCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  icon?: React.ElementType;
  colorScheme?: string;
  variant?: 'outline' | 'filled' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  badge?: string;
  stat?: {
    value: string | number;
    change?: number;
  };
  minHeight?: string;
}

const sizeProps = {
  sm: {
    titleSize: 'sm',
    subtitleSize: 'xs',
    iconSize: 4,
    statSize: 'md',
    padding: 4,
  },
  md: {
    titleSize: 'md',
    subtitleSize: 'sm',
    iconSize: 5,
    statSize: 'lg',
    padding: 6,
  },
  lg: {
    titleSize: 'lg',
    subtitleSize: 'md',
    iconSize: 6,
    statSize: 'xl',
    padding: 8,
  },
};

export default function ModernCard({
  title,
  subtitle,
  children,
  icon,
  colorScheme = "blue",
  variant = "outline",
  size = "md",
  badge,
  stat,
  minHeight = "auto",
}: ModernCardProps) {
  const cardBg = useColorModeValue(
    variant === 'filled' ? `${colorScheme}.50` : 'white',
    variant === 'filled' ? `${colorScheme}.900` : 'gray.800'
  );
  
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const titleColor = useColorModeValue('gray.800', 'white');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');

  const currentSize = sizeProps[size];

  return (
    <Box
      bg={cardBg}
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow={variant === 'elevated' ? 'lg' : 'sm'}
      transition="all 0.2s"
      _hover={{
        boxShadow: variant === 'elevated' ? 'xl' : 'md',
        transform: 'translateY(-2px)',
      }}
      minHeight={minHeight}
      overflow="hidden"
      border="1px solid"
      p={currentSize.padding}
    >
      {(title || subtitle || icon || badge || stat) && (
        <Box pb={4}>
          <Flex align="center" justify="space-between">
            <Flex align="center" gap={3}>
              {icon && (
                <Box
                  p={2}
                  borderRadius="md"
                  bg={`${colorScheme}.100`}
                  color={`${colorScheme}.500`}
                >
                  <Icon as={icon} boxSize={currentSize.iconSize} />
                </Box>
              )}
              <Box>
                {title && (
                  <Heading size={currentSize.titleSize} color={titleColor}>
                    {title}
                  </Heading>
                )}
                {subtitle && (
                  <Text fontSize={currentSize.subtitleSize} color={subtitleColor} mt={1}>
                    {subtitle}
                  </Text>
                )}
              </Box>
            </Flex>
            <Flex align="center" gap={2}>
              {badge && (
                <Badge colorScheme={colorScheme} variant="subtle">
                  {badge}
                </Badge>
              )}
              {stat && (
                <Stat size="sm">
                  <StatNumber fontSize={currentSize.statSize} color={titleColor}>
                    {stat.value}
                  </StatNumber>
                  {stat.change && (
                    <StatHelpText mb={0}>
                      <StatArrow type={stat.change > 0 ? 'increase' : 'decrease'} />
                      {Math.abs(stat.change)}%
                    </StatHelpText>
                  )}
                </Stat>
              )}
            </Flex>
          </Flex>
        </Box>
      )}
      <Box>
        {children}
      </Box>
    </Box>
  );
}

// Componente específico para métricas
export function MetricCard({
  title,
  value,
  change,
  icon,
  colorScheme = "blue",
  size = "md"
}: {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ElementType;
  colorScheme?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <ModernCard
      title={title}
      icon={icon}
      colorScheme={colorScheme}
      variant="elevated"
      size={size}
      stat={{ value, change }}
    />
  );
}

// Componente específico para gráficos
export function ChartCard({
  title,
  subtitle,
  children,
  colorScheme = "blue",
  height = "300px"
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  colorScheme?: string;
  height?: string;
}) {
  return (
    <ModernCard
      title={title}
      subtitle={subtitle}
      colorScheme={colorScheme}
      variant="outline"
      minHeight={height}
    >
      {children}
    </ModernCard>
  );
}