import { Grid, GridItem, Box, Heading, Text, SimpleGrid, VStack, Spinner, Center } from "@chakra-ui/react";
import SimpleCard from "../presentation/components/ModernCard/SimpleCard";
import LogoutButton from "../presentation/components/LogoutButton";
import { useProjects } from "../presentation/hooks/useProjects";
import { useAuth } from "../presentation/hooks/useAuth";
import { Project } from "../core/domain/entities/project.entity";

export default function ProjectsPage() {
  const { isLoading: isAuthLoading, selectProject } = useAuth();
  const { data: projects, isLoading: isProjectsLoading } = useProjects();

  if (isAuthLoading || isProjectsLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <Grid>
      <Box position="absolute" top="4" right="4" zIndex="1" borderColor="gray.200" borderRadius="md">
        <LogoutButton />
      </Box>
      <GridItem marginBottom="10">
        <Box borderRadius="md" boxShadow="md" p={6}>
          <Heading size="lg" mb={4} color="blue.600">
            Projects
          </Heading>
          <Text mb={4}>
            Bem-vindo ao Dashboard de Métricas do Azure DevOps!
          </Text>
          <Text color="gray.600">
            Selecione um dos projetos disponíveis para visualizar os relatórios e métricas disponíveis.
          </Text>
        </Box>
      </GridItem>
      <VStack >
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3 }}
          spacing={{ base: 4, md: 6 }}
          w="90%">
          {projects?.map((project: Project) => (
            <SimpleCard key={project.id} title={project.name} onClick={() => selectProject(project.id)}>
            </SimpleCard>
          ))}
        </SimpleGrid>
      </VStack>
    </Grid>
  );
}
