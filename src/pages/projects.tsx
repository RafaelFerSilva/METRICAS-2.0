import { Grid, GridItem, Box, Heading, Text, SimpleGrid, VStack, Spinner, Center, Input, Icon, Flex, useColorModeValue, Container, Button } from "@chakra-ui/react";
import { useProjects } from "../presentation/hooks/useProjects";
import { useAuth } from "../presentation/hooks/useAuth";
import { Project } from "../core/domain/entities/project.entity";
import { useState } from "react";
import { FaSearch, FaSignOutAlt, FaFolder } from "react-icons/fa";
import Head from "next/head";

export default function ProjectsPage() {
  const { isLoading: isAuthLoading, selectProject, logout } = useAuth();
  const { data: projects, isLoading: isProjectsLoading } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");

  const bgGradient = useColorModeValue("linear(to-br, gray.50, gray.100)", "linear(to-br, gray.900, black)");
  const cardBg = useColorModeValue("white", "gray.800");
  const glassBg = useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(26, 32, 44, 0.9)");
  const headingColor = useColorModeValue("gray.700", "white");

  if (isAuthLoading || isProjectsLoading) {
    return (
      <Center h="100vh" bg={bgGradient}>
        <Spinner size="xl" color="blue.500" thickness="4px" speed="0.65s" emptyColor="gray.200" />
      </Center>
    );
  }

  const filteredProjects = projects?.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Projetos | Azure Metrics</title>
      </Head>
      <Box minH="100vh" bgGradient={bgGradient} py={10}>

        {/* Header Section */}
        <Container maxW="7xl">
          <Flex justify="space-between" align="center" mb={12}>
            <Heading
              size="lg"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
              letterSpacing="tight"
            >
              Azure Metrics
            </Heading>
            <Button
              leftIcon={<Icon as={FaSignOutAlt} />}
              variant="ghost"
              colorScheme="red"
              onClick={logout}
            >
              Sair
            </Button>
          </Flex>

          {/* Hero & Search */}
          <VStack spacing={6} align="center" mb={16} textAlign="center">
            <Heading as="h1" size="2xl" fontWeight="extrabold" color={headingColor}>
              Selecione seu Workspace
            </Heading>
            <Text fontSize="xl" color="gray.500" maxW="2xl">
              Navegue pelos seus projetos e acesse dashboards de alta performance.
            </Text>

            <Box position="relative" w={{ base: "full", md: "500px" }}>
              <Input
                placeholder="Buscar projeto..."
                size="lg"
                bg={cardBg}
                borderRadius="full"
                pl={12}
                boxShadow="lg"
                _focus={{ boxShadow: "xl", borderColor: "blue.400" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Icon
                as={FaSearch}
                position="absolute"
                left={5}
                top={4}
                color="gray.400"
              />
            </Box>
          </VStack>

          {/* Projects Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {filteredProjects?.map((project: Project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => selectProject(project.id)}
                bg={glassBg}
              />
            ))}
          </SimpleGrid>

          {filteredProjects?.length === 0 && (
            <Center mt={10}>
              <Text color="gray.500">Nenhum projeto encontrado.</Text>
            </Center>
          )}

        </Container>
      </Box>
    </>
  );
}

const ProjectCard = ({ project, onClick, bg }: { project: Project, onClick: () => void, bg: string }) => {
  return (
    <Box
      onClick={onClick}
      bg={bg}
      p={8}
      borderRadius="2xl"
      boxShadow="md"
      cursor="pointer"
      border="1px solid"
      borderColor="transparent"
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-8px)",
        boxShadow: "2xl",
        borderColor: "blue.300",
      }}
      position="relative"
      overflow="hidden"
      role="group"
    >
      <Box
        position="absolute"
        top={-10}
        right={-10}
        boxSize="150px"
        bg="blue.50"
        borderRadius="full"
        opacity={0.5}
        _groupHover={{ scale: 1.2, bg: "blue.100" }}
        transition="all 0.3s"
      />

      <Flex align="center" mb={4}>
        <Flex
          w={12}
          h={12}
          align="center"
          justify="center"
          bg="blue.500"
          color="white"
          borderRadius="xl"
          boxShadow="lg"
          mr={4}
        >
          <Icon as={FaFolder} w={6} h={6} />
        </Flex>
        <Heading size="md" noOfLines={1} color="gray.700">
          {project.name}
        </Heading>
      </Flex>

      <Text color="gray.500" fontSize="sm" noOfLines={2}>
        {project.description || "Nenhuma descrição disponível para este projeto."}
      </Text>

      <Flex mt={6} align="center" color="blue.500" fontSize="sm" fontWeight="bold">
        <Text _groupHover={{ mr: 2 }} transition="all 0.3s">Acessar Dashboard</Text>
        <Text opacity={0} transform="translateX(-10px)" _groupHover={{ opacity: 1, transform: "translateX(0)" }} transition="all 0.3s">→</Text>
      </Flex>
    </Box>
  )
}
