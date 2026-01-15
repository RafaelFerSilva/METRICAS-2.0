import React from "react";
import {
  Box,
  VStack,
  Text,
  Icon,
  Button,
  useColorModeValue,
  Heading,
  Center,
} from "@chakra-ui/react";
import { 
  MdBarChart, 
  MdRefresh, 
  MdSearch, 
  MdWarning,
  MdDataUsage,
  MdTrendingUp
} from "react-icons/md";

interface EmptyStateProps {
  type?: "no-data" | "no-selection" | "loading-error" | "no-results";
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ElementType;
}

export default function ModernEmptyState({
  type = "no-data",
  title,
  description,
  actionLabel,
  onAction,
  icon
}: EmptyStateProps) {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const getEmptyStateConfig = () => {
    switch (type) {
      case "no-selection":
        return {
          icon: icon || MdSearch,
          title: title || "Selecione um Time e Sprint",
          description: description || "Para visualizar os gráficos e métricas, primeiro selecione um time e depois escolha uma sprint específica.",
          actionLabel: actionLabel || "Começar Seleção",
          color: "blue"
        };
      case "loading-error":
        return {
          icon: icon || MdWarning,
          title: title || "Erro ao Carregar Dados",
          description: description || "Ocorreu um problema ao carregar os dados da sprint. Verifique sua conexão e tente novamente.",
          actionLabel: actionLabel || "Tentar Novamente",
          color: "red"
        };
      case "no-results":
        return {
          icon: icon || MdDataUsage,
          title: title || "Nenhum Resultado Encontrado",
          description: description || "A sprint selecionada não possui dados ou ainda não foi iniciada.",
          actionLabel: actionLabel || "Selecionar Outra Sprint",
          color: "orange"
        };
      default: // no-data
        return {
          icon: icon || MdBarChart,
          title: title || "Nenhum Dado Disponível",
          description: description || "Não há dados para exibir nos gráficos. Selecione uma sprint com dados ou aguarde o carregamento.",
          actionLabel: actionLabel || "Atualizar Dados",
          color: "gray"
        };
    }
  };

  const config = getEmptyStateConfig();

  return (
    <Center minH="400px" p={8}>
      <VStack spacing={6} textAlign="center" maxW="md">
        {/* Ícone Principal */}
        <Box
          p={6}
          borderRadius="full"
          bg={`${config.color}.100`}
          border="2px solid"
          borderColor={`${config.color}.200`}
        >
          <Icon 
            as={config.icon} 
            boxSize={12} 
            color={`${config.color}.500`} 
          />
        </Box>

        <Heading 
          size="lg" 
          color={textColor}
          fontWeight="semibold"
        >
          {config.title}
        </Heading>

        <Text 
          color={textColor} 
          fontSize="md" 
          lineHeight="tall"
          textAlign="center"
        >
          {config.description}
        </Text>

        {onAction && (
          <Button
            colorScheme={config.color}
            size="lg"
            leftIcon={<Icon as={MdRefresh} />}
            onClick={onAction}
            variant="solid"
            borderRadius="full"
            px={8}
          >
            {config.actionLabel}
          </Button>
        )}

        <Box 
          p={4} 
          bg={bgColor} 
          borderRadius="lg" 
          border="1px solid" 
          borderColor={`${config.color}.200`}
          w="full"
        >
          <VStack spacing={2}>
            <Icon as={MdTrendingUp} color={`${config.color}.500`} />
            <Text fontSize="sm" color={textColor} fontWeight="medium">
              Dica: Os gráficos aparecerão automaticamente quando houver dados disponíveis
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Center>
  );
}
